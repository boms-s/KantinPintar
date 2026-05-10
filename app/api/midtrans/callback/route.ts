import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coreApi } from "@/lib/midtrans";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Midtrans callback signature validation
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const signatureKey = crypto
      .createHash("sha512")
      .update(`${data.order_id}${data.status_code}${data.gross_amount}${serverKey}`)
      .digest("hex");

    if (signatureKey !== data.signature_key) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    const transactionStatus = data.transaction_status;
    const fraudStatus = data.fraud_status;
    const orderId = data.order_id; // ini transactionCode di schema Order

    // Retrieve order to know which order we are updating
    const order = await prisma.order.findUnique({
      where: { transactionCode: orderId },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let paymentStatus = order.paymentStatus;
    let newOrderStatus = order.status;

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        paymentStatus = "COMPLETED";
      }
    } else if (transactionStatus === "settlement") {
      paymentStatus = "COMPLETED";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      paymentStatus = "FAILED";
      newOrderStatus = "CANCELLED";
    } else if (transactionStatus === "pending") {
      paymentStatus = "PENDING";
    }

    // Determine initial order status if payment is completed
    if (paymentStatus === "COMPLETED" && order.status === "PENDING") {
      // Once paid, order can be prepared or at least wait for seller
      // Actually we can keep it PENDING for seller to CONFIRM, but payment is COMPLETED
    }

    // Update the database
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus,
          status: newOrderStatus,
        },
      }),
      // Upsert payment proof/transaction details if payment record exists
      ...(order.payment
        ? [
            prisma.payment.update({
              where: { orderId: order.id },
              data: {
                status: paymentStatus,
                transactionId: data.transaction_id,
                paidAt: paymentStatus === "COMPLETED" ? new Date() : null,
              },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Midtrans Callback Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

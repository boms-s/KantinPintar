import { prisma } from '../lib/prisma';

async function main() {
  const orders = await prisma.order.findMany({
    include: { penjual: true, pembeli: true }
  });
  console.log(JSON.stringify(orders.map(o => ({
    id: o.id,
    penjual: o.penjual.email,
    pembeli: o.pembeli.email,
    status: o.status,
    paymentStatus: o.paymentStatus,
    price: o.totalPrice
  })), null, 2));
}
main().catch(console.error).finally(()=>prisma.$disconnect());

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { userDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // Get user and verify is seller
    const user = await userDb.getUserById(userId);
    if (!user || user.role !== "PENJUAL") {
      return NextResponse.json(
        { success: false, message: "Hanya penjual yang dapat upload foto profile" },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "File harus berupa gambar" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Create filename with timestamp
    const timestamp = Date.now();
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `profile-${userId}-${timestamp}.${ext}`;

    // Ensure directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", "profiles");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory may already exist
    }

    // Write file
    const filepath = join(uploadDir, filename);
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    // Return success with URL
    const imageUrl = `/uploads/profiles/${filename}`;
    return NextResponse.json({
      success: true,
      message: "Foto berhasil diupload",
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal upload foto" },
      { status: 500 }
    );
  }
}

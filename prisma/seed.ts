/**
 * Seed Script - Populates database with initial/test data
 * Run with: node prisma/seed.js (after building TypeScript)
 * Or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }
 */

import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Starting database seed...");

  try {
    // ========== SEED PENJUAL (SELLERS) ==========
    const seller1 = await prisma.seller.upsert({
      where: { email: "warung.budi@example.com" },
      update: {},
      create: {
        fullName: "Budi Warung Makan",
        email: "warung.budi@example.com",
        password: "hashed_password_1", // In production, use bcrypt
        phone: "081234567890",
        description: "Warung makan tradisional dengan menu favorit pegawai kantor",
        location: "Jl. Merdeka No. 10, Jakarta",
        rating: 4.5,
      },
    });

    const seller2 = await prisma.seller.upsert({
      where: { email: "kafe.kopi.id@example.com" },
      update: {},
      create: {
        fullName: "Kafe Kopi Indonesia",
        email: "kafe.kopi.id@example.com",
        password: "hashed_password_2",
        phone: "082345678901",
        description: "Kafe premium dengan biji kopi pilihan dari berbagai daerah",
        location: "Jl. Sudirman No. 20, Jakarta",
        rating: 4.7,
      },
    });

    const seller3 = await prisma.seller.upsert({
      where: { email: "bakery.fresh@example.com" },
      update: {},
      create: {
        fullName: "Fresh Bakery",
        email: "bakery.fresh@example.com",
        password: "hashed_password_3",
        phone: "083456789012",
        description: "Roti dan kue segar setiap hari",
        location: "Jl. Gatot Subroto No. 30, Jakarta",
        rating: 4.3,
      },
    });

    console.log("✅ Sellers created:", {
      seller1: seller1.id,
      seller2: seller2.id,
      seller3: seller3.id,
    });

    // ========== SEED MENU ITEMS ==========
    const menu1 = await prisma.menuItem.upsert({
      where: { id: "menu-1-nasi-kuning" },
      update: {},
      create: {
        id: "menu-1-nasi-kuning",
        name: "Nasi Kuning",
        description: "Nasi kuning dengan telur dan ayam",
        price: 25000,
        sellerId: seller1.id,
        category: "Makanan Utama",
        available: true,
      },
    });

    const menu2 = await prisma.menuItem.upsert({
      where: { id: "menu-1-gado-gado" },
      update: {},
      create: {
        id: "menu-1-gado-gado",
        name: "Gado-Gado",
        description: "Sayuran segar dengan saus kacang",
        price: 15000,
        sellerId: seller1.id,
        category: "Makanan Utama",
        available: true,
      },
    });

    const menu3 = await prisma.menuItem.upsert({
      where: { id: "menu-2-kopi-arabika" },
      update: {},
      create: {
        id: "menu-2-kopi-arabika",
        name: "Kopi Arabika Premium",
        description: "Biji kopi arabika pilihan dari Sumatera",
        price: 30000,
        sellerId: seller2.id,
        category: "Minuman",
        available: true,
      },
    });

    const menu4 = await prisma.menuItem.upsert({
      where: { id: "menu-2-cappuccino" },
      update: {},
      create: {
        id: "menu-2-cappuccino",
        name: "Cappuccino",
        description: "Espresso dengan susu dan foam",
        price: 28000,
        sellerId: seller2.id,
        category: "Minuman",
        available: true,
      },
    });

    const menu5 = await prisma.menuItem.upsert({
      where: { id: "menu-3-roti-tawar" },
      update: {},
      create: {
        id: "menu-3-roti-tawar",
        name: "Roti Tawar",
        description: "Roti tawar putih segar",
        price: 20000,
        sellerId: seller3.id,
        category: "Roti",
        available: true,
      },
    });

    const menu6 = await prisma.menuItem.upsert({
      where: { id: "menu-3-croissant" },
      update: {},
      create: {
        id: "menu-3-croissant",
        name: "Croissant",
        description: "Croissant dengan topping cokelat",
        price: 18000,
        sellerId: seller3.id,
        category: "Pastry",
        available: true,
      },
    });

    console.log("✅ Menu items created:", {
      menu1: menu1.id,
      menu2: menu2.id,
      menu3: menu3.id,
      menu4: menu4.id,
      menu5: menu5.id,
      menu6: menu6.id,
    });

    // ========== SEED USERS (PEMBELI) ==========
    const user1 = await prisma.user.upsert({
      where: { email: "andi.customer@example.com" },
      update: {},
      create: {
        fullName: "Andi Wijaya",
        email: "andi.customer@example.com",
        password: "hashed_password_user_1",
        phone: "081234567890",
        address: "Jl. Flores No. 5, Jakarta",
        role: "pembeli",
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: "siti.customer@example.com" },
      update: {},
      create: {
        fullName: "Siti Rahman",
        email: "siti.customer@example.com",
        password: "hashed_password_user_2",
        phone: "082345678901",
        address: "Jl. Bima No. 10, Jakarta",
        role: "pembeli",
      },
    });

    console.log("✅ Users created:", {
      user1: user1.id,
      user2: user2.id,
    });

    // ========== SEED ORDERS ==========
    const order1 = await prisma.order.create({
      data: {
        userId: user1.id,
        sellerId: seller1.id,
        totalPrice: 40000,
        status: "completed",
        items: {
          create: [
            {
              menuItemId: menu1.id,
              qty: 1,
              price: 25000,
            },
            {
              menuItemId: menu2.id,
              qty: 1,
              price: 15000,
            },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        userId: user2.id,
        sellerId: seller2.id,
        totalPrice: 58000,
        status: "completed",
        items: {
          create: [
            {
              menuItemId: menu3.id,
              qty: 1,
              price: 30000,
            },
            {
              menuItemId: menu4.id,
              qty: 1,
              price: 28000,
            },
          ],
        },
      },
    });

    console.log("✅ Orders created:", {
      order1: order1.id,
      order2: order2.id,
    });

    // ========== SEED FAVORITES ==========
    await prisma.user.update({
      where: { id: user1.id },
      data: {
        favorites: {
          connect: [{ id: menu1.id }, { id: menu3.id }],
        },
      },
    });

    console.log("✅ Favorites added for user1");

    console.log("\n✨ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

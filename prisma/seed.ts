/**
 * Prisma Seed Script
 * Initialize database with seed data (categories, admin user, etc)
 * Run with: npm run db:seed
 */

import { hash } from "bcryptjs";

const { PrismaClient, UserRole } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  try {
    // ============================================
    // 1. Create Admin User
    // ============================================
    console.log("Creating admin user...");
    const hashedAdminPassword = await hash("admin123", 10);

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@kantinpintar.local" },
      update: {},
      create: {
        username: "admin",
        email: "admin@kantinpintar.local",
        password: hashedAdminPassword,
        role: "ADMIN",
        admin: {
          create: {
            fullName: "Administrator",
            department: "System",
            permissions: JSON.stringify([
              "manage_users",
              "manage_menus",
              "manage_orders",
              "view_reports",
            ]),
          },
        },
      },
      include: {
        admin: true,
      },
    });

    console.log(`✅ Admin user created: ${adminUser.email}`);

    // ============================================
    // 2. Create Sample Seller
    // ============================================
    console.log("Creating sample seller...");
    const hashedSellerPassword = await hash("seller123", 10);

    const sellerUser = await prisma.user.upsert({
      where: { email: "seller@kantinpintar.local" },
      update: {},
      create: {
        username: "seller_demo",
        email: "seller@kantinpintar.local",
        password: hashedSellerPassword,
        role: "PENJUAL",
        penjual: {
          create: {
            businessName: "Kantin Demo",
            description: "Kantin terbaik dengan menu lengkap",
            phone: "081234567890",
            address: "Jalan Merdeka No. 123",
            city: "Jakarta",
            isVerified: true,
            isOpen: true,
          },
        },
      },
      include: {
        penjual: true,
      },
    });

    console.log(`✅ Sample seller created: ${sellerUser.email}`);

    // ============================================
    // 3. Create Seller Menu Categories
    // ============================================
    console.log("Creating seller menu categories...");
    const sellerCategories = [];
    const sellerCategoryNames = [
      { name: "Makanan", icon: "🍽️", desc: "Menu makanan utama" },
      { name: "Minuman", icon: "🥤", desc: "Menu minuman segar" },
      { name: "Snack", icon: "🍿", desc: "Camilan ringan" },
      { name: "Dessert", icon: "🍰", desc: "Menu penutup dan manis" },
    ];

    if (sellerUser.penjual) {
      for (const cat of sellerCategoryNames) {
        const created = await prisma.menuCategory.upsert({
          where: {
            penjualId_name: {
              penjualId: sellerUser.penjual.id,
              name: cat.name,
            },
          },
          update: {
            description: cat.desc,
            icon: cat.icon,
          },
          create: {
            penjualId: sellerUser.penjual.id,
            name: cat.name,
            description: cat.desc,
            icon: cat.icon,
          },
        });
        sellerCategories.push(created);
      }
    }

    console.log(`✅ ${sellerCategories.length} seller menu categories created`);

    // ============================================
    // 4. Create Sample Buyer
    // ============================================
    console.log("Creating sample buyer...");
    const hashedBuyerPassword = await hash("buyer123", 10);

    const buyerUser = await prisma.user.upsert({
      where: { email: "buyer@kantinpintar.local" },
      update: {},
      create: {
        username: "buyer_demo",
        email: "buyer@kantinpintar.local",
        password: hashedBuyerPassword,
        role: "PEMBELI",
        pembeli: {
          create: {
            fullName: "Pembeli Demo",
            phone: "082234567890",
            address: "Jalan Pahlawan No. 456",
            city: "Jakarta",
          },
        },
      },
      include: {
        pembeli: true,
      },
    });

    console.log(`✅ Sample buyer created: ${buyerUser.email}`);

    // ============================================
    // 5. Create Sample Menus
    // ============================================
    console.log("Creating sample menus...");

    if (sellerUser.penjual && sellerCategories.length > 0) {
      const sampleMenus = [
        {
          name: "Nasi Goreng Spesial",
          description: "Nasi goreng dengan telur dan lauk pilihan",
          price: 25000,
          stock: 50,
          cost: 12000,
          menuCategoryId: sellerCategories[0].id,
        },
        {
          name: "Mie Ayam",
          description: "Mie kuning dengan daging ayam suwir",
          price: 20000,
          stock: 40,
          cost: 10000,
          menuCategoryId: sellerCategories[0].id,
        },
        {
          name: "Es Teh Manis",
          description: "Minuman segar es teh dengan rasa alami",
          price: 5000,
          stock: 100,
          cost: 2000,
          menuCategoryId: sellerCategories[1].id,
        },
        {
          name: "Kopi Espresso",
          description: "Kopi premium pilihan",
          price: 15000,
          stock: 60,
          cost: 7000,
          menuCategoryId: sellerCategories[1].id,
        },
        {
          name: "Bakso Malang",
          description: "Bakso tradisional dengan kuah spesial",
          price: 22000,
          stock: 35,
          cost: 9000,
          menuCategoryId: sellerCategories[0].id,
        },
        {
          name: "Lumpia Goreng",
          description: "Lumpia krispy dengan saus sambal",
          price: 10000,
          stock: 80,
          cost: 4000,
          menuCategoryId: sellerCategories[2].id,
        },
      ];

      for (const menu of sampleMenus) {
        await prisma.menu.upsert({
          where: {
            penjualId_name: {
              penjualId: sellerUser.penjual.id,
              name: menu.name,
            },
          },
          update: {},
          create: {
            ...menu,
            penjualId: sellerUser.penjual.id,
          },
        });
      }

      console.log(`✅ ${sampleMenus.length} sample menus created`);
    }

    console.log("\n🌱 Database seeded successfully!\n");
    console.log("📝 Default accounts for testing:");
    console.log("   Admin: admin@kantinpintar.local / admin123");
    console.log("   Seller: seller@kantinpintar.local / seller123");
    console.log("   Buyer: buyer@kantinpintar.local / buyer123\n");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
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

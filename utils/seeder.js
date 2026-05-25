// ============================================
// DATABASE SEEDING SCRIPT
// Inserts dataset.json into MongoDB
// Run: npm run seed
// ============================================

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const fs       = require("fs");
const path     = require("path");

const connectDB  = require("../config/db");
const User       = require("../models/User");
const Category   = require("../models/Category");
const Product    = require("../models/Product");
const Order      = require("../models/Order");

const dataset = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/dataset.json"), "utf-8")
);

const seedDB = async () => {
  try {
    await connectDB();
    console.log("\n🌱 Starting database seeding...\n");

    // ── 1. Clear existing data ─────────────────────────────────────
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️  Cleared existing collections");

    // ── 2. Seed Users ─────────────────────────────────────────────
    const createdUsers = await User.create(dataset.users);
    console.log(`✅ Inserted ${createdUsers.length} users`);

    // ── 3. Seed Categories ─────────────────────────────────────────
    const createdCategories = await Category.create(dataset.categories);
    console.log(`✅ Inserted ${createdCategories.length} categories`);

    // Build slug → ObjectId map
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // ── 4. Seed Products (with real category ObjectIds) ────────────
    const productsWithIds = dataset.products.map((p) => ({
      ...p,
      category: categoryMap[p.category] || createdCategories[0]._id,
    }));
    const createdProducts = await Product.create(productsWithIds);
    console.log(`✅ Inserted ${createdProducts.length} products`);

    // ── 5. Seed Orders ─────────────────────────────────────────────
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u._id;
    });
    const productMap = {};
    createdProducts.forEach((p) => {
      productMap[p.name] = { _id: p._id, price: p.price };
    });

    const ordersWithIds = dataset.orders.map((o) => ({
      user: userMap[o.userEmail],
      items: o.items.map((item) => ({
        product:  productMap[item.productName]?._id || createdProducts[0]._id,
        name:     item.productName,
        price:    item.price,
        quantity: item.quantity,
      })),
      totalAmount:     o.totalAmount,
      status:          o.status,
      paymentMethod:   o.paymentMethod,
      shippingAddress: o.shippingAddress,
    }));
    const createdOrders = await Order.create(ordersWithIds);
    console.log(`✅ Inserted ${createdOrders.length} orders`);

    console.log("\n🎉 Database seeding completed successfully!\n");
    console.log("📋 Test Credentials:");
    console.log("   Admin → admin@shop.com / Admin@123");
    console.log("   User  → rahul@example.com / Rahul@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();

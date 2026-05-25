// ============================================
// DATA BACKUP SCRIPT (Basic Level)
// Exports MongoDB collections to JSON files
// Run: npm run backup
// ============================================

require("dotenv").config();
const fs   = require("fs");
const path = require("path");

const connectDB = require("../config/db");
const User     = require("../models/User");
const Category = require("../models/Category");
const Product  = require("../models/Product");
const Order    = require("../models/Order");

const backupDB = async () => {
  try {
    await connectDB();
    console.log("\n💾 Starting database backup...\n");

    // Create backup directory with timestamp
    const timestamp  = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir  = path.join(__dirname, `../backup/${timestamp}`);
    fs.mkdirSync(backupDir, { recursive: true });

    // Export each collection
    const collections = [
      { name: "users",      Model: User,     exclude: { password: 0 } },
      { name: "categories", Model: Category, exclude: {} },
      { name: "products",   Model: Product,  exclude: {} },
      { name: "orders",     Model: Order,    exclude: {} },
    ];

    for (const col of collections) {
      const data = await col.Model.find({}).select(col.exclude).lean();
      const filePath = path.join(backupDir, `${col.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ Backed up ${data.length} ${col.name} → ${filePath}`);
    }

    console.log(`\n🎉 Backup completed at: ${backupDir}\n`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Backup failed:", error.message);
    process.exit(1);
  }
};

backupDB();

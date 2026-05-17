const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/adminModel");
require("dotenv").config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const username = "Prashant";       // ← change this
  const password = "Prashant@123";   // ← change this

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log("Admin already exists!");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.create({ username, password: hashedPassword });

  console.log(" Admin created successfully!");
  console.log("Username:", username);
  console.log("Password:", password);
  process.exit();
};

createAdmin();
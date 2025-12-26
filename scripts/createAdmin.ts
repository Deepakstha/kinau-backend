import mongoose from "mongoose";
import { User } from "../src/models/User";
import { config } from "../src/config";

async function createAdmin() {
  try {
    // Connect to database
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Admin user data
    const adminData = {
      email: "admin@example.com", // Change this
      password: "admin123", // Change this
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      isActive: true,
      emailVerified: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    console.log("Admin user created successfully:");
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log("Please change the password after first login!");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();

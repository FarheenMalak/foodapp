import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import { connectDB } from "./config/db.js";

connectDB()
async function createAdmin() {
    const hashed = await bcrypt.hash("Admin@123", 10);

    const adminExists = await userModel.findOne({ email: "admin@food.com" });
    if (adminExists) {
        console.log("Admin already exists");
        return process.exit();
    }

    await userModel.create({
        name: "Admin",
        email: "admin@food.com",
        password: hashed,
        role: "admin",
    });

    console.log("Admin Created Successfully");
    process.exit();
}

createAdmin();

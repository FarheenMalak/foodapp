import express from "express";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// ADMIN LOGIN ONLY
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await userModel.findOne({ email, role: "admin" });

        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET
        );

        return res.json({ success: true, token });

    } catch (err) {
        return res.json({ success: false, message: "Error while admin login" });
    }
});

export default router;

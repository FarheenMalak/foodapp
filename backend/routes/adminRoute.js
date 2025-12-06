import express from "express";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Admin token validation middleware
const authenticateAdmin = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                     req.query.token;
        
        if (!token) {
            return res.json({ 
                success: false, 
                message: "Access denied. No token provided." 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify it's an admin token
        if (decoded.role !== 'admin') {
            return res.json({ 
                success: false, 
                message: "Access denied. Admin privileges required." 
            });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        return res.json({ 
            success: false, 
            message: "Invalid or expired token" 
        });
    }
};

// ADMIN LOGIN
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
            { 
                id: admin._id, 
                email: admin.email,
                name: admin.name,
                role: "admin" 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({ 
            success: true, 
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (err) {
        console.error("Admin login error:", err);
        return res.json({ 
            success: false, 
            message: "Error while admin login" 
        });
    }
});

// VALIDATE ADMIN TOKEN
router.get("/validate", authenticateAdmin, async (req, res) => {
    try {
        const admin = await userModel.findById(req.admin.id).select("-password");
        
        if (!admin || admin.role !== 'admin') {
            return res.json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        res.json({
            success: true,
            message: "Token is valid",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error("Token validation error:", error);
        res.json({
            success: false,
            message: "Token validation failed"
        });
    }
});

// GET ADMIN PROFILE (PROTECTED)
router.get("/profile", authenticateAdmin, async (req, res) => {
    try {
        const admin = await userModel.findById(req.admin.id).select("-password");
        
        if (!admin) {
            return res.json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        res.json({
            success: true,
            admin
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.json({
            success: false,
            message: "Failed to get profile"
        });
    }
});

export default router;
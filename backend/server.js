import 'dotenv/config';
import express from "express";
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";

//app config
const app = express()
const port = process.env.PORT || 4000;

//middleware - ADD THESE LINES
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // ← THIS IS CRITICAL FOR FORM DATA
app.use(cors({ origin: process.env.FRONT_END_URL }));

//db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/admin", adminRouter)

// Add a test route for debugging
app.post("/api/test-upload", (req, res) => {
    console.log("Test endpoint hit");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    res.json({ message: "Test successful", body: req.body });
});

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => { console.log(`Server started on http://localhost:${port}`);});
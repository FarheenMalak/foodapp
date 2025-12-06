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

// Define allowed origins
const allowedOrigins = [
  'https://foodapp-frontend-phi.vercel.app',
  'https://foodapp-admin-panel.vercel.app', 
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true  
}));

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/admin", adminRouter)

app.get("/", (req, res) => {
  res.send("API Working")
})

app.listen(port, () => { 
  console.log(`Server started on http://localhost:${port}`);
  console.log("Allowed origins:", allowedOrigins);
});

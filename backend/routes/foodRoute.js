import express from 'express'
import { addFood, listfood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';

const foodRouter = express.Router();

// Use memory storage (for Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single('image'), addFood);
foodRouter.get("/list", listfood);
foodRouter.post("/remove", removeFood);

export default foodRouter;

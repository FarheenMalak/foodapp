import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://farheenmalak:222444333@cluster0.wjinurc.mongodb.net/food-del').then(()=>{
        console.log('DB connected');       
    })
}
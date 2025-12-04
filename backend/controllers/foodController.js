// foodController.js - COMPLETELY UPDATED VERSION
import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config';

// Add food item
const addFood = async (req, res) => {
  console.log("\n" + "=".repeat(50));
  console.log("ADD FOOD REQUEST STARTED");
  console.log("=".repeat(50));

  try {
    // STEP 1: Debug environment variables
    console.log("\n📋 ENVIRONMENT CHECK:");
    console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
    console.log("CLOUDINARY_KEY:", process.env.CLOUDINARY_KEY);
    console.log("CLOUDINARY_SECRET:", process.env.CLOUDINARY_SECRET ? "***SET***" : "✗ MISSING");

    // STEP 2: Check request data
    console.log("\n📦 REQUEST DATA:");
    console.log("File received:", req.file ? `✅ ${req.file.originalname} (${req.file.size} bytes)` : "❌ No file");
    console.log("Form data:", req.body);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    // STEP 3: Configure Cloudinary RIGHT HERE (not globally)
    console.log("\n⚙️ CONFIGURING CLOUDINARY...");

    // Hardcode for testing (temporarily - replace with your actual values)
    const cloudinaryConfig = {
      cloud_name: "dj3keqwze",  // Your cloud name
      api_key: "828823351975534",  // Your API key
      api_secret: "The5unSDGnoS_snoxnWNlEXeGDA"  // Your API secret
    };

    console.log("Cloudinary Config:", {
      cloud_name: cloudinaryConfig.cloud_name,
      api_key: cloudinaryConfig.api_key ? "✓ SET" : "✗ MISSING",
      api_secret: cloudinaryConfig.api_secret ? "✓ SET" : "✗ MISSING"
    });

    // Apply configuration
    cloudinary.config(cloudinaryConfig);

    // Verify configuration was applied
    const currentConfig = cloudinary.config();
    console.log("Current Cloudinary config in library:", {
      cloud_name: currentConfig.cloud_name,
      has_api_key: !!currentConfig.api_key,
      has_api_secret: !!currentConfig.api_secret
    });

    if (!currentConfig.api_key) {
      throw new Error("Cloudinary API key was not set in configuration");
    }

    // STEP 4: Test Cloudinary connection with a simple method
    console.log("\n🔍 TESTING CLOUDINARY CONNECTION...");
    try {
      // Use a simple method to test
      const testResult = await cloudinary.api.ping();
      console.log("✅ Cloudinary connection test passed:", testResult);
    } catch (testError) {
      console.error("❌ Cloudinary connection test failed:", testError.message);
      // Continue anyway - sometimes ping fails but upload works
    }

    // STEP 5: Upload image
    console.log("\n📤 UPLOADING IMAGE TO CLOUDINARY...");

    // Method 1: Try upload_stream first
    const result = await new Promise((resolve, reject) => {
      console.log("Starting upload stream...");

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "food-items",
          resource_type: "auto",
          timeout: 30000 // 30 second timeout
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary upload_stream error:", error);
            console.error("Error details:", {
              message: error.message,
              name: error.name,
              http_code: error.http_code
            });
            reject(error);
          } else {
            console.log("✅ Cloudinary upload successful via stream");
            console.log("Image URL:", result.secure_url);
            resolve(result);
          }
        }
      );

      // Handle stream errors
      uploadStream.on('error', (streamError) => {
        console.error("❌ Stream error:", streamError);
        reject(streamError);
      });

      // Write the buffer to the stream
      console.log("Writing buffer to stream...");
      uploadStream.end(req.file.buffer);
    });

    // STEP 6: Save to database
    console.log("\n💾 SAVING TO DATABASE...");

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description || "",
      price: parseFloat(req.body.price) || 0,
      category: req.body.category || "General",
      image: result.secure_url,
    });

    await food.save();
    console.log("✅ Food saved successfully! ID:", food._id);
    console.log("📝 Food details:", {
      name: food.name,
      price: food.price,
      category: food.category,
      image: food.image
    });

    // STEP 7: Send success response
    console.log("\n✅ REQUEST COMPLETED SUCCESSFULLY");
    console.log("=".repeat(50) + "\n");

    res.json({
      success: true,
      message: "Food added successfully",
      data: food
    });

  } catch (error) {
    console.error("\n" + "❌".repeat(20));
    console.error("FATAL ERROR IN ADD FOOD:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    // Try alternative upload method if stream fails
    if (error.message.includes("api_key") || error.message.includes("Must supply")) {
      console.log("\n🔄 Trying alternative upload method...");

      try {
        // Alternative: Use base64 upload method
        const base64Image = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

        console.log("Attempting base64 upload...");
        const altResult = await cloudinary.uploader.upload(dataURI, {
          folder: "food-items",
          resource_type: "auto"
        });

        console.log("✅ Alternative upload successful!");

        // Save to DB
        const food = new foodModel({
          name: req.body.name,
          description: req.body.description || "",
          price: parseFloat(req.body.price) || 0,
          category: req.body.category || "General",
          image: altResult.secure_url,
        });

        await food.save();

        return res.json({
          success: true,
          message: "Food added successfully (via alternative method)",
          data: food
        });

      } catch (altError) {
        console.error("❌ Alternative method also failed:", altError.message);
      }
    }

    console.error("Stack trace:", error.stack);
    console.error("❌".repeat(20) + "\n");

    res.status(500).json({
      success: false,
      message: "Error adding food. Please check server logs."
    });
  }
};

// List all food items
const listfood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching foods" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting food" });
  }
};

export { addFood, listfood, removeFood };
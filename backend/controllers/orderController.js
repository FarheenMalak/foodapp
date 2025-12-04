import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONT_END_URL;
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      status: "Order Placed"
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map(item => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//verify order payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//user orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//admin order list
const listOrders = async (req, res) => {
  try {
    // Sort by createdAt descending (newest first)
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


// update order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// DASHBOARD STATS
// DASHBOARD STATS
const dashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = await orderModel.countDocuments({
      createdAt: { $gte: today }
    });

    const paidOrdersToday = await orderModel.find({
      createdAt: { $gte: today },
      payment: true
    });

    let revenueToday = 0;
    paidOrdersToday.forEach(order => {
      revenueToday += Number(order.amount || 0);
    });

    const aov = ordersToday > 0 ? (revenueToday / ordersToday).toFixed(2) : 0;

    const newCustomers = await userModel.countDocuments({
      createdAt: { $gte: today }
    });

    const activeDeliveries = await orderModel.countDocuments({
      status: { $regex: new RegExp("out for delivery", "i") }
    });

    const recentOrders = await orderModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(4);

const recentActivities = recentOrders.map(order => ({
  message: `Order #${order._id} - ${order.status}`,
  time: order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : "No Timestamp"
}));

    res.json({
      success: true,
      data: {
        adminName: "Admin",
        ordersToday,
        revenueToday,
        aov,
        newCustomers,
        activeDeliveries,
        recentActivities
      }
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching stats" });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  dashboardStats
};

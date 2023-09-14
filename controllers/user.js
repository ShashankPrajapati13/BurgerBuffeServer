import { asyncError } from "../middlewares/errorMiddleWare.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";

export const myProfile = (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid", {
      secure: process.env.NODE_ENV === "development" ? false : true,
      httpOnly: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    });
    res.status(200).json({
      message: "Logged Out",
    });
  });
};

export const getAdminUsers = asyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    success: true,
    users,
  });
});

export const getAdminStats = asyncError(async (req, res, next) => {
  const userCount = await User.countDocuments();

  const orders = await Order.find();

  const preparingOrders = orders.filter(
    (order) => order.orderStatus === "Preparing"
  );

  const shippedOrders = orders.filter(
    (order) => order.orderStatus === "Shipped"
  );

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "Delivered"
  );

  let totalIncome = 0;

  orders.forEach((order) => (totalIncome += order.totalAmount));

  res.status(201).json({
    success: true,
    userCount,
    orderCount: {
      total: orders.length,
      preparing: preparingOrders.length,
      shipped: shippedOrders.length,
      delivered: deliveredOrders.length,
    },
    totalIncome,
  });
});

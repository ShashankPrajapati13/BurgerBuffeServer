import { asyncError } from "../middlewares/errorMiddleWare.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { sendToken } from "../utils/Provider.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const myProfile = (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const CreateUser = asyncError(async (req, res, next) => {
  const { name, password, email } = req.body;
  const user = await User.create({
    email,
    name,
    password,
    username: name.split(" ").join(""),
  });
  sendToken(user, 201, res);
});

export const LoginUser = asyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("user not registered", 404));
  }

  const matchedPassword = await user.comparePassword(password);

  if (!matchedPassword)
    return next(new ErrorHandler("Invalid Credentials", 401));

  sendToken(user, 201, res);
  
});

export const logOutUser = async (req, res, next) => {
  res.clearCookie("connect.sid",{
    secure: process.env.NODE_ENV === "development" ? false : true,
    httpOnly: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? false : "none",
  });
  res.json({ message: "logout succesfully!" });
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

import express from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import { getAdminOrders, getMyOrders, getOrderDetails, paymentVerification, placeOrder, placeOrderOnline, processOrder } from "../controllers/order.js";

const router = express.Router();

router.post("/createorder",placeOrder)

router.post("/createorderonline",isAuthenticated,placeOrderOnline)

router.post("/paymentverification",isAuthenticated,paymentVerification)

router.get("/myorders",isAuthenticated,getMyOrders)

router.get("/order/:id",isAuthenticated,getOrderDetails)

router.get("/admin/orders",isAuthenticated,isAdmin,getAdminOrders)

router.get("/admin/order/:id",isAuthenticated,isAdmin,processOrder)

export default router;

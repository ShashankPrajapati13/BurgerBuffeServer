import app from "./app.js";
import { connectDB } from "./config/database.js";
import Razorpay from "razorpay";

connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.get("/", (req, res) => {
  res.render('index')
});

app.listen(process.env.PORT, () =>
  console.log(`server is working on port : ${process.env.PORT}, in ${process.env.NODE_ENV}mode`)
);


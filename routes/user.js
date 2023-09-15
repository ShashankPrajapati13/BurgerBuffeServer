import express from "express";
import passport from "passport";
import {
  CreateUser,
  LoginUser,
  getAdminStats,
  getAdminUsers,
  logOutUser,
  logout,
  myProfile,
} from "../controllers/user.js";
import { isAdmin, isAuthenticate, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/googlelogin",passport.authenticate("google", {
    scope: ["profile","email"], 
}));

router.get("/login", passport.authenticate("google"),(req,res)=> {
  successRedirect: process.env.FRONTEND_URL,
  res.json({
    success:true,
    message:"logged in"
  })
});

// router.get("/logout", logout);

router.post("/register", CreateUser);

router.post("/login", LoginUser);

router.get("/logout", logOutUser);

router.get("/me", isAuthenticate, myProfile);


// admin routes
router.get("/admin/users", isAuthenticated, isAdmin, getAdminUsers);

router.get("/admin/stats", isAuthenticated, isAdmin, getAdminStats);

export default router;

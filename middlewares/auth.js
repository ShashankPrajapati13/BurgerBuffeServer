import { User } from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken'
import { asyncError } from "./errorMiddleWare.js";


export const isAuthenticated = (req,res,next) => {
    const token = req.cookies["connect.sid"];

    if(!token) return next(new ErrorHandler("please login to continue",401))
    next()
}

export const isAuthenticate = asyncError(
    async (req, res, next) => {
          const token = req.cookies["connect.sid"];
      
          if (!token)
            return next(new ErrorHandler("please login to continue",401));

            
      
          const { id } = jwt.verify(token, process.env.JWT_SECRET);
          console.log(id)
      
          const user = await User.findOne({ _id: id });
      
          req.user = user;
      
          next();
      }
)

export const isAdmin = (req,res,next) => {
    if(req.user.role!=="admin") return next(new ErrorHandler("Only Admin Allowed",405))
    next()
}
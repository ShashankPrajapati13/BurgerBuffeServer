import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";
import passport from "passport";

export const connectPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refressToken, profile, done) {
        //dataBase comes here
        const user = await User.findOne({
          googleId: profile.id,
        });
        
        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            photo: profile.photos[0].value,
            email:profile.emails[0].value,
            password:"default",
            username:profile.displayName.split(" ").join("")
          });
          return done(null,newUser)
        } else {
          return  done(null, user);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

export const sendToken = async (user, statusCode, res) => {
  const token = user.generateToken();
  // // console.log(token)

  const cookieOption = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 1000),
    httpOnly: true,
  };
   
  res
    .status(statusCode)
    .cookie("connect.sid", token, cookieOption)
    .json({ message: "Logged in succesful", user, token });
};
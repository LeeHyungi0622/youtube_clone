import passport from "passport";
import User from "./models/User";

// passport-local-mongoose username, password를 사용하는 strategy
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
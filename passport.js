import passport from "passport";
import dotenv from "dotenv";
import GithubStrategy from "passport-github";
import User from "./models/User";
import routes from "./routes";
import { githubLoginCallback } from "./controllers/userController";

dotenv.config();

// passport-local-mongoose username, password를 사용하는 strategy
passport.use(User.createStrategy());

// Github strategy
passport.use(
    new GithubStrategy({
            clientID: process.env.GH_ID,
            clientSecret: process.env.GH_SECRET,
            callbackURL: `http://localhost:4000${routes.githubCallback}`
        }, // Github page에서 되돌아왔을때의 처리
        githubLoginCallback
    )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
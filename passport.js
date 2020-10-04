import passport from "passport";
import dotenv from "dotenv";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User";
import routes from "./routes";
import {
    githubLoginCallback,
    facebookLoginCallback
} from "./controllers/userController";

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

passport.use(
    new FacebookStrategy({
            clientID: process.env.FB_ID,
            clientSecret: process.env.FB_SECRET,
            callbackURL: `https://fluffy-ladybug-25.serverless.social${routes.facebookCallback}`,
            profileFields: ["id", "displayName", "photos", "email"],
            scope: ["public_profile", "email"]
        },
        facebookLoginCallback
    )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
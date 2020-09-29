import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};

export const postJoin = async(req, res, next) => {
    const {
        body: { name, email, password, password2 }
    } = req;
    if (password !== password2) {
        // 400: bad request
        req.flash("error", "Password don't match");
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else {
        // To Do: Register User
        try {
            const user = await User({
                name,
                email
            });
            await User.register(user, password);
            // To Do: Log user in
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
};

export const getLogin = (req, res) =>
    res.render("login", { pageTitle: "Log In" });

export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

// cg: passport로부터 우리에게 제공되는 것
export const githubLoginCallback = (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile, cb);
};

export const postGithubLogin = (req, res) => {
    res.send(routes.home);
};

export const logout = (req, res) => {
    req.logout();
    //To Do: Process Log Out
    res.redirect(routes.home);
};

export const userDetail = (req, res) => res.render("userDetail");
export const editProfile = (req, res) => res.render("editProfile");
export const changePassword = (req, res) => res.render("changePassword");
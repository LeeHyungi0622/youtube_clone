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

// cb: passport로부터 우리에게 제공되는 것
export const githubLoginCallback = async(_, __, profile, cb) => {
    // console.log(profile, cb);
    // github profile정보에 github 계정에 대한 정보가 담겨있다.
    const {
        _json: { id, avatar_url: avatarUrl, name, email }
    } = profile;

    try {
        const user = await User.findOne({ email });
        if (user) {
            user.githubId = id;
            user.avatarUrl = avatarUrl;
            user.name = name;
            user.save();
            // user정보만 passport에 넘겨줘서 해당 user정보를 cookie에 저장해준다.
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = async(_, __, profile, cb) => {
    const {
        _json: { id, name, email }
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.facebookId = id;
            user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
            user.name = name;
            user.save();
            // user정보만 passport에 넘겨줘서 해당 user정보를 cookie에 저장해준다.
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.logout();
    //To Do: Process Log Out
    res.redirect(routes.home);
};

export const getMe = (req, res) => {
    // user는 이미 로그인된 상태이므로, req.user 정보를 user 변수로 반환해준다.
    console.log(req.user);
    res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};

export const userDetail = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const user = await User.findById(id).populate("videos");
        // user가 업로드한 video리스트를 보여주기 위한 처리
        console.log(user);
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) =>
    res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async(req, res) => {
    const {
        body: { name, email },
        file
    } = req;
    // console.log("name, email : ", name, email);
    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            // avatar 파일을 업데이트하지 않은 경우, 현재 로그인되어있는 사용자의 avatarUrl로 업데이트한다.
            avatarUrl: file ? file.path : req.user.avatarUrl
        });
        res.redirect(routes.me);
    } catch (error) {
        console.log(error);
        res.redirect("editProfile", { pageTitle: "Edit Profile" });
    }
};

export const getChangePassword = (req, res) =>
    res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async(req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword1 }
    } = req;
    try {
        console.log(oldPassword, newPassword, newPassword1);
        if (newPassword !== newPassword1) {
            res.status(400);
            res.redirect(routes.changePassword);
            return;
        }
        // changePassword 메서드를 사용해서 user의 password를 변경해준다.
        // changePassword(oldPassword, newPassword, [cb])
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch (error) {
        console.log(error);
        res.status(400);
        res.redirect(`/users/${routes.changePassword}`);
    }
};
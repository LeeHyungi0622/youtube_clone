import routes from "../routes";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};

export const postJoin = (req, res) => {
    const {
        body: { name, email, password, password2 }
    } = req;
    if (password !== password2) {
        // 400: bad request
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else {
        // To Do: Register User
        // To Do: Log user in
        res.redirect(routes.home);
    }
};

export const getLogin = (req, res) =>
    res.render("login", { pageTitle: "Log In" });
export const postLogin = (req, res) => {
    // 로그인에 성공하면 단순히 home화면으로 redirect를 해준다.
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    //To Do: Process Log Out
    res.redirect(routes.home);
};

export const userDetail = (req, res) => res.render("userDetail");
export const editProfile = (req, res) => res.render("editProfile");
export const changePassword = (req, res) => res.render("changePassword");
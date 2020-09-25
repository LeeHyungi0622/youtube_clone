import multer from "multer";
import routes from "./routes";

const multerVideo = multer({ dest: "uploads/videos/" });

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "WeTube";
    res.locals.routes = routes;
    res.locals.user = {
        isAuthenticated: false,
        id: 1
    };
    next();
};

// 여기서 single은 오직 하나의 파일만 upload할 수 있다는 것을 의미한다.
// single('')내부에 들어가는 이름은 file type의 input 태그의 name이 들어간다.
export const uploadVideo = multerVideo.single("videoFile");
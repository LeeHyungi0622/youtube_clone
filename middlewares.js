import dotenv from "dotenv";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import routes from "./routes";

dotenv.config();

// S3유저와 관련된 부분 초기화
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_PRIVATE_KEY,
    region: "ap-northeast-2"
});

const multerVideo = multer({
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket: "cloneyoutube/video"
    })
});
const multerAvatar = multer({
    storage: multerS3({
        s3,
        acl: "public-read",
        bucket: "cloneyoutube/avatar"
    })
});

// 여기서 single은 오직 하나의 파일만 upload할 수 있다는 것을 의미한다.
// single('')내부에 들어가는 이름은 file type의 input 태그의 name이 들어간다.
export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "WeTube";
    res.locals.routes = routes;
    // res.locals.user = req.user || null;
    res.locals.loggedUser = req.user || null;
    next();
};

export const onlyPublic = (req, res, next) => {
    if (req.user) {
        res.redirect(routes.home);
    } else {
        next();
    }
};

export const onlyPrivate = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(routes.home);
    }
};
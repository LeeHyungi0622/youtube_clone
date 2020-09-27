import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
import { localsMiddleware } from "./middlewares";
import "./passport";

dotenv.config();
// express라는 이름의 파일을 찾아보고, 없으면 node_modules내부에서 찾아본다.
// const express = require("express");
const app = express();

const CookieStore = MongoStore(session);

app.use(helmet());
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: true,
        saveUninitialized: false,
        // CookieStore와 mongo간의 연결고리를 만들어줘야 한다.
        store: new CookieStore({ mongooseConnection: mongoose.connection })
    })
);
// cookieParser()로부터 내려와서 passport를 초기화
app.use(passport.initialize());
// passport가 스스로 쿠키를 들여다보고 쿠키 정보에 해당하는 사용자를 찾아줄 것이다.
// 결과적으로 passport는 찾은 사용자 요청(request)의 object, req.user을 만들어서 넘겨준다.
app.use(passport.session());
app.use(localsMiddleware);
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

// app을 import할때 위에서 만든 app object를 넘겨준다.
export default app;
import dotenv from "dotenv";
import app from "./app";
import "./db";
import "./models/Video";
import "./models/Comment";

dotenv.config();

//만일 대상을 찾지 못하면 or 4000으로 port default
// 아래와 같이 port를 숨긴다.
const PORT = process.env.PORT || 4000;

const handleListening = () =>
    console.log(`Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
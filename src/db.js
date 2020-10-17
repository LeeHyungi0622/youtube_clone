import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// 'mongodb://localhost:포트번호/Database이름'
mongoose.connect(process.env.MONGO_URL_PROD, {
    // 새로운 버전의 mongoose에서는 이런식으로 configuration을 보낼 수 있다.
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

const db = mongoose.connection;

const handleOpen = () => console.log("connected to DB");
const handleError = (error) => console.log(`Error on DB Connection: ${error}`);
// connection을 열고 성공여부를 확인할 수 있는 function을 입력
db.once("open", handleOpen);
db.on("error", handleError);
import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const deleteComment = (comment) => {
    // 로그인한 사용자와 comment 작성자가 같다면, X 표시를 보여주고, 클릭하면 작성한 comment를 삭제한다.
    // axios와 HTML tag를 li에 mongoDB에 저장된 comment id를 넣어서 삭제 처리를 할 수 있도록 한다.
};

const addComment = (comment) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerHTML = comment;
    li.appendChild(span);
    commentList.prepend(li);
    increaseNumber();
};

const sendComment = async(comment) => {
    console.log(comment);
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            // comment data는 back단의 body로 넘어갈 것이다.
            comment
        }
    });
    if (response.status == 200) {
        addComment(comment);
    }
    console.log(response);
};

const handleSumit = (event) => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
};

function init() {
    addCommentForm.addEventListener("submit", handleSumit);
}

if (addCommentForm) {
    init();
}
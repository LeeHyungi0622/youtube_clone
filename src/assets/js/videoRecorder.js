const recorderContainer = document.getElementById("jsRecordContainer");
const recordBtn = document.getElementById("jsRecordBtn");
const videoPreview = document.getElementById("jsVideoPreview");

let streamObject;
let videoRecorder;

const handleVideoData = (event) => {
    const { data: videoFile } = event;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(videoFile);
    link.download = "recorded.webm";
    document.body.appendChild(link);
    link.click();
};

const startRecording = () => {
    videoRecorder = new MediaRecorder(streamObject);
    // video record 시작
    // 매초마다 video recording정보를 return받을 수 있다.
    // videoRecorder.start(1000);
    videoRecorder.start();
    videoRecorder.addEventListener("dataavailable", handleVideoData);
    // 5초후에 video recording을 멈추기 위한 처리.
    // setTimeout(() => videoRecorder.stop(), 5000);
    recordBtn.addEventListener("click", stopRecording);
};

const stopRecording = () => {
    videoRecorder.stop();
    recordBtn.removeEventListener("click", stopRecording);
    recordBtn.addEventListener("click", getVideo);
    recordBtn.innerHTML = "Start recording";
};

const getVideo = async() => {
    try {
        // media stream을 취득하기 위한 user의 접근권한을 기다리기 위해서 비동기 처리
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 }
        });
        // 파일이 아니기때문에 srcObject 로 stream Object를 넘겨준다.
        videoPreview.srcObject = stream;
        videoPreview.muted = true;
        videoPreview.play();
        recordBtn.innerHTML = "Stop recording";
        // 화면에 보여진 video를 record
        streamObject = stream;
        startRecording();
    } catch (error) {
        recordBtn.innerHTML = "☹️ Cant record";
    } finally {
        recordBtn.removeEventListener("click", getVideo);
    }
};

function init() {
    recordBtn.addEventListener("click", getVideo);
    // 단 하나의 이벤트만 적용시킬 수 있다.
    // recordBtn.onclick = getVideo
}

if (recorderContainer) {
    init();
}
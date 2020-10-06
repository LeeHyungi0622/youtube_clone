import routes from "../routes";
import Video from "../models/Video";

export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({ _id: -1 });
        res.render("home", { pageTitle: "Home", videos });
    } catch (error) {
        console.log(error);
        res.render("home", { pageTitle: "Home", videos: [] });
    }
};

export const search = async(req, res) => {
    const {
        query: { term: searchingBy }
    } = req;
    let videos = [];
    try {
        // Video.find({title: searchingBy })를 하게 되면 검색된 단어 밖에 검색이 안된다.
        // 여기서 검색한 단어가 포함된 단어를 포함해서 검색해보도록 한다.
        // $options: "i"(insensitive) - 덜 민감하다는 것을 의미. 대소문자를 구분하지 않는다.
        videos = await Video.find({
            title: { $regex: searchingBy, $options: "i" }
        });
    } catch (error) {
        console.log(error);
    }
    // 문제가 생겨도 일단 page를 rendering한다.
    res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
    res.render("upload", { pageTitle: "Upload" });

export const postUpload = async(req, res) => {
    const {
        body: { title, description },
        file: { path }
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description,
        creator: req.user.id
    });
    // user정보 중 videos 리스트에 newVideo의 id에 대한 정보를 push 해주도록 한다.
    req.user.videos.push(newVideo.id);
    // 업데이트 된 user 정보를 저장한다.
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
    // To Do: Upload and save video (video id)
    // res.redirect(routes.videoDetail(324393));
};

export const videoDetail = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Video.findById(id).populate("creator");
        res.render("videoDetail", { pageTitle: video.title, video });
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const getEditVideo = async(req, res) => {
    // getEditVideo에서 video에 대한 정보를 가져와서 화면에 채워준 다음에
    // 아래 postEditVideo 함수에서는 정보를 서버에 보내서 업데이트를 해준다.
    const {
        params: { id }
    } = req;
    try {
        const video = await await Video.findById(id);
        if (video.creator !== req.user.id) {
            throw Error();
        } else {
            res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
        }
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const postEditVideo = async(req, res) => {
    const {
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const deleteVideo = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await await Video.findById(id);
        if (video.creator !== req.user.id) {
            throw Error();
        } else {
            await Video.findOneAndRemove({ _id: id });
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(routes.home);
};
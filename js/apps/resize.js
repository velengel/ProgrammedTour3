function ResizeVideo() {
    var video = document.getElementById("video");
    video.width = 853;
    var canvas = document.getElementById("canvas");
    canvas.width = 853;

    tracker.init(pModel);
    tracker.start(video);
    classifier.init(emotionModel);
}
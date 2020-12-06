var resizecount=0;

function ResizeVideo() {
    resizecount++;
    console.log(resizecount);
    var video = document.getElementById("video");
    //video.width=853;
    if(resizecount%2==1)video.width=853;
    else video.width = 640;//*/
    var canvas = document.getElementById("canvas");
    //canvas.width = 853;
    if(resizecount%2==1)canvas.width=853;
    else canvas.width = 640;//*/

    tracker.init(pModel);
    tracker.start(video);
    classifier.init(emotionModel);
}
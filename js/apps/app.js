//特徴点

var phase = 0;

// phase 2
var index = 0,
    bindex = -1;
var bliCnt = 0;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.hypot(dx, dy);
    }
}
var les = [],
    res = [],
    nos = [];
les.length = 1000;
res.length = 1000;
nos.length = 1000;


var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var media = navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false
});

media.then((stream) => {
    video.srcObject = stream;
});

var tracker = new clm.tracker();
tracker.init(pModel);
tracker.start(video);

var classifier = new emotionClassifier(); // ★emotionClassifier オブジェクトを作成
classifier.init(emotionModel);

function drawLoop() {
    requestAnimationFrame(drawLoop);
    var positions = tracker.getCurrentPosition();
    var parameters = tracker.getCurrentParameters(); // ★現在の顔のパラメータを取得
    var emotion = classifier.meanPredict(parameters);
    showData(positions, emotion);
    context.clearRect(0, 0, canvas.width, canvas.height);
    tracker.draw(canvas);
}
drawLoop();

function showData(pos, emo) {
    var txt = document.getElementById("txt");
    var dat = document.getElementById("dat");
    var phaseBar = document.getElementById("progress");
    phaseBar.value = phase;
    var emoBar = document.getElementById("emobar");

    switch (phase) {
        case 0:
            emoBar.style.display = "none";
            break;
        case 1:
            emoBar.style.display = "block";
            txt.innerHTML = "命令：笑顔になってください。";
            if (!!emo[5].value) {
                var hValue = emo[5].value;
                emoBar.value = hValue;
                //dat.innerHTML = "Value : " + hValue;
                if (hValue > 0.5) {
                    alert("aaaa");
                    phase = 2;
                }
            }
            break;
        case 2:
            emoBar.style.display = "none";
            txt.innerHTML = "命令：まばたきを10回してください。";
            index++;
            for (var i = 0; i < pos.length; i++) {
                if (!!pos[i][0] && !!pos[i][1]) {
                    if (i == 27) res[index] = new Point(Math.round(pos[i][0]), Math.round(pos[i][1]));
                    if (i == 32) les[index] = new Point(Math.round(pos[i][0]), Math.round(pos[i][1]));
                    if (i == 37) nos[index] = new Point(Math.round(pos[i][0]), Math.round(pos[i][1]));
                }
            }
            if (index > 1000) {
                index %= 1000;
                res = [], les = [], nos = [];
            }
            if (!!res[index] && !!res[(index - 1) % 1000]) {
                var dif27 = Point.distance(res[index], res[(index - 1) % 1000]);
                var dif32 = Point.distance(les[index], les[(index - 1) % 1000]);
                var dif37 = Point.distance(nos[index], nos[(index - 1) % 1000]);
                //console.log("dif27 : " + dif27);
                if (dif27 > 1.2 && dif32 > 1.2 && dif27 + dif32 - dif37 > 1.2 && bindex < 0) {
                    bliCnt++;
                    bindex = index;
                }

                if ((bindex + 40) % 1000 < index) bindex = -1;
            }

            dat.innerHTML = bliCnt;
            //console.log(bliCnt + "\n");
            if (bliCnt >= 10) {
                alert("bbbb");
                phase = 3;
            }
            break;
        case 3:
            emoBar.style.display = "block";
            txt.innerHTML = "命令：驚いた顔をしてください。";
            if (!!emo[4].value) {
                var sValue = emo[4].value;
                emoBar.value = sValue;
                dat.innerHTML = "Value : " + sValue;
                if (sValue > 0.2) {
                    alert("cccc");
                    phase = 4;
                }
            }
            break;
        case 4:
            txt.innerHTML = "おつかれさまでした！";
            break;
    }

}

function Start() {
    phase = 1;
    var sButton = document.getElementById("start");
    sButton.style.display = "none";
}
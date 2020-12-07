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

document.body.addEventListener('keydown',
    event => {
        if (event.key === 'n') {
            phase++;
        }
    });

var count = 0;
timerID = setInterval('countup()', 1000);

function countup() {
    if (phase == 2) {

        count++;
        var dat = document.getElementById("dat");
        dat.innerHTML = String(count);
        if (count > 11) {
            createMordalWindow(phase);
            //alert("あなたにプログラムされていた内容：\nまばたきする。\nカメラの画面をみる。\n他のことを考える。\n画面の他のところを見る。\nまばたきする。");
            //phase = 3;
        }
    }

}

var noDetectionTime = 200;

function showData(pos, emo) {
    var txt = document.getElementById("txt");
    var dat = document.getElementById("dat");
    var phaseBar = document.getElementById("progress");
    phaseBar.value = phase;
    var emoBar = document.getElementById("emoBar");

    switch (phase) {
        case 0:
            emoBar.style.display = "none";
            break;
        case 1:
            emoBar.style.display = "none";
            //var resizeButton = document.getElementById("resize");
            //resizeButton.style.display = "none";
            txt.innerHTML = "命令1：まばたきをしてください。";
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
            if (bliCnt >= 7) {
                createMordalWindow(phase);
                //alert("あなたにプログラムされていた内容：\n7回まばたきする");
                //phase = 2;
            }



            break;
        case 2:
            emoBar.style.display = "none";
            txt.innerHTML = "命令2：画面をじっと見てください。";
            break;
        case 3:
            emoBar.style.display = "block";
            var emobar = document.getElementById("emobar");
            noDetectionTime--;
            //dat.style.display = "none";
            txt.innerHTML = "命令3：笑顔になってください。";

            /*var str = ""; // データの文字列を入れる変数
            for (var i = 0; i < emo.length; i++) { // 全ての感情（6種類）について
                str += emo[i].emotion + ": " // 感情名
                    +
                    emo[i].value.toFixed(5) + "<br>"; // 感情の程度（小数第一位まで）
            }*/
            var dat = document.getElementById("dat"); // データ表示用div要素の取得
            dat.style.display = "none";
            if (!!emo[5].value) {
                //dat.innerHTML = emo[5].value;

                var hValue = emo[5].value;
                emobar.value = hValue * 5;

                if (hValue > 0.9 && noDetectionTime < 0) {
                    //alert("あなたにプログラムされていた内容：\n目を細める。\n歯を見せて笑う。\n色んな角度を試す。");
                    createMordalWindow(phase);
                    //phase = 4;
                }
            }
            //console.log(noDetectionTime);
            break;
        case 4:
            var all = document.getElementById("all");
            all.style.display = "none";
            var program = document.getElementById("program");
            var programText = `
<br>おつかれさまでした。<br>
あなたにプログラムされていた内容は以下になります。<br>
<b>無意識にやっている動作</b>や、<b>反復している動作</b>に気づけましたか？<br>
<br>
<pre><code>
# あなたの人生のライブラリをimport
import YourBehavior

def main():
    # 命令1：まばたきをしてください。
    # 7回まばたきする
    for i in range(7):
      Blink()
    # 命令2：画面をじっと見てください。
    while True:
      # 画面を見る
      LookAt(display)
      # まばたきする
      Blink()
      # 他のことを考える
      Think(something)
      # 周りを見る
      LookAround()
      # もしウィンドウが出たら、見るのをやめる
      if find(window) == True:
        break
    # 命令3：笑顔になってください。
    while True:
      # 目を細める
      Squinch(eyes)
      # 歯を見せて笑う
      Smile(with: teeth)
      # 色んな角度で笑ってみる
      Laugh(from: manyAngles)
    # もしウィンドウが出たら、笑顔を作るのをやめる
      if find(window) == True:
      break
</code></pre>
`;
            program.innerHTML = programText;
            break;
    }


}

function Start() {
    phase = 1;
    var sButton = document.getElementById("start");
    sButton.style.display = "none";
}

function createMordalWindow(phaseNumber) {
    $(this).blur();
    if ($("#modal-overlay")[0]) return false;
    $("body").append('<div id="modal-overlay"></div>');
    centeringModalSyncer();
    $("#modal-overlay").fadeIn("slow");
    $("#modal-content").fadeIn("slow");
    switch (phaseNumber) {
        case 1:
            var programText = `<b>あなたにプログラムされていた内容：</b><br>
            <pre>
# 7回まばたきする
for i in range(7):
  Blink()
</pre>`
            $("#ProgramText").html(programText);
            bliCnt = 0;
            break;
        case 2:
            var programText = `<b>あなたにプログラムされていた内容：</b><br>
            <pre>
while True:
  # 画面を見る
  LookAt(display)
  # まばたきする
  Blink()
  # 他のことを考える
  Think(something)
  # 周りを見る
  LookAround()
  # もしウィンドウが出たら、見るのをやめる
  if find(window) == True:
    break
</pre>`
            $("#ProgramText").html(programText);
            break;
        case 3:
            var programText = `<b>あなたにプログラムされていた内容：</b><br>
                <pre>
while True:
  # 目を細める
  Squinch(eyes)
  # 歯を見せて笑う
  Smile(with: teeth)
  # 色んな角度で笑ってみる
  Laugh(from: manyAngles)
# もしウィンドウが出たら、笑顔を作るのをやめる
  if find(window) == True:
    break
</pre>`
            $("#ProgramText").html(programText);
            break;
    }
    $("#modal-close").unbind().click(function() {
        $("#modal-overlay").remove();
        $("#modal-content").css({ "display": "none" });
        phase++;
    });
}

function centeringModalSyncer() {
    var w = $(window).width();
    var h = $(window).height();
    var cw = $("#modal-content").outerWidth({ margin: true });
    var ch = $("#modal-content").outerHeight({ margin: true });
    var pxleft = ((w - cw) / 2);
    var pxtop = ((h - ch) / 2);
    $("#modal-content").css({ "left": pxleft + "px" });
    $("#modal-content").css({ "top": pxtop + "px" });
}
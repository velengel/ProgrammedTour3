//笑顔

var video = document.getElementById("video"); // video 要素を取得
var canvas = document.getElementById("canvas"); // canvas 要素の取得
var context = canvas.getContext("2d"); // canvas の context の取得

// getUserMedia によるカメラ映像の取得
var media = navigator.mediaDevices.getUserMedia({ // メディアデバイスを取得
    video: { facingMode: "user" }, // カメラの映像を使う（スマホならインカメラ）
    audio: false // マイクの音声は使わない
});
media.then((stream) => { // メディアデバイスが取得できたら
    video.srcObject = stream; // video 要素にストリームを渡す
});

// clmtrackr の開始
var tracker = new clm.tracker(); // tracker オブジェクトを作成
tracker.init(pModel); // tracker を所定のフェイスモデル（※1）で初期化
tracker.start(video); // video 要素内でフェイストラッキング開始

// 感情分類の開始
var classifier = new emotionClassifier(); // ★emotionClassifier オブジェクトを作成
classifier.init(emotionModel); // ★classifier を所定の感情モデル（※2）で初期化

// 描画ループ
function drawLoop() {
    requestAnimationFrame(drawLoop); // drawLoop 関数を繰り返し実行
    var positions = tracker.getCurrentPosition(); // 顔部品の現在位置の取得
    var parameters = tracker.getCurrentParameters(); // ★現在の顔のパラメータを取得
    var emotion = classifier.meanPredict(parameters); // ★そのパラメータから感情を推定して emotion に結果を入れる
    showEmotionData(emotion); // ★感情データを表示
    context.clearRect(0, 0, canvas.width, canvas.height); // canvas をクリア
    tracker.draw(canvas); // canvas にトラッキング結果を描画
}
drawLoop(); // drawLoop 関数をトリガー

// ★感情データの表示
function showEmotionData(emo) {
    var str = ""; // データの文字列を入れる変数
    for (var i = 0; i < emo.length; i++) { // 全ての感情（6種類）について
        str += emo[i].emotion + ": " // 感情名
            +
            emo[i].value.toFixed(4) + "<br>"; // 感情の程度（小数第一位まで）
    }
    var dat = document.getElementById("dat"); // データ表示用div要素の取得
    dat.innerHTML = str; // データ文字列の表示
}
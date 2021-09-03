
(function(){
    'use strict'; //エラーチェックを行う

 //htmlのidからデータを取得
 //取得したデータを変数に代入
    //HTMLでid指定して部分を、各変数に代入する
    //変数を指定することでid部分と連携させられる

var timer = document.getElementById('timer');
var start = document.getElementById('start');
var stop = document.getElementById('stop');
var reset = document.getElementById('reset');

//クリック時の時間を保持するための変数定義
var startTime;

//経過時刻を更新するための変数。 初めはだから0で初期化
var elapsedTime = 0;

//タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
var timerId;

//タイマーをストップ -> 再開させたら0になってしまうのを避けるための変数。
var timeToadd = 0;


//ミリ秒の表示ではなく、分とか秒に直すための関数, 他のところからも呼び出すので別関数として作る
//計算方法として135200ミリ秒経過したとしてそれを分とか秒に直すと -> 02:15:200
function updateTimetText(){

    //m(分) = 135200 / 60000ミリ秒で割った数の商　-> 2分
    //Math.floor( 45.95); =45　　Math.floor()内の数字を整数で返す
    //elapsedTime:経過時間表示で設定した変数
    var m = Math.floor(elapsedTime / 60000);

    //s(秒) = 135200 % 60000ミリ秒で / 1000 (ミリ秒なので1000で割ってやる) -> 15秒
    var s = Math.floor(elapsedTime % 60000 / 1000);

    //ms(ミリ秒) = 135200ミリ秒を % 1000ミリ秒で割った数の余り
    var ms = elapsedTime % 1000;


    //HTML 上で表示の際の桁数を固定する　例）3 => 03　、 12 -> 012
    //javascriptでは文字列数列を連結すると文字列になる
    //文字列の末尾2桁を表示したいのでsliceで負の値(-2)引数で渡してやる。
    m = ('0' + m).slice(-2); 
    s = ('0' + s).slice(-2);
    ms = ('0' + ms).slice(-2); //2桁表示になる

    //HTMLのid　timer部分に表示させる　
    //ここでHTML内のtimer文字部分と連携させる、ないと表示変わらない
    timer.textContent = m + ':' + s + ':' + ms;
}


//再帰的に使える用の関数
function countUp(){

    //timerId変数はsetTimeoutの返り値になるので代入する
    timerId = setTimeout(function(){

        //経過時刻(elapsedTime)は現在時刻をミリ秒で示すDate.now()からstartを押した時の時刻(startTime)を引く
        elapsedTime = Date.now() - startTime + timeToadd;
        updateTimetText()

        //countUp関数自身を呼ぶことで10ミリ秒毎に以下の計算を始める
        countUp();

    //1秒以下の時間を表示するために10ミリ秒後に始めるよう宣言
    },10);
}

//startボタンにクリック時のイベントを追加(タイマースタートイベント)
//id.addEventListener('click',function(){ 実行したい処理　});
start.addEventListener('click',function(){

    //現在時刻を示すDate.nowを代入
    //startTimeでクリック時の時間が保持されている、
    startTime = Date.now();

    //再帰的に使えるように関数を作る
    countUp();
});

//stopボタンにクリック時のイベントを追加(タイマーストップイベント)
//stop.addEventListener('click',function(){
    stop.addEventListener('click',function(){

    //タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
    //変数TimerIdは61行目でsetTimeoutに代入しているので、そこに対応する
    clearInterval(timerId);


    //タイマーに表示される時間elapsedTimeが現在時刻からスタートボタンを押した時刻を引いたものなので、
    //タイマーを再開させたら0になってしまう。elapsedTime = Date.now - startTime
    //それを回避するためには過去のスタート時間からストップ時間までの経過時間を足してあげなければならない。
    //elapsedTime = Date.now - startTime + timeToadd (timeToadd = ストップを押した時刻(Date.now)から直近のスタート時刻(startTime)を引く)
   timeToadd += Date.now() - startTime;
});

//resetボタンにクリック時のイベントを追加(タイマーリセットイベント)
reset.addEventListener('click',function(){
    clearInterval(timerId);

    //経過時刻を更新するための変数elapsedTimeを0にしてあげつつ、updateTimetTextで0になったタイムを表示。
    //経過時間を0にすることで、タイマーの表示が0でリセットできる
    elapsedTime = 0;

    //リセット時に0に初期化したいのでリセットを押した際に0を代入してあげる
    //再度スタートボタンを押したときに0からのスタートになる
    //指定しない場合：リセットで表示が0になるが、再度スタートボタンを押すとリセットした時間から再度計測を始めてしまう
    timeToadd = 0;

    //updateTimetTextで0になったタイムを表示
    //関数updateTimetTextでタイマーの表示を設定している
    updateTimetText();


});


//ここから　ボタンの不活化

//$('button').prop('disabled', false);
//trueで付与、falseで解除

//最初はスタートボタンのみ活性にしておく
$('#stop').prop('disabled', true);
$('#reset').prop('disabled', true);

//スタートボタンを押すとスタートが不活性化、ストップとリセットは活性
$('#start').click(function() {
    $('#start').prop('disabled', true);
    $('#stop').prop('disabled',  false);
    $('#reset').prop('disabled', false);
})

//ストップ押すとスタートが解除
$('#stop').click(function() {
    $('#start').prop('disabled', false);
    $('#reset').prop('disabled', false);
})

//リセットを押すと最初の状態に戻る
$('#reset').click(function() {
    $('#start').prop('disabled', false);
    $('#stop').prop('disabled', true);
    $('#reset').prop('disabled', false);
})


})();

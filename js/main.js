$(main)

var gEBI = (sel) => document.getElementById(sel);
var qSA = (sel) => document.querySelectorAll(sel);
var qS = (sel) => document.querySelector(sel);

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function main(){
    // ロケールを設定
    moment.locale('ja');
    new app({});
}


/************************************/
//          保管
/************************************/




//作成日時
//start_dt 開始予定日時　開始シグナル
//limit_dt 完了予定日時　リミットシグナル
//do_at 開始日時 活動開始
//done_at 完了日時　完了報告

/*
10.30
TODOを作ろう
------------------------
<要望>
期限が決まっているもの
eg.給料が振り込まれる15日から月末までに家賃を振り込む。それは毎月発生する。
eg.今は差し迫ってしなくてもいいけど来年の春までに引っ越しをしなくてはならない。
eg.月曜から水曜日のファイルの取り込み作業は自分が担当する。水曜日は取り込み完了を上司に報告する。

日時、繰り返し、
タスクの自動発生をどうつくるか

また、実績を残せるようにしたい。
eg.ﾌﾟﾗﾝAは、10月1日 HHMMに完了した。
eg.ﾌﾟﾗﾝBは、今日の12:00から作業開始し、15:30に終了した。

また、そこから発生した別の作業も関連付けて記録したい。
eg.ﾌﾟﾗﾝCの作業が始まると、それを完了させるためには工程Xが必要だと気付いた。

上記例があるなら、タスクの中に複数のタスクが入る構造もありえる。

<仕様>
色々面倒だから、まず、タスクの作成と、そのタスクが完了したかを記録できるようにしよう。


<備考>
予実管理は、budget control
実績は、actual achievement
*/
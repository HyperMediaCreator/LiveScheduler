
var Task = Backbone.Model.extend({
    "idAttribute": "id"
    , urlRoot:'request.php'
//        , urlRoot: 'tasks'
/*
        , urlRoot: function(){
            if(this.isNew()){
                return "request.php";
            } else {
                return "request.php?id=" + this.id;
            }
        } */
    //(1) データ構造とデフォルト値の定義
    ,"defaults":{
        'id':null
        ,'ins_at':null
        ,'manpower':null
        ,'start_dt':null
        ,'limit_dt':null
        ,'do_at':null
        ,'done_at':null
        ,'title':null
        ,'content':null
        ,'status':null
    }
});
var TaskList = Backbone.Collection.extend({
    model: Task
    // モデルの内容取得先リソース
    , url : 'request.php'
    // リソースから取得した結果をモデルに格納する前に参照できる。
    // returnされた値のみがモデルに格納される
    ,initialize: function(){
//         _.bindAll(this);
//         this.on('change', this.cbChange);
    },
    cbChange: function(model, collection){
        //所定の位置に入れるなら使うかもね
        var index = this.indexOf(model);
    }, parse : function(res) {
        if (res.error) {
            // エラーがあればエラーメッセージ表示
            alert("error",res.error.message);
        }
        // モデルに格納するデータ部分を返す
        return res;
    }
});
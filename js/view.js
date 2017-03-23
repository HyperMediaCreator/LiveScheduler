var EditorView = Backbone.View.extend({
    "initialize":function() {
        //重複起動を避ける
        if(this.el.style.display === "block") return;
        _.bindAll(this, "render", "enter","afterHidePanel","toggleDtUnit");
        this.render();
    },"events":{
        "click input": "enter"
        ,"click input[type=radio]":"toggleDtUnit"
    },"toggleDtUnit":function(e){
        
    },"render":function(){
        this.$el.html(EditorView.render(this.model.toJSON()));
        //Edit Area
        $('.start_dt,.limit_dt,.do_at,.done_at').datetimepicker({
          format: 'Y-m-d H:i',
          lang: 'ja'
        });
        $('.manpower').datetimepicker({
          startDate:'2000/01/01 00:00',
          format: 'Y-m-d H:i',
          lang: 'ja'
        });
        $("#editorPanel").show();
        this.el.style.display = "block";

        //フェード効果 DATEPICKER
        $("#editorPanel").on({
            'mouseenter':function(e){
                $('#fadeLayer').stop(); //無駄な繰り返しをさせない
                $('#fadeLayer').show().fadeTo(20000, 0.8);
            },
            'mouseleave':_.bind(function(e){
                $('#fadeLayer').stop();
                $('#fadeLayer').fadeTo('fast', 0, function(){ })
//                 $("#editorPanel").stop();
//                 $("#editorPanel").fadeTo(5000,0,_.bind(function(){ this.afterHidePanel(); },this));
            },this)
        },this);
        return this;
    },"enter":function(e){
        if(!(e.target.value === "OK" || e.target.value === "CANCEL")) return;
        if(e.target.value === "OK"){
            var newTask = $(this.$el.find("form")).serializeObject();
            //更新オブジェクト([edit])なら、saveしたらcollectionのsyncが発火して画面更新される
            //新規オブジェクトならコレクションに追加されていないので、collectionには何も通知されない
            this.model.save(newTask,{
                "silent":true
                ,'success':_.bind(function(_model,_id){
                    if(!_model.isNew()) return;
                    //ここで新規オブジェクトをコレクションに追加するが
                    //その前にinsertの戻り値のidを割り当てる
                    _model.set("id",_id);
                    //したあと、コレクションに追加
                    this.collection.add(_model);
                    //追加後、しかるべきイベントがコレクションから生ずる
                    },this)
                ,'error':function(){console.log("error",arguments)}
                });
        }
        this.afterHidePanel();
    },"afterHidePanel":function(){
        $('#fadeLayer').stop();
        $('#fadeLayer').hide();
//         $("#editorPanel").stop();
        //elを破棄しないままだと、再度このクラスをnewした時イベントの重複登録になる。
        //それを避けるため、ウィンドウを閉じるときはundelegateする。
        this.undelegateEvents();
        this.el.style.display = "none";
        this.el.removeChild(gEBI("editorPanel"));
    }
},{
    render:_.template(gEBI("tmpl_editorPanel").innerText)
});



var app = Backbone.View.extend({
    "el":"#app"
    ,"events":{
        "click button":"button_clicked"
    },"initialize":function() {
        _.bindAll(this,"interval","button_clicked","edit","delete");
        intervalID = window.setInterval(this.interval,60000);
        this.collection = new TaskList();
        this.collection.fetch();
        new TaskListView({el:'#tasklist',collection:this.collection});
    },"button_clicked":function(e){
        var name = e.target.id || e.target.className;
        switch(name){
            case "del":this.delete();break;
            case "newtask":this.newtask();break;
            case "edit":this.edit(e.target.value);break;
            case "upd":this.upd();break;
        }
    },"upd":function(){
        this.collection.fetch({data: {page: 3}});
    },"delete":function(){
        var ids = $("input:checked","#tasklist").map(function(){return this.getAttribute("data-my-id");});
        _.each(ids,function(id,idx,total){
            //複数のモデルを削除する場合、画面への反映は全てのモデルを削除仕切った時でよい。
            //isLast : 全てのモデルを削除したかの判定
            //this.collection.remove は コレクション内のみの削除操作で、(サーバに)deleteリクエストを送らない
            //delete リクエストを送るために、model.destroy()を行う
            //collection.remove で removeイベントが発火 -> TaskView内でmodel.remove を補足しそこでdestroy
            var model = this.collection.get(id);
            this.collection.remove(model);
        },this)
    },"interval":function(){
        var disp = gEBI("disp");
        disp.innerHTML = moment().format("YYYY/MM/DD(ddd) HH:mm");
    },"newtask":function(){
        //タスク作成フォームを出す
        //作成ボタンが押されたら、DBにも作成
        new EditorView({el:"#task_disp",model:new Task(),collection:this.collection});
    },"edit":function(idx){
        new EditorView({el:"#task_disp",model:this.collection.get(idx),collection:this.collection});
    }
});


/*
追加
削除
更新

*/

var TaskView = Backbone.View.extend({
    "initialize":function() {
        _.bindAll(this,"remove","render","format");
        this.listenTo(this.model,'all',function(){ console.log("TaskView - all -",arguments); });
        this.listenTo(this.model,"remove",this.remove)
        this.listenTo(this.model,'change',this.render);
        this.render();
    },"events":{
        "click td:nth-child(1)":"toggleChk"
    },"toggleChk":function(e){
        if(e.target.nodeName === "INPUT")return;
        var chk = this.$el.find("td:nth-child(1) input");
        chk.prop('checked',!chk.prop('checked'));
    },"remove":function(_model,_collection){
        this.stopListening();
        _model.destroy();
        this.undelegateEvents();
        this.$el.remove();
//         this.remove();
    },"render":function(){
        var json = this.format(this.model.attributes);
        var html = TaskView.compiled(json);
        $(this.el).html(html);
        return this;
    }, "format":function (task){
        var _task = $.extend({},task);
        if(_task["ins_at"] === null ){
            task["ins_at"] = "0000-00-00 00:00:00";
        }
        //"0000-00-00 00:00:00"
        _task["view_ins_at"]   = task["ins_at"][0]   === "0" ? "-" : moment(task["ins_at"]).format("YYYY/MM/DD ddd HH:mm");
        _task["view_start_dt"] = task["start_dt"][0] === "0" ? "-" : moment(task["start_dt"]).format("YYYY/MM/DD ddd HH:mm");
        _task["view_limit_dt"] = task["limit_dt"][0] === "0" ? "-" : moment(task["limit_dt"]).format("YYYY/MM/DD ddd HH:mm");
        _task["view_do_at"]    = task["do_at"][0]    === "0" ? "-" : moment(task["do_at"]).format("YYYY/MM/DD ddd HH:mm");
        _task["view_done_at"]  = task["done_at"][0]  === "0" ? "-" : moment(task["done_at"]).format("YYYY/MM/DD ddd HH:mm");
        _task["view_manpower"]  = task["manpower"][0]  === "0" ? "-" : moment(task["manpower"]).diff(moment('2000-01-01 0:00'),'minute') + "min";  //'days'  'hour'
        _task["view_remain"] = task["limit_dt"][0] === "0" ? "-" : moment(task["limit_dt"]).diff(moment(),'minute');
        
        if(task['status'] === 'done' || task['status'] === 'complete') _task["view_remain"] = "-";
        
        //実績工数
        if( (task['status'] === 'done' || task['status'] === 'complete') &&　task["do_at"][0]    !== "0" && task["done_at"][0]  !== "0"){
            _task["view_manpower"] += "/実績 " + moment(task["done_at"]).diff(moment(task["do_at"]),'minute') + 'min';
        }
        return _task;
    }
}, {
    compiled: _.template(""
        + "<td><input type='checkbox' data-my-id='<%= id %>'></td>"
        + "<td class='stts'><%= status %></td>"
        + "<td class='inst'><%= view_ins_at %></td>"
        + "<td class='manp'><%= view_manpower %></td>"
        + "<td class='remain'><%= view_remain %></td>"
        + "<td class='start'><%= view_start_dt %></td>"
        + "<td class='limit'><%= view_limit_dt %></td>"
        + "<td class='do'  ><%= view_do_at %></td>"
        + "<td class='done'><%= view_done_at %></td>"
        + "<td class='ttle'><%= title %></td>"
        + "<td class='cont'><%= content %></td>"
        + "<td class='edit'><button type='button' class='edit' value='<%= id %>'>edit</button></td>")
});



var TaskListView = Backbone.View.extend({
    "initialize":function() {
        this.render();
        // オブザーバパターンを利用してモデルのイベントを購読
        this.listenTo(this.collection,'all',function(){console.log("TaskListView - all",arguments)});
        this.listenTo(this.collection,'add',this.add);
    }, "add": function(model){
        var taskView = new TaskView({ "tagName":"tr", "model": model });
        this.$el.find('tbody').append(taskView.el);
    }, "render":function(){
        this.$el.html($(TaskListView.template));
        return this;
    }
},{
    template:
        "<table id='tasks'>"
        + "<colgroup><col><col><col class='dt'><col class='dt'><col class='dt'><col class='dt'><col class='dt'><col class='dt'><col class='dt'><col><col><col></colgroup>"
        + "<thead><tr><th>選択</th><th>状態</th><th>起票</th><th>工数</th><th>残</th><th>開始予定</th><th>期日</th><th>実行</th><th>完了</th><th>名称</th><th>内容</th><th>編集</th></tr></thead>"
        + "<tbody>"
        + "<tr class='tr0'><td>(1) chk</td><td>(2) stts</td><td>(3) insAt</td><td>(3) manP</td><td>(3) remain</td><td>(4) start</td><td>(5) limit</td><td>(6) do</td><td>(7) done</td><td>(8) title</td><td>(9) content</td><td>(10) chgStts</td></tr>"
        + "</table></tbody>"
});
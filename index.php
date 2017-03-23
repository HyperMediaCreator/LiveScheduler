<?PHP ?>
<html>
<head>
    <meta charset="utf-8">

    <!-- template -->
    <script type="text/template" id="sts_lst">
        <select class="sts_lst">
            <option value="create" data-my-desc="作成済">CREATED</option>
            <option value="complete" data-my-desc="責務を果たし完了した">COMPLETE</option>
            <option value="done" data-my-desc="済">DONE</option>
            <option value="abort" data-my-desc="放棄">ABORT</option>
            <option value="running" data-my-desc="実施中">RUNNING</option>
        </select>
    </script>

    <!-- NEW TASK -->
    <script id="tmpl_task" type="text/template">
        <input type="text" required  maxlength="30" class="title" placeholder="title">
        <br><textarea class="content" maxlength="200" cols="50" rows="4" placeholder="content"></textarea>
        <br><input class="start" type="datetime" placeholder="開始日時"><input class="end" type="datetime" placeholder="終了日時">
        <br><input class="deadline" type="datetime" placeholder="発生日"><input class="deadline" type="datetime" placeholder="期日">
        <br><button class="ok">OK</button>
        <button class="cancel">CANCEL</button>
    </script>

    <script id="tmpl_editorPanel" type="text/template">
        <!-- 編集ウィンドウ -->
        <form id="editorPanel">
            <!-- ステータス -->
            <select class="sts_lst" name="status">
                <option value="create" data-my-desc="作成済" <% if("create" == status)print("selected"); %> >CREATED</option>
                <option value="complete" data-my-desc="責務を果たし完了した" <% if("complete" == status)print("selected"); %> >COMPLETE</option>
                <option value="done" data-my-desc="済" <% if("done" == status)print("selected"); %> >DONE</option>
                <option value="abort" data-my-desc="放棄" <% if("abort" == status)print("selected"); %> >ABORT</option>
                <option value="running" data-my-desc="実施中" <% if("running" == status)print("selected"); %> >RUNNING</option>
            </select>
            <!-- ID -->
            <div class="row">
                Id:<label class="idx"><%= id %></label>
            </div>
            <!-- タイトル -->
            <div class="row">
                <label class="title">Title</label><input type="text" class="ttle" placeholder="Title" name="title" value="<%= title %>">
            </div>
            <!-- コンテント -->
            <div class="row">
                <label class="content">Content</label>
                <textarea class="cont" name="content" placeholder="Content"><%= content %></textarea>
            </div>
            <!-- 日時 -->
            <div class="row">
                <label class="dt">Start</label><input type="text" name="start_dt" class="start_dt" placeholder="Start" value="<%= start_dt %>">
                <label class="dt">Limit</label><input type="text" name="limit_dt" class="limit_dt" placeholder="Limit" value="<%= limit_dt %>">
            </div>
            <div class="row">
                <label class="dt">Do</label><input type="text" name="do_at" class="do_at" placeholder="Do" value="<%= do_at %>">
                <label class="dt">Done</label><input type="text" name="done_at" class="done_at" placeholder="Done" value="<%= done_at %>">
            </div>
            <div class="row">
                <label class="dt">manp</label><input type="text" name="manpower" class="manpower" placeholder="工数" value="<%= manpower %>">
                <label><input type="radio" name="manp" value="day">日</label>
                <label><input type="radio" name="manp" value="hour" checked>時</label>
                <label><input type="radio" name="manp" value="min">分</label>
            </div>
            <!-- [OK] / [CANCEL] -->
            <input type="button" class="ok" value="OK"><input type="button" class="cancel" value="CANCEL">
        </form>
    </script>

    <!-- important -->
<!--    <script type="text/javascript" src="lib/jquery-3.1.1/jquery-3.1.1.js" charset="UTF-8"></script> -->
    <!-- jQuery v1.10.2 -->
    <script type="text/javascript" src="lib/datetimepicker-master/jquery.js" charset="UTF-8"></script>
    <!-- Underscore.js 1.8.3 -->
    <script type="text/javascript" src="lib/Underscore.js-1.8.3/underscore.js" charset="UTF-8"></script>
    <!-- Backbone.js 1.3.3 -->
    <script type="text/javascript" src="lib/Backbone.js-1.3.3/backbone-min.js" charset="UTF-8"></script>

    <!-- less -->
    <link rel="stylesheet/less" type="text/css" href="css/styles.less">
    <script src="lib/less.min.js" type="text/javascript"></script>

    <!-- datetimepicker -->
    <link rel="stylesheet" type="text/css" href="lib/datetimepicker-master/build/jquery.datetimepicker.min.css"/>
    <script type="text/javascript" src="lib/datetimepicker-master/build/jquery.datetimepicker.full.min.js" charset="UTF-8"></script>

    <!-- moment.js -->
    <script type="text/javascript" src="lib/moment-master/min/moment.min.js" charset="UTF-8"></script>
    <script type="text/javascript" src="lib/moment-master/locale/ja.js" charset="UTF-8"></script>

    <!-- main -->
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <link rel="stylesheet" type="text/css" href="css/editorpanel.css">
    <script type="text/javascript" src="js/main.js" charset="UTF-8"></script>
    <script type="text/javascript" src="js/router.js" charset="UTF-8"></script>
    <script type="text/javascript" src="js/model.js" charset="UTF-8"></script>
    <script type="text/javascript" src="js/view.js" charset="UTF-8"></script>
</head>

<body>
    <div id="app">
        <div id="fadeLayer"></div>
        <div id="disp"></div>
        <div id="controlPanel">
            <button id="newtask" class="newtask">NEW TASK</button>
        </div>

        <!-- タスク一覧表 -->
        <div id="tasklist"></div>

        <!-- タスク編集 -->
        <div id="task_disp"></div>
        
        <button type="button" id="upd" value="upd">更新</button>
        <button type="button" id="del" value="del">削除</button>
    </div>
</body>
</html>
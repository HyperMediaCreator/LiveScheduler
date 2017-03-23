<?php
$link = mysql_connect('localhost', 'root', '');
if (!$link) {
    die('接続失敗です。'.mysql_error());
}

$db_selected = mysql_select_db("test", $link);
if (!$db_selected){
    die('データベース選択失敗です。'.mysql_error());
}

mysql_set_charset('utf8');

$method = $_SERVER["REQUEST_METHOD"];
switch($method){
    case "GET" :
        fetch();
        break;
    case "POST" :
        create();
        break;
    case "PUT" :
        save();
        break;
    case "DELETE" :
        destroy();
        break;
}

$close_flag = mysql_close($link);
exit();

function fetch(){
    if(isset($_SERVER['PATH_INFO'])) {
        $where = "id = " . str_replace("/","",$_SERVER['PATH_INFO']);
    } else if(isset($_GET['page'])){
        $page = $_GET['page'];
    } else {
        $where = "1=1";
    }
    $q = "SELECT * FROM `schedule` WHERE $where ORDER BY FIELD(STATUS,'create','running','done','complete','abort'), LIMIT_DT DESC";
    if(isset($_GET["status"]) && $_GET["status"] !== ""){
        $status = $_POST["status"];
        $q = "SELECT * FROM `schedule` WHERE status='$status'";
    }

    $result = mysql_query($q);
    if (!$result) { die('クエリーが失敗しました。'.mysql_error()); }

    $var = array();
    while ($row = mysql_fetch_assoc($result)) {
        array_push($var, $row);
    }
    echo json_encode($var);
}

function create(){
    $reqData = json_decode(file_get_contents('php://input'), TRUE);
    $title = $reqData["title"];
    $content = $reqData["content"];
    $status = $reqData["status"];


    //mysql_query() を利用して SHOW COLUMNS FROM table [LIKE 'name'] 文
    $result = mysql_query('SHOW COLUMNS FROM `schedule`');
    while ($row = mysql_fetch_assoc($result)) {
        $fields[] = $row;
    }

    foreach ($reqData as $key => $val) {
        foreach($fields as $field){
            if($key !== $field['Field'] || $key === 'id' || $key === 'ins_at' ) continue;
            if($val === "") continue;
            $keys[] = "`".$key."`";
            $vals[] = "'".$val."'";
            /*
            if($field['Type'] === 'datetime'){
                $keys[] = "`".$key."`";
                $vals[] = $val;
            } else {
                $keys[] = "`".$key."`";
                $vals[] = "'".$val."'";
            }
            */
        }
    }
    $keyStr = implode(",",$keys);
    $valStr = implode(",",$vals);
    $q = "INSERT INTO `schedule`(`ins_at`, $keyStr) VALUES (now(),$valStr)";
//     $q = "INSERT INTO `schedule`(`ins_at`, `title`, `content`, `status`) VALUES (now(),'$title','$content','$status')";

    $result = mysql_query($q);
    if (!$result) { die('クエリーが失敗しました。'.mysql_error()); }
    echo mysql_insert_id();
}

function save(){
    $reqData = json_decode(file_get_contents('php://input'), TRUE);
    $id = $reqData["id"];
    $set = array();

    array_push($set, "title='$reqData[title]'");
    array_push($set, "content='$reqData[content]'");
    if(isset($reqData["status"]) && $reqData["status"] !== "") 		array_push($set, "status='$reqData[status]'");
    if(isset($reqData["start_dt"]) && $reqData["start_dt"] !== "") 	array_push($set, "start_dt='$reqData[start_dt]'");
    if(isset($reqData["limit_dt"]) && $reqData["limit_dt"] !== "") 	array_push($set, "limit_dt='$reqData[limit_dt]'");
    if(isset($reqData["do_at"]) && $reqData["do_at"] !== "") 		array_push($set, "do_at='$reqData[do_at]'");
    if(isset($reqData["done_at"]) && $reqData["done_at"] !== "") 	array_push($set, "done_at='$reqData[done_at]'");
    if(isset($reqData["manpower"]) && $reqData["manpower"] !== "") 	array_push($set, "manpower='$reqData[manpower]'");

    $setStr = implode(",",$set);
    $q = "UPDATE `schedule` SET $setStr WHERE id=$id";

    $result = mysql_query($q);
    if (!$result) { die('クエリーが失敗しました。'.mysql_error()); }
    echo mysql_affected_rows();
}

function destroy(){
    $id = str_replace("/","",$_SERVER['PATH_INFO']);
    $q = "DELETE FROM `schedule` WHERE id=$id";

    $result = mysql_query($q);
    if (!$result) { die('クエリーが失敗しました。'.mysql_error()); }
}


return;
//echo $_SERVER["REQUEST_METHOD"];
$ar = array(
    "data" => array(
        "id" => 1
        ,"foo" => "bar"
        ,"bar" => $_SERVER["REQUEST_METHOD"]
        ,"get" => $_GET
        ,"post" => $_POST
    ),"error" => array(
        //エラーメッセージ（エラー発生時のみ）
        "message" => "errmsg"
    )

);
// echo json_encode($_GET);
//echo json_encode($ar);
?>
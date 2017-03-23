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


$sql = $_POST["sql"];

if($sql === "INS") {
	$title = $_POST["title"];
	$content = $_POST["content"];
	$status = $_POST["status"];
	$q = "INSERT INTO `schedule`(`ins_at`, `title`, `content`, `status`) VALUES (now(),'$title','$content','$status')";
} elseif ($sql === "UPD") {
	$id = $_POST["id"];
	$set = array();
	
	array_push($set, "title='$_POST[title]'");
	array_push($set, "content='$_POST[content]'");
	if(isset($_POST["status"]) && $_POST["status"] !== "") 		array_push($set, "status='$_POST[status]'");
	if(isset($_POST["start_dt"]) && $_POST["start_dt"] !== "") 	array_push($set, "start_dt='$_POST[start_dt]'");
	if(isset($_POST["limit_dt"]) && $_POST["limit_dt"] !== "") 	array_push($set, "limit_dt='$_POST[limit_dt]'");
	if(isset($_POST["do_at"]) && $_POST["do_at"] !== "") 		array_push($set, "do_at='$_POST[do_at]'");
	if(isset($_POST["done_at"]) && $_POST["done_at"] !== "") 	array_push($set, "done_at='$_POST[done_at]'");

	$setStr = implode(",",$set);
	$q = "UPDATE `schedule` SET $setStr WHERE id=$id";
	// $q = "UPDATE `schedule` SET do_at='2016-01-01 12:11' WHERE id=1"; //SUCCESS
	// $q = "UPDATE `schedule` SET do_at=cast('2016-01-01 12:11:12' as datetime) WHERE id=1"; //SUCCESS
	// $q = "UPDATE `schedule` SET do_at=cast('2016-01-01 18:17' as datetime) WHERE id=1"; //SUCCESS
} elseif ($sql === "SEL") {
	$q = "SELECT * FROM `schedule` WHERE 1=1";
	if(isset($_POST["status"]) && $_POST["status"] !== ""){
		$status = $_POST["status"];
		$q = "SELECT * FROM `schedule` WHERE status='$status'";
	}
} elseif ($sql === "DEL") {
	$id = $_POST["id"];
	$q = "DELETE FROM `schedule` WHERE id=$id";
}

$result = mysql_query($q);

if (!$result) { die('クエリーが失敗しました。'.mysql_error()); }

if($sql === "INS") {
	echo mysql_insert_id();
} elseif ($sql === "UPD") {
	echo mysql_affected_rows();
} elseif ($sql === "SEL") {
	$var = array();
	while ($row = mysql_fetch_assoc($result)) {
		array_push($var, $row);
	}
	echo json_encode($var);
}

$close_flag = mysql_close($link);
exit();

$close_flag = mysql_close($link);
if ($close_flag){}

?>
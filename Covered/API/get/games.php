<?php
include "../util.php";
$conn = connect();

$sql = "SELECT * FROM Games";

$lst = array();
$res = $conn->query($sql);

foreach ($res as $game) {
    array_push($lst, $game);
}

throwCode("Success", 200, $lst);
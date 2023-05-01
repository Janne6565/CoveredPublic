<?php
include "util.php";
$conn = connect();

$query = protect($_GET["query"]);

$sql = "SELECT * FROM Games WHERE Games.DisplayName LIKE '%$query%'";
$res = $conn->query($sql);

$lst = array();

foreach ($res as $game) {
    array_push($lst, $game);
}

throwCode("Success", 200, $lst); 
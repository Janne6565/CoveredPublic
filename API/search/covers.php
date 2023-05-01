<?php 
include "util.php";
$conn = connect(); 

$gameId = protect($_GET["gameId"]);

$sql = "SELECT * FROM Covers WHERE GameId = $gameId";
$res = $conn->query($sql);

$lst = array();

foreach ($res as $game) {
    array_push($lst, $game);
}

throwCode("Success", 200, $lst); 
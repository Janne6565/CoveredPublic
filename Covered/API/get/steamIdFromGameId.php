<?php
include "../util.php";
$conn = connect(); 

$gameId = protect($_GET["gameId"]);

$sql = "SELECT SteamId FROM Games WHERE GameId = $gameId";
$res = $conn->query($res);

foreach ($res as $game) {
    throwCode("Success", 200, $game["SteamId"]);
}
<?php
include "../util.php";
$conn = connect();

$steamId = protect($_GET["steamId"]);

$sql = "SELECT GameId FROM Games WHERE SteamId = $steamId";
$res = $conn->query($sql);

$found = false;
foreach ($res as $game){
    throwCode("Success", 200, $game["GameId"]);
    $found = true;
}

if (!$found) {
    throwCode("Not Found", 401, "No game found with that ID");
}
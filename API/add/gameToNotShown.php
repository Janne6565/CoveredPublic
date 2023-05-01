<?php
include "../util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$gameId = protect($_GET["gameId"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "INSERT INTO GamesNotToShow (UserId, GameId) VALUES ($userId, $gameId)";
    $res = $conn->query($sql);
} else {
    throwCode("Wrong User Infos", 401, "Wrong UserAuth or UserId");
}   
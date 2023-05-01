<?php
include "../util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$gameId = protect($_GET["gameId"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "INSERT INTO OwnsGame VALUES ($userId, $gameId)";
    $conn->query($sql);
    throwCode("Success", 200, "Added Game to your Owned Games");
} else {
    throwCode("Wrong User Infos", 401, "Wrong UserAuth or UserId");
} 
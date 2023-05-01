<?php
include "../util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "SELECT * FROM OwnsGame WHERE UserId = $userId";
    $res = $conn->query($sql);

    $lst = array();
    foreach ($res as $game) {
        array_push($lst, $game["GameId"]);
    }
    throwCode("Success", 200, $lst);
} else {
    throwCode("Wrong User Infos", 401, "Wrong UserAuth or UserId");
} 
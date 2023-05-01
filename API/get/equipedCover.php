<?php
include "../util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$coverId = protect($_GET["coverId"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "SELECT * FROM Covers, Likes WHERE Covers.GameId = (SELECT GameId FROM Covers WHERE CoverId = $coverId) AND Likes.UserId = $userId AND Likes.CoverId = Covers.CoverId";
    $res = $conn->query($sql);
    $found = false;

    foreach ($res as $cover) {
        $found = true;
        throwCode("Success", 200, $cover);
    }

    if (!$found) {
        throwCode("Success", 201, "No Cover equiped");
    }
} else {
    throwCode("Wrong User Infos", 401, "Wrong UserAuth or UserId");
} 
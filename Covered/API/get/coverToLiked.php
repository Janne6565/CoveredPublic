<?php
include "../util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$coverId = protect($_GET["coverId"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "INSERT INTO Likes (UserId, CoverId) VALUES ($userId, $coverId)";
    $res = $conn->query($sql);
} else {
    throwCode("Wrong User Infos", 401, "Wrong UserAuth or UserId");
}  
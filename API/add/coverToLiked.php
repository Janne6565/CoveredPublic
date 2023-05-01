<?php
include "../util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$coverId = protect($_GET["coverId"]);

if (verifyUser($userId, $userAuth)) {
    $sqlInsert = "INSERT INTO Dislikes (UserId, CoverId) SELECT $userId, Covers.CoverId FROM Covers JOIN Likes ON Covers.CoverId = Likes.CoverId WHERE Covers.GameId = (SELECT GameId FROM Covers WHERE CoverId = $coverId)";
    $conn->query($sqlInsert);
    $sqlClear = "DELETE FROM Likes WHERE CoverId IN (SELECT CoverId FROM Covers WHERE GameId = (SELECT GameId FROM Covers WHERE CoverId = $coverId))";
    $conn->query($sqlClear);
    echo $sqlClear;

    $sql = "INSERT INTO Likes (UserId, CoverId) VALUES ($userId, $coverId)";
    $conn->query($sql);
} else {
    throwCode("Wrong User Infos", 401, "Wrong UserAuth or UserId"); 
}  
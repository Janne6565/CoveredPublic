<?php
include "../util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$only600900 = protect($_GET["only600900"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "";
    if ($only600900 == "1") {
        $sql = "SELECT * FROM Covers WHERE Covers.GameId IN (SELECT Games.GameId FROM Games, OwnsGame WHERE OwnsGame.UserId = $userId AND Games.GameId = OwnsGame.GameId) AND Covers.CoverId NOT IN (SELECT CoverId FROM Likes WHERE UserId = $userId) AND Covers.CoverId NOT IN (SELECT CoverId FROM Dislikes WHERE UserId = $userId) AND Covers.CoverId NOT IN (SELECT CoverId FROM ListItems WHERE UserId = $userId) AND GameId NOT IN (SELECT GameId FROM GamesNotToShow WHERE UserId = $userId) AND GameId NOT IN (SELECT GameId FROM Likes, Covers WHERE Covers.CoverId = Likes.CoverId AND UserId = $userId) AND Covers.Type = 'library_600x900'";
    } else {
        $sql = "SELECT * FROM Covers WHERE Covers.GameId IN (SELECT Games.GameId FROM Games, OwnsGame WHERE OwnsGame.UserId = $userId AND Games.GameId = OwnsGame.GameId) AND Covers.CoverId NOT IN (SELECT CoverId FROM Likes WHERE UserId = $userId) AND Covers.CoverId NOT IN (SELECT CoverId FROM Dislikes WHERE UserId = $userId) AND Covers.CoverId NOT IN (SELECT CoverId FROM ListItems WHERE UserId = $userId) AND GameId NOT IN (SELECT GameId FROM GamesNotToShow WHERE UserId = $userId) AND GameId NOT IN (SELECT GameId FROM Likes, Covers WHERE Covers.CoverId = Likes.CoverId AND UserId = $userId)";
    }
    $res = $conn->query($sql);
    $lst = array();

    foreach ($res as $cover) {
        array_push($lst, $cover);
    }

    throwCode("Success", 200, $lst);
} else {
    throwCode("Wrong User Infos", 401, "Wrong UserAuth or UserId");
}
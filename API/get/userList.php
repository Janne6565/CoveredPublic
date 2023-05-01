<?php
include "../util.php";
$conn = connect(); 

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$gameId = protect($_GET["gameId"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "SELECT * FROM ListItems, Covers, Games WHERE Covers.GameId = Games.GameId AND Covers.CoverId = ListItems.CoverId AND UserId = $userId AND Games.GameId = $gameId";
    $res = $conn->query($sql);
    $lst = array();
    foreach ($res as $item) {
        array_push($lst, $item);
    }
    throwCode("Success", 200, $lst);
}
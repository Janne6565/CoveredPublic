<?php
include "../util.php";
$conn = connect(); 

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$coverId = protect($_GET["coverId"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "INSERT INTO ListItems (SELECT $userId, GameId, $coverId FROM Covers WHERE CoverId = $coverId)";
    $conn->query($sql);

    throwCode("Success", 200, "Successfully added Item to list");
}
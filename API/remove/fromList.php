<?php
include "../util.php";
$conn = connect(); 

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);
$coverId = protect($_GET["coverId"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "DELETE FROM ListItems WHERE CoverId = $coverId AND UserId = $userId";
    $conn->query($sql);

    throwCode("Success", 200, "Successfully removed Item from list");
}
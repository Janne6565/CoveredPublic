<?php
include "../util.php";
$conn = connect(); 

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "SELECT *, COUNT(*) AS numEntrys FROM ListItems, Covers WHERE Covers.CoverId = ListItems.CoverId AND UserId = $userId GROUP BY ListItems.GameId";
    $res = $conn->query($sql);

    $lst = array();
    foreach ($res as $item) {
        array_push($lst, $item);
    }
    throwCode("Success", 200, $lst);
}
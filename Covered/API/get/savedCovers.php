<?php
include "../util.php";
$conn = connect(); 

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "SELECT * FROM Likes, Covers WHERE Likes.CoverId = Covers.CoverId AND Likes.UserId = $userId";
    $res = $conn->query($sql);
    $lst = array(); 
    foreach ($res as $item) {
        array_push($lst, $item);
    }
    throwCode("Success", 200, $lst);
} else {
    throwCode("Wrong User Infos", 401, "Wrong UserAuth or UserId");
} 
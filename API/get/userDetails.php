<?php
include "../util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);

$sql = "SELECT * FROM Users WHERE UserId = $userId && UserAuth = '$userAuth'";
$res = $conn->query($sql);
$data = [];
$found = false;

foreach ($res as $item) {
    $found = true;
    $item["Password"] = null;
    throwCode("Success", 200, $item);
}  

if (!$found) {
    throwCode("Failure", 400, "No User could be found");
}
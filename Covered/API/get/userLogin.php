<?php
include "../util.php";
$conn = connect();

$userEmail = protect($_GET["userEmail"]);
$userPassword = protect($_GET["userPassword"]);

$sql = "SELECT * FROM Users WHERE UserEmail = '$userEmail'";
$res = $conn->query($sql);
$data = [];

if (isEmpty($res)) {
    throwCode("Wrong User Infos", 401, "Either your Password or Email is incorrect");
}
foreach ($res as $item) {
    if (password_verify($userPassword, $item["UserPassword"])) {
        $item["Password"] = null;
        throwCode("Success", 200, $item);
    } else {
        throwCode("Wrong User Infos", 401, "Either your Password or Email is incorrect");
    }
}  
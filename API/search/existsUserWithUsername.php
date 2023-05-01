<?php
include "../util.php";
$conn = connect();

$userName = protect($_GET["userName"]);

$sql = "SELECT UserName FROM Users WHERE UserName = '$userName'";
$res = $conn->query($sql);

if (isEmpty($res)) {
    throwCode("No User Found", 200, "There was no User found with that Username");
} else {
    throwCode("User Found", 201, "There was a User found with that Username");
}
<?php
include "../util.php";
$conn = connect(); 

$coverId = protect($_GET["coverId"]);

$sql = "SELECT * FROM Covers WHERE CoverId = $coverId";
$res = $conn->query($sql);

$found = false;

foreach ($res as $cover) {
    $found = true;
    throwCode("Success", 200, $cover);
}

if (!$found) {
    throwCode("No Cover Found", 400, "No Cover with that ID found");
}
<?php
include "../util.php";
$conn = connect();

$gameId = protect($_GET["gameId"]);
$onlyLibraryIcons = protect($_GET["only600900"]);

$sql = "SELECT * FROM Covers WHERE GameId = $gameId";

if ($onlyLibraryIcons == "1") {
    $sql = "SELECT * FROM Covers WHERE GameId = $gameId AND Type = 'library_600x900'";
}

$res = $conn->query($sql);

$lst = array();
foreach ($res as $cover) {
    array_push($lst, $cover);
}

throwCode("Success", 200, $lst);
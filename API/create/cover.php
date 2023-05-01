<?php
include "../util.php";
$conn = connect();

$seperator = protect($_GET["seperator"]);
$paths = explode($seperator, protect($_GET["paths"]));
$gameId = explode($seperator, protect($_GET["gameId"]));
$authorId = explode($seperator, protect($_GET["authorId"]));
$differentAuthor = explode($seperator, protect($_GET["differentAuthor"]));
$type = explode($seperator, protect($_GET["type"]));
$style = explode($seperator, protect($_GET["style"]));
$linkToPost = explode($seperator, protect($_GET["linkToPost"]));
$adminKey = protect($_GET["adminKey"]);

$sql = "INSERT INTO Covers (`Path`, `GameId`, `AuthorId`, `DifferentAuthor`, `Type`, `Style`, `linkToPost`) VALUES ";
for ($i = 0; $i <= sizeof($paths); $i++) {
    if ($paths[$i] != '') {
        $sql .= "('$paths[$i]', $gameId[$i], '$authorId[$i]', '$differentAuthor[$i]', '$type[$i]', $style[$i], '$linkToPost[$i]')";
    }
    if ($paths[$i + 1] != '') {
        $sql .= ",";
    } else {
        $sql .= ";";
    }
}

if ($adminKey != getAdminKey()) {
    throwCode("Admin Key is wrong", 401, "Der Admin Key ist falsch");
} else {
    $conn->query($sql);
}

echo $sql;
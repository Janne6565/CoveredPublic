<?php
include "../util.php";
$conn = connect();

$gameId = protect($_GET["gameId"]);

$sql = "SELECT * FROM Games WHERE GameId = $gameId";
$res = $conn->query($sql);
$getGenres = "SELECT * FROM GameGenre WHERE GameId = $gameId";
$resGenre = $conn->query($sql);

foreach ($res as $game) {
    $lst = array(); 
    foreach ($resGenre as $genre) {
        array_push($lst, $genre["GenreId"]);
    }

    $game["Genres"] = $lst;
    throwCode("Game Found", 200, $game);
}
 
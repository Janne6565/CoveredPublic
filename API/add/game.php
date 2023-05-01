<?php
include "../util.php";
$conn = connect();

$adminKey = protect($_GET["adminKey"]);
$steamId = protect($_GET["steamId"]);

if ($adminKey == getAdminKey()) {
    $sql = "SELECT * FROM Games WHERE SteamId = $steamId";
    $res = $conn->query($sql); 
    if (isEmpty($res)) {
        $url = "https://store.steampowered.com/api/appdetails?appids=$steamId";
        $lst = file_get_contents($url);
        if ($lst != '{"response":{}}') {
            $json = json_decode($lst)->$steamId->data;
            $name = $json->name;
            $sqlToExe = "INSERT INTO Games (GameDisplayName, SteamId) VALUES ('$name', $steamId); ";
            foreach ($json->genres as $genre) {
                $sqlToExe .= "INSERT INTO GameGenre (GameId, GenreId) VALUES ((SELECT max(GameId) FROM Games WHERE SteamId = $steamId), $genre->id); ";
            }
            echo $sqlToExe;
            $conn->multi_query($sqlToExe);
        } else {
            throwCode("Couldnt import steam Games", 402, "Please make your Steam Profile public for us to import your owned Games (https://help.steampowered.com/de/faqs/view/588C-C67D-0251-C276)");
        }
    } else {
        throwCode("Allready Added", 401, "This game is allready in the Library");
    }
} 
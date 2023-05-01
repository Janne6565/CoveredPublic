<?php 
include "../util.php";
$conn = connect();

$userName = protect($_GET["userName"]);
$userPassword = password_hash(protect($_GET["userPassword"]), PASSWORD_DEFAULT);
$userEmail = protect($_GET["userEmail"]);
$userAuth = randomString(40);
$steamId = protect($_GET["steamId"]);

$sql = "INSERT INTO Users (UserName, UserPassword, UserEmail, UserAuth, SteamId) VALUES ('$userName', '$userPassword', '$userEmail', '$userAuth', $steamId)";
$res = $conn->query($sql);
$getUserDetails = "SELECT * FROM Users WHERE UserName = '$userName' && UserPassword = '$userPassword' && UserEmail = '$userEmail'";
$resUser = $conn->query($getUserDetails);
$found = false;
foreach ($resUser as $item) {
    $item["Password"] = null;
    throwCode("User Created", 200, $item);
    $found = true;
    $url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=497BD25A58E5053680B03F236823F84F&steamid=$steamId&format=json";
    $lst = file_get_contents($url);
    if ($lst != '{"response":{}}') {
        $json = json_decode($lst)->response->games;
        $sqlToExe = "";
        $userId = $item["UserId"];
        foreach ($json as $game) {
            $queryCheckIfGameExists = "SELECT * FROM Games WHERE SteamId = $game->appid";
            $resultExists = $conn->query($queryCheckIfGameExists);
            if (isEmpty($resultExists)) {
                $url = "https://projektejwkk.com/Covered/API/add/game.php?adminKey=ahdihhasiudhaiushduiavhduiahduivaunhv127831784zv81235z7z78aszve78szna7878nz2178z3781gvkjnghnviun2374z&steamId=$game->appid";
                $lst = file_get_contents($url);
            }

            $sqlToExe .= "INSERT INTO OwnsGame (UserId, GameId) SELECT $userId, GameId FROM Games WHERE SteamId = $game->appid; ";
        }
        $conn->multi_query($sqlToExe);
    } else {
        throwCode("Couldnt import steam Games", 402, "Please make your Steam Profile public for us to import your owned Games (https://help.steampowered.com/de/faqs/view/588C-C67D-0251-C276)");
    }
}

if (!$found) {
    throwCode("Failure", 402, "There is allready a User existing with those Informations");
}
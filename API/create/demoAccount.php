<?php 
include "../util.php";

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$games = explode(",", protect($_GET["gameList"]));

$conn = connect();


$sql = "INSERT INTO Users (UserName, UserAuth, UserPassword, UserEmail, SteamId) VALUES (?, ?, ?, ?, ?)";

$userName = "";
$userAuth = "";
$userPassword = "";
$userEmail = "";
$steamId = "";

while (True) {
    $stmt = $conn->prepare($sql); 

    $userName = "Demo Account: " . randomString(20);
    $userAuth = randomString(20);
    $userPassword = password_hash(randomString(20), PASSWORD_DEFAULT);
    $userEmail = randomString(20);
    $steamId = randomString(20);

    $stmt->bind_param("ssssi", $userName, $userAuth, $userPassword, $userEmail, $steamId);
    $success = $stmt->execute();

    if ($success) {
        break;
    }
}

$getUserDetails = "SELECT * FROM Users WHERE UserName = '$userName' && UserPassword = '$userPassword' && UserEmail = '$userEmail'";
$resUser = $conn->query($getUserDetails);
$found = false;
$userId = 0;
foreach ($resUser as $item) {
    $item["Password"] = null;
    $userId = $item["UserId"];
    throwCode("User Created", 200, $item);
    $found = true;
}

foreach ($games as $game) {
    $sql = "INSERT INTO OwnsGame (UserId, GameId) VALUES (?, ?)";
    $stmtGames = $conn->prepare($sql);
    $stmtGames->bind_param("ii", $userId, $game);
    $stmtGames->execute();
}

if (!$found) {
    throwCode("Failure", 402, "There is allready a User existing with those Informations");
}
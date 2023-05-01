<?php
include "util.php";
$conn = connect();

$userId = protect($_GET["userId"]);
$userAuth = protect($_GET["userAuth"]);

if (verifyUser($userId, $userAuth)) {
    $sql = "SELECT * FROM Covers, Games WHERE CoverId IN (SELECT CoverId FROM Likes WHERE UserId = $userId) AND Games.GameId = Covers.GameId";
    $res = $conn->query($sql);
    $files = array();

    foreach ($res as $cover) {
        array_push($files, [$cover["Path"], $cover["SteamId"] . "_" . $cover["Type"] . ".jpg"]);
    }

    
    $zip = new ZipArchive();

    # create a temp file & open it
    $tmp_file = tempnam('.', '');
    $zip->open($tmp_file, ZipArchive::CREATE);

    # loop through each file
    foreach ($files as $file) {
        # download file
        $download_file = file_get_contents($file[0]);

        #add it to the zip
        $zip->addFromString($file[1], $download_file);
    }

    # close zip
    $zip->close();

    # send the file to the browser as a download
    header('Content-disposition: attachment; filename="my file.zip"');
    header('Content-type: application/zip');
    readfile($tmp_file);
    unlink($tmp_file);
} else {
    throwCode("Wrong User Infos", 400, "Cant login with those user informations");
} 
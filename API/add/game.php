<?php
include "../util.php";
$conn = connect();

$adminKey = protect($_GET["adminKey"]);
$steamId = protect($_GET["steamId"]);


$styles = array(
    "none specific" => 0,
    "alternate" => 1,
    "blurred" => 2,
    "no_logo" => 3,
    "material" => 4,
    "white_logo" => 5
);

$widthHeight = array(
    "library_600x900" => 2 / 3,
    "logo" => 1 / 3,
    "library_hero" => 1920 / 620,
    "icon" => 1
);


$apiKey = "e18791e0887d1a17d92e146e4e44e379";




// Use the covers as needed

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
            $conn->query($sqlToExe);
            $gameId = mysqli_insert_id($conn);
            foreach ($json->genres as $genre) {
                $sqlToExe = "INSERT INTO GameGenre (GameId, GenreId) VALUES ($gameId, $genre->id); ";
                $conn->query($sqlToExe);
            }
            $conn->multi_query($sqlToExe);

            // Get Game ID from Steam ID
            $url = "https://www.steamgriddb.com/api/v2/games/steam/$steamId";
            $headers = array(
                "Authorization: Bearer $apiKey",
                "Content-Type: application/json"
            );

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $response = curl_exec($ch);
            $jsonResponse = json_decode($response);
            $gameIdCover = $jsonResponse->data->id;

            $url = "https://www.steamgriddb.com/api/v2/grids/game/$gameIdCover";
            $headers = array(
                "Authorization: Bearer $apiKey",
                "Content-Type: application/json"
            );

            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

            $response = curl_exec($ch);
            $jsonResponse = json_decode($response);

            $sqlToExecute = "";

            foreach ($jsonResponse->data as $item) {
                $style = $item->style;
                $styleId = $styles[$style];

                $res = $item->width / $item->height;
                $res_key = "";
                $res_val = 0;

                foreach ($widthHeight as $key => $value) {
                    if (abs($res - $value) < abs($res - $res_val)) {
                        $res_key = $key;
                        $res_val = $value;
                    }
                }

                $path = $item->url;

                $author = $item->author;

                $authorId = $author->name;

                $differentAuthor = $author->steam64;

                $linkToPost = "https://www.steamgriddb.com/grid/" . $item->id;

                $thumbPath = $item->thumb;

                $sqlToExecute .= "INSERT INTO `Covers`(`Path`, `GameId`, `AuthorId`, `DifferentAuthor`, `Type`, `Style`, `linkToPost`, `ThumbPath`) VALUES (\"$path\", $gameId, \"$authorId\", $differentAuthor, \"$res_key\", $styleId, \"$linkToPost\", \"$thumbPath\"); ";
            }

            $conn->multi_query($sqlToExecute);

        } else {
            throwCode("Couldnt import steam Games", 402, "Please make your Steam Profile public for us to import your owned Games (https://help.steampowered.com/de/faqs/view/588C-C67D-0251-C276)");
        }


    } else {
        throwCode("Allready Added", 401, "This game is allready in the Library");
    }
} 
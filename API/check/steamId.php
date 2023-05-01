<?php 
include "../util.php";

$steamId = protect($_GET["steamId"]);

$url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=497BD25A58E5053680B03F236823F84F&steamid=$steamId&format=json";

$lst = file_get_contents($url);

if ($lst != '{"response":{}}' AND $lst != "") {
    echo "true";
} else {
    echo "false";
}

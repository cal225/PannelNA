<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = "https://mylogbook.fr/mto/dernier_metar.json";
$data = file_get_contents($url);

// DEBUG: Voir ce que renvoie vraiment le serveur
if ($data === false) {
    echo json_encode(["error" => "Erreur lors de la récupération du METAR"]);
    exit;
}

echo $data;

<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = "https://mylogbook.fr/mto/dernier_metar.json";
$data = @file_get_contents($url);

if (!$data) {
    echo json_encode(["error" => "Échec de récupération (file_get_contents)"]);
    exit;
}

$decoded = json_decode($data, true);

if ($decoded === null) {
    echo json_encode([
        "error" => "JSON invalide",
        "raw" => $data // ← include raw response for debugging
    ]);
    exit;
}

echo $data;

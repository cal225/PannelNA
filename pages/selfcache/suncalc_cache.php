<?php
header('Content-Type: application/json');

$lat = 46.9;
$lon = 6.3667;
$today = date('Y-m-d');
$cacheDir = '/tmp/suncalc';
$cacheFile = "$cacheDir/suncalc.json";
$cacheDuration = 43200; // 2 minutes

// Crée le dossier s'il n'existe pas
if (!is_dir($cacheDir)) {
    if (!mkdir($cacheDir, 0755, true)) {
        error_log("Failed to create cache directory: $cacheDir");
    }
}

// Lire cache s'il est valide
if (file_exists($cacheFile)) {
    $data = json_decode(file_get_contents($cacheFile), true);
    if ($data && isset($data['date']) && $data['date'] === $today) {
        echo json_encode($data);
        exit;
    }
}

// Serve cached version if still fresh
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheDuration) {
    echo file_get_contents($cacheFile);
    exit;
}

// Sinon, recalcul avec `date_sun_info`
$info = date_sun_info(time(), $lat, $lon);

$data = [
    'date' => $today,
    'sunrise' => gmdate('H:i', $info['sunrise']),
    'sunset' => gmdate('H:i', $info['sunset'])
];

// Sauvegarde cache
file_put_contents($cacheFile, json_encode($data));

echo json_encode($data);

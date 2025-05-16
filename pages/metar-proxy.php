<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = "https://mylogbook.fr/mto/dernier_metar.json";
$cacheDir = "/tmp/metar_cache";
$cacheFile = $cacheDir . "/metar_mylogbook.json";
$lockFile = $cacheFile . ".lock";
$cacheDuration = 120; // i want this to be only 2 min

// Ensure cache directory exists
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}

// Serve cached version if still fresh
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheDuration) {
    echo file_get_contents($cacheFile);
    exit;
}

// Try to get a lock
$lock = fopen($lockFile, 'w');
if ($lock && flock($lock, LOCK_EX)) {
    $data = @file_get_contents($url);

    if ($data === false) {
        $error = error_get_last();

        // Serve stale cache if available
        if (file_exists($cacheFile)) {
            echo file_get_contents($cacheFile);
        } else {
            echo json_encode([
                "error" => "Échec de récupération METAR",
                "details" => $error['message'] ?? 'Erreur inconnue'
            ]);
        }

        flock($lock, LOCK_UN);
        fclose($lock);
        exit;
    }

    // Save fresh data and release lock
    file_put_contents($cacheFile, $data);
    flock($lock, LOCK_UN);
    fclose($lock);

    echo $data;
} else {
    // Could not get lock — fallback to cached version
    if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
    } else {
        echo json_encode(["error" => "Impossible d'accéder au cache"]);
    }
}

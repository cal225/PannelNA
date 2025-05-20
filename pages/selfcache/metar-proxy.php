<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$url = "https://mylogbook.fr/mto/dernier_metar.json";
$cacheDir = "/tmp/metar_cache";
$cacheFile = $cacheDir . "/metar_mylogbook.json";
$lockFile = $cacheFile . ".lock";
$cacheDuration = 120; // 2 minutes

// Ensure cache directory exists
if (!is_dir($cacheDir)) {
    if (!mkdir($cacheDir, 0755, true)) {
        error_log("Failed to create cache directory: $cacheDir");
    }
}

if (!is_writable($cacheDir)) {
    error_log("Directory not writable: $cacheDir");
}

// Allow forcing fresh fetch via ?nocache=1
$forceRefresh = isset($_GET['nocache']) && $_GET['nocache'] == '1';

// Serve cached version if still fresh
if (!$forceRefresh && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheDuration) {
    echo file_get_contents($cacheFile);
    exit;
}

// Try to get a lock
$lock = fopen($lockFile, 'w');
if (!$lock) {
    error_log("Failed to open lock file: $lockFile");
}

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

    // Validate JSON before saving
    if (json_decode($data) === null) {
        error_log("Invalid JSON fetched from $url");
        if (file_exists($cacheFile)) {
            echo file_get_contents($cacheFile);
        } else {
            echo json_encode([
                "error" => "JSON invalide reçu depuis la source"
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

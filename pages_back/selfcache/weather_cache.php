<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Configuration
$location = "pontarlier";
$apiKey = "95e866d055a843c0bb882659251405";
$url = "https://api.weatherapi.com/v1/forecast.json?key=$apiKey&q=$location&days=1&aqi=no&alerts=no";

$cacheDir = "../tmp/weather_cache";
$cacheFile = "$cacheDir/weather_$location.json";
$lockFile = $cacheFile . ".lock";
$cacheDuration = 900; // 15 minutes

// Create cache directory if needed
if (!is_dir($cacheDir)) {
    if (!mkdir($cacheDir, 0755, true)) {
        error_log("Failed to create cache directory: $cacheDir");
    }
}

if (!is_writable($cacheDir)) {
    error_log("Directory not writable: $cacheDir");
}

// Optional ?nocache=1
$forceRefresh = isset($_GET['nocache']) && $_GET['nocache'] == '1';

if (!$forceRefresh && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheDuration) {
    echo file_get_contents($cacheFile);
    exit;
}

$lock = fopen($lockFile, 'w');
if (!$lock) {
    error_log("Failed to open lock file: $lockFile");
}

if ($lock && flock($lock, LOCK_EX)) {
    $data = @file_get_contents($url);

    if ($data === false) {
        $error = error_get_last();
        if (file_exists($cacheFile)) {
            echo file_get_contents($cacheFile);
        } else {
            echo json_encode([
                "error" => "Failed to fetch weather",
                "details" => $error['message'] ?? "Unknown error"
            ]);
        }
        flock($lock, LOCK_UN);
        fclose($lock);
        exit;
    }

    if (json_decode($data) === null) {
        error_log("Invalid JSON from WeatherAPI");
        if (file_exists($cacheFile)) {
            echo file_get_contents($cacheFile);
        } else {
            echo json_encode([
                "error" => "Invalid JSON from WeatherAPI"
            ]);
        }
        flock($lock, LOCK_UN);
        fclose($lock);
        exit;
    }

    file_put_contents($cacheFile, $data);
    flock($lock, LOCK_UN);
    fclose($lock);

    echo $data;
} else {
    if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
    } else {
        echo json_encode(["error" => "Unable to access cache"]);
    }
}

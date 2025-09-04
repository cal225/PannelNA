<?php
// Headers CORS + JSON
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Vérification du paramètre ICAO
$icao = $_GET['icao'] ?? null;
if (!$icao) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing ICAO code']);
    exit;
}

// Clé d'API (à sécuriser en prod)
$token = 'Bearer cVJu7da4o0GuccX3b4fghqCIn1DXrozwicZ2WVJZvzU';

// Cache config
$cacheDir = "../pages/tmp";
$cacheFile = "$cacheDir/{$icao}_aviation.json";
$lockFile = $cacheFile . ".lock";
$cacheDuration = 300; // 5 min

// Création du dossier cache si besoin
if (!is_dir($cacheDir) && !mkdir($cacheDir, 0755, true)) {
    error_log("Failed to create cache directory: $cacheDir");
}
if (!is_writable($cacheDir)) {
    error_log("Directory not writable: $cacheDir");
}

// Forcer le rafraîchissement via ?nocache=1
$forceRefresh = isset($_GET['nocache']) && $_GET['nocache'] == '1';

// Si le cache est valide, le renvoyer
if (!$forceRefresh && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheDuration) {
    echo file_get_contents($cacheFile);
    exit;
}

// Tentative de verrouillage
$lock = fopen($lockFile, 'w');
if (!$lock) {
    error_log("Failed to open lock file: $lockFile");
}

if ($lock && flock($lock, LOCK_EX)) {
    $headers = [
        "Authorization: $token",
        "Accept: application/json"
    ];

    function fetchAviation(string $url, array $headers): ?array {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }

    $metar = fetchAviation("https://avwx.rest/api/metar/{$icao}", $headers);
    $taf = fetchAviation("https://avwx.rest/api/taf/{$icao}", $headers);

    if (!$metar || !$taf) {
        error_log("Invalid JSON received from AVWX");

        // Si cache dispo : fallback
        if (file_exists($cacheFile)) {
            echo file_get_contents($cacheFile);
        } else {
            echo json_encode(["error" => "Failed to fetch valid METAR/TAF data"]);
        }

        flock($lock, LOCK_UN);
        fclose($lock);
        exit;
    }

    $data = [
        "title" => "app_resa",
        "metar" => $metar['raw'] ?? null,
        "taf" => $taf['raw'] ?? null
    ];

    file_put_contents($cacheFile, json_encode($data));
    flock($lock, LOCK_UN);
    fclose($lock);

    echo json_encode($data);
} else {
    // Fallback si pas de lock
    if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
    } else {
        echo json_encode(["error" => "Unable to access cache"]);
    }
}

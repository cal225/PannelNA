<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// DB connection config
$dbHost = 'nextaviametopdb.mysql.db';
$dbUser = 'nextaviametopdb';
$dbPass = 'F2EnyHCU01nRwk3iOp9W8fVvu1RPwL';
$dbName = 'nextaviametopdb';

// Cache config
$cacheDir = __DIR__ . '/../tmp/pro_vol';
$cacheFile = $cacheDir . '/get_vols.json';
$lockFile = $cacheFile . '.lock';
$cacheDuration = 0; // in seconds

// Ensure cache directory exists
if (!is_dir($cacheDir)) {
    if (!mkdir($cacheDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to create cache directory"]);
        exit;
    }
}
if (!is_writable($cacheDir)) {
    http_response_code(500);
    echo json_encode(["error" => "Cache directory not writable"]);
    exit;
}

// Force refresh if needed
$forceRefresh = isset($_GET['nocache']) && $_GET['nocache'] == '1';

// Serve cache if available
if (!$forceRefresh && file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheDuration) {
    echo file_get_contents($cacheFile);
    exit;
}

// Lock cache file
$lock = fopen($lockFile, 'w');
if (!$lock || !flock($lock, LOCK_EX)) {
    if (file_exists($cacheFile)) {
        echo file_get_contents($cacheFile);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Unable to acquire lock or access cache."]);
    }
    exit;
}

// Connect to DB
$mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if ($mysqli->connect_errno) {
    flock($lock, LOCK_UN);
    fclose($lock);
    http_response_code(500);
    echo json_encode(["error" => "Failed to connect to DB", "details" => $mysqli->connect_error]);
    exit;
}
$mysqli->set_charset("utf8");

// Corrected SQL
$sql = "
SELECT 
    r.date_debut AS Date,
    a.immat_avion AS Avion,
    c.nom_client AS NomClient,
    c.prenom_client AS PrenomClient,
    f.trigramme AS FI,
    r.id_lecon AS Instruction,
    r.id_type AS TypeVol
FROM 
    app_resa r
LEFT JOIN app_client c ON r.id_client = c.id_client
LEFT JOIN app_lov_avions a ON r.id_avion = a.id_avion
LEFT JOIN app_lov_fi f ON r.id_fi = f.id_fi
WHERE 
    r.date_debut > NOW() - INTERVAL 3 HOUR
ORDER BY 
    r.date_debut ASC
LIMIT 30;
";

$result = $mysqli->query($sql);

if (!$result) {
    flock($lock, LOCK_UN);
    fclose($lock);
    http_response_code(500);
    echo json_encode(["error" => "SQL query failed", "details" => $mysqli->error]);
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "Date" => $row['Date'],
        "Avion" => $row['Avion'],
        "NomClient" => $row['NomClient'],
        "PrenomClient" => $row['PrenomClient'],
        "FI" => $row['FI'],
        "Instruction" => $row['Instruction'],
        "TypeVol" => $row['TypeVol'] // renamed for consistency with JS
    ];
}

$output = [
    "data" => $data
];

// Save to cache
file_put_contents($cacheFile, json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

// Release lock
flock($lock, LOCK_UN);
fclose($lock);

// Output JSON
echo json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

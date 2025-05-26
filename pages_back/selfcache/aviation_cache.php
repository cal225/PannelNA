<?php
$icao = $_GET['icao'] ?? null;
if (!$icao) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing ICAO code']);
  exit;
}

// Token (secure this in a real app)
$token = 'Bearer rDahirOQPf9u5UajlxNP7GbD_rJDSEjbFTNRRfe2CMo';

// File-based cache
$cacheFile = __DIR__ . "/?page=5.3/{$icao}_aviation.json";
$cacheTTL = 300; // 5 minutes

// If cache valid, serve
if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTTL)) {
  header('Content-Type: application/json');
  echo file_get_contents($cacheFile);
  exit;
}

// Fetch METAR and TAF
$headers = [
  "Authorization: $token",
  "Accept: application/json"
];

function fetchAviation($url, $headers) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  $response = curl_exec($ch);
  curl_close($ch);
  return json_decode($response, true);
}

$metar = fetchAviation("https://avwx.rest/api/metar/{$icao}", $headers);
$taf = fetchAviation("https://avwx.rest/api/taf/{$icao}", $headers);

// Save to cache
$data = [
  'metar' => $metar['raw'] ?? null,
  'taf' => $taf['raw'] ?? null
];

file_put_contents($cacheFile, json_encode($data));
header('Content-Type: application/json');
echo json_encode($data);

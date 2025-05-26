<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// List of pages inside the "pages" folder
$pages = [
    ['logo/logo.php', 'logo/logo-white.php', 'logo/logo-grey.php'],
    'meteo.php',
    'clock.php',
    'flight.php',
    'METAR.php',
    ['../pages_back/selfcache/metar-proxy.php', '../pages_back/selfcache/suncalc_cache.php', '../pages_back/selfcache/weather_cache.php', '../pages_back/selfcache/aviation_cache.php'],
    '../pages_back/get_vols.php'
];


// Get page param as string, e.g., "3.1"
$pageParam = isset($_GET['page']) ? $_GET['page'] : '0';
$parts = explode('.', $pageParam);

$mainIndex = isset($parts[0]) && is_numeric($parts[0]) ? (int)$parts[0] : 0;
$subIndex = isset($parts[1]) && is_numeric($parts[1]) ? (int)$parts[1] : 0;

// Validate main index
if ($mainIndex < 0 || $mainIndex >= count($pages)) {
    $mainIndex = 0;
}

// Select page
$selectedPage = $pages[$mainIndex];

if (is_array($selectedPage)) {
    // Validate sub index
    if ($subIndex < 0 || $subIndex >= count($selectedPage)) {
        $subIndex = 0;
    }
    $selectedPage = $selectedPage[$subIndex];
}

// Include selected page
include 'pages/' . $selectedPage;

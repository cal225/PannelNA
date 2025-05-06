<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// List of pages inside the "pages" folder
$pages = ['logo.php', 'meteo.php', 'METAR.php', 'flightD.php', 'flightA.php'];
// Get 'page' from URL, default to 0 if not set or invalid
$pageIndex = isset($_GET['page']) ? (int)$_GET['page'] : 0;

// Make sure the index is within the array bounds
if ($pageIndex < 0 || $pageIndex >= count($pages)) {
    $pageIndex = 0; // fallback to first page if out of range
}

// Include selected page
include 'pages/' . $pages[$pageIndex];
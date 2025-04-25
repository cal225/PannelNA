<?php
// List of pages inside the "pages" folder
$pages = ['METAR.php', 'meteo.php', 'flightD.php', 'flightA.php'];

// Get current page index from query string (default to 0)
$currentIndex = isset($_GET['page']) ? (int)$_GET['page'] : 0;

// Safety check: if index is out of bounds
if ($currentIndex < 0 || $currentIndex >= count($pages)) {
    $currentIndex = 0;
}

// Calculate next page index
$nextIndex = ($currentIndex + 1) % count($pages);

// Set meta refresh to auto-rotate
// echo '<meta http-equiv="refresh" content="60;url=?page=' . $nextIndex . '">';

// Set up path to the current page
$currentPage = 'pages/' . $pages[$currentIndex];


// Include common layout
include 'header.php';
// include $currentPage;
include 'pages/meteo.php';
include 'footer.php';

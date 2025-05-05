<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// List of pages inside the "pages" folder
$pages = ['METAR.php', 'meteo.php', 'flightD.php', 'flightA.php'];

// Include common layout
include 'header.php';
// include $currentPage;
include 'pages/'.$pages[1];
include 'footer.php';

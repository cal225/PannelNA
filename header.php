<?php
echo "
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <meta http-equiv='Cache-Control' content='no-cache, no-store, must-revalidate'>
    <meta http-equiv='Pragma' content='no-cache'>
    <meta http-equiv='Expires' content='0'> 
    <meta name='format-detection' content='telephone=no'>
    <link rel='stylesheet' href='style/style.css'>
    <link rel='stylesheet' href='style/{$title}.css'>
    <title>{$title}</title>
</head>
<body>
<header>
    <h1 class='timeNdate'>
";
    if ($title === 'flight-1') {
        echo "
        <span class='logoHeader'>
            <img src='./assets/logo_nextAviation.svg' alt=''>
            <p>PROCHAINS VOLS</p>
        </span>";
    } elseif ($title === 'flight-2') {
        echo "
        <span class='logoHeader'>
            <img src='./assets/logo_nextAviation-white.svg' alt=''>
            <p>PROCHAINS VOLS</p>
        </span>";
    }

echo "
        <span class='date' id='utc-date'></span>
        <span class='UTCWrapper'>
            <span class='utc-time' id='utc-time'></span>
            <span>UTC</span>
        </span>
    </h1>
</header>
";
?>

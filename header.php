<?php
$title = "meteo";
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
    <!-- <meta http-equiv='refresh' content='5'> -->
    <link rel='stylesheet' href='style/style.css'>
    <link rel='stylesheet' href='style/{$title}.css'>
    <title>{$title}</title>
</head>
";
?>


<body>
    <header>

        <h1 class="timeNdate">
            <span class='date'>
                <?= date("d/m/Y") ?>
            </span>
            <span class="UTCWrapper">
                <span class='utc-time' id="utc-time">
                    <?= (new DateTime("now", new DateTimeZone("UTC")))->format("H : i : s") ?>
                </span>
                <span>UTC</span>
            </span>
        </h1>

    </header>
<?php
$title = "meteo";
echo "
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
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
                </span>
                <span>UTC</span>
            </span>
        </h1>

    </header>
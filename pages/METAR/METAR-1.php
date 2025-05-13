<?php
$title = "METAR";
include 'header.php';

?>
<main>
    <div class="METAF_wrapper frosted Top">
        <div class="infoWrapper">
            <p class="PisteCode">
                LFGJ
            </p>
            <img src="../assets/france.svg.png" alt="">
            <p class="alt">Alt : <span id="alt">620</span> ft</p>
        </div>
        <div class="titleWraper">
            <p> METAR</p>
            <p>TAF</p>
        </div>
        <div class="codeWrapper" data-icao="LFGJ">
            <p class="MetarCode Code"></p>
            <p class="TafCode Code"></p>
        </div>
    </div>
    <div class="METAF_wrapper frosted Bottom">
        <div class="infoWrapper">
            <p class="PisteCode">
                LSGC
            </p>
            <img src="../assets/swiss.svg.png" alt="">
            <p class="alt">Alt : <span id="alt">300</span> ft</p>
        </div>
        <div class="titleWraper">
            <p> METAR</p>
            <p>TAF</p>
        </div>
        <div class="codeWrapper" data-icao="LSGC">
            <p class="MetarCode Code"></p>
            <p class="TafCode Code"></p>
        </div>
    </div>
</main>

<?php
putenv('METAR=Bearer rDahirOQPf9u5UajlxNP7GbD_rJDSEjbFTNRRfe2CMo');
?>

<script>
    const METAR = "<?= getenv('METAR') ?>";
</script>
<script src="../pages_back/METAR.js"></script>

<?php
include 'footer.php';
?>
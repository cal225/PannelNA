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
        <div class="codeWrapper">
            <p class="MetarCode Code">LFGJ 130830Z AUTO 35008KT 320V020 9999 SCT022 16/11 Q1016 TEMPO SHRA FEW030CB</p>
            <p class="TafCode Code">
                TAF LFGJ 130800Z 1309/1318 01006KT 9999 FEW020 BKN030
                TEMPO 1310/1318 FEW030TCU
                PROB30 TEMPO 1310/1317 SHRA FEW030CB
            </p>
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
        <div class="codeWrapper">
            <p class="MetarCode Code">LSGC 130820Z 02004KT 330V060 CAVOK 12/05 Q1016</p>
            <p class="TafCode Code">
                TAF LSGC 130825Z 1309/1318 VRB02KT CAVOK
                BECMG 1311/1313 9999 FEW030
                TEMPO 1313/1318 04010KT 9999 FEW035TCU
            </p>
        </div>
    </div>
</main>


<!-- <script src="../pages_back/METAR.js"></script> -->
<?php
include 'footer.php';
?>
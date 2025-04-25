<?php
$title = "meteo"; // This should match your page-specific CSS file: meteo.css
?>
<main>
    <div class="leftContainer">
        <div class="leftInfoContainer">
            <div class="windContainer frosted">
                <div class="metarWind">
                    <p>040 / 12G25</p>
                </div>
                <div class="mancheContainer">
                    <div class="wind02">
                        <p>RWY 02</p>
                    </div>
                    <div class="windCenter">
                        <div class="frosted backPiste"></div>
                        <img class="piste" src="../assets/Piste.svg" alt="piste d'atterisage"> <!-- déjà a 19° (orientation magnetique du pôle nord) -->
                        <img class="mancheAir" src="../assets/MancheAir.svg" alt="manche à air">
                    </div>
                    <div class="wind020">text and arrows</div>
                </div>
            </div>
            <p class="MaJ">Derrière MàJ des données : moins d'une minute</p>
        </div>
    </div>
    <div class="rightContainer" style="background-color:red;"></div>
</main>
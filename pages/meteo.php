<?php
$title = "meteo"; 
include 'header.php';

?>
<main>
    <section class="leftContainer">
        <?php include 'meteo/meteoleft.php'; ?>
    </section>
    <section class="rightContainer">
        <?php include 'meteo/meteoright.php'; ?> 
    </section>
</main>
<script src='../script/meteo.js'></script>
<script src='../pages_back/forecast.js'></script>
<script src="https://unpkg.com/suncalc@1.9.0/suncalc.js"></script>
<script src='../pages_back/twilight.js'></script>
<?php
include 'footer.php';
?>
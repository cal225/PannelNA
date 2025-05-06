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
<?php
include 'footer.php';
?>
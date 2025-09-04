<?php
$title = 'flight';
include 'header.php';

$data = json_decode($json, true);

?>

<main>
    <table>
        <thead>
            <th class="tbHeader">ETD lt</th>
            <!-- <th class="tbHeader">DEST</th> -->
            <th class="tbHeader">ÉQUIPAGE</th>
            <th class="tbHeader">AÉRONEF</th>
            <th class="tbHeader">VOL</th>
            <!-- <th class="tbHeader">Disponibilité</th> -->
        </thead>
        <tbody id="flights">
        </tbody>
    </table>
</main>

<script src='../pages_back/get_flights.js'></script>
<?php include 'footer.php'; ?>
<?php
$title = "clock";
include 'header.php';

?>
<main>
    <div class="clock">
        <div class="wrap">
            <span class="clockType"></span>
            <span class="hour" id="hour"></span>
            <span class="minute" id="minute"></span>
            <span class="second" id="second"></span>
            <span class="dot"></span>
            <div class="clockDate" id="clock-date"></div>
        </div>
    </div>
    <div class="clock" id="UTCclock">
        <div class="wrap">
            <span class="clockType"></span>
            <span class="hour" id="UTChour"></span>
            <span class="minute" id="UTCminute"></span>
            <span class="second" id="UTCsecond"></span>
            <span class="dot"></span>
            <div class="clockDate" id="utc-clock-date"></div>
        </div>
    </div>
</main>
<?php
include 'footer.php';
?>
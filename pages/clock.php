<?php
$title = "clock";
include 'header.php';

?>
<main>
    <div class="clocksWrapper">
        <div class="space"></div>
        <div class="outline frosted">
            <div class="clock">
                <div class="wrap">
                    <span class="hour" id="hour"><span class="hourHand"></span></span>
                    <span class="minute" id="minute"><span class="minuteHand"></span></span>
                    <span class="second" id="second"><span class="secondHand"></span></span>
                    <span class="dot"></span>
                    <img class="logo" src="../assets/logo_nextAviation4 2.svg" alt="">
                </div>
            </div>
            <span class="clockType">LSFP</span>
        </div>
        <div class="outline frosted">
            <div class="clock" id="UTCclock">
                <div class="wrap">
                    <span class="hour" id="UTChour"><span class="hourHand"></span></span>
                    <span class="minute" id="UTCminute"><span class="minuteHand"></span></span>
                    <span class="second" id="UTCsecond"><span class="secondHand"></span></span>
                    <span class="dot"></span>
                    <img class="logo" src="../assets/logo_nextAviation4 2.svg" alt="">
                </div>
            </div>
            <span class="clockType">UTC</span>
        </div>
        <div class="space"></div>
    </div>
</main>
<?php
include 'footer.php';
echo "<script src='../script/clock.js'></script>";
?>
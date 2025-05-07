var inc = 1000;

clock();

function clock() {
  const date = new Date();

  const hours = ((date.getHours() + 11) % 12 + 1);
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  const hour = hours * 30;
  const minute = minutes * 6;
  const second = seconds * 6;
  
  document.getElementById('hour').style.transform = `rotate(${hour}deg)`
  document.getElementById('minute').style.transform = `rotate(${minute}deg)`
  document.getElementById('second').style.transform = `rotate(${second}deg)`
}

setInterval(clock, inc);


UTCclock();

function UTCclock() {
  const date = new Date();

  const hours = ((date.getUTCHours() + 11) % 12 + 1);
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  
  const hour = hours * 30;
  const minute = minutes * 6;
  const second = seconds * 6;
  
  document.getElementById('UTChour').style.transform = `rotate(${hour}deg)`
  document.getElementById('UTCminute').style.transform = `rotate(${minute}deg)`
  document.getElementById('UTCsecond').style.transform = `rotate(${second}deg)`
}

setInterval(UTCclock, inc);

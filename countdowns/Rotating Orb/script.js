(function(){
    var ticker = false;
    var countdown = document.querySelector('#countdown');
    var rotator = document.querySelector('#rotator');

    function computeEndTime() {
        var params = new URLSearchParams(window.location.search);
        var completeAt = new Date();
        var seconds = params.get('s');
        var minutes = params.get('m');
        var hours = params.get('h');
        if (seconds !== null && isNaN(seconds) === false) {
            completeAt.setSeconds(completeAt.getSeconds() + parseFloat(seconds));
        }
        if (minutes !== null && isNaN(minutes) === false) {
            completeAt.setMinutes(completeAt.getMinutes() + parseFloat(minutes));
        }
        if (hours !== null && isNaN(hours) === false) {
            completeAt.setHours(completeAt.getHours() + parseFloat(hours));
        }
        return completeAt;
    }
    
    function tick() {
        var timeLeft = [(completeAt - new Date()) / 1000];
        if (timeLeft[0] <= 0) {
            countdown.innerText = 'END';
            rotator.style.opacity = '0';
            clearInterval(ticker);
            return;
        }
        while (timeLeft.length < 3 && timeLeft[timeLeft.length - 1] / 60 > 1) {
            timeLeft.push(Math.floor(timeLeft[timeLeft.length - 1] / 60));
            timeLeft[timeLeft.length-2] = timeLeft[timeLeft.length-2] % 60;
        }
        var timeStr = '';
        for(var i = timeLeft.length-1; i > -1; i--) {
            if (timeStr === '') {
                timeStr += Math.floor(timeLeft[i]);
            } else {
                timeStr += ':' + Math.floor(timeLeft[i]);
            }
        }
        countdown.innerText = timeStr;
    }

    var completeAt = computeEndTime();

    rotator.style.animation = 'rotate linear 1s infinite';
    rotator.addEventListener('animationstart', function(){
        if (ticker !== false) {
            clearInterval(ticker);
        }
        ticker = setInterval(tick, 1000);
    });
    tick();
})();
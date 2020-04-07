(function(){
    var ticker = false;
    var countdown = document.querySelector('#countdown');
    var rotator = document.querySelector('#rotator');
    var params = new URLSearchParams(window.location.search);

    function computeEndTime(params) {
        var completeAt = new Date();
        var seconds = params.get('s');
        var setSeconds = params.get('S');
        var minutes = params.get('m');
        var setMinutes = params.get('M');
        var hours = params.get('h');
        var setHours = params.get('H');
        if (seconds !== null && isNaN(seconds) === false) {
            completeAt.setSeconds(completeAt.getSeconds() + parseFloat(seconds));
        }
        if (minutes !== null && isNaN(minutes) === false) {
            completeAt.setMinutes(completeAt.getMinutes() + parseFloat(minutes));
        }
        if (hours !== null && isNaN(hours) === false) {
            completeAt.setHours(completeAt.getHours() + parseFloat(hours));
        }
        if (setSeconds !== null && isNaN(setSeconds) === false) {
            completeAt.setSeconds(parseFloat(setSeconds));
        }
        if (setMinutes !== null && isNaN(setMinutes) === false) {
            completeAt.setMinutes(parseFloat(setMinutes));
        }
        if (setHours !== null && isNaN(setHours) === false) {
            completeAt.setHours(parseFloat(setHours));
        }
        return completeAt;
    }

    function computeColors(params) {
        var fontColor = params.get('fontColor');
        var detailColor = params.get('detailColor');
        if (/[a-fA-F0-9]{6}/.test(fontColor)) {
            document.querySelector('#countdown').style.color = '#' + fontColor;
        }
        if (/[a-fA-F0-9]{6}/.test(detailColor)) {
            document.querySelector('#circle').style.border = 'solid 1vmin #' + detailColor;
            var orb = document.querySelector('#orb');
            orb.style.boxShadow = '0 0 2vmin 2vmin #' + detailColor;
            orb.style.background = '#' + detailColor;
        }
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

    var completeAt = computeEndTime(params);
    computeColors(params);

    rotator.style.animation = 'rotate linear 1s infinite';
    rotator.addEventListener('animationstart', function(){
        if (ticker !== false) {
            clearInterval(ticker);
        }
        ticker = setInterval(tick, 1000);
    });
    tick();
})();
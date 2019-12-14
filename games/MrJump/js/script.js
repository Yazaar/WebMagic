// place everything within a private scope
(function () {
    var main = document.querySelector('main');
    var player = document.querySelector('#player');
    var movable1 = document.querySelector('#movable1');
    var movable2 = document.querySelector('#movable2');
    var start = document.querySelector('#start');
    var goal = document.querySelector('#goal');
    var time = document.querySelector('#time');

    var mainHeight = main.offsetHeight;
    var mainWidth = main.offsetWidth;

    var highscores = generateHighscores();

    var mouseData;

    var lastRegPos;

    var velocityX;
    var velocityY;


    var moveKeyDown;
    var jumpKeyDown;
    var currentOffset;

    var startTime;

    /*
        normal sorting function (min to max)
        -1 = lower the index of comparator1
        0 = do not swap place
        1 = upper the index of comparator1
    */
    function sortFunction(comparator1, comparator2) {
        if (comparator1 > comparator2) {
            // push comparator1 one index up
            return 1;
        }
        if (comparator1 < comparator2) {
            // push comparator1 one index down
            return -1;
        }
        // keep comparator1 where it is positioned
        return 0;
    }

    // Grabs the highscores from localstorages (or sets it to an empty list for older browsers)
    // Generates a list of all highscores in the right order
    function generateHighscores() {
        if(localStorage === undefined) {
            // old browser detected, returning empty array since localStorage is not supported
            return [];
        }

        var highscores = localStorage.getItem('highscores');
        
        if(highscores === null) {
            highscores = [];
        } else {
            highscores = highscores.split(',');
        }
        for (var i = highscores.length; i > -1; i--) {
            var duration = parseFloat(highscores[i]);
            if (isNaN(duration)) {
                highscores.splice(i, 1);
            } else {
                highscores[i] = duration;
            }
        }
        highscores.sort(sortFunction); // sortFunction should not be a requirement but ran into problems which is why I rewrote the logic

        if(highscores.length > 10) {
            highscores.splice(10, highscores.length - 10);
        }

        localStorage.setItem('highscores', highscores.join(','))
        return highscores;
    }

    // function triggerd if the user reaches the goal platform
    function handleWin() {
        var goalTime = (new Date() - startTime) / 1000; // the duration until reaching the goal in seconds
        highscores.push(goalTime);
        highscores.sort(sortFunction); // sortFunction should not be a requirement but ran into problems which is why I rewrote the logic
        if (highscores.length > 10) {
            highscores.splice(10, highscores.length - 10);
        }
        if(localStorage !== undefined) {
            localStorage.setItem('highscores', highscores.join(','));
        }
        setScoreBoard();
    }

    // inserts the scoreboard 
    function setScoreBoard() {
        var scoreElement = document.querySelector('#scoreboardData');
        scoreElement.innerHTML = '';
        for (var i = 0; i < highscores.length; i++) {

            // wrapper around the position span and the duration span
            var rowElement = document.createElement('section');
            rowElement.classList.add('row');
            
            // contains the scoreboard position (1-10)
            var leftElement = document.createElement('span');
            leftElement.classList.add('position');
            leftElement.innerText = i + 1;
            
            // contains the runs duration in seconds
            var rightElement = document.createElement('span');
            rightElement.classList.add('duration');
            rightElement.innerText = highscores[i].toFixed(1) + 's';
            rightElement.addEventListener('click', function(e){
                var targetElement = e.currentTarget.parentElement; // returns parent element of the one with the event listner
                var scoreIndex = parseInt(targetElement.querySelector('span.position').innerText) - 1; // the position starts at 1, which means that the actual index is this position subtracted by 1
                highscores.splice(scoreIndex, 1); // delete the element which was clicked on
                if (localStorage !== undefined) {
                    // save the new highscores
                    localStorage.setItem('highscores', highscores.join(','));
                }
                setScoreBoard(); // rebuild the scoreboard
            });

            // merge the spans with the row element
            rowElement.appendChild(leftElement);
            rowElement.appendChild(rightElement);

            // insert the row to the HTML-DOM element
            scoreElement.appendChild(rowElement);
        }
    }

    // update the position of all game objects
    // generate object structures
    function loadGame() {
        // calculate the positions absolute positions for all game objects (x & y-axis)
        movable1.style.left = main.offsetWidth / 2 + 'px';
        movable2.style.left = main.offsetWidth / 2 + 'px';
        movable1.style.top = ((main.offsetHeight / 2) + movable1.offsetHeight * 5) + 'px';
        movable2.style.top = ((main.offsetHeight / 2) - movable2.offsetHeight * 5) + 'px';
        player.style.top = main.offsetHeight * 0.45 + 'px';
        player.style.left = main.offsetWidth / 2 + 'px';
        start.style.top = main.offsetHeight / 2 + 'px';
        start.style.left = main.offsetWidth / 2 + 'px';
        goal.style.top = main.offsetHeight / 2 + 'px';
        goal.style.left = ((main.offsetWidth / 2) + 500) + 'px';

        // set the margins to 0, which is used to push objects around the screen
        movable1.style.marginLeft = '0px';
        movable2.style.marginLeft = '0px';
        player.style.marginLeft = '0px';
        start.style.marginLeft = '0px';
        goal.style.marginLeft = '0px';

        mouseData = {
            x: null,
            y: null,
            dragEvent: null
        };

        lastRegPos = {
            x: null,
            y: null
        };

        velocityX = 2;
        velocityY = 0;

        startTime = undefined;


        moveKeyDown = '';
        jumpKeyDown = false;
        currentOffset = 0;
    }

    // calculates where the player is positioned relative to all solid objects
    function validatePosition(user, solids) {
        var bestHit = {
            under: undefined,
            under_distance: Infinity,
            above: undefined,
            above_distance: Infinity * -1
        };

        /*
            1. check if the player matches the objects x-axis
            2. check the distance between the player and the object
            3. insert the closest values and objects to bestHit
        */

        for (var i = 0; i < solids.length; i++) {
            var xPos = user.offsetLeft - solids[i].offsetLeft;
            var xWidth = (solids[i].offsetWidth / 2) + (user.offsetWidth / 2);
            if (xPos < xWidth && xPos > (-1 * xWidth)) {
                // The if statement above validates if user is within the other objects x axis
                // The code underneath calculates the distance between the object and the user
                var distance_between = solids[i].offsetTop - user.offsetTop;
                if (distance_between >= 0) {
                    // objektet var funnet under spelaren
                    if (distance_between < bestHit.under_distance) {
                        // The object is closer to the player than the previous
                        bestHit.under_distance = distance_between;
                        bestHit.under = solids[i];
                    }

                } else {
                    // The object has been found within of above the player
                    if (distance_between > bestHit.above_distance) {
                        // The object is closer to the player than the previous
                        bestHit.above_distance = distance_between;
                        bestHit.above = solids[i];
                    }
                }
            }

        }

        return bestHit;
    }


    // the main function which is triggerd 100 times per second (in theory)
    function tick() {

        if (main.offsetHeight < player.offsetTop) {
            // fell of the screen (lost)
            loadGame();
        }

        if (moveKeyDown === 'a') {
            currentOffset += velocityX;
            start.style.marginLeft = currentOffset + 'px';
            goal.style.marginLeft = currentOffset + 'px';
            movable1.style.marginLeft = currentOffset + 'px';
            movable2.style.marginLeft = currentOffset + 'px';
        } else if (moveKeyDown === 'd') {
            currentOffset += velocityX * -1;
            start.style.marginLeft = currentOffset + 'px';
            goal.style.marginLeft = currentOffset + 'px';
            movable1.style.marginLeft = currentOffset + 'px';
            movable2.style.marginLeft = currentOffset + 'px';
        }

        if (startTime === undefined && (moveKeyDown === 'a' || moveKeyDown === 'd' || jumpKeyDown === true || mouseData.dragEvent !== null)) {
            // start the game if the user made keyboard input or moved an movable object 
            startTime = new Date();
        }

        onObject = validatePosition(player, [movable1, movable2, start, goal]); // returns an object (dictionary, key-value pairs) which includes information about objects above and underneath the player

        if (onObject.under === goal && onObject.under_distance < 5) {
            // won the game (reached the goal platform)
            handleWin();
            loadGame();
        }

        if (mouseData.dragEvent !== null && moveKeyDown === '' && mouseData.x !== null && mouseData.y !== null && lastRegPos.x !== null && lastRegPos.y !== null && onObject.under !== mouseData.dragEvent) {
            mouseData.dragEvent.style.left = (parseFloat(mouseData.dragEvent.style.left) + (mouseData.x - lastRegPos.x)) + 'px';
            mouseData.dragEvent.style.top = (parseFloat(mouseData.dragEvent.style.top) + (mouseData.y - lastRegPos.y)) + 'px';
        }

        lastRegPos.x = mouseData.x;
        lastRegPos.y = mouseData.y;
        if (jumpKeyDown === true && (onObject.under_distance < 5 || onObject.above_distance > -5)) {
            velocityY = 10;
            player.style.top = (parseFloat(player.style.top) - velocityY) + 'px';
        } else if (onObject.above_distance > -10) {
            velocityY = 0;
            player.style.top = (parseFloat(player.style.top) + onObject.above_distance) + 'px';
        } else if (onObject.under_distance > 1) {
            velocityY = velocityY - 1;
            if ((velocityY * -1) > onObject.under_distance) {
                player.style.top = (parseFloat(player.style.top) - onObject.under_distance) + 'px';
                velocityY = 0;
            } else {
                player.style.top = (parseFloat(player.style.top) - velocityY) + 'px';
            }
        } else if (velocityY !== 0) {
            velocityY = 0;
        }

        if (startTime !== undefined) {
            time.innerText = (Math.floor((new Date() - startTime) / 100) / 10).toFixed(1);
        }
    }

    // Keyboard and mouse event listeners to check for user inputs which controls the game
    window.addEventListener('keydown', function (e) {
        if (e.key === 'a' || e.key === 'd') {
            moveKeyDown = e.key;
            if(mouseData.dragEvent !== null) {
                mouseData.dragEvent = null;
            }
            return;
        } else if (e.key === 'w') {
            jumpKeyDown = true;
        }
    });
    window.addEventListener('keyup', function (e) {
        if (moveKeyDown === e.key) {
            moveKeyDown = '';
        } else if (e.key === 'w') {
            jumpKeyDown = false;
        }
    });

    // check for the release of mouse leftclick
    window.addEventListener('mouseup', function () {
        mouseData.dragEvent = null;
    });

    //Check if the user clicks on any of the two movable objects
    movable1.addEventListener('mousedown', function (e) {
        mouseData.dragEvent = e.currentTarget;
    });
    movable2.addEventListener('mousedown', function (e) {
        var positionData = validatePosition(player, [movable1, movable2, start, goal]);
        if(moveKeyDown !== '') {
            return;
        }
        if (positionData.under_distance > 5 || positionData.under !== e.currentTarget) {
            mouseData.dragEvent = e.currentTarget;
        }
    });

    // check for mouse movements, deletes the data if the mouse leaves the game window
    main.addEventListener('mouseleave', function () {
        mouseData.x = null;
        mouseData.y = null;
    });
    
    // check for mouse movements, updating the mouse position variables
    main.addEventListener('mousemove', function (e) {
        mouseData.x = e.clientX;
        mouseData.y = e.clientY;
    });

    // checking if the screen is resized to recalculate the positions of all game objects
    window.addEventListener('resize', function(){
        var currentWidth = main.offsetWidth;
        var currentHeight = main.offsetHeight;

        var widthDiff = (currentWidth - mainWidth) / 2;
        var heightDiff = (currentHeight - mainHeight) / 2;

        movable1.style.left = (parseFloat(movable1.style.left) + widthDiff) + 'px';
        movable2.style.left = (parseFloat(movable2.style.left) + widthDiff) + 'px';
        player.style.left = (parseFloat(player.style.left) + widthDiff) + 'px';
        start.style.left = (parseFloat(start.style.left) + widthDiff) + 'px';
        goal.style.left = (parseFloat(goal.style.left) + widthDiff) + 'px';
        
        movable1.style.top = (parseFloat(movable1.style.top) + heightDiff) + 'px';
        movable2.style.top = (parseFloat(movable2.style.top) + heightDiff) + 'px';
        player.style.top = (parseFloat(player.style.top) + heightDiff) + 'px';
        start.style.top = (parseFloat(start.style.top) + heightDiff) + 'px';
        goal.style.top = (parseFloat(goal.style.top) + heightDiff) + 'px';
        
        mainHeight = currentHeight;
        mainWidth = currentWidth;
    });

    setScoreBoard(); // generate the highscore board
    loadGame(); // update the position of all game objects + generate object structures
    setInterval(tick, 10); // start the main game loop
})();
//Calls the canvas and elements onto JS

var mainMap = document.getElementById("map");
var m = mainMap.getContext("2d");

var scoreBoard = document.getElementById("scoreboard");
var timeBoard = document.getElementById("time");

//Determines if the gamemode allows touching

var canTouch = true

//It's a square so it is delimited by vertical space

mainMap.height = Math.floor(window.innerHeight / 32) * 32 + 2
mainMap.width = Math.floor(window.innerHeight / 32) * 32 + 2

//Kinda redundant but may help
//The length of the square itself

var mapLength = Math.floor(window.innerHeight / 32) * 32 + 2

var tileSpace = (mapLength - 2) / 32
var time = 0
//Records where the points has spawned

var pointPosition = []

//The R2 positions of the players
//Btw cube and square are the names of the players

var square = [7, 7] 
var cube = [24, 24]

//Direction square and cube are facing (WASD = 0123)

var direction = [2, 0]

//Points score

var pointScore = [0, 0]

//Boolean to see if a player has made a move

var gameStarted = false

//Event Listener (Keyboard)

document.addEventListener('keydown', playerMovement)

//Just to clear all that the game needs to start
function startGame() {
    drawMap()
}

//Clears/redraws the main grid w/o the players
function drawMap() {
    m.beginPath()

    m.strokeStyle = "#000000";

    //Gotta choose a color

    m.fillStyle = "#A0A0FF";

    //Clears the screen
    m.fillRect(0, 0, mapLength, mapLength)

    //Makes the grid


    for (var i = 0; i <= 32; i++) {
        m.moveTo(i * tileSpace + 1, 0)
        m.lineTo(i * tileSpace + 1, mapLength)
        m.stroke()
        m.fillRect(i * tileSpace + 2, 2, tileSpace - 2,  tileSpace - 2)
    }
    for (var j = 0; j <= 32; j++) {
        m.moveTo(0, j * tileSpace + 1)
        m.lineTo(mapLength, j * tileSpace + 1)
        m.stroke()
    }

    drawPlayers();
}

//Makes the players (IDK why I separated them)

function drawPlayers() {
    m.fillStyle = "#00FF00"
    m.fillRect(square[0] * tileSpace + 2, square[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
    m.fillStyle = "#FF0000"
    m.fillRect(cube[0] * tileSpace + 2, cube[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)

    //Case where both players are in the same tile
    
    if (square[0] == cube[0] && square[1] == cube[1]) {
        if (canTouch == true) {
            m.fillStyle = "#0000FF"
            m.fillRect(square[0] * tileSpace + 2, square[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
        }
        else {
            square = [7, 7];
            cube = [24, 24];
            drawMap()
        }
    }

    drawHelmet()
    drawPoints()
}

//Helps see in which direction you're going (Super unoptimized btw)

function drawHelmet() {
    m.fillStyle = "#008000"

    switch (direction[0]) {
    case 0:
        m.fillRect(square[0] * tileSpace + 4, square[1] * tileSpace + 4, tileSpace - 6, 2)
        break;
    case 1:
        m.fillRect(square[0] * tileSpace + 4, square[1] * tileSpace + 4, 2, tileSpace - 6)
        break;
    case 2:
        m.fillRect(square[0] * tileSpace + 4, square[1] * tileSpace + (tileSpace - 4), tileSpace - 6, 2)
        break;
    case 3:
        m.fillRect(square[0] * tileSpace + (tileSpace - 4), square[1] * tileSpace + 4, 2, tileSpace - 6)
        break;
    }

    m.fillStyle = "#800000"
    switch (direction[1]) {
        case 0:
            m.fillRect(cube[0] * tileSpace + 4, cube[1] * tileSpace + 4, tileSpace - 6, 2)
            break;
        case 1:
            m.fillRect(cube[0] * tileSpace + 4, cube[1] * tileSpace + 4, 2, tileSpace - 6)
            break;
        case 2:
            m.fillRect(cube[0] * tileSpace + 4, cube[1] * tileSpace + (tileSpace - 4), tileSpace - 6, 2)
            break;
        case 3:
            m.fillRect(cube[0] * tileSpace + (tileSpace - 4), cube[1] * tileSpace + 4, 2, tileSpace - 6)
            break
    }
}

//Draws the points

function drawPoints() {
    m.fillStyle = "#0000FF"
    for (var a = 0; a < (pointPosition.length); a++) {
        m.fillRect(pointPosition[a][0] * tileSpace + 2, pointPosition[a][1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
    }
}

//Basic movement for the players

function playerMovement() {
    switch (event.code) {
        case "KeyW":
            square[1] -= 1
            direction[0] = 0
            break;
        case "KeyA":
            square[0] -= 1
            direction[0] = 1
            break;
        case "KeyS":
            square[1] += 1
            direction[0] = 2
            break;
        case "KeyD":
            square[0] += 1
            direction[0] = 3
            break;
        case "ArrowUp":
            cube[1] -= 1
            direction[1] = 0
            break;
        case "ArrowLeft":
            cube[0] -= 1
            direction[1] = 1
            break;
        case "ArrowDown":
            cube[1] += 1
            direction[1] = 2
            break;
        case "ArrowRight":
            cube[0] += 1
            direction[1] = 3
            break;
    }

    movementLogic()
    if (gameStarted == false) {
        setInterval(pointSpawner, 1500)
        setInterval(trackTime, 1000)
        gameStarted = true
    }
}

//Advanced movement

function movementLogic() {
    if (square[1] >= 0 && square[1] < 32) {
        //Nothing xD
    }
    else if (square[1] >= 32) {
        square[1] = square[1] % 32
    }
    else if (square[1] < 0 && square[1] > -32) {
        square[1] += 32
    }
    else {
        console.log("Weird bug (S, 1)")
        square[1] = 0
    }

    if (square[0] >= 0 && square[0] < 32) {
        //Nothing xD
    }
    else if (square[0] >= 32) {
        square[0] = square[0] % 32
    }
    else if (square[0] < 0 && square[0] > -32) {
        square[0] += 32
    }
    else {
        console.log("Weird bug (S, 0)")
        square[0] = 0
    }

        if (cube[1] >= 0 && cube[1] < 32) {
        //Nothing xD
    }
    else if (cube[1] >= 32) {
        cube[1] = cube[1] % 32
    }
    else if (cube[1] < 0 && cube[1] > -32) {
        cube[1] += 32
    }
    else {
        console.log("Weird bug (C, 1)")
        cube[1] = 0
    }

    if (cube[0] >= 0 && cube[0] < 32) {
        //Nothing xD
    }
    else if (cube[0] >= 32) {
        cube[0] = cube[0] % 32
    }
    else if (cube[0] < 0 && cube[0] > -32) {
        cube[0] += 32
    }
    else {
        console.log("Weird bug (C, 0)")
        cube[0] = 0
    }

    if (direction[0] >= 4 || direction[0] < 0) {
        direction[0] = 0
        console.log("Weird bug (S, D)")
    }

    if (direction[1] >= 4 || direction[1] < 0) {
        direction[1] = 0
        console.log("Weird bug (S, D)")
    }
    pointCollecting();
    drawMap()
}

//Checks point collection

function pointCollecting() {
    for (var i = 0; i < pointPosition.length; i++) {
        if (square[0] == pointPosition[i][0] && square[1] == pointPosition[i][1]) {
            pointScore[0]++
            pointPosition.splice(i, 1)
            break;
        }
    }
    for (var i = 0; i < pointPosition.length; i++) {
        if (cube[0] == pointPosition[i][0] && cube[1] == pointPosition[i][1]) {
            pointScore[1]++
            pointPosition.splice(i, 1)
            break;
        }
    }
    scoreBoard.innerHTML = "S " + pointScore[0] + " - " + pointScore[1] + " C"
}
//Basic logic for block placing
function blockPlacement() {
    //Haven't done nothing yet
}

function pointSpawner() {
    if (!(pointPosition.length >= 16)) {
        pointPosition.push([Math.floor(Math.random() * 32), Math.floor(Math.random() * 32)])
        

        for (var i = 0; i < (pointPosition.length - 1); i++) {
            if (pointPosition[pointPosition.length - 1][0] == pointPosition[i][0]) {
                if (pointPosition[pointPosition.length - 1][1] == pointPosition[i][1]) {
                    console.log("Double spawn.")
                    pointPosition.pop()
                    pointSpawner()
                }
            }
        }

        m.fillStyle = "#0000FF"
        for (var a = 0; a < (pointPosition.length); a++) {
            m.fillRect(pointPosition[a][0] * tileSpace + 2, pointPosition[a][1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
        }
    }
}

function trackTime() {
    time++
    timeBoard.innerHTML = Math.floor(time / 60) + ":" + String(time % 60).padStart(2, "0")
}

startGame()
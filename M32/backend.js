//Variable elements

var canTouch = false //Allows touching

var timeLeft = 150 //Time limit

var timeLimit = true //Sets a time limit

var pointSpawnTime = 1000 //Time a point spawns in ms

var pointExpirationDate = 10 //Time a point expires in seconds (also serves as a cap)

var allow3Players = true //Allows a third player (WASD = IJKL)

var boardSize = 32 //Board size (ofc recommended is 32)

var backgroundColor = "#222222"
var quadrilleColor = "#DDDDDD"

var playersColorsIdle = ["#00BB00", "#BB0000", "#0000BB"] //Colors of the players when idle

var playersColorsLit = ["#2EFF00","#FF2E00","#002EFF"] //Second implementation of the shine mechanic


//Code. Do not touch below here

//Calls the canvas and elements onto JS

var mainMap = document.getElementById("map");
var m = mainMap.getContext("2d");

var scoreBoard = document.getElementById("scoreboard");
var timeBoard = document.getElementById("time");

//It's a square so it is delimited by vertical space

mainMap.height = Math.floor(window.innerHeight / boardSize) * boardSize + 2
mainMap.width = Math.floor(window.innerHeight / boardSize) * boardSize + 2

//Implemetation of the shine mechanic: 
//Intrinsic "shine" value of every cell on the board

var mapShine = []
var fillerMatrix = [] //Only helps make the mapShine quadrille
for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
        fillerMatrix.push(0)
    }
    mapShine.push(fillerMatrix)
    fillerMatrix = []
}
console.log(mapShine)
//Kinda redundant but may help
//The length of the square itself

var mapLength = Math.floor(window.innerHeight / boardSize) * boardSize + 2

var tileSpace = (mapLength - 2) / boardSize

var time = 0

var shineTime = 150

var truePlayerColors = ["#00BB00", "#BB0000", "#0000BB"]

var timeOver = false

//The R2 positions of the players
//Btw square, cube and teseract (S,C,T) are the names of the players

let pointX;
let pointY;

var startingPositions = [[Math.floor(boardSize / 4) - 1, Math.floor(boardSize / 4) - 1], [Math.floor(boardSize * 3 / 4) - 1, Math.floor(boardSize * 3 / 4) - 1], [-boardSize, -boardSize]]
var square = [Math.floor(boardSize / 4) - 1, Math.floor(boardSize / 4) - 1] 
var cube = [Math.floor(boardSize * 3 / 4) - 1, Math.floor(boardSize * 3 / 4) - 1]
var teseract = [-boardSize, -boardSize]

if (allow3Players == true) {
    var teseract = [Math.floor(boardSize * 3 / 4) - 1, Math.floor(boardSize / 4) - 1]
    startingPositions[2] = [Math.floor(boardSize * 3 / 4) - 1, Math.floor(boardSize / 4) - 1]
}
//Direction square and cube are facing (WASD = 0123)

var direction = [2, 0, 0]

//Points score

var pointScore = [0, 0, 0]

//Boolean to see if a player has made a move

var gameStarted = false

//Event Listener (Keyboard)

document.addEventListener('keydown', playerMovement, true)

//Just to clear all that the game needs to start
function startGame() {
    drawMap()
}

//Clears/redraws the main grid w/o the players
function drawMap() {
    m.beginPath()

    m.strokeStyle = quadrilleColor;

    //Gotta choose a color

    m.fillStyle = backgroundColor;

    //Clears the screen
    m.fillRect(0, 0, mapLength, mapLength)

    //Makes the grid


    for (var i = 0; i <= boardSize; i++) {
        m.moveTo(i * tileSpace + 1, 0)
        m.lineTo(i * tileSpace + 1, mapLength)
        m.stroke()
        m.fillRect(i * tileSpace + 2, 2, tileSpace - 2,  tileSpace - 2)
    }
    for (var j = 0; j <= boardSize; j++) {
        m.moveTo(0, j * tileSpace + 1)
        m.lineTo(mapLength, j * tileSpace + 1)
        m.stroke()
    }

    if (timeLimit == true) {
        timeBoard.innerHTML = Math.floor(timeLeft / 60) + ":" + String(timeLeft % 60).padStart(2, "0")
    }
    else {
        timeBoard.innerHTML = Math.floor(time / 60) + ":" + String(time % 60).padStart(2, "0")
    }
    drawPlayers();

    //Making it VERY CLEAR that the points are now a property of the map tiles themselves

    for (let y = 0; y < mapShine.length; y++) {
        for (let x = 0; x < mapShine.length; x++) {
            if (mapShine[y][x] >= pointExpirationDate) {
                mapShine[y][x] = 0
            }
            else if (mapShine[y][x] != 0) {
                m.fillStyle = "#" + (Math.ceil((1 - (0.8 * mapShine[y][x] / pointExpirationDate)) * 255)).toString(16) + (Math.ceil((1 - (0.8 * mapShine[y][x] / pointExpirationDate)) * 255)).toString(16) + (Math.ceil((1 - (0.8 * mapShine[y][x] / pointExpirationDate)) * 255)).toString(16)
                m.fillRect(x * tileSpace + 2, y * tileSpace + 2, tileSpace - 2, tileSpace - 2)
            }
        }
    }
}

//Makes the players (IDK why I separated them)

function drawPlayers() {
    m.fillStyle = truePlayerColors[0]
    m.fillRect(square[0] * tileSpace + 2, square[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
    m.fillStyle = truePlayerColors[1]
    m.fillRect(cube[0] * tileSpace + 2, cube[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
    m.fillStyle = truePlayerColors[2]
    m.fillRect(teseract[0] * tileSpace + 2, teseract[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)

    //Case where both players are in the same tile
    if ((square[0] == cube[0] && cube[0] == teseract[0]) && (square[1] == cube[1] && cube[1] == teseract[1])) {
        if (canTouch == true) {
            m.fillStyle = "#FFFFFF"
            m.fillRect(square[0] * tileSpace + 2, square[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
        }
        else {
            square[0] = startingPositions[0][0];
            square[1] = startingPositions[0][1];
            cube[0] = startingPositions[1][0];
            cube[1] = startingPositions[1][1];
            teseract[0] = startingPositions[2][0];
            teseract[1] = startingPositions[2][1];
            pointCollecting()
            drawMap()
        }
    }
    else if (square[0] == cube[0] && square[1] == cube[1]) {
        if (canTouch == true) {
            m.fillStyle = "#FFFF00"
            m.fillRect(square[0] * tileSpace + 2, square[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
        }
        else {
            square[0] = startingPositions[0][0];
            square[1] = startingPositions[0][1];
            cube[0] = startingPositions[1][0];
            cube[1] = startingPositions[1][1];
            pointCollecting()
            drawMap()
        }
    }
    else if (square[0] == teseract[0] && square[1] == teseract[1]) {
        if (canTouch == true) {
            m.fillStyle = "#FF00FF"
            m.fillRect(square[0] * tileSpace + 2, square[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
        }
        else {
            square[0] = startingPositions[0][0];
            square[1] = startingPositions[0][1];
            teseract[0] = startingPositions[2][0];
            teseract[1] = startingPositions[2][1];
            pointCollecting()
            drawMap()
        }
    }
    else if (teseract[0] == cube[0] && teseract[1] == cube[1]) {
        if (canTouch == true) {
            m.fillStyle = "#00FFFF"
            m.fillRect(cube[0] * tileSpace + 2, cube[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
        }
        else {
            teseract[0] = startingPositions[2][0];
            teseract[1] = startingPositions[2][1];
            cube[0] = startingPositions[1][0];
            cube[1] = startingPositions[1][1];
            drawMap()
            pointCollecting()
        }
    }

    drawHelmet()
}

//Helps see in which direction you're going (Super unoptimized btw)
//Also lacks the potential of customization by letting the player change it

function drawHelmet() {
    m.fillStyle = "#0000FF"

    switch (direction[0]) {
    case 0:
        m.fillRect(square[0] * tileSpace + 4, square[1] * tileSpace + 4, tileSpace - 6, Math.ceil(tileSpace / 16))
        break;
    case 1:
        m.fillRect(square[0] * tileSpace + 4, square[1] * tileSpace + 4, Math.ceil(tileSpace / 16), tileSpace - 6)
        break;
    case 2:
        m.fillRect(square[0] * tileSpace + 4, square[1] * tileSpace + (tileSpace - Math.ceil(tileSpace / 8)), tileSpace - 6, Math.ceil(tileSpace / 16))
        break;
    case 3:
        m.fillRect(square[0] * tileSpace + (tileSpace - Math.ceil(tileSpace / 8)), square[1] * tileSpace + 4, Math.ceil(tileSpace / 16), tileSpace - 6)
        break;
    }

    m.fillStyle = "#00FF00"
    switch (direction[1]) {
        case 0:
            m.fillRect(cube[0] * tileSpace + 4, cube[1] * tileSpace + 4, tileSpace - 6, Math.ceil(tileSpace / 16))
            break;
        case 1:
            m.fillRect(cube[0] * tileSpace + 4, cube[1] * tileSpace + 4, Math.ceil(tileSpace / 16), tileSpace - 6)
            break;
        case 2:
            m.fillRect(cube[0] * tileSpace + 4, cube[1] * tileSpace + (tileSpace - Math.ceil(tileSpace / 8)), tileSpace - 6, Math.ceil(tileSpace / 16))
            break;
        case 3:
            m.fillRect(cube[0] * tileSpace + (tileSpace - Math.ceil(tileSpace / 8)), cube[1] * tileSpace + 4, Math.ceil(tileSpace / 16), tileSpace - 6)
            break;
    }

    m.fillStyle = "#FF0000"
    switch (direction[2]) {
        case 0:
            m.fillRect(teseract[0] * tileSpace + 4, teseract[1] * tileSpace + 4, tileSpace - 6, Math.ceil(tileSpace / 16))
            break;
        case 1:
            m.fillRect(teseract[0] * tileSpace + 4, teseract[1] * tileSpace + 4, Math.ceil(tileSpace / 16), tileSpace - 6)
            break;
        case 2:
            m.fillRect(teseract[0] * tileSpace + 4, teseract[1] * tileSpace + (tileSpace - Math.ceil(tileSpace / 8)), tileSpace - 6, Math.ceil(tileSpace / 16))
            break;
        case 3:
            m.fillRect(teseract[0] * tileSpace + (tileSpace - Math.ceil(tileSpace / 8)), teseract[1] * tileSpace + 4, Math.ceil(tileSpace / 16), tileSpace - 6)
            break;
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
        case "KeyI":
            teseract[1] -= 1
            direction[2] = 0
            break;
        case "KeyJ":
            teseract[0] -= 1
            direction[2] = 1
            break;
        case "KeyK":
            teseract[1] += 1
            direction[2] = 2
            break;
        case "KeyL":
            teseract[0] += 1
            direction[2] = 3
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
        pointInterval = setInterval(pointSpawner, pointSpawnTime)
        timeInterval = setInterval(trackTime, 1000)

        gameStarted = true
    }
}

//Advanced movement

function movementLogic() {
    if (square[1] >= 0 && square[1] < boardSize) {
        //Nothing xD
    }
    else if (square[1] >= boardSize) {
        square[1] = square[1] % boardSize
    }
    else if (square[1] < 0 && square[1] > -boardSize) {
        square[1] += boardSize
    }
    else {
        console.log("Weird bug (S, 1)")
        square[1] = 0
    }

    if (square[0] >= 0 && square[0] < boardSize) {
        //Nothing xD
    }
    else if (square[0] >= boardSize) {
        square[0] = square[0] % boardSize
    }
    else if (square[0] < 0 && square[0] > -boardSize) {
        square[0] += boardSize
    }
    else {
        console.log("Weird bug (S, 0)")
        square[0] = 0
    }

    if (cube[1] >= 0 && cube[1] < boardSize) {
        //Nothing xD
    }
    else if (cube[1] >= boardSize) {
        cube[1] = cube[1] % boardSize
    }
    else if (cube[1] < 0 && cube[1] > -boardSize) {
        cube[1] += boardSize
    }
    else {
        console.log("Weird bug (C, 1)")
        cube[1] = 0
    }

    if (cube[0] >= 0 && cube[0] < boardSize) {
        //Nothing xD
    }
    else if (cube[0] >= boardSize) {
        cube[0] = cube[0] % boardSize
    }
    else if (cube[0] < 0 && cube[0] > -boardSize) {
        cube[0] += boardSize
    }
    else {
        console.log("Weird bug (C, 0)")
        cube[0] = 0
    }

    if (allow3Players == true) { 
        if (teseract[1] >= 0 && teseract[1] < boardSize) {
            //Nothing xD
        }
        else if (teseract[1] >= boardSize) {
            teseract[1] = teseract[1] % boardSize
        }
        else if (teseract[1] < 0 && teseract[1] > -boardSize) {
            teseract[1] += boardSize
        }
        else {
            console.log("Weird bug (T, 1)")
            teseract[1] = 0
        }
        
        if (teseract[0] >= 0 && teseract[0] < boardSize) {
            //Nothing xD
        }
        else if (teseract[0] >= boardSize) {
            teseract[0] = teseract[0] % boardSize
        }
        else if (teseract[0] < 0 && teseract[0] > -boardSize) {
            teseract[0] += boardSize
        }
        else {
            console.log("Weird bug (T, 0)")
            teseract[0] = 0
        }
    }

    if (direction[0] >= 4 || direction[0] < 0) {
        direction[0] = 0
        console.log("Weird bug (S, D)")
    }

    if (direction[1] >= 4 || direction[1] < 0) {
        direction[1] = 0
        console.log("Weird bug (C, D)")
    }
    if (direction[2] >= 4 || direction[2] < 0) {
        direction[2] = 0
        console.log("Weird bug (T, D)")
    }
    pointCollecting();
    drawMap()
}

//Checks point collection

function pointCollecting() {
    if (mapShine[square[1]][square[0]] != 0) {
        pointScore[0]++
        mapShine[square[1]][square[0]] = 0
        truePlayerColors[0] = playersColorsLit[0]
        setTimeout(dimColors, shineTime)
    }

    if (mapShine[cube[1]][cube[0]] != 0) {
        pointScore[1]++
        mapShine[cube[1]][cube[0]] = 0
        truePlayerColors[1] = playersColorsLit[1]
        setTimeout(dimColors, shineTime)
    }
    if (allow3Players == true ) {
        if (mapShine[teseract[1]][teseract[0]] != 0) {
            pointScore[2]++
            mapShine[teseract[1]][teseract[0]] = 0
            truePlayerColors[2] = playersColorsLit[2]
            setTimeout(dimColors, shineTime)
        }
    }

    scoreBoard.innerHTML = "S " + pointScore[0] + " - T " + pointScore[2] + " - C " + pointScore[1]  
}

function dimColors() {
    truePlayerColors[0] = playersColorsIdle[0]
    truePlayerColors[1] = playersColorsIdle[1]
    truePlayerColors[2] = playersColorsIdle[2]
    drawMap()
}

//Basic logic for block placing
function blockPlacement() {
    //Haven't done nothing yet
}

function pointSpawner() {

    pointX = Math.floor(Math.random() * boardSize)
    pointY = Math.floor(Math.random() * boardSize)

    mapShine[pointY][pointX]++

    pointCollecting()

    if (timeOver == true) {
        clearInterval(pointInterval)
    }
}

function trackTime() {
    time++

    drawMap()

    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if (mapShine[y][x] != 0) {
                mapShine[y][x]++
            }
        } 
    }

    if (timeLimit == true) {
        timeLeft--
        timeBoard.innerHTML = Math.floor(timeLeft / 60) + ":" + String(timeLeft % 60).padStart(2, "0")
            if (timeLeft <= 0) {
            timeOver = true;
            clearInterval(timeInterval)
            clearInterval(pointInterval)
        }
    }
    else {
        timeBoard.innerHTML = Math.floor(time / 60) + ":" + String(time % 60).padStart(2, "0")
    }
}

startGame()

//Call the canvas onto JS

var mainMap = document.getElementById("map");
var m = mainMap.getContext("2d");

//It's a square so it is delimited by vertical space

mainMap.height = Math.floor(window.innerHeight / 32) * 32 + 2
mainMap.width = Math.floor(window.innerHeight / 32) * 32 + 2

//Kinda redundant but may help
//The length of the square itself

var mapLength = Math.floor(window.innerHeight / 32) * 32 + 2

var tileSpace = (mapLength - 2) / 32

//The R2 positions of the players
//Btw cube and square are the names of the players


var square = [7, 7] 
var cube = [24, 24]

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
    m.fillStyle = "#FFFFFF";

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

    if (square[0] == cube[0] && square[1] == cube[1]) {
        m.fillStyle = "#0000FF"
        m.fillRect(square[0] * tileSpace + 2, square[1] * tileSpace + 2, tileSpace - 2, tileSpace - 2)
    }
}

//Basic movement for the players

function playerMovement() {
    switch (event.code) {
        case "KeyW":
            square[1] -= 1
            break;
        case "KeyA":
            square[0] -= 1
            break;
        case "KeyS":
            square[1] += 1
            break;
        case "KeyD":
            square[0] += 1
            break;
        case "ArrowUp":
            cube[1] -= 1
            break;
        case "ArrowLeft":
            cube[0] -= 1
            break;
        case "ArrowDown":
            cube[1] += 1
            break;
        case "ArrowRight":
            cube[0] += 1
            break;
    }

    
    movementLogic()
}

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

    drawMap()
}
startGame()
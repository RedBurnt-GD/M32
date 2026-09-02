//Call the canvas onto JS

var mainMap = document.getElementById("map");
var m = mainMap.getContext("2d");

//It's a square so it is delimited by vertical space

mainMap.height = Math.floor(window.innerHeight / 32) * 32 - 36
mainMap.width = Math.floor(window.innerHeight / 32) * 32 - 36

//Kinda redundant but may help
//The length of the square itself

var mapLength = Math.floor(window.innerHeight / 32) * 32 - 36

var tileSpace = (mapLength + 36) / 32

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

    for (var i = 0; i < 33; i++) {
        m.moveTo(i * tileSpace + 1, 0)
        m.lineTo(i * tileSpace + 1, mapLength)
        m.stroke()
    }
    for (var j = 0; j < 33; j++) {
        m.moveTo(0, j * tileSpace + 1)
        m.lineTo(mapLength, j * tileSpace + 1)
        m.stroke()
    }
}


drawMap()
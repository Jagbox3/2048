//global vars here

let grid;
let score = 0;
let storageManager;

let t = 0;
let debug = false;
let rectLength = 150;
let startingPoint = {
    x: window.innerWidth / 2 - 2 * rectLength,
    y: window.innerHeight / 2 - 2 * rectLength
};
let buttons = [];
let directions = {
    RIGHT: "RIGHT",
    LEFT: "LEFT",
    DOWN: "DOWN",
    UP: "UP"
};
let touchMousePos = {
    x: 0,
    y: 0
};
let previousState = {
    grid: undefined,
    score: 0
};

function setup() {
    noLoop();
    unloadScrollBars();
    createCanvas(window.innerWidth, window.innerHeight);
    colorMode(RGB);

    storageManager = new StorageManager();
    startNewGame();

    //undo button
    buttons.push(new Button(innerWidth / 2 - 100 + 3 * rectLength, innerHeight / 2 + 50, 200, 100, "Undo"));
    buttons[buttons.length - 1].isClicked = function(){
        touchMousePos.x = 100000000000;
        grid = previousState.grid;
        score = previousState.score;
    }
    //new game button
    buttons.push(new Button(innerWidth / 2 - 100 + 3 * rectLength, innerHeight / 2 - 150, 200, 100, "New Game"));
    buttons[buttons.length - 1].isClicked = function(){
        startNewGame();
    }
}

function keyPressed(){
    let direction = -1;
    switch(keyCode){
        case RIGHT_ARROW:
            direction = directions.RIGHT;
            break;
        case LEFT_ARROW:
            direction = directions.LEFT;
            break;
        case DOWN_ARROW:
            direction = directions.DOWN;
            break;
        case UP_ARROW:
            direction = directions.UP;
            break;
    }
    if(direction != -1){
        makeMove(direction);
    }
}

function mousePressed(){
    touchMousePos.x = mouseX;
    touchMousePos.y = mouseY;

    for(let i = 0; i < buttons.length; i++){
        buttons[i].checkClicked();
    }
}

function mouseReleased(){
    let xDiff = mouseX - touchMousePos.x;
    let yDiff = mouseY - touchMousePos.y;
    if(abs(xDiff) < 50 && abs(yDiff) < 50 || abs(xDiff) > innerWidth){
        console.log("Touch ignored");
        return;
    }
    console.log(xDiff + " " + yDiff);
    let dir;
    if(abs(xDiff) >= abs(yDiff)){
        if(xDiff > 0){
            dir = directions.RIGHT;
        } else {
            dir = directions.LEFT;
        }
    } else {
        if(yDiff > 0){
            dir = directions.DOWN;
        } else {
            dir = directions.UP;
        }
    }
    makeMove(dir);
    if(debug){
        console.log(dir);
    }

}

function makeMove(dir){

    let flipped = false;
    let transposed = false;
    let played = true;

    previousState.grid = copyGrid(grid);
    previousState.score = score;

    switch(dir){
        case directions.RIGHT:
            //do nothing
            break;
        case directions.LEFT:
            //flip grid
            grid = flipGrid(grid);
            flipped = true;
            break;
        case directions.DOWN:
            // turn left
            grid = transposeGrid(grid);
            transposed = true;
            break;
        case directions.UP:
            // turn right
            grid = transposeGrid(grid);
            grid = flipGrid(grid);
            transposed = true;
            flipped = true;
            break;
        default:
            played = false;
    }

    if (played){

        for(let i = 0; i < 4; i++){
            grid[i][3].horizontalSlide();
        }

        if (flipped){
            grid = flipGrid(grid);
        }

        if (transposed){
            grid = transposeGrid(grid);
        }

        // only add a new number if something moved
        if(compareGrid(grid, previousState.grid)){
            let spot = addNumber(grid);
        }

        // print out the values if debug mode on
        if (debug){
            console.table(getGridValues(grid));
        }
    }

}

function draw(){
    //draw base layer
    background('#f9b77c');
    textSize(22);
    textAlign(CENTER, CENTER);
    text("HOW TO PLAY: Use your arrow keys to move the tiles. When", innerWidth / 2, startingPoint.y + 4 * rectLength + 40);
    text("two tiles with the same number touch, they merge into one!", innerWidth / 2, startingPoint.y + 4 * rectLength + 70);
    drawGrid();
    fill(0);
    noStroke();
    //@todo: make text size scalable
    textSize(48);
    textAlign(LEFT, CENTER);
    text("Score: " + score, startingPoint.x, startingPoint.y - 60);
    textAlign(RIGHT, CENTER);
    text("Best: " + storageManager.getBestScore(), startingPoint.x + 4 * rectLength, startingPoint.y - 60);

    for(let i = 0; i < buttons.length; i++){
        buttons[i].draw();
    }
}


function startNewGame(){
    score = 0;
    grid = getBlankGrid();
    addNumber(grid);
    addNumber(grid);
    previousState.grid = grid;
    if (debug){
        console.table(getGridValues(grid));
    }
    loop();
}

function drawGrid() {

    // draw the base
    fill("#aaaaaa");
    rect(startingPoint.x, startingPoint.y, rectLength*4, rectLength*4);

    // draw the individual squares
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            grid[i][j].draw();
        }
    }

    // draw the grid pattern
    noFill();
    strokeWeight(4);
    stroke(255);
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            rect(startingPoint.x + j * rectLength, startingPoint.y + i * rectLength, rectLength, rectLength);
        }
    }

    if (score > storageManager.getBestScore()){
        storageManager.setBestScore(score);
    }

    if(isGameOver()){
        t += 4;
        console.log("game over");
        strokeWeight(4);
        let c = color(93, 93, 93, constrain(t, 0, 200));
        stroke(c);
        fill(c);
        rect(startingPoint.x, startingPoint.y, rectLength * 4, rectLength * 4);
        fill(0);
        noStroke();
        //@todo: make text size scalable
        textSize(96);
        if(isWon()){
            text("You Win!", innerWidth / 2, startingPoint.y + rectLength);
        } else {
            text("Game Over", innerWidth / 2, startingPoint.y + rectLength);
        }
        textSize(32);
        text("Written by Jeff Putlock", innerWidth / 2, startingPoint.y + 2 * rectLength + 125);
        text("Based on 2048 by Gabriele Cirulli", innerWidth / 2, startingPoint.y + 2 * rectLength + 170);
        // strokeWeight(4);
        // stroke(255);
        // fill('#f9cd8e');
        // rect(innerWidth / 2 - 100, innerHeight / 2 - 50, 200, 100);
        // noStroke();
        // fill(0);
        // text("Play Again?", innerWidth / 2, innerHeight / 2);
        if (t >= 200){
            noLoop();
        }
    }
}

/** Returns state of game
* Game is over if two conditions are met:
* (a) No zeros left on the board
* (b) No two of the same number are adjacent
**/
function isGameOver(){

    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            //no zeros
            if (grid[i][j].value == 0){
                return false;
            }
            //no two of the same adjacent horizontally
            if (j < 3 && grid[i][j].value == grid[i][j+1].value){
                return false;
            }
            //no two of the same adjacent vertically
            if (i < 3 && grid[i][j].value == grid[i+1][j].value){
                return false;
            }
        }
    }
    return true;
}

function isWon(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if (grid[i][j].value >= 2048){
                return true;
            }
        }
    }
    return false;
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}

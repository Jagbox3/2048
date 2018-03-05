//global vars here

let grid;
let score = 0;


let rectLength = 150;
let startingPoint = {
    x: window.innerWidth / 2 - 2 * rectLength,
    y: window.innerHeight / 2 - 2 * rectLength
};

function setup() {
    unloadScrollBars();
    createCanvas(window.innerWidth, window.innerHeight);
    colorMode(RGB);
    startNewGame();
}

function keyPressed(){
    let flipped = false;
    let transposed = false;
    let played = true;
    
    let previousGrid = copyGrid(grid);
    
    switch(keyCode){
        case RIGHT_ARROW:
            //do nothing
            break;
        case LEFT_ARROW:
            //flip grid
            grid = flipGrid(grid);
            flipped = true;
            break;
        case DOWN_ARROW:            
            // turn left
            grid = transposeGrid(grid);
            transposed = true;
            break;
        case UP_ARROW:
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
        if(compareGrid(grid, previousGrid)){
            let spot = addNumber(grid);
        }
        console.table(getGridValues(grid));
    }
}

function draw(){
    background('#f9b77c');
    drawGrid();
    fill(0);
    noStroke();
    //@todo: make text size scalable
    textSize(48);
    text("Score: " + score, innerWidth / 2, startingPoint.y - 60);
    textSize(22);
    text("HOW TO PLAY: Use your arrow keys to move the tiles. When", innerWidth / 2, startingPoint.y + 4 * rectLength + 40);
    text("two tiles with the same number touch, they merge into one!", innerWidth / 2, startingPoint.y + 4 * rectLength + 70);
}

function drawGrid() {
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            grid[i][j].draw();
        }
    }
}

function startNewGame(){
    grid = getBlankGrid();
    addNumber(grid);
    addNumber(grid);
    console.table(getGridValues(grid));
}

function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}
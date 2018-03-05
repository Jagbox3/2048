let colors = {
    0: '#aaaaaa',
    2: '#ffb66d',
    4: '#ffa449',
    8: '#ed851e',
    16: '#d36900',
    32: '#ed551e',
    64: '#a82710',
    128: '#af1c4f',
    256: '#8e3166',
    512: '#7a1135',
    1024: '#41135b',
    2048: '#0007a0',
    4096: '#22682a'
};

// Returns a 4x4 Grid filled with zeros (initial game state)
function getBlankGrid(){
    let blankGrid = Array(4);
    for(let i = 0; i < 4; i++){
        blankGrid[i] = [];
        for(let j = 0; j < 4; j++){
            blankGrid[i][j] = new Cell(j, i, 0);
        }
    }
    return blankGrid;
}

// Sets the current grid to a given grid
function createTestGrid(testGrid){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            grid[i][j] = new Cell(j, i, testGrid[i][j]);
        }
    }
}

// Returns a copy of the given grid
function copyGrid(grid){
    let copied = [];
    for (let i = 0; i < 4; i++){
        copied[i] = grid[i].slice();
    }
    return copied;
}

// Returns true if grids are different
function compareGrid(grid1, grid2){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if (grid1[i][j].value != grid2[i][j].value){
                return true;
            }
        }
    }
    return false;
}

// Returns a horizontally flipped version of the grid
function flipGrid(grid){
    let newGrid = getBlankGrid();
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            newGrid[i][j] = new Cell(j, i, grid[i][3-j].value);
        }
    }
    return newGrid;
}

// Returns a transposed grid
function transposeGrid(grid){
    let newGrid = getBlankGrid();
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            newGrid[j][i] = new Cell(i, j, grid[i][j].value);
        }
    }
    return newGrid;
}

// Adds a number from remaining zeros
// Returns the spot where the new number was added
function addNumber(grid){
    let options = [];
    let newSpot = -1;
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            // if it is an open slot, add it to the list of possibilites
            if (grid[i][j].value == 0){
                options.push({
                    x: j,
                    y: i
                });
            }
        }
    }
    if (options.length > 0){
        newSpot = random(options);
        let chance = random(1);
        if (chance > 0.1){
            grid[newSpot.y][newSpot.x] = new Cell(newSpot.x, newSpot.y, 2, true);
        } else {
            grid[newSpot.y][newSpot.x] = new Cell(newSpot.x, newSpot.y, 4, true);
        }
    }
    return newSpot;
}

function getGridValues(testGrid){
    let values = [];
    for(let i = 0; i < 4; i++){
        values[i] = [];
        for(let j = 0; j < 4; j++){
            values[i][j] = testGrid[i][j].value;
        }
    }
    return values;
}
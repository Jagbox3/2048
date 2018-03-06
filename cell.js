function Cell(x, y, value, isNew = 0){

    //Constructor
    this.pos = {x: x, y: y};
    this.value = value;
    this.color = colors[value.toString()];
    this.newCell = isNew ? 20 : 0;

    this.update = function(){
        let a = color('#ffb66d');
        let b = color('#420056');
        let c = lerpColor(a, b, this.newCell / 20);
        if (this.newCell > 0){
            fill(c);
        } else {
            if(this.value > 0){
                fill(colors[value.toString()]);
            } else {
                noFill();
            }
        }
        //decay "new cell" color
        if (this.newCell > 0){
            this.newCell -= 1;
        }
    }

    // go to the right (increase x)
    this.horizontalSlide = function(){
        this.moveRight();
        this.combineRight();
        this.moveRight();
    }

    this.moveRight = function(){
        if(this.pos.x < 3 && this.value != 0 && grid[this.pos.y][this.pos.x+1].value == 0){
            // replace this current cell in the grid
            grid[this.pos.y][this.pos.x] = new Cell(this.pos.x, this.pos.y, 0);

            // update position in grid
            let newCell = new Cell(this.pos.x+1, this.pos.y, this.value);
            grid[this.pos.y][this.pos.x+1] = newCell;
            newCell.moveRight();
        }
        if(this.pos.x > 0){
            grid[this.pos.y][this.pos.x-1].moveRight();
        }
    }

    this.combineRight = function(){
        if(this.pos.x < 3 && this.value != 0 && this.value == grid[this.pos.y][this.pos.x+1].value){
            if(debug){
                console.log(this.value + " " + grid[this.pos.y][this.pos.x].value);
            }
            // replace current cell in grid
            grid[this.pos.y][this.pos.x] = new Cell(this.pos.x, this.pos.y, 0);
            // update new cell
            grid[this.pos.y][this.pos.x+1] = new Cell(this.pos.x+1, this.pos.y, this.value * 2);
            score += this.value * 2;
        }
        if(this.pos.x > 0){
            grid[this.pos.y][this.pos.x-1].combineRight();
        }
    }

    this.draw = function(){
        this.update();
        noStroke();

        // Draw Square
        rect(startingPoint.x + this.pos.x * rectLength, startingPoint.y + this.pos.y * rectLength, rectLength, rectLength);

        if(this.value){
            // Draw Value
            fill(0);
            textSize(48);
            textAlign(CENTER, CENTER);
            text(this.value, startingPoint.x + (this.pos.x + 0.5) * rectLength, startingPoint.y + (this.pos.y + 0.5) * rectLength);
        }
    }
}

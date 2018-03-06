function Button(x, y, w, l, t){

    this.pos = {
        x: x,
        y: y
    };

    this.dimensions = {
        width: w,
        length: l
    }

    this.buttonText = t;

    this.draw = function(){
        strokeWeight(4);
        stroke(255);
        fill('#4c525b');
        rect(this.pos.x, this.pos.y, this.dimensions.width, this.dimensions.length);
        noStroke();
        fill(0);
        textSize(36);
        textAlign(CENTER, CENTER);
        text(this.buttonText, this.pos.x + this.dimensions.width / 2, this.pos.y + this.dimensions.length / 2);
    }

    this.checkClicked = function(){
        if(
            mouseX > this.pos.x && mouseX < this.pos.x + this.dimensions.width &&
            mouseY > this.pos.y && mouseY < this.pos.y + this.dimensions.length
        ){
            this.isClicked();
            if(debug){
                console.log(this.buttonText + " clicked");
            }
        }
    }

    this.isClicked = function(){
        //define this function on construction
    }

}

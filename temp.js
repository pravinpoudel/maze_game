function drawLine(ctx, begin, end, stroke="white", width =1){
    if(stroke){
        ctx.strokeStyle = stroke;
    }

    if(width){
        ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}

function Cell(i,j){
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true]; //top, right, bottom, left

    this.show = function(){
        console.log("hi")
        let x = this.i*w;
        let y = this.j*w;
        let start = [x,y];
        let end = [x,y];
        //top
        if(this.walls[0]){
            start = [x,y];
            end=[x+w,y];
            drawLine(ctx, start, end , "wheat", 2);
        }
        //right
        if(this.walls[1]){
            start=[x+w, y];
            end = [x+w, y+w];
            drawLine(ctx, start, end , "wheat", 2);
        }
        if(this.walls[2]){
            start = [x+w, y+w];
            end = [x, y+w];
            drawLine(ctx, start, end , "wheat", 2);
        }
        if(this.walls[3]){
            start = [x, y+w];
            end = [x,y];
            drawLine(ctx, start, end , "wheat", 2);
        }
    
    }
}


function draw(){
    for(let i=0; i<grid.length; i++){
        grid[i].show();
    }
}


function randInt(n){
    return Math.floor(Math.random()*n);
}


function getIndex(i,j){
    if(i<0 || i>cols-1|| j<0 || j> row-1){
        return -1;
    }
    let index = j*cols+i;
    return index;
}

//right getIndex(i+1,j)
//bottom getIndex(i, j+1)
//left getIndex(i-1,j)
//top getIndex(i, j-1)

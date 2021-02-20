window.onload = function(){
	
	var canvasHeight = 600;
	var canvasWidth = 600;
	var blockSize = 30;
	var ctx;
	var delay = 100;
	var snakee;
	var applee;
	var widthInBlocks = canvasWidth / blockSize;
	var heightInBlocks = canvasHeight / blockSize;
	var score;
	var timeout;

	init();


    function init(){
    	var canvas = document.createElement('canvas');
		canvas.width= canvasHeight;
		canvas.height = canvasWidth;
		canvas.style.border = "20px solid";
		canvas.style.margin = "40px auto";
		canvas.style.display= "block";
		canvas.style.backgroundColor = "#ddd";
		document.body.appendChild(canvas);
		ctx = canvas.getContext('2d');
		snakee= new Snake( [[6,4], [5,4], [4,4]],"right" );
		applee = new Apple ([10,10]);
		score=0;
		refresh();

    }
	
	function refresh(){
		snakee.advance();
		if (snakee.checkCollistion()) {
			gameOver();
		} else {
			if(snakee.isEatingApple(applee)){
				score++;
				snakee.ateApple = true;
				do{
                    applee.setNewPosition();
				}while(applee.isOnSnake(snakee));
			}
	        ctx.clearRect(0,0,canvasHeight,canvasWidth);
			drawscore();
			applee.draw();
			snakee.draw();
			timeout = setTimeout(refresh,delay);
		}
		
	}

	function gameOver(){
		ctx.save();
	    ctx.font = "bold 15px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasWidth / 2  , canvasHeight/2 -180);
        ctx.fillText("Press space key to play again", canvasWidth / 2 ,canvasHeight/2 -100);
		ctx.restore();
	}

    function restore(){
        snakee= new Snake( [[6,4], [5,4], [4,4]],"right" );
		applee = new Apple ([10,10]);
		score=0;
		clearTimeout(timeout);
		refresh();
    }

    function drawscore(){
        ctx.save();
        ctx.font = "bold 25px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.fillText("Score = "+score.toString(), 70 ,canvasHeight - 5);
		ctx.restore();
    }
	function drawBlock(ctx, position){
		var x = position[0] * blockSize;
		var y = position[1] * blockSize;
		ctx.fillRect(x,y,blockSize,blockSize);
	}

	function Snake(body,direction){
		this.body = body;
		this.direction = direction;
		this.ateApple = false;
		this.draw = function(){
			ctx.save();
			ctx.fillStyle = "#270694";
			for (var i = 0; i < this.body.length; i++) {
				drawBlock(ctx,this.body[i]);
			}
			ctx.restore();
		};
		this.advance = function(){
			var nextPosition = this.body[0].slice();
			switch(this.direction){
				case "left":
				   nextPosition[0]-= 1;
				   break;
				case "right":
				   nextPosition[0] += 1;
				   break;
				case "down":
				   nextPosition[1] += 1;
				    break;
				case "up":
				    nextPosition[1] -= 1;
				    break;
				 default:
				    throw("Invalid Direction");   
			}
			this.body.unshift(nextPosition);
			if(!this.ateApple){
				 this.body.pop();
			}else{
				this.ateApple = false;
			}
		};
		this.setDirection = function(newDirection){
			var allowedDirections;
				switch(this.direction){
				case "left":
				case "right":
				   allowedDirections =["up", "down"];
				   break;
				case "down":
				case "up":
				   allowedDirections =["left", "right"];
				    break;
				 default:
				    throw("Invalid Direction");   
			}
			if(allowedDirections.indexOf(newDirection) > -1){
				this.direction = newDirection;
			}
		};
		this.checkCollistion = function(){
				var wallCollistion = false;
				var snakeCollistion = false;
				var head = this.body[0];
				var rest = this.body.slice(1);
				var snakeX = head[0];
				var snakeY = head[1];
				var minX = 0;
				var minY = 0;
				var maxX = widthInBlocks - 1 ;
				var maxY = heightInBlocks -1 ;
				var isNoBetwennHorizontalWalls = snakeX < minX ||snakeX  > maxX;
				var isNoBetwennVerticalWalls = snakeY < minY || snakeY > maxY ;
				
				if (isNoBetwennVerticalWalls || isNoBetwennHorizontalWalls) {
					wallCollistion = true;
				} 
				for ( var i=0; i<rest.length;i++){
                  if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
						snakeCollistion = true;
					}
				}
			
				return wallCollistion || snakeCollistion ; 
		};
		this.isEatingApple = function(appleToEat){
 				var head = this.body[0];
 				if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
 					return true;
 				}else{
 					return false;
 				}
		};

	}

	function Apple(position){
		this.position = position;
		this.draw = function(){
				ctx.save();
				ctx.fillStyle = "#ff0000";
				ctx.beginPath();
				var radius = blockSize/2;
				var x = this.position[0] * blockSize + radius;
				var y = this.position[1] * blockSize + radius;
				ctx.arc(x,y,radius,0,Math.PI*2,true);
				ctx.fill();
				ctx.restore();
		};

		this.setNewPosition = function(){
          var NewX = Math.round(Math.random() * (widthInBlocks - 1));
          var NewY = Math.round(Math.random() * (heightInBlocks - 1));
          this.position = [NewX, NewY];
		};

		this.isOnSnake = function(snakeToCheck){
			var isOnSnake = false;
			for (var i = 0; i < snakeToCheck.body.length ; i++) {
				if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
					isOnSnake = true;
				}
				return isOnSnake;
			}
		};
	}

	document.onkeydown = function handleKeyDown(e){
		var key = e.keyCode;
		var newDirection;
		switch(key){
			case 37:
			 newDirection="left";
			 break;
			case 38:
			 newDirection="up";
			 break;
			case 39:
			 newDirection="right";
			 break;
			case 40:
			 newDirection="down";
			 break; 
			case 32:
			  restore();
			  return;
			default:
			   return; 
		}
		snakee.setDirection(newDirection);
	} 
}





/*code pour le project fi lien de youtube*/
/*
var Myurl = 'https://www.youtube.com/watch?v=4kpCgVEZ0Ts';
var Newurl = Myurl.replace('https://www.youtube.com/watch?v=','https://www.youtube.com/embed/');
console.log(Newurl);
*/
/*loop infini
var nbr = 0;
while(nbr<3){
	console.log(nbr);
}*/
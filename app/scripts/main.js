/* jshint devel:true */

$(document).ready(onReady)

$(window).resize(resize)
window.onorientationchange = resize;

var Game = {
	FRICTION: 1,
	currentCursor: 'draw',
	GRAVITY: 10,
	width: 800,
	height: 600,
	wallDamping: -0.75,
	throwTime: 0
}


var wabbitTexture;
var pirateTexture;

var balls = [];



var startballCount = 2;
var isAdding = false;
var count = 0;
var container;

var lastTime = (new Date()).getTime();
var currentTime = 0;
var delta = 0;
var currentMousePos = { x: -1, 
						y: -1,
						lastx: -1,
						lasty: -1 };


var amount = 1;
var myTree;


function onReady()
{
	Game.friction = false;
	Game.gravity = Game.GRAVITY;
	
	renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor:0x000000});

	myTree = new Quadtree({
	    x: 0,
	    y: 0,
	    width: renderer.width,
	    height: renderer.height
	}, 10, 12);

	// if(delta >= 5)//TODO: watch fps drop
	// {
	// 	renderer.context.mozImageSmoothingEnabled = false
	// 	renderer.context.webkitImageSmoothingEnabled = false;
		
	// }
	
	renderer.view.style["transform"] = "translatez(0)";
	//alert(amount)
	document.body.appendChild(renderer.view);
	renderer.view.style.position = "absolute";
	stats = new Stats();
	
	
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "absolute";
	stats.domElement.style.top = "0px";
	requestAnimationFrame(update);
	
	wabbitTexture = new PIXI.Texture.fromImage("images/bunnys.png")
	ballTexture = new PIXI.Texture.fromImage("images/ball.png")
	aimTexture = new PIXI.Texture.fromImage("images/aim.png")


	
	container = new PIXI.Container();
	Ui.init();	

	balltex = new PIXI.Texture(ballTexture.baseTexture, new PIXI.math.Rectangle(0, 0, 50, 50));
	aimtex = new PIXI.Texture(aimTexture.baseTexture, new PIXI.math.Rectangle(0, 0, 25, 25));



	for (var i = 0; i < startballCount; i++) 
	{
		var x = Math.floor(Math.random() * renderer.width);
		var y = Math.floor(Math.random() * renderer.height/2);
		var ball = new Ball(x,y,25,balltex);

		balls.push(ball);

		container.addChild(ball);
	}

	Input.init();
	
	
	resize();
}



function resize()
{

	Game.width = $(window).width(); 
	Game.height = $(window).height(); 
	
	
	var w = $(window).width() / 2 - Game.width/2;
	var h = $(window).height() / 2 - Game.height/2;
	
	renderer.view.style.left = $(window).width() / 2 - Game.width/2 + "px"
	renderer.view.style.top = $(window).height() / 2 - Game.height/2 + "px"
	
	stats.domElement.style.left = w + "px";
	stats.domElement.style.top = h + "px";
	
	Ui.update();

	

	
	renderer.resize(Game.width, Game.height);
}

function update()
{
	currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;
	stats.begin();
	myTree.clear();
	if(isAdding && Game.currentCursor == 'draw') {
		addBalls();

	}
	if (isAdding && Game.currentCursor == 'throw') {
		Game.preThrowBall();
	}
	if (!isAdding && Game.currentCursor == 'throw') {
		Game.throwBall();
	}
	
	
	for (var i = 0; i < balls.length; i++) 
	{
		var ball = balls[i];

		myTree.insert(ball);
		
	

		var elements = myTree.retrieve(ball);

		for (var j = 0; j < elements.length; j++) {
			checkCollision(elements[j], ball);
		};

		if (isAdding && Game.currentCursor == 'repel') {
			ball.repel();
		}
		if (isAdding && Game.currentCursor == 'attract') {
			ball.attract();
		}
		if (isAdding && Game.currentCursor == 'vacuum') {
			ball.vacuum();
		}
		if (ball.remove) {
			container.removeChild(ball);
			balls.splice(i,1);
			count --;
			Ui.counter.text = count + " Balls";
		}
		if (isAdding && Game.currentCursor == 'split') {
			ball.split();
		}

		ball.update();
		
	}
	
	
	
	renderer.render(container);
	requestAnimationFrame(update);
	stats.end();
	lastTime = currentTime;
	
}

// var checkCollision = function(circle1, circle2) {
// 	var dx = circle1.x - circle2.x;
// 	var dy = circle1.y - circle2.y;
// 	var distance = Math.sqrt(dx * dx + dy * dy);
// 	var cd = circle1.r + circle2.r;
// 	var dvec = [dx, dy];
// 	var dnorm = [dx/distance, dy/distance];
// 	var colDepth = cd - distance;
// 	if (colDepth > 0) {
// 		if (circle1.m < circle2.m) {
// 			circle1.position.x -= dx * colDepth;
// 			circle1.position.y -= dy * colDepth;
// 		} else {
// 			circle2.position.x += dx * colDepth;
// 			circle2.position.y += dy * colDepth;
// 		}
// 		var aci = dotproduct([circle1.vx, circle1.vy], dnorm);
// 		var bci = dotproduct([circle2.vx, circle2.vy], dnorm);

// 		var acf = (aci * (circle1.m - circle2.m) + 2 * circle2.m *bci) / (circle1.m + circle2.m);
// 		var bcf = (bci * (circle2.m - circle1.m) + 2 * circle1.m *aci) / (circle1.m + circle2.m);

// 		circle1.vx += (acf - aci) * dx/distance;
// 		circle1.vy += (acf - aci) * dy/distance;
// 		circle2.vx += (bcf - bci) * dx/distance;
// 		circle2.vy += (bcf - bci) * dy/distance;

// 	}

	
// }

	

var checkCollision = function(circle1, circle2) {
	var dx = circle1.x - circle2.x;
	var dy = circle1.y - circle2.y;
	var distance = Math.sqrt(dx * dx + dy * dy);
	var cd = circle1.r + circle2.r;
	if (distance <= cd) {
		collide(circle1, circle2, distance, cd);

	}
}

	
var collide = function(c1, c2, d, cd) {
	if (d==0){
		return;
	}
	//http://simonpstevens.com/articles/vectorcollisionphysics
	//var msac = moveToCollisionPoint(c1, c2, d, cd)
	var norm = [(c1.x - c2.x)/d, (c1.y - c2.y)/d];
	var coll = [-norm[1], norm[0]];
	//move overlapping balls
	var dcd = cd -d;
	if (Math.random() >0.5) {
		c1.position.x += norm[0] * dcd;
		c1.position.y += norm[1] * dcd;

	} 
	else {
		c2.position.x -= norm[0] * dcd;
		c2.position.y -= norm[1] * dcd;
	}


	var cn1 = dotproduct(norm, [c1.vx, c1.vy])
	var cn2 = dotproduct(norm, [c2.vx, c2.vy])
	var cc1 = dotproduct(coll, [c1.vx, c1.vy])
	var cc2 = dotproduct(coll, [c2.vx, c2.vy])

	var va1 = ((cn1 * (c1.m - c2.m)) + (2*c2.m*cn2)) / (c2.m + c1.m)
	var va2 = ((cn2 * (c2.m - c1.m)) + (2*c1.m*cn1)) / (c2.m + c1.m)

	var vecn1a = [va1*norm[0],va1*norm[1]];
	var vecn2a = [va2*norm[0],va2*norm[1]];
	var vecc1 = [cc1*coll[0],cc1*coll[1]];
	var vecc2 = [cc2*coll[0],cc2*coll[1]];

	var v1a = [vecn1a[0]+vecc1[0],vecn1a[1]+vecc1[1]];
	var v2a = [vecn2a[0]+vecc2[0],vecn2a[1]+vecc2[1]];
	
	var f = Game.FRICTION;

	c1.vx = v1a[0] * f;
	c1.vy = v1a[1] * f;
	c2.vx = v2a[0] * f;
	c2.vy = v2a[1] * f;

	// c1.position.x = c1.position.x + c1.vx * msac;
	// c1.position.y = c1.position.y + c1.vy * msac;
	// c2.position.x = c2.position.x + c2.vx * msac;
	// c2.position.y = c2.position.y + c2.vy * msac;

}




var addBalls = function() {
		
		if(count < 20000)
		{

			for (var i = 0; i < amount; i++) 
			{

				var ball = new Ball(currentMousePos.x, currentMousePos.y, 2 + Math.random() * 4, balltex);

				balls.push(ball);

				container.addChild(ball);
				
				count++;
			}
		}

		Ui.counter.text = count + " Balls";
}

 function dotproduct(a,b) {
	var n = 0, lim = Math.min(a.length,b.length);
	for (var i = 0; i < lim; i++) n += a[i] * b[i];
	return n;
 }






Game.preThrowBall = function() {
	if (!this.activeBall) {
		this.activeBall = new Ball(currentMousePos.x, currentMousePos.y, 25, balltex);
		balls.push(this.activeBall);
		container.addChild(this.activeBall);
		count++;
		Ui.counter.text = count + " Balls";

	}
	if (!this.graphics) {
		this.graphics = new Ball(currentMousePos.lastx, currentMousePos.lasty, 8, aimtex);
		container.addChild(this.graphics);

	}
	this.activeBall.position.x = currentMousePos.x;
	this.activeBall.position.y = currentMousePos.y;


	


}


Game.throwBall = function() {
	if (this.activeBall) {
		this.activeBall.vx = -(currentMousePos.x - currentMousePos.lastx);
		this.activeBall.vy = -(currentMousePos.y - currentMousePos.lasty);
		delete this.activeBall;
		container.removeChild(this.graphics);
		delete this.graphics;
	}
}
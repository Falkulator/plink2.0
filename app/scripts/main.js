/* jshint devel:true */

$(document).ready(onReady)

$(window).resize(resize)
window.onorientationchange = resize;

var width = 480;
var height = 320;

var wabbitTexture;
var pirateTexture;

var balls = [];
var gravity = 19.5 ;

var maxX = width;
var minX = 0;
var maxY = height;
var minY = 0;

var startballCount = 3;
var isAdding = false;
var count = 0;
var container;

var lastTime = (new Date()).getTime();
var currentTime = 0;
var delta = 0;
var currentMousePos = { x: -1, y: -1 };


var amount = 1;
var myTree;

function onReady()
{
	
	
	renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor:0x000000});

	myTree = new Quadtree({
	    x: 0,
	    y: 0,
	    width: renderer.width,
	    height: renderer.height
	}, 5, 12);

	if(amount == 5)
	{
		renderer.context.mozImageSmoothingEnabled = false
		renderer.context.webkitImageSmoothingEnabled = false;
		
	}
	
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

	counter = document.createElement("div");
	counter.className = "counter";
	document.body.appendChild( counter);

	
	count = startballCount;
	counter.innerHTML = count + " Balls";
	
	
	container = new PIXI.Container();


	balltex = new PIXI.Texture(ballTexture.baseTexture, new PIXI.math.Rectangle(0, 0, 50, 50));
	



	for (var i = 0; i < startballCount; i++) 
	{
		var x = Math.floor(Math.random() * renderer.width);
		var y = Math.floor(Math.random() * renderer.height);
		var ball = new Ball(x,y,25);

		balls.push(ball);

	//	ball.filters = [filter];	
	//	ball.position.x = Math.random() * 800;
	//	ball.position.y = Math.random() * 600;
			

		container.addChild(ball);
	}
	
	
	$(renderer.view).mousedown(function(event){
		currentMousePos.x = event.pageX;
  		currentMousePos.y = event.pageY;
		isAdding = true;
	});
	
	$(renderer.view).mouseup(function(event){

		currentMousePos.x = event.pageX;
  		currentMousePos.y = event.pageY;
		isAdding = false;
	})
	
	$(renderer.view).mousemove(function(event){

		currentMousePos.x = event.pageX;
  		currentMousePos.y = event.pageY;

	})
	
	document.addEventListener("touchstart", onTouchStart, true);
	document.addEventListener("touchend", onTouchEnd, true);
	document.addEventListener("touchmove", onTouchMove, true);
	
	
	resize();
}

function onTouchStart(event)
{
	isAdding = true;
	currentMousePos.x = event.pageX;
  	currentMousePos.y = event.pageY;
}

function onTouchMove(event){
  currentMousePos.x = event.pageX;
  currentMousePos.y = event.pageY;
}

function onTouchEnd(event)
{
	currentMousePos.x = event.pageX;
  	currentMousePos.y = event.pageY;

	isAdding = false;
}

function resize()
{

	var width = $(window).width(); 
	var height = $(window).height(); 
	

	
	maxX = width;
	minX = 0;
	maxY = height;
	minY = 0;
	
	var w = $(window).width() / 2 - width/2;
	var h = $(window).height() / 2 - height/2;
	
	renderer.view.style.left = $(window).width() / 2 - width/2 + "px"
	renderer.view.style.top = $(window).height() / 2 - height/2 + "px"
	
	stats.domElement.style.left = w + "px";
	stats.domElement.style.top = h + "px";
	
	counter.style.left = w + "px";
	counter.style.top = h + 48 + "px";
	counter.style.color = "#fff";
	counter.style.position = "absolute";

	

	
	renderer.resize(width, height);
}

function update()
{
	currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime) / 1000;
	stats.begin();
	myTree.clear();
	if(isAdding)
	{
		addBalls();
	}
	
	for (var i = 0; i < balls.length; i++) 
	{
		var ball = balls[i];

		myTree.insert(ball);
		ball.update();
	

		var elements = myTree.retrieve(ball);

		for (var j = 0; j < elements.length; j++) {
			checkCollision(elements[j], ball);
		};
		
	}
	
	renderer.render(container);
	requestAnimationFrame(update);
	stats.end();
	lastTime = currentTime;
	
}

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
	if (c1.m <= c2.m) {
		c1.x += norm[0] * dcd;
		c1.y += norm[1] * dcd;

	} 
	else {
		c2.x -= norm[0] * dcd;
		c2.y -= norm[1] * dcd;
	}


	var cn1 = dotproduct(norm, [c1.speedX, c1.speedY])
	var cn2 = dotproduct(norm, [c2.speedX, c2.speedY])
	var cc1 = dotproduct(coll, [c1.speedX, c1.speedY])
	var cc2 = dotproduct(coll, [c2.speedX, c2.speedY])

	var va1 = ((cn1 * (c1.m - c2.m)) + (2*c2.m*cn2)) / (c2.m + c1.m)
	var va2 = ((cn2 * (c2.m - c1.m)) + (2*c1.m*cn1)) / (c2.m + c1.m)

	var vecn1a = [va1*norm[0],va1*norm[1]];
	var vecn2a = [va2*norm[0],va2*norm[1]];
	var vecc1 = [cc1*coll[0],cc1*coll[1]];
	var vecc2 = [cc2*coll[0],cc2*coll[1]];

	var v1a = [vecn1a[0]+vecc1[0],vecn1a[1]+vecc1[1]];
	var v2a = [vecn2a[0]+vecc2[0],vecn2a[1]+vecc2[1]];
	

	c1.speedX = v1a[0];
	c1.speedY = v1a[1];
	c2.speedX = v2a[0];
	c2.speedY = v2a[1];

	// c1.x = c1.x + c1.speedX * msac;
	// c1.y = c1.y + c1.speedY * msac;
	// c2.x = c2.x + c2.speedX * msac;
	// c2.y = c2.y + c2.speedY * msac;

}




var addBalls = function() {
		
		if(count < 20000)
		{

			for (var i = 0; i < amount; i++) 
			{

				var ball = new Ball(currentMousePos.x, currentMousePos.y, 2 + Math.random() * 4);

				balls.push(ball);

				container.addChild(ball);
				
				count++;
			}
		}

		counter.innerHTML = count + " Balls";
}

 function dotproduct(a,b) {
	var n = 0, lim = Math.min(a.length,b.length);
	for (var i = 0; i < lim; i++) n += a[i] * b[i];
	return n;
 }





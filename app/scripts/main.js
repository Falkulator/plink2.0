/* jshint devel:true */

$(document).ready(onReady)

$(window).resize(resize)
window.onorientationchange = resize;

var width = 480;
var height = 320;

var wabbitTexture;
var pirateTexture;

var balls = [];
var gravity = 9.5 ;

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


var amount = 10;
var myTree;

function onReady()
{
	myTree = new Quadtree({
	    x: 0,
	    y: 0,
	    width: 800,
	    height: 600
	}, 5, 8);
	
	renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor:0x000000});
	//stage = new PIXI.Stage(0x000000);
	//stage.filterArea = new PIXI.math.Rectangle(0, 0, 800 ,600);

	//amount = (renderer instanceof PIXI.WebGLRenderer) ? 100 : 5;
//	
//	bloom = new PIXI.filters.BloomFilter();
	//stage.filters = [bloom];

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
	counter.innerHTML = count + " Balls lol";
	
	
	container = new PIXI.Container();
	//container = new PIXI.ParticleContainer(200000, [false, true, false, false, false]);
	//stage.addChild(container);
	//var filter = new PIXI.filters.ColorMatrixFilter();

	balltex = new PIXI.Texture(ballTexture.baseTexture, new PIXI.math.Rectangle(0, 0, 50, 50));
	



	for (var i = 0; i < startballCount; i++) 
	{
		var ball = new Ball(20,20,25);

		balls.push(ball);

	//	ball.filters = [filter];	
	//	ball.position.x = Math.random() * 800;
	//	ball.position.y = Math.random() * 600;
			

		container.addChild(ball);
	}
	
	
	$(renderer.view).mousedown(function(e){
		//console.log(e.offsetX)
		isAdding = true;
	});
	
	$(renderer.view).mouseup(function(){


		isAdding = false;
	})
	
	document.addEventListener("touchstart", onTouchStart, true);
	document.addEventListener("touchend", onTouchEnd, true);
	
	
	resize();
}

function onTouchStart(event)
{
	isAdding = true;
}

function onTouchEnd(event)
{
	ballType++
	ballType %= 5;
	currentTexture = ballTextures[ballType];

	isAdding = false;
}

function resize()
{

	var width = $(window).width(); 
	var height = $(window).height(); 
	
	if(width > 800)width  = 800;
	if(height > 600)height = 600;
	
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
	counter.style.top = h + 49 + "px";

	

	
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

	if (distance < circle1.r+ circle2.r) {
		collide(circle1, circle2, distance);

	}
}

	//http://simonpstevens.com/articles/vectorcollisionphysics
var collide = function(c1, c2, d) {
	if (d < 3) {return}
	var cd = c1.r + c2.r;
	var msac = moveToCollisionPoint(c1, c2, d, cd)
	var norm = [(c1.x - c2.x)/d, (c1.y - c2.y)/d];
	var coll = [-norm[1], norm[0]];

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

	c1.x = c1.x + c1.speedX * msac;
	c1.y = c1.y + c1.speedY * msac;
	c2.x = c2.x + c2.speedX * msac;
	c2.y = c2.y + c2.speedY * msac;

}

var moveToCollisionPoint = function(c1, c2, d, cd) {

	var c1s_x = c1.x - c1.speedX * delta;
	var c1s_y = c1.y - c1.speedY* delta;

	var c2s_x = c2.x - c2.speedX * delta;
	var c2s_y = c2.y - c2.speedY* delta;

	var dx = c1s_x - c2s_x;
	var dy = c1s_y - c2s_y;
	var dafs = Math.sqrt(dx * dx + dy * dy);

	var dtd = d - dafs;
	var ddtc = cd - dafs;

	var pdtc = ddtc/dtd;
	var pdac = 1 - pdtc;

	var mstc = delta * pdtc;
	var msac = delta * pdac;

	c1.x = c1s_x + c1.speedX * mstc;
	c1.y = c1s_y + c1.speedY * mstc;

	c2.x = c2s_x + c2.speedX * mstc;
	c2.y = c2s_y + c2.speedY * mstc;

	return msac;


}

var addBalls = function() {
	// add 10 at a time :)
		
		if(count < 200000)
		{

			for (var i = 0; i < amount; i++) 
			{
				var ball = new Ball(20, 20, 5 + Math.random() * 10);

				balls.push(ball);

				container.addChild(ball)//, random);
				
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





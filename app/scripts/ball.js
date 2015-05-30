function Ball(x,y,r,tex) {
	PIXI.Sprite.call(this, tex);
	
	this.x = x;
	this.y = y;
	this.width = r*2;
	this.height = r*2;
	this.r = r;
	this.m = r/100;
	this.vx = -2 + Math.random() * 4;
	this.vy = -2 + Math.random() * 4;
	this.remove = false;
	
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.alpha = 0.3 + Math.random() * 0.7;
	this.scale.set(r/25);

}

Ball.prototype = new PIXI.Sprite();
Ball.prototype.cunstructor = Ball;

Ball.prototype.update = function() {

	var wallDaming = Game.wallDamping;
	this.position.x += this.vx * delta;
	this.position.y += this.vy * delta;

	this.vy += Game.gravity * delta;
	
	
	this.applyFriction();

//TODO: thid causes overlap. add momentum to walls
	if (this.position.x + this.r > Game.width)
	{
		this.vx *= wallDaming;
		this.position.x = Game.width - this.r;
	}
	else if (this.position.x - this.r < 0)
	{
		this.vx *= wallDaming;
		this.position.x = 0 + this.r;
	}
	
	if (this.position.y + this.r > Game.height)
	{
		this.vy *= wallDaming;
		this.position.y = Game.height - this.r;
		// if (Math.random() > 0.3)
		// {
		// 	this.vy -= Math.random() * 6;
		// }
	} 
	else if (this.position.y - this.r< 0)
	{
		this.vy *= wallDaming;
		this.position.y = 0+ this.r;
	}

	if (this.r < 0.6) {
		this.remove = true;

	}

}

Ball.prototype.applyFriction = function() {
	//NOTE: limit ball movment to one direction game mechanic?
	if (Game.friction) {
		var f = 0.9950;
	}
	else {
		var f = 0.9997;
	}
	this.vx *= f;
	this.vy *= f;


}


Ball.prototype.repel = function() {
	var c = 300;
	var dx = currentMousePos.x - this.x;
	var dy = currentMousePos.y - this.y;
	var r = Math.sqrt(dx * dx + dy * dy);
	if (r < 350) {
		this.vx -= c*dx/(r*r);
		this.vy -= c*dy/(r*r);
	}
}

Ball.prototype.attract = function() {
	var c = 300;
	var dx = currentMousePos.x - this.x;
	var dy = currentMousePos.y - this.y;
	var r = Math.sqrt(dx * dx + dy * dy);
	
	this.vx += c*dx/(r*r);
	this.vy += c*dy/(r*r);

}

Ball.prototype.vacuum = function() {
	var c = 600;
	var dx = currentMousePos.x - this.x;
	var dy = currentMousePos.y - this.y;
	var r = Math.sqrt(dx * dx + dy * dy);
	
	this.vx += c*dx/(r*r);
	this.vy += c*dy/(r*r);

	var distance = Math.sqrt(dx * dx + dy * dy);
	if (distance < 10) {
		this.remove = true;
	}

}

Ball.prototype.split = function() {
	var dx = this.position.x - currentMousePos.x;
	var dy = this.position.y - currentMousePos.y;
	var distance = Math.sqrt(dx * dx + dy * dy);
	if (distance < this.r) {
		var ball = new Ball(this.position.x,this.position.y,this.r/2,balltex);
		ball.vx = this.vx;
		ball.vy = this.vy;
		balls.push(ball);
		container.addChild(ball);

		var ball = new Ball(this.position.x,this.position.y,this.r/2,balltex);
		ball.vx = this.vx;
		ball.vy = -this.vy;
		balls.push(ball);
		container.addChild(ball);

		count += 2;
		this.remove = true;
	}
}
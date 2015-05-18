function Ball(x,y,r) {
	PIXI.Sprite.call(this, balltex);
	
	this.x = x;
	this.y = y;
	this.width = r*2;
	this.height = r*2;
	this.r = r;
	this.m = r/10;
	this.speedX = -15 + Math.random() * 30;
	this.speedY = -15 + Math.random() * 30;
	
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.alpha = 0.3 + Math.random() * 0.7;
	this.scale.set(r/25)

}

Ball.prototype = new PIXI.Sprite();
Ball.prototype.cunstructor = Ball;

Ball.prototype.update = function() {

	
	this.position.x += this.speedX * delta;
	this.position.y += this.speedY * delta;
	this.speedY += gravity * delta;
	this.applyFriction();
	if (this.position.x > maxX)
	{
		this.speedX *= -0.85;
		this.position.x = maxX;
	}
	else if (this.position.x < minX)
	{
		this.speedX *= -1;
		this.position.x = minX;
	}
	
	if (this.position.y > maxY)
	{
		this.speedY *= -0.85;
		this.position.y = maxY;
		if (Math.random() > 0.3)
		{
			this.speedY -= Math.random() * 6;
		}
	} 
	else if (this.position.y < minY)
	{
		this.speedY *= -0.85;
		this.position.y = minY;
	}

}

Ball.prototype.applyFriction = function() {
	var friction = 0.0005;

	if (this.speedX > 0) {
		this.speedX -= friction;
	}
	else if (this.speedX < 0) {
		this.speedX += friction;
	}
	else if (this.speedY > 0) {
		this.speedY -= friction;
	}
	else if (this.speedY < 0) {
		this.speedY += friction;
	}
	

}

Ball.prototype.limitSpeed = function() {
	var max = 250;
	if (this.speedX > max) {
		this.speedX = max;
	}
	if (this.speedX < -max) {
		this.speedX = -max;
	}
	if (this.speedY < -max) {
		this.speedY = -max;
	}
	if (this.speedY > max) {
		this.speedY = max;
	}
}
function Ball(x,y,r) {
	PIXI.Sprite.call(this, balltex);
	
	this.x = x + Math.random() * 150;
	this.y = y + Math.random() * 150;
	this.width = r*2;
	this.height = r*2;
	this.r = r;
	this.m = 10;
	this.speedX = 5 + Math.random() * 5;
	this.speedY = 5 + Math.random() * 5;
	
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.alpha = 0.3 + Math.random() * 0.7;
	this.scale.set(r/25)

}

Ball.prototype = new PIXI.Sprite();
Ball.prototype.cunstructor = Ball;

Ball.prototype.update = function() {

	//this.limitSpeed();
	this.position.x += this.speedX * delta;
	this.position.y += this.speedY * delta;
	this.speedY += gravity * delta;
	
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
		// this.spin = (Math.random()-0.5) * 0.2
		if (Math.random() > 0.5)
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

Ball.prototype.limitSpeed = function() {
	var max = 18;
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
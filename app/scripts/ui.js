var Ui = {

}

Ui.init = function() {

	var css = {font: "15px Helvetica", 
				fill: "#fff", 
				align: "center", 
				stroke: "#fff", 
				strokeThickness: 0}
	//counter
	
	count = startballCount;
	this.counter = new PIXI.Text(count + " Balls", css);
	container.addChild(this.counter);

	//cursor
	this.cursor = new PIXI.Text("[  ] " + Game.currentCursor, css);
	container.addChild(this.cursor);

	//gravity
	this.gravity = new PIXI.Text("[g] " + Game.gravity, css);
	container.addChild(this.gravity);

	//friction
	this.friction = new PIXI.Text("[f] " + Game.friction, css);
	container.addChild(this.friction);
	
}

Ui.update = function() {
	this.counter.position.x = 4;
	this.counter.position.y = 50;
	this.counter.text = count + " Balls";

	this.cursor.position.x = 4;
	this.cursor.position.y = 70;
	this.cursor.text = "[  ] " + Game.currentCursor;

	this.gravity.position.x = 4;
	this.gravity.position.y = 90;
	this.gravity.text = "[g] " + Game.gravity;

	this.friction.position.x = 4;
	this.friction.position.y = 110;
	this.friction.text = "[f] " + Game.friction;


}

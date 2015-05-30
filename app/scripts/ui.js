var Ui = {

}

Ui.init = function() {
	//counter
	this.counter = document.createElement("div");
	this.counter.className = "counter";
	document.body.appendChild(this.counter);

	
	count = startballCount;
	this.counter.innerHTML = count + " Balls";

	//cursor
	this.cursor = document.createElement("div");
	this.cursor.className = "cursor";
	document.body.appendChild( this.cursor);

	this.cursor.innerHTML = "[ ] " + Game.currentCursor;

	//gravity
	this.gravity = document.createElement("div");
	this.gravity.className = "gravity";
	document.body.appendChild( this.gravity);

	this.gravity.innerHTML = "[g] " + Game.gravity;

	//friction
	this.friction = document.createElement("div");
	this.friction.className = "friction";
	document.body.appendChild( this.friction);

	this.friction.innerHTML = "[f] " + Game.friction;
	
}

Ui.update = function() {

	this.counter.innerHTML = count + " Balls";
	this.cursor.innerHTML = "[ ] " + Game.currentCursor;
	this.gravity.innerHTML = "[g] " + Game.gravity;
	this.friction.innerHTML = "[f] " + Game.friction;

	this.counter.style.left = 0 + "px";
	this.counter.style.top = 48 + "px";
	this.counter.style.color = "#fff";
	this.counter.style.position = "absolute";

	this.cursor.style.left = 0 + "px";
	this.cursor.style.top = 70 + "px";
	this.cursor.style.color = "#fff";
	this.cursor.style.position = "absolute";

	this.gravity.style.left = 0 + "px";
	this.gravity.style.top = 90 + "px";
	this.gravity.style.color = "#fff";
	this.gravity.style.position = "absolute";

	this.friction.style.left = 0 + "px";
	this.friction.style.top = 110 + "px";
	this.friction.style.color = "#fff";
	this.friction.style.position = "absolute";
}

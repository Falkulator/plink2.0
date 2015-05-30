var Ui = {

}

Ui.init = function() {

	counter = document.createElement("div");
	counter.className = "counter";
	document.body.appendChild( counter);

	
	count = startballCount;
	counter.innerHTML = count + " Balls";
	
}

Ui.update = function() {
	counter.innerHTML = count + " Balls";
}

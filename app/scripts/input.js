var Input = {}

Input.init = function() {
	$(renderer.view).mousedown(function(event){
		currentMousePos.lastx = event.pageX;
		currentMousePos.lasty = event.pageY;
		isAdding = true;
	});
	
	$(renderer.view).mouseup(function(event){
		isAdding = false;
		Ui.update(); 

	})
	
	$(renderer.view).mousemove(function(event){

		currentMousePos.x = event.pageX;
  		currentMousePos.y = event.pageY;

	})

	var spaceBar = keyboard(32);
	spaceBar.press = function() {

	};

	var cursorType = 0;
	var cursorTypes = ['draw', 'repel', 'attract', 'throw', 'split', 'vacuum'];
	spaceBar.release = function() {
	  	cursorType++
		cursorType %= 6;
		Game.currentCursor = cursorTypes[cursorType];
		Game.activeBall = undefined;
	};

	var gKey = keyboard(71);
	gKey.press = function() {
		if (Game.gravity > 0) {
			Game.gravity = 0;
		} else {
			Game.gravity = Game.GRAVITY;
		}
  		
	};
	gKey.release = function() {
	  
	};

	var fKey = keyboard(70);
	fKey.press = function() {
		Game.friction = !Game.friction;
	};
	fKey.release = function() {
	  
	};
	
	
	

	
}



function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
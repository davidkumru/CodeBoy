var canvas = document.getElementById("level");
var context = canvas.getContext("2d");

var world = {x: 0, y: 300, width: 900, height: 100, color: "#A1D490"};
var codeboyPosition = {x: 30, y: 240, width: 30, height: 60, color: "black"};
var direction = "";
var keyCombo = [];

function rerender() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  renderBlock(world);
  renderBlock(codeboyPosition);
}

function renderBlock(position) {
  context.fillStyle = position.color;
  context.fillRect(position.x, position.y, position.width, position.height);
};

function jump(momentum) {
  var counter = 0;
  var interval = setInterval(function() {
    codeboyPosition.y -= 10;
    rerender()
    counter++;
    keyCombo = []
    if(counter === 7 && momentum == "right") {
      console.log("jump right")
      clearInterval(interval);
      setTimeout(function(){ land(10) }, 60);
      codeboyPosition.x += 30;
    } else if (counter === 7 && momentum == "left") {
      console.log("jump left")
      clearInterval(interval);
      setTimeout(function(){ land(10) }, 60);
      codeboyPosition.x -= 30;
    } else if (counter === 7) {
      console.log("jump up")
      clearInterval(interval);
      setTimeout(function(){ land(10) }, 60);
    }
  }, 30);
}

function land() {
  var counter = 0;
  var interval = setInterval(function() {
    codeboyPosition.y += 10;
    rerender()
    counter++;
    if(counter === 7) {
      clearInterval(interval);
    }
  }, 30);
}

function moveBoy() {
  console.log(keyCombo)
  if (keyCombo[0] === 38 && keyCombo[1] === 39) {
    jump("right");
  } else if (keyCombo[0] === 38 && keyCombo[1] === 37) {
    jump("left");
  } else if (keyCombo.includes(38)) {
    jump();
  }

  switch (direction) {
    case "down":
      codeboyPosition.y += 0;
      rerender()
      break;
    case "left":
      codeboyPosition.x -= 15;
      rerender()
      break;
    case "right":
      codeboyPosition.x += 15;
      rerender()
      break;
  }
};

function inputKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    e.preventDefault();
    direction = "up";
    keyCombo[0]= e.keyCode;
    moveBoy()
  }
  else if (e.keyCode == '40') {
    e.preventDefault();
    direction = "down";
    keyCombo[0]= e.keyCode;
    moveBoy()
  }
  else if (e.keyCode == '37') {
    e.preventDefault();
    direction = "left";
    keyCombo[1]= e.keyCode;
    moveBoy()
  }
  else if (e.keyCode == '39') {
    e.preventDefault();
    direction = "right";
    keyCombo[1]= e.keyCode;
    moveBoy()
  }
};

document.onkeydown = inputKey;

rerender()

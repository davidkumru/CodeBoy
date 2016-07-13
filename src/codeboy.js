var canvas = document.getElementById("level");
var context = canvas.getContext("2d");

var world = {x: 0, y: 300, width: 900, height: 100, color: "#A1D490"};
var codeboyPosition = {x: 30, y: 240, width: 30, height: 60, color: "black"};
var direction = "";

renderBlock(codeboyPosition);
renderBlock(world);

function renderBlock(position) {
  context.fillStyle = position.color;
  context.fillRect(position.x, position.y, position.width, position.height);
};

function moveBoy() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  switch (direction) {
    case "up":
      for (i = 0; i < 3; i++) {
        setTimeout(function() { console.log("test");}, 1000);
        context.clearRect(0, 0, canvas.width, canvas.height);
        codeboyPosition.y -= 20;
        renderBlock(codeboyPosition);
        renderBlock(world);
      }
      break;
    case "down":
      break;
    case "left":
      codeboyPosition.x -= 30;
      renderBlock(codeboyPosition);
      renderBlock(world);
      break;
    case "right":
      codeboyPosition.x += 30;
      renderBlock(codeboyPosition);
      renderBlock(world);
      break;
  }
};

function inputKey(e) {
  e = e || window.event;
  if (e.keyCode == '38') {
    e.preventDefault();
    direction = "up";
    moveBoy()
  }
  else if (e.keyCode == '40') {
    e.preventDefault();
    direction = "down";
  }
  else if (e.keyCode == '37') {
    e.preventDefault();
    direction = "left";
    moveBoy()
  }
  else if (e.keyCode == '39') {
    e.preventDefault();
    direction = "right";
    moveBoy()
  }
};

document.onkeydown = inputKey;

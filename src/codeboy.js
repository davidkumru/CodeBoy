var canvas = document.getElementById("level");
var context = canvas.getContext("2d");

var skye = {x: 0, y: 0, width: 900, height: 400, color: "#9FABCF"};
var world = {x: 0, y: 300, width: 900, height: 100, color: "#A1D490"};
var codeboyPosition = {x: 30, y: 240, width: 30, height: 60, color: "black"};
var direction = "";
var imageSun = new Image();
var imageGrass = new Image();

renderBlock(skye);
renderBlock(world);
renderBlock(codeboyPosition);

function renderBlock(position) {
  context.fillStyle = position.color;
  context.fillRect(position.x, position.y, position.width, position.height);

  imageGrass.src = 'img/marioug.png';
  context.drawImage(imageGrass, 0, 300, 900, 100);

  imageSun.src = 'img/sun2.png';
  context.drawImage(imageSun, 800, 0, 100, 100);
};

function moveBoy() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  switch (direction) {

    case "up":
      var counter = 0;
      var i = setInterval(function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        codeboyPosition.y -= 5;
        renderBlock(skye);
        renderBlock(world);
        renderBlock(codeboyPosition);
          counter++;
          if(counter === 12) {
              clearInterval(i);
          }
      }, 12);
    break;

    case "down":
    break;

    case "left":
      codeboyPosition.x -= 30;
      renderBlock(skye);
      renderBlock(world);
      renderBlock(codeboyPosition);
    break;

    case "right":
      codeboyPosition.x += 30;
      renderBlock(skye);
      renderBlock(world);
      renderBlock(codeboyPosition);
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

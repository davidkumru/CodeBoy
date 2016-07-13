var canvas = document.getElementById("level");
var context = canvas.getContext("2d");

var skye = {x: 0, y: 0, width: 900, height: 400, color: "#9FABCF"};
var world = {x: 0, y: 300, width: 900, height: 100, color: "#A1D490"};
var codeboyPosition = {x: 30, y: 240, width: 30, height: 60, color: "black"};
var direction = "";
var imageSun = new Image();
var imageGrass = new Image();
// var imageSkye = new Image();

renderBlock(skye);
renderBlock(world);
renderBlock(codeboyPosition);

function renderBlock(position) {
  context.fillStyle = position.color;
  context.fillRect(position.x, position.y, position.width, position.height);

  // imageSkye.onload = function() {
  //   context.drawImage(imageSkye, 0, 0, 1100, 200);
  // };
  // imageSkye.src = 'img/skye.png';

  imageGrass.onload = function() {
    context.drawImage(imageGrass, -70, 270, 1100, 200);
  };
  imageGrass.src = 'img/grass.png';

  imageSun.onload = function() {
    context.drawImage(imageSun, 825, 25, 50, 50);
  };
  imageSun.src = 'img/sun.png';

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

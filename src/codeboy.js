var canvas = document.getElementById("level");
var context = canvas.getContext("2d");

var sky = {x: 0, y: 0, width: 900, height: 400, color: "#9FABCF"};
var world = {x: 0, y: 300, width: 900, height: 100, color: "#A1D490"};
var direction = "";
var keyCombo = [];
var landed = true
var imageSun = new Image();
var imageBackg = new Image();
var imageGrass = new Image();
var imageCanon = new Image();
var imageBullet = new Image();
var imageBulletPosition = [635, 273, 19, 19];
var imageFlying = new Image();
var imageFlyingPosition = [830, -30, 30, 30];
var imageBoy = new Image();
var imageBlock = new Image();
var imageBoyPosition = [30, 240, 30, 60];
var blockOne = {x: 90, y: 240, width: 30, height: 60, color: "black"};
var audio = new Audio("img/Mario-jump-sound.mp3");

function rerender() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  renderBlock(sky);
  renderBlock(world);
  renderBlock(blockOne);
}

function renderBlock(position) {
  context.fillStyle = position.color;
  context.fillRect(position.x, position.y, position.width, position.height);

  imageBackg.src = 'img/marioworld.png';
  context.drawImage(imageBackg, 0, -10, 900, 600);

  imageGrass.src = 'img/marioug.png';
  context.drawImage(imageGrass, 0, 300, 900, 100);

  imageSun.src = 'img/sun2.png';
  context.drawImage(imageSun, 800, 0, 100, 100);

  imageCanon.src = 'img/BillBlasterPM.png';
  context.drawImage(imageCanon, 650, 271, 32, 32);

  imageBullet.src = 'img/bullet.png';
  context.drawImage(imageBullet, imageBulletPosition[0], imageBulletPosition[1], imageBulletPosition[2], imageBulletPosition[3]);

  imageBlock.src = 'img/block.png';
  context.drawImage(imageBlock, 90, 240, 30, 30);
  context.drawImage(imageBlock, 90, 270, 30, 30);

  imageBoy.src = 'img/SMB3_Smallmario.png';
  context.drawImage(imageBoy, imageBoyPosition[0], imageBoyPosition[1], imageBoyPosition[2], imageBoyPosition[3]);

  imageFlying.src = 'img/vlieg.png';
  context.drawImage(imageFlying, imageFlyingPosition[0], imageFlyingPosition[1], imageFlyingPosition[2], imageFlyingPosition[3]);
};

function shot() {
  var counter = 0;
  var interval = setInterval(function() {
    imageBulletPosition[0] -= 3;
    rerender()
    counter++;
    if(counter === 172){
      imageBulletPosition[0] += 516;
      counter -= 172;
    }
    //if (_.range(imageBoyPosition[0] - 30, imageBoyPosition + 30 + 1).includes(imageBulletPosition[0]) && _.range(imageBoyPosition[1], imageBoyPosition[1] + 40).includes(imageBulletPosition[1])) {
    //window.location.reload();
    //}
  }, 10);
}

function flyingthing() {
  var counter = 0;
  var interval = setInterval(function() {
    imageFlyingPosition[0] -= 3;
    imageFlyingPosition[1] += 2;
    rerender()
    counter++;
    if(counter === 220){
      imageFlyingPosition[0] += 660;
      imageFlyingPosition[1] -= 440;
      counter -= 220;
    }
  }, 20);
}

function checkCollision(momentum) {
  if (_.range(blockOne.x - 30, blockOne.x + 30 + 1).includes(imageBoyPosition[0])) {
    if (momentum === "left" && imageBoyPosition[0] > blockOne.x + 15 + 1) {
      console.log("left hit")
      return true
    } else if (momentum === "right" && imageBoyPosition[0] < blockOne.x - 15) {
      console.log("right hit")
      return true
    } else if (momentum === "land" && imageBoyPosition[1] < blockOne.y + blockOne.height) {
      console.log("land hit")
      return true
    } else {
      return false
    }
  }
}

function jump(momentum) {
  landed = false
  var counter = 0;
  audio.play();
  var interval = setInterval(function() {
    imageBoyPosition[1] -= 10;
    rerender()
    counter++;
    if(counter === 6 && momentum === "right") {
      clearInterval(interval);
      setTimeout(function(){ land() }, 60);
      imageBoyPosition[0] += 60;
    } else if (counter === 6 && momentum === "left") {
      clearInterval(interval);
      setTimeout(function(){ land() }, 60);
      imageBoyPosition[0] -= 60;
    } else if (counter === 6) {
      clearInterval(interval);
      setTimeout(function(){ land() }, 60);
    }
  }, 30);
}

function land() {
  var interval = setInterval(function() {
    if (!checkCollision("land") && imageBoyPosition[1] < 240) {
      imageBoyPosition[1] += 10;
    }
    if(imageBoyPosition[1] >= 240) {
      clearInterval(interval);
    }
    rerender()
    landed = true;
  }, 30);
}

function moveBoy() {
  if (keyCombo[0] === 38 && keyCombo[1] === 39) {
    jump("right");
    keyCombo = []
  } else if (keyCombo[0] === 38 && keyCombo[1] === 37) {
    jump("left");
    keyCombo = []
  } else if (keyCombo.includes(38)) {
    jump();
    keyCombo = []
  } else if (keyCombo.includes(37)) {
    if (!checkCollision("left")) {
      imageBoyPosition[0] -= 15;
    }
    rerender()
  } else if (keyCombo.includes(39)) {
    if (!checkCollision("right")) {
      imageBoyPosition[0] += 15;
    }
    rerender()
  }
};

function inputKey(e) {
  if (landed === true) {
    e = e || window.event;
    if (e.keyCode == '38') {
      e.preventDefault();
      direction = "up";
      keyCombo[0]= e.keyCode;
      moveBoy()
    }
    //else if (e.keyCode == '40') {
    //e.preventDefault();
    //direction = "down";
    //keyCombo[0]= e.keyCode;
    //}
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
  }
};

document.onkeydown = inputKey;

rerender();

shot();

flyingthing();

//canvas variables
var canvas = document.getElementById("level");
var context = canvas.getContext("2d");

//movement variables
var landed = true
var keyCombo = [];

//background images
var imageBackg = new Image();
imageBackg.src = 'img/marioworld.png';
var imageGround = new Image();
imageGround.src = 'img/marioug.png';
var imageSun = new Image();
imageSun.src = 'img/sun2.png';

//foreground images
var imageCannon = new Image();
imageCannon.src = 'img/BillBlasterPM.png';
var imageBullet = new Image();
imageBullet.src = 'img/bullet.png';
var imageBlock = new Image();
imageBlock.src = 'img/block.png';
var imageBoy = new Image();
imageBoy.src = 'img/SMB3_Smallmario.png';
var imageBoyPosition = [30, 240, 30, 60];

//jumpSound
var jumpSound = new Audio("img/Mario-jump-sound.mp3");
var theme = new Audio("img/theme.mp3");
var death = new Audio("img/death.mp3");
var cannon = new Audio("img/cannon.wav");
var stomp = new Audio("img/stomp.wav");

//level objects
ground = [{x: 0, y: 300, width: 900, height: 100, image: imageGround, name: "ground"}]
blocks = [{x: 90, y: 270, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 180, y: 270, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 210, y: 240, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 300, y: 180, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 390, y: 150, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 450, y: 210, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 550, y: 210, width: 30, height: 30, image: imageBlock, name: "block"}]
cannons = [{x: 650, y: 270, width: 30, height: 30, image: imageCannon, name: "cannon"}]
cannonbullets = [{x: 640, y: 270, width: 20, height: 20, image: imageBullet, name: "bullet"}]

levelObjects = [blocks, cannons, cannonbullets, ground]

function rerender() {
  context.drawImage(imageBackg, 0, -10, 900, 600);
  context.drawImage(imageSun, 800, 0, 100, 100);

  for (i = 0; i < levelObjects.length; i++) {
    x = levelObjects[i]
    for (y = 0; y < x.length; y++) {
      item = x[y]
      context.drawImage(item.image, item.x, item.y, item.width, item.height)
    }
  }

  context.drawImage(imageBoy, imageBoyPosition[0], imageBoyPosition[1], imageBoyPosition[2], imageBoyPosition[3]);
  checkCollision()
};

function shot() {
  var counter = 0;
  var interval = setInterval(function() {
    cannonbullets[0].x -= 3;
    rerender()
    counter++;
    if(counter === 142){
      cannonbullets[0].x += 426
      counter -= 142;
      cannon.play();
    }
  }, 10);
}

function checkVerticalCollision() {
  var onTop = false
  for (i = 0; i < levelObjects.length; i++) {
    x = levelObjects[i]
    for (y = 0; y < x.length; y++) {
      item = x[y]
      rangeObjectX = _.range(item.x - 1, item.x + item.width + 1)
      rangeBoyX = _.range(imageBoyPosition[0], imageBoyPosition[0] + imageBoyPosition[2])
      rangeObjectY = _.range(item.y - 1, item.y + item.height + 1)
      rangeBoyY = _.range(imageBoyPosition[1], imageBoyPosition[1] + imageBoyPosition[3])

      if (findOne(rangeObjectX, rangeBoyX) && findOne(rangeObjectY, rangeBoyY)) {
        //if (findOne(rangeObjectX, rangeBoyX) && imageBoyPosition[1] + imageBoyPosition[3] === item.y) {
        onTop = true
        if (onTop && item.name === "bullet") {
          cannonbullets.splice(y, 1);
          stomp.play()
          land()
        }
      }
    }
  }
  return onTop
}

function checkCollision(momentum) {
  var onSide = false
  var blocked = false
  for (i = 0; i < levelObjects.length; i++) {
    x = levelObjects[i]
    for (y = 0; y < x.length; y++) {
      item = x[y]
      rangeObjectX = _.range(item.x - 1, item.x + item.width + 1)
      rangeBoyX = _.range(imageBoyPosition[0], imageBoyPosition[0] + imageBoyPosition[2])
      rangeObjectY = _.range(item.y, item.y + item.height)
      rangeBoyY = _.range(imageBoyPosition[1], imageBoyPosition[1] + imageBoyPosition[3])

      if (findOne(rangeObjectY, rangeBoyY) && findOne(rangeObjectX, rangeBoyX)) {
        onSide = true
        if (onSide && item.name === "bullet" && imageBoyPosition[1] + imageBoyPosition[3] > item.y) {
          theme.pause()
          death.play();
          landed = false
          setTimeout(function(){ window.location.reload() }, 3100);
        }
        if (momentum === "left" && imageBoyPosition[0] < item.x - 1) {
          blocked = false
        } else if (momentum === "right" && imageBoyPosition[0] + imageBoyPosition[2] > item.x + item.width + 1) {
          blocked = false
        } else {
          blocked = true
        }
      }
    }
  }
  return blocked
}

function findOne(rangeObject, rangeBoy) {
  return rangeBoy.some(function (v) {
    return rangeObject.indexOf(v) >= 0;
  });
};

function jump(momentum) {
  landed = false
  keyCombo = []
  var counter = 0;
  jumpSound.play();
  var interval = setInterval(function() {
    imageBoyPosition[1] -= 10;
    counter++;
    rerender()
    if (counter === 6) {
      jumpMove(momentum)
      clearInterval(interval);
    }
  }, 30);
}

function jumpMove(momentum) {
  if(momentum === "jumpright") {
    imageBoyPosition[0] += 60;
    setTimeout(function(){ land() }, 60);
  } else if (momentum === "jumpleft") {
    imageBoyPosition[0] -= 60;
    setTimeout(function(){ land() }, 60);
  } else if (momentum === "jumpup") {
    setTimeout(function(){ land() }, 60);
  }
}

function land() {
  var interval = setInterval(function() {
    if (!checkVerticalCollision()) {
      console.log("descend: ", !checkVerticalCollision())
      imageBoyPosition[1] += 10;
      rerender()
    }
    if(checkVerticalCollision()) {
      console.log("landed: ", checkVerticalCollision())
      landed = true;
      rerender()
      clearInterval(interval);
    }
  }, 30);
}

function moveBoy() {
  if (keyCombo[0] === 38 && keyCombo[1] === 39) {
    jump("jumpright");
  } else if (keyCombo[0] === 38 && keyCombo[1] === 37) {
    jump("jumpleft");
  } else if (keyCombo.includes(38)) {
    jump("jumpup");
  } else if (keyCombo.includes(37)) {
    if (!checkCollision("left")) {
      imageBoyPosition[0] -= 15;
      land()
    }
    rerender()
  } else if (keyCombo.includes(39)) {
    if (!checkCollision("right")) {
      imageBoyPosition[0] += 15;
      land()
    }
    rerender()
  }
  setTimeout(function(){ keyCombo = [] }, 30);
};

function inputKey(e) {
  if (landed === true) {
    e = e || window.event;
    if (e.keyCode == '38') {
      e.preventDefault();
      keyCombo[0]= e.keyCode;
      moveBoy()
    }
    //else if (e.keyCode == '40') {
    //e.preventDefault();
    //keyCombo[0]= e.keyCode;
    //}
    else if (e.keyCode == '37') {
      e.preventDefault();
      keyCombo[1]= e.keyCode;
      moveBoy()
    }
    else if (e.keyCode == '39') {
      e.preventDefault();
      keyCombo[1]= e.keyCode;
      moveBoy()
    }
  }
};

document.onkeydown = inputKey;

rerender();

theme.play();

shot();

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
var imageBulletPosition = [635, 273, 19, 19];
var imageBlock = new Image();
imageBlock.src = 'img/block.png';
var imageBoy = new Image();
imageBoy.src = 'img/SMB3_Smallmario.png';
var imageBoyPosition = [30, 240, 30, 60];
//var imageBird = new Image();
//imageBird.src = 'img/vlieg.png';
//var imageBirdPosition = [830, -30, 30, 30];

//jumpSound
var jumpSound = new Audio("img/Mario-jump-sound.mp3");

function rerender() {
  //level objects
  var ground = [{x: 0, y: 300, width: 900, height: 100, image: imageGround, name: "ground"}]
  var blocks = [{x: 90, y: 240, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 180, y: 240, width: 30, height: 30, image: imageBlock, name: "block"}]
  var cannons = [{x: 650, y: 271, width: 30, height: 30, image: imageCannon, name: "cannon"}]
  var cannonbullets = [{x: imageBulletPosition[0], y: imageBulletPosition[1], width: imageBulletPosition[2], height: imageBulletPosition[3], image: imageBullet, name: "bullet"}]
  //var birds = [{x: imageBirdPosition[0], y: imageBirdPosition[1], width: imageBirdPosition[2], height: imageBirdPosition[3], image: imageBird}]

  levelObjects = [ground, blocks, cannons, cannonbullets]

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
  }, 10);
}

//function flyingthing() {
//var counter = 0;
//var interval = setInterval(function() {
//imageBirdPosition[0] -= 3;
//imageBirdPosition[1] += 2;
//rerender()
//counter++;
//if(counter === 220){
//imageBirdPosition[0] += 660;
//imageBirdPosition[1] -= 440;
//counter -= 220;
//}
//}, 20);
//}


function checkVerticalCollision() {
  var onTop = false
  for (i = 0; i < levelObjects.length; i++) {
    x = levelObjects[i]
    for (y = 0; y < x.length; y++) {
      item = x[y]
      rangeObjectX = _.range(item.x - 1, item.x + item.width + 1)
      rangeBoyX = _.range(imageBoyPosition[0], imageBoyPosition[0] + imageBoyPosition[2])

      if (findOne(rangeObjectX, rangeBoyX) && imageBoyPosition[1] + imageBoyPosition[3] === item.y) {
        onTop = true
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
        console.log("on side: ", onSide)
        if (momentum === "left" && imageBoyPosition[0] < item.x - 1) {
          console.log("left hit")
          blocked = false
        } else if (momentum === "right" && imageBoyPosition[0] + imageBoyPosition[2] > item.x + item.width + 1) {
          console.log("right hit")
          blocked = false
        } else {
          blocked = true
        }
      }
    }
  }
  console.log("blocked: ", blocked)
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
    console.log("ascend: ", counter)
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

shot();

//flyingthing();

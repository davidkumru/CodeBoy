//canvas variables
var canvas = document.getElementById("level");
var context = canvas.getContext("2d");

//movement variables
var direction = "";
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
  var blocks = [{x: 90, y: 240, width: 30, height: 30, image: imageBlock, name: "block"}, {x: 180, y: 240, width: 30, height: 30, image: imageBlock, name: "block"}]
  var cannons = [{x: 650, y: 271, width: 30, height: 30, image: imageCannon, name: "cannon"}]
  var cannonbullets = [{x: imageBulletPosition[0], y: imageBulletPosition[1], width: imageBulletPosition[2], height: imageBulletPosition[3], image: imageBullet, name: "bullet"}]
  //var birds = [{x: imageBirdPosition[0], y: imageBirdPosition[1], width: imageBirdPosition[2], height: imageBirdPosition[3], image: imageBird}]

  levelObjects = [blocks, cannons, cannonbullets]

  context.drawImage(imageBackg, 0, -10, 900, 600);
  context.drawImage(imageGround, 0, 300, 900, 100);
  context.drawImage(imageSun, 800, 0, 100, 100);

  for (i = 0; i < levelObjects.length; i++) {
    x = levelObjects[i]
    for (y = 0; y < x.length; y++) {
      item = x[y]
      context.drawImage(item.image, item.x, item.y, item.width, item.height)
    }
  }

  context.drawImage(imageBoy, imageBoyPosition[0], imageBoyPosition[1], imageBoyPosition[2], imageBoyPosition[3]);

  //checkCollision()

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

function checkCollision(momentum) {
  var onTop = false
  var onSide = false
  var accept = false
  for (i = 0; i < levelObjects.length; i++) {
    x = levelObjects[i]
    for (y = 0; y < x.length; y++) {
      item = x[y]
      rangeObjectX = _.range(item.x - 1, item.x + item.width + 1)
      rangeBoyX = _.range(imageBoyPosition[0], imageBoyPosition[0] + imageBoyPosition[2])
      rangeObjectY = _.range(item.y, item.y + item.height)
      rangeBoyY = _.range(imageBoyPosition[1], imageBoyPosition[1] + imageBoyPosition[3])

      if (findOne(rangeObjectX, rangeBoyX) && imageBoyPosition[1] + imageBoyPosition[3] === item.y) {
        onTop = true
        console.log("on top: ", onTop)
        accept = true
      }
      if (findOne(rangeObjectY, rangeBoyY) && findOne(rangeObjectX, rangeBoyX)) {
        onSide = true
        console.log("on side: ", onSide)
        if (momentum === "left" && imageBoyPosition[0] < item.x) {
          console.log("left hit")
          accept = false
        } else if (momentum === "right" && imageBoyPosition[0] + imageBoyPosition[2] > item.x) {
          console.log("right hit")
          accept = false
        } else {
        accept = true
        }
      }
    }
  }
  console.log("accept: ", accept)
  return accept
}

function findOne(rangeObject, rangeBoy) {
  return rangeBoy.some(function (v) {
    return rangeObject.indexOf(v) >= 0;
  });
};

function jump(momentum) {
  landed = false
  var counter = 0;
  jumpSound.play();
  var interval = setInterval(function() {
    imageBoyPosition[1] -= 10;
    rerender()
    counter++;
    if(counter === 6 && momentum === "jumpright") {
      clearInterval(interval);
      setTimeout(function(){ land("jumpright") }, 60);
      imageBoyPosition[0] += 60;
    } else if (counter === 6 && momentum === "jumpleft") {
      clearInterval(interval);
      setTimeout(function(){ land("jumpleft") }, 60);
      imageBoyPosition[0] -= 60;
    } else if (counter === 6 && momentum === "jumpup") {
      clearInterval(interval);
      setTimeout(function(){ land("jumpup") }, 60);
    }
  }, 30);
}

function land(momentum) {
  var interval = setInterval(function() {
    if (!checkCollision("land") && imageBoyPosition[1] < 240) {
      console.log("land: ", !checkCollision(momentum))
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
    jump("jumpright");
    keyCombo = []
  } else if (keyCombo[0] === 38 && keyCombo[1] === 37) {
    jump("jumpleft");
    keyCombo = []
  } else if (keyCombo.includes(38)) {
    jump("jumpup");
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

//flyingthing();

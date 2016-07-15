// document.getElementById("myForm").submit();
//
// formObject.submit()

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
var imageCanon = new Image();
imageCanon.src = 'img/BillBlasterPM.png';
var imageBullet = new Image();
imageBullet.src = 'img/bullet.png';
var imageBulletPosition = [635, 273, 19, 19];
var imageBlock = new Image();
imageBlock.src = 'img/block.png';
var imageBoy = new Image();
imageBoy.src = 'img/SMB3_Smallmario.png';
var imageBoyPosition = [30, 240, 30, 60];
var imageBird = new Image();
imageBird.src = 'img/vlieg.png';
var imageBirdPosition = [830, -30, 30, 30];

//jumpSound
var jumpSound = new Audio("img/Mario-jump-sound.mp3");

//level objects
var blocks = [{x: 90, y: 240, width: 30, height: 30}, {x: 180, y: 240, width: 30, height: 30}]

var levelObjects = [blocks]

function rerender() {
  context.drawImage(imageBackg, 0, -10, 900, 600);
  context.drawImage(imageGround, 0, 300, 900, 100);
  context.drawImage(imageSun, 800, 0, 100, 100);

  context.drawImage(imageCanon, 650, 271, 32, 32);
  context.drawImage(imageBullet, imageBulletPosition[0], imageBulletPosition[1], imageBulletPosition[2], imageBulletPosition[3]);

  for (i = 0; i < blocks.length; i++) {
    context.drawImage(imageBlock, blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
    context.drawImage(imageBlock, blocks[i].x, blocks[i].y, blocks[i].width, blocks[i].height);
  }

  context.drawImage(imageBoy, imageBoyPosition[0], imageBoyPosition[1], imageBoyPosition[2], imageBoyPosition[3]);

  context.drawImage(imageBird, imageBirdPosition[0], imageBirdPosition[1], imageBirdPosition[2], imageBirdPosition[3]);
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
    imageBirdPosition[0] -= 3;
    imageBirdPosition[1] += 2;
    rerender()
    counter++;
    if(counter === 220){
      imageBirdPosition[0] += 660;
      imageBirdPosition[1] -= 440;
      counter -= 220;
    }
  }, 20);
}

function checkCollision(momentum) {
  for (i = 0; i < levelObjects.length; i++) {
    x = levelObjects[i]
    for (y = 0; y < x.length; y++) {
      item = x[y]
      if (_.range(item.x - item.width, item.x + item.width + 1).includes(imageBoyPosition[0])) {
        console.log(_.range(item.x - item.width, item.x + item.width + 1))
        console.log(imageBoyPosition[1] + imageBoyPosition[3])
        console.log(item.y)
        if (momentum === "left" && imageBoyPosition[0] > item.x + (item.width / 2) + 1) {
          console.log("left hit")
          return true
        } else if (momentum === "right" && imageBoyPosition[0] < item.x - (item.width / 2)) {
          console.log("right hit")
          return true
        } else if (momentum === "land" && imageBoyPosition[1] + imageBoyPosition[3] === item.y) {
          console.log("land hit")
          return true
        } else {
          return false
        }
      }
    }
  }
}

function jump(momentum) {
  landed = false
  var counter = 0;
  jumpSound.play();
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

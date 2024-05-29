//Canvas setup
const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
context.font = "35px Helvetica";
let gameSpeed = 1;
let gameOver = false;

//Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
};
canvas.addEventListener("mousedown", function (event) {
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
  console.log(mouse.x, mouse.y);
});
canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});

function refreshPage() {
  window.location.reload();
}
const button = document.getElementById("button1");
button.addEventListener("click", function () {
  refreshPage();
});

//Player
const playerLeft = new Image();
playerLeft.src = "shrimp_left.png";
const playerRight = new Image();
playerRight.src = "shrimp_right.png";

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.width;
    this.radius = 50;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }
  update() {
    const distanceX = this.x - mouse.x;
    const distanceY = this.y - mouse.y;
    let theta = Math.atan2(distanceY, distanceX);
    this.angle = theta;
    if (mouse.x != this.x) {
      this.x -= distanceX / 30;
    }
    if (mouse.y != this.y) {
      this.y -= distanceY / 30;
    }
    if (gameFrame % 50 == 0) {
      this.frame++;
      if (this.frame >= 12) {
        this.frame = 0;
      }
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) {
        this.frameY = 0;
      } else if (this.frame < 7) {
        this.frameY = 1;
      } else if (this.frame < 11) {
        this.frameY = 2;
      } else {
        this.frameY = 0;
      }
    }
  }
  draw() {
    if (mouse.click) {
      context.lineWidth = 0.2;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
    }
    /*context.fillStyle = "red";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.fillRect(this.x, this.y, this.radius, 10);*/

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    if (this.x >= mouse.x) {
      context.drawImage(
        playerLeft,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 65,
        0 - 40,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      context.drawImage(
        playerRight,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        0 - 65,
        0 - 40,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
    context.restore();
  }
}
const player = new Player();

//Bubbles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = "bubble.png";
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 2 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
  }
  update() {
    this.y -= this.speed;
    const distanceX = this.x - player.x;
    const distanceY = this.y - player.y;
    this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }
  draw() {
    /*context.fillStyle = "blue";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.stroke();*/
    context.drawImage(
      bubbleImage,
      this.x - 60,
      this.y - 60,
      this.radius * 2.3,
      this.radius * 2.3
    );
  }
}

const bubbleSound1 = document.createElement("audio");
bubbleSound1.src = "bubbleSound1.mp3";
const bubbleSound2 = document.createElement("audio");
bubbleSound2.src = "bubbleSound2.mp3";

function handleBubbles() {
  if (gameFrame % 100 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1);
      i--;
    } else if (
      bubblesArray[i].distance <
      bubblesArray[i].radius + player.radius
    ) {
      if (!bubblesArray[i].counted) {
        if (bubblesArray[i].sound == "sound1") {
          console.log(bubblesArray[i].sound);
          bubbleSound1.play();
        } else {
          console.log(bubblesArray[i].sound);
          bubbleSound2.play();
        }
        score += 10;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
        i--;
      }
    }
  }
}

//Reapating backgrounds
const background = new Image();
background.src = "background.png";

const bg = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

function handelBackground() {
  bg.x1 -= gameSpeed;
  if (bg.x1 < -bg.width) {
    bg.x1 = bg.width;
  }
  bg.x2 -= gameSpeed;
  if (bg.x2 < -bg.width) {
    bg.x2 = bg.width;
  }
  context.drawImage(background, bg.x1, bg.y, bg.width, bg.height);
  context.drawImage(background, bg.x2, bg.y, bg.width, bg.height);
}

//Enemies
const enemyImage = new Image();
enemyImage.src = "shark.png";

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.heght - 150) + 90;
    this.radius = 60;
    this.speed = Math.random() * 2 + 2;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.spriteWidth = 800;
    this.spriteHeight = 490;
  }
  draw() {
    // context.fillStyle = "red";
    // context.beginPath();
    // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // context.fill();
    context.drawImage(
      enemyImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 100,
      this.y - 85,
      this.spriteWidth / 3.5,
      this.spriteHeight / 3
    );
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() + 0.5 * 2;
    }

    if (gameFrame % 150 == 0) {
      this.frame++;
      if (this.frame >= 4) {
        this.frame = 0;
      }
      if (this.frame == 1 || this.frame == 3) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 2) {
        this.frameY = 0;
      } else if (this.frame < 3) {
        this.frameY = 1;
      } else {
        this.frameY = 0;
      }
    }
    //collision with player
    const distanceX = this.x - player.x;
    const distanceY = this.y - player.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (distance < this.radius + player.radius) {
      handleGameOver();
    }
  }
}

const enemy1 = new Enemy();
function handleEnemy() {
  enemy1.draw();
  enemy1.update();
}

function handleGameOver() {
  context.fillStyle = "white";
  context.fillText("Game Over, your score is " + score, 180, 250);
  gameOver = true;
}

//Animation Loop
function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  handelBackground();
  handleBubbles();
  player.update();
  player.draw();
  handleEnemy();
  context.fillStyle = "orange";
  context.fillText("SCORE: " + score, 15, 40);
  gameFrame++;
  if (!gameOver) {
    requestAnimationFrame(animate);
  }
}
animate();
window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});

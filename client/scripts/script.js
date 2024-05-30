//HTML Elements
const highscoreButton = document.getElementById("button2");
const scoreboard = document.getElementById("scoreboard");
const span = document.getElementsByClassName("close")[0];
const highscoreList = document.getElementById("highscoreList");
const closeSubmit = document.getElementById("closeSubmit");
const submit = document.getElementById("submit");
const submitInput = document.getElementById("modalInput");
const finalScore = document.getElementById("finalScore");

//Canvas setup
const canvas = document.getElementById("canvas1");
const context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
context.font = "35px Helvetica";

//Default variables
let score = 0;
let gameFrame = 0;
let gameSpeed = 1;
let gameOver = false;

//Pauseing the game function
function pausedGame() {
  gameOver = true;
  return;
}

//Unpausing the game function
function unpauseGame() {
  gameOver = false;
  animate();
}

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
});
canvas.addEventListener("mouseup", function () {
  mouse.click = false;
});

//Page refresh function
function refreshPage() {
  window.location.reload();
}
//Start the game again
const playAgain = document.getElementById("button1");
playAgain.addEventListener("click", function () {
  refreshPage();
});

//Player Sprite
const playerLeft = new Image();
playerLeft.src = "../client/images/shrimp_left.png";
const playerRight = new Image();
playerRight.src = "../client/images/shrimp_right.png";

//Playe Class
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
  //Player behaviour management
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

  //Drawing the players size
  draw() {
    if (mouse.click) {
      context.lineWidth = 0.2;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(mouse.x, mouse.y);
      context.stroke();
    }

    //Drawing the players sprite after the movement of the player
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

//Creating a player
const player = new Player();

//Bubbles Sprites
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = "../client/images/bubble.png";

//Bubble Class
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
  //Bubble behaviour management
  update() {
    this.y -= this.speed;
    const distanceX = this.x - player.x;
    const distanceY = this.y - player.y;
    this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }
  //Drawing the bubble's size
  draw() {
    context.drawImage(
      bubbleImage,
      this.x - 60,
      this.y - 60,
      this.radius * 2.3,
      this.radius * 2.3
    );
  }
}

//Spawning and destruciton of the bubbles
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
          bubbleSound1.play();
        } else {
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

//Music
const bubbleSound1 = document.createElement("audio");
bubbleSound1.src = "../client/sound/bubbleSound1.mp3";
const bubbleSound2 = document.createElement("audio");
bubbleSound2.src = "../client/sound/bubbleSound2.mp3";
const backgroundMusic = document.createElement("audio");
backgroundMusic.src = "../client/sound/gamemusic.mp3";

let musicOff = true;

//Turning music on and off
const music = document.getElementById("button6");
music.addEventListener("click", function () {
  console.log(musicOff);
  if (musicOff) {
    backgroundMusic.play();
    musicOff = false;
    return;
  } else if (!musicOff) {
    backgroundMusic.pause();
    musicOff = true;
    return;
  }
});

//Reapating backgrounds
const background = new Image();
background.src = "../client/images/background.png";

const bg = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

//Background Movement
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

//Enemie Sprite
const enemyImage = new Image();
enemyImage.src = "../client/images/shark.png";

//Enemy Class
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
  //Drawing the enemy's size
  draw() {
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

  //Enemy behaviour management
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
      showModal();
    }
  }
}

//Creating New Enemey
const enemy1 = new Enemy();
function handleEnemy() {
  enemy1.draw();
  enemy1.update();
}

//Gameover Screen
function handleGameOver() {
  context.fillStyle = "white";
  context.fillText("Game Over, your score is " + score, 180, 250);
  pausedGame();
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

//Start Animation
animate();

window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});

//Saving final score as a string
function showModal() {
  document.getElementById("finalScore").innerText = score.toString();
  document.getElementById("myModal").style.display = "block";
}

//Submiting final score
function submitModal() {
  let inputValue = document.getElementById("modalInput").value;
  alert("You entered: " + inputValue);
  closeModal();
}

//Highscore check
highscoreButton.addEventListener("click", async function () {
  try {
    const response = await fetch(
      "http://127.0.0.1:3000/getHighScoresAndUsername"
    );
    const highScores = await response.json();

    // Clear previous high scores
    highscoreList.innerHTML = "";

    //Creating banners for empty highscorelist
    if (highScores.message) {
      const li = document.createElement("li");
      li.textContent = `${highScores.message}`;
      highscoreList.appendChild(li);
      scoreboard.style.display = "block";
      pausedGame();
      return;
    }

    // Populate the scoreboard with high scores
    highScores.forEach((score) => {
      const li = document.createElement("li");
      li.textContent = `${score.username}: ${score.score}`;
      highscoreList.appendChild(li);
    });

    // Showing the scoreboard
    scoreboard.style.display = "block";
    pausedGame();
    return;
  } catch (error) {
    console.error("Error fetching high scores:", error);
  }
});

// When the user clicks on (x), close the scoreboard
span.onclick = function () {
  scoreboard.style.display = "none";
  unpauseGame();
  return;
};

//Closing the submit screen
closeSubmit.onclick = function () {
  myModal.style.display = "none";
};

//Submiting Username and Highscore
submit.addEventListener("click", async function () {
  const data = {
    username: submitInput.value,
    score: parseInt(finalScore.valueOf().innerHTML),
  };
  if (!data.username) {
    alert("Please enter a username!");
    return;
  }
  try {
    const response = await fetch(
      "http://127.0.0.1:3000/newHighscoreAndUsername",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      }
    );
    const result = await response.json();
    alert(result.message);

    // Remove submit
    myModal.style.display = "none";
    location.href = "startPage.html";

    //Error maneging
  } catch (error) {
    console.error("Error fetching high scores:", error);
  }
});

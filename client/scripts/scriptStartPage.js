///HTML Elements
const highscoreButton = document.getElementById("button2");
const scoreboard = document.getElementById("scoreboard");
const span = document.getElementsByClassName("close")[0];
const highscoreList = document.getElementById("highscoreList");
const howToPlayButton = document.getElementById("button4");
const howToPlay = document.getElementById("howToPlay");
const closeHowToPlayBtn = document.getElementsByClassName("close-howToPlay")[0];
const howToPlayImage = document.getElementById("howToPlayImage");
const myModal = document.getElementById("myModal");

//Highscore Button
highscoreButton.addEventListener("click", async function () {
  try {
    const response = await fetch(
      "http://127.0.0.1:3000/getHighScoresAndUsername"
    );
    const highScores = await response.json();

    // Clear previous high scores
    highscoreList.innerHTML = "";

    if (highScores.message) {
      const li = document.createElement("li");
      li.textContent = `${highScores.message}`;
      highscoreList.appendChild(li);
      scoreboard.style.display = "block";
    }

    // Populate the scoreboard with high scores
    highScores.forEach((score) => {
      const li = document.createElement("li");
      li.textContent = `${score.username}: ${score.score}`;
      highscoreList.appendChild(li);
    });

    // Show the scoreboard
    scoreboard.style.display = "block";
  } catch (error) {
    console.error("Error fetching high scores:", error);
  }
});

// When the user clicks on <span> (x), close the scoreboard
span.onclick = function () {
  scoreboard.style.display = "none";
};

// When the user clicks anywhere outside of the scoreboard, close it
window.onclick = function (event) {
  if (event.target == scoreboard) {
    scoreboard.style.display = "none";
  } else if (event.target == howToPlay) {
    howToPlay.style.display = "none";
  }
};

//How to play
howToPlayButton.addEventListener("click", function () {
  howToPlayImage.src = "../client/images/howtoplay.png"; // Replace with your image URL
  howToPlay.style.display = "block";
});

closeHowToPlayBtn.onclick = function () {
  howToPlay.style.display = "none";
};

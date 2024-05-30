// Importing modules and initializing server
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

//Importing databas connection
const DatabaseHandler = require("./src/Classes/DatabaseHandler");
app.use(bodyParser.json());

//Fixing cores policy
app.use(
  cors({
    origin: ["http://127.0.0.1:5500"],
    credentials: true,
  })
);

//Fetching highscore list from database
app.get("/getHighScoresAndUsername", async (req, res) => {
  try {
    const highScore = new DatabaseHandler();
    const fetchedHighscores = await highScore.getHighScoresAndUsername();
    let highscoreList = [];
    let username;
    let score;

    fetchedHighscores.sort((a, b) => b.score - a.score);
    if (fetchedHighscores.length === 0) {
      res.send({ message: "HIGHSCORE LIST IS EMPTY" });
      return;
    } else if (fetchedHighscores.length < 10) {
      for (let i = 0; i < fetchedHighscores.length; i++) {
        username = fetchedHighscores[i].username;
        score = fetchedHighscores[i].score;
        highscoreList.push({ username: username, score: score });
      }
    } else {
      for (let i = 0; i < 10; i++) {
        username = fetchedHighscores[i].username;
        score = fetchedHighscores[i].score;
        highscoreList.push({ username: username, score: score });
      }
    }

    res.send(highscoreList);
  } catch (error) {
    console.error("Error creating new user", error);
    res.send({ error: error });
  }
});

//Inserting new highscore into database
app.post("/newHighscoreAndUsername", async (req, res) => {
  const { username, score } = req.body;

  try {
    const newUser = new DatabaseHandler();
    await newUser.saveHighscore(username, score);
    res.send({ message: "Highscore saved successfully." });
  } catch (error) {
    console.error("Error saving highscore", error);
    res.send({ error: error });
  }
});

//Starting server
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

//Creating a varible with database connection
const knex = require("../db/db");

//Database quary executor
class DatabaseHandler {
  constructor(userData) {
    this.knex = knex;
  }

  //Executing new entry into highscore table into database
  async saveHighscore(username, score) {
    try {
      return await this.knex("users_highscores").insert({
        username: username,
        score: score,
      });
    } catch (error) {
      console.error("Error submiting highscores", error);
      return { error: error };
    }
  }

  //Selecting user_highscore table from database
  async getHighScoresAndUsername() {
    try {
      return await this.knex("users_highscores").select("*");
    } catch (error) {
      console.error("Error getting highscores", error);
      return { error: error };
    }
  }
}

module.exports = DatabaseHandler;

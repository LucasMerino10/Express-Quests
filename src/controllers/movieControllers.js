const database = require("../../database");

const getMovies = (req, res) => {
  let sql = "SELECT * FROM movies";
  const sqlValues = [];
  if (req.query.title) {
    sql += " WHERE title LIKE ?";
    sqlValues.push(`%${req.query.title}%`);
  }
  if (req.query.director) {
    sqlValues.length
      ? (sql += " AND director LIKE ?")
      : (sql += " WHERE director LIKE ?");
    sqlValues.push(`%${req.query.director}%`);
  }
  if (req.query.max_year) {
    sqlValues.length ? (sql += " AND year <= ?") : (sql += " WHERE year <= ?");
    sqlValues.push(req.query.max_year);
  }
  if (req.query.min_year) {
    sqlValues.length ? (sql += " AND year >= ?") : (sql += " WHERE year >= ?");
    sqlValues.push(req.query.min_year);
  }
  if (req.query.color) {
    sqlValues.length ? (sql += " AND color = ?") : (sql += " WHERE color = ?");
    sqlValues.push(req.query.color);
  }
  if (req.query.max_duration) {
    sqlValues.length
      ? (sql += " AND duration <= ?")
      : (sql += " WHERE duration <= ?");
    sqlValues.push(req.query.max_duration);
  }
  if (req.query.min_duration) {
    sqlValues.length
      ? (sql += " AND duration >= ?")
      : (sql += " WHERE duration >= ?");
    sqlValues.push(req.query.min_duration);
  }
  database
    .query(
      sql,
      sqlValues.map((value) => value)
    )
    .then(([movies]) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("SELECT * FROM movies WHERE id= ?", [id])
    .then(([movies]) => {
      if (movies[0]) {
        res.status(200).json(movies[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;
  database
    .query(
      "INSERT INTO movies (title, director, year, color, duration) VALUES(?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const putMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM movies WHERE id = ?", id)
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  putMovie,
  deleteMovie,
};

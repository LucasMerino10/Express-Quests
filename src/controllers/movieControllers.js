const database = require("../../database");

const getMovies = (req, res) => {
  database
    .query("SELECT * FROM movies")
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

  // const id = parseInt(req.params.id);

  // const movie = movies.find((movie) => movie.id === id);

  // if (movie != null) {
  //   res.json(movie);
  // } else {
  //   res.status(404).send("Not Found");
  // }
};

module.exports = {
  getMovies,
  getMovieById,
};

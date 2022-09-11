const Movie = require('../models/movie');
const {
  CREATE_STATUS,
} = require('../utils/status');
const UncorrectDataError = require('../utils/uncorrect-data-error');
const NotFoundError = require('../utils/not-found-error');
const ForbiddenError = require('../utils/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((cards) => res.status(CREATE_STATUS).send({ data: cards }))
    .catch((next));
};

module.exports.setMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.find({ owner: req.user._id, movieId }).then((movie) => {
    if (movie.length === 0) {
      Movie.create(
        {
          country,
          director,
          duration,
          year,
          description,
          image,
          trailerLink,
          thumbnail,
          owner: req.user._id,
          movieId,
          nameRU,
          nameEN,
        },
      ).then((movieCreated) => res.status(CREATE_STATUS).send({ data: movieCreated }));
    } else {
      throw new UncorrectDataError('Фильм уже добавлен');
    }
  }).catch(next);
};

module.exports.deleteMovies = (req, res, next) => {
  Movie.findOne({ movieId: req.params.moviesId }).then((movie) => {
    if (movie) {
      if (movie.owner._id.valueOf() === req.user._id) {
        Movie.findOneAndRemove({ movieId: req.params.moviesId })
          .then((movieRemoved) => {
            res.send({ data: movieRemoved });
          });
      } else {
        throw new ForbiddenError('Отказано в доступе');
      }
    } else {
      throw new NotFoundError('Запрашиваемый фильм не найден');
    }
  }).catch((err) => {
    if (err.name === 'CastError') {
      throw new UncorrectDataError('Передан некорректный id фильма');
    }
    next(err);
  }).catch(next);
};

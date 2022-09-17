const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getMovies,
  setMovies,
  deleteMovies,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');

router.get('/movies', auth, getMovies);
router.post('/movies', auth, celebrate({
  body: {
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
    trailerLink: Joi.string().required().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
    thumbnail: Joi.string().required().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  },
}), setMovies);
router.delete('/movies/:moviesId', auth, celebrate({
  params: {
    moviesId: Joi.number(),
  },
}), deleteMovies);

module.exports = router;

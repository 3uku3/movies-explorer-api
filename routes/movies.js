const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getMovies,
  setMovies,
  deleteMovies,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: {
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
    trailerLink: Joi.string().required().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
    thumbnail: Joi.string().required().regex(/^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/),
    movieId: Joi.string().required().alphanum().length(24)
      .hex(),
    nameRu: Joi.string().required(),
    nameEn: Joi.string().required(),
  },
}), setMovies);
router.delete('/:moviesId', celebrate({
  params: {
    moviesId: Joi.string().alphanum().length(24).hex(),
  },
}), deleteMovies);

module.exports = router;

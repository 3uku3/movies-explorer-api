const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      require: true,
    },
    director: {
      type: String,
      require: true,
    },
    duration: {
      type: Number,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      validate: {
        validator: (link) => /^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/g.test(link),
      },
      require: true,
    },
    trailerLink: {
      type: String,
      validate: {
        validator: (link) => /^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/g.test(link),
      },
      require: true,
    },
    thumbnail: {
      type: String,
      validate: {
        validator: (link) => /^http(s)?:\/\/((www.)?([\w-]+\.)+\/?)\S*$/g.test(link),
      },
      require: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    movieId: {
      type: Number,
      require: true,
    },
    nameRU: {
      type: String,
      require: true,
    },
    nameEN: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
  },
);
module.exports = mongoose.model('movie', movieSchema);

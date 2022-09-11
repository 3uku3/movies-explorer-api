const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const DeniedAccessError = require('../utils/denied-access-error');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      require: true,
      validate: {
        validator: isEmail,
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);
userSchema.statics.findUserByCredintials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new DeniedAccessError('Неверный email или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new DeniedAccessError('Неверный email или пароль');
        }
        return user;
      });
    });
};
module.exports = mongoose.model('user', userSchema);

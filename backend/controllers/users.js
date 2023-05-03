const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  let id;
  // eslint-disable-next-line no-unused-expressions
  req.params.id
    ? id = req.params.id
    : id = req.user._id;
  User.findById(id).orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      next(err);
    });
};

function refreshUserData(req, res, next, data) {
  User.findByIdAndUpdate(
    req.user._id,
    data,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
      }
      next(err);
    });
}

module.exports.patchUser = (req, res, next) => {
  const { name, about } = req.body;
  const data = { name, about };
  refreshUserData(req, res, next, data);
  // User.findByIdAndUpdate(
  //   req.user._id,
  //   data,
  //   {
  //     new: true,
  //     runValidators: true,
  //   },
  // )
  //   .then((user) => res.send(user))
  //   .catch((err) => {
  //     if (err instanceof mongoose.Error.ValidationError) {
  //       next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
  //     }
  //     next(err);
  //   });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  refreshUserData(req, res, next, { avatar });
  // User.findByIdAndUpdate(
  //   req.user._id,
  //   { avatar },
  //   {
  //     new: true,
  //     runValidators: true,
  //   },
  // )
  //   .then((user) => res.send(user))
  //   .catch((err) => {
  //     if (err instanceof mongoose.Error.ValidationError) {
  //       next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
  //     }
  //     next(err);
  //   });
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.send({ token });
        });
    })
    .catch(next);
};

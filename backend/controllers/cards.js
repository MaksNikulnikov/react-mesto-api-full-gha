const mongoose = require('mongoose');
const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).orFail()
    .then((searchedCard) => {
      if (!(String(req.user._id) === searchedCard.owner.toString())) {
        return Promise.reject(new ForbiddenError('Вы не можете удалить эту карту'));
      }
      return searchedCard.deleteOne().then(() => { res.send(searchedCard); });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Передан некорректный _id карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => card.populate('owner')
      .then((newCard) => res.send(newCard)))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

function handleLike(req, res, next, param) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    param,
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      } else if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные при постановке лайка.'));
      } else {
        next(err);
      }
    });
}

module.exports.likeCard = (req, res, next) => {
  handleLike(req, res, next, { $addToSet: { likes: req.user._id } });
};

module.exports.dislikeCard = (req, res, next) => {
  handleLike(req, res, next, { $pull: { likes: req.user._id } });
};

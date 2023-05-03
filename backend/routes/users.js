const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  patchUser,
  patchAvatar,
} = require('../controllers/users');
const { URL_REGEXP } = require('../utils');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().required().length(24),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEXP),
  }),
}), patchAvatar);

module.exports = router;

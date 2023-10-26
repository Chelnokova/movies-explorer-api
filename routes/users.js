const router = require('express').Router();
const { validationUpdateUser } = require('../utils/validation-joi');

const {
  getCurrentUser,
  updateUserProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', validationUpdateUser, updateUserProfile);

module.exports = router;

const router = require('express').Router();

const {
  validateCreateMovie,
  validationDeleteMovie,
} = require('../utils/validation-joi');

const {
  getSaveMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getSaveMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;

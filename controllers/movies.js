const Movie = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const OK_STATUS = 200;

const getSaveMovies = (req, res, next) => {
  Movie
    .find({ owner: req.user._id })
    .then((movies) => res.send(movies.reverse()))
    .catch(next);
};

// const createMovie = (req, res, next) => {
  // const {
  //   country,
  //   director,
  //   duration,
  //   year,
  //   description,
  //   image,
  //   trailerLink,
  //   thumbnail,
  //   movieId,
  //   nameRU,
  //   nameEN,
  // } = req.body;

  // console.log(req.user);

  // Movie.create({
  //   country,
  //   director,
  //   duration,
  //   year,
  //   description,
  //   image,
  //   trailerLink,
  //   thumbnail,
  //   // owner: req.user._id,
  //   movieId,
  //   nameRU,
  //   nameEN,
  // })
  //   .then((movie) => {
  //     res.send({ data: movie });
  //   })
  //   .catch((err) => {
  //     // console.log(err);
  //     if (err.name === 'ValidationError') {
  //       next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
  //     } else {
  //       next(err);
  //     }
  //   });
// };

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      } else if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалять карточки других пользователей.');
      }
      card.deleteOne()
        .then(() => {
          res.status(OK_STATUS).send({ message: 'Успешно удалено.' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getSaveMovies,
  createMovie,
  deleteMovie,
};

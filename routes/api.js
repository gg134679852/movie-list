const exrpess = require('express');
const router = exrpess.Router();
const passport = require('../config/passport')
const movieListControllers = require('../controllers/api/movieListControllers')
const userController = require('../controllers/api/userController')

const authenticated = passport.authenticate('jwt', { session: false })


router.get('/movieList', movieListControllers.getMovie)

router.get('/movieList/searchMovie',movieListControllers.searchMovie)

router.get('/movieList/favoriteMovies',authenticated, movieListControllers.getFavoriteMovies)

router.post('/movieList/addFavoriteMovie',authenticated, movieListControllers.addFavoriteMovie)

router.delete('/movieList/removeFavoriteMovie',authenticated,movieListControllers.removeFavoriteMovie)

router.get('/movieList/:id/detailed',movieListControllers.movieDetailed)

router.post('/movieList/signin', userController.signIn)

router.post('/movieList/signup', userController.signUp)

module.exports = router
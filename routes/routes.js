const exrpess = require('express');
const router = exrpess.Router();
const movieListControllers = require('../controllers/movieListControllers')

router.get('/',(req, res) => {
  res.redirect('/movieList');
});
router.get('/movieList', movieListControllers.getMovie)

router.get('/movieList/:id/detailed', movieListControllers.movieDetailed)

router.get('/movieList/cart',)

router.get('/movieList/movieScraper', movieListControllers.movieScraper)

module.exports = router
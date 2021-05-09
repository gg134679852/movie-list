const exrpess = require('express');
const router = exrpess.Router();
const movieListControllers = require('../controllers/movieListControllers')
const payControllers = require('../controllers/payControllers')

router.get('/',(req, res) => {
  res.redirect('/movieList');
});
router.get('/movieList', movieListControllers.getMovie)

router.get('/movieList/:id/detailed', movieListControllers.movieDetailed)

router.get('/movieList/cart', payControllers.getCart)

router.post('/movieList/cart', payControllers.postCart)

router.get('/movieList/movieScraper', movieListControllers.movieScraper)

module.exports = router
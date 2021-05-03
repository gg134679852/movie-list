const exrpess = require('express');
const router = exrpess.Router();
const movieListControllers = require('../controllers/movieListControllers')

router.get('/',(req, res) => {
  res.redirect('/movieList');
});
router.get('/movieList',movieListControllers.getMovie)

module.exports = router
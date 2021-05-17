const exrpess = require('express');
const router = exrpess.Router();
const movieListControllers = require('../controllers/api/movieListControllers')


router.get('/movieList', movieListControllers.getMovie)




module.exports = router
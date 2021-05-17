const exrpess = require('express');
const router = exrpess.Router();
const movieListControllers = require('../controllers/api/movieListControllers')

const payControllers = require('../controllers/api/payControllers')

router.get('/movieList', movieListControllers.getMovie)

router.get('/movieList/:id/detailed',movieListControllers.movieDetailed)

router.get('/movieList/cart', payControllers.getCart)

router.post('/movieList/cart', payControllers.postCart)

router.post('/cartItem/:id/add', payControllers.addCartItem)

router.post('/cartItem/:id/sub', payControllers.subCartItem)

router.delete('/cartItem/:id', payControllers.deleteCartItem)

router.post('/orders/:id', payControllers.cancelOrder)


module.exports = router
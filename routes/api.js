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

router.post('/cart/:id/add', payControllers.addCartItem)

router.post('/cart/:id/sub', payControllers.subCartItem)

router.delete('/cart/:id', payControllers.deleteCartItem)

router.get('/orders', payControllers.getOrders)

router.post('/orders', payControllers.postOrder)

router.post('/orders/:id', payControllers.cancelOrder)

router.get('/orders/:id/payment', payControllers.getPayment)

router.post('/spgateway/callback', payControllers.spgatewayCallback)

module.exports = router
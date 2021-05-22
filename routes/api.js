const exrpess = require('express');
const router = exrpess.Router();
const passport = require('../config/passport')
const movieListControllers = require('../controllers/api/movieListControllers')
const payControllers = require('../controllers/api/payControllers')
const userController = require('../controllers/api/userController')

const authenticated = passport.authenticate('jwt', { session: false })


router.get('/movieList', movieListControllers.getMovie)

router.get('/movieList/:id/detailed',movieListControllers.movieDetailed)

router.get('/movieList/cart', authenticated,payControllers.getCart)

router.post('/movieList/cart',payControllers.postCart)

router.post('/cartItem/:id/add',payControllers.addCartItem)

router.post('/cartItem/:id/sub', payControllers.subCartItem)

router.delete('/cartItem/:id', payControllers.deleteCartItem)

router.get('/orders', authenticated,payControllers.getOrders)

router.post('/orders', authenticated,payControllers.postOrder)

router.post('/orders/:id', authenticated,payControllers.cancelOrder)

router.get('/orders/:id/payment', authenticated,payControllers.getPayment)

router.post('/movieList/signin', userController.signIn)

router.post('/movieList/signup', userController.signUp)

router.post('/spgateway/callback', payControllers.spgatewayCallback)

module.exports = router
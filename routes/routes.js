const exrpess = require('express');
const router = exrpess.Router();
const passport = require('../config/passport')
const movieListControllers = require('../controllers/movieListControllers')
const payControllers = require('../controllers/payControllers')
const userController = require('../controllers/userController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/movieList/signin')
}


router.get('/',(req, res) => {
  res.redirect('/movieList')
})

router.get('/movieList', movieListControllers.getMovie)

router.get('/movieList/:id/detailed', movieListControllers.movieDetailed)

router.get('/movieList/cart', authenticated,payControllers.getCart)

router.post('/movieList/cart',payControllers.postCart)

router.post('/cartItem/:id/add', payControllers.addCartItem)

router.post('/cartItem/:id/sub', payControllers.subCartItem)

router.delete('/cartItem/:id', payControllers.deleteCartItem)

router.get('/orders', authenticated,payControllers.getOrders)

router.post('/orders', authenticated,payControllers.postOrder)

router.post('/orders/:id', authenticated,payControllers.cancelOrder)

router.get('/orders/:id/payment', authenticated, payControllers.getPayment)

router.post('/spgateway/callback', payControllers.spgatewayCallback)

router.get('/movieList/signup', userController.signUpPage)
router.post('/movieList/signup', userController.signUp)
router.get('/movieList/signin', userController.signInPage)
router.post('/movieList/signin', passport.authenticate('local', { failureRedirect: '/movieList/signin', failureFlash: true }), userController.signIn)

router.get('/movieList/logout', userController.logout)

module.exports = router
const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem
const { movieScraper, movieDatas} = require('../public/movie-data')
const movieListControllers = {
  getMovie: (req, res) => {
    if (req.session.cartId){
      return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items' }] }).then(cart => {
        cart = cart || { items: [] }
        let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
        return res.render('movieList', {
          movieDatas,
          cart: cart.toJSON(),
          totalPrice
        })
      })
    }else{
      res.render('movieList', { movieDatas })
    }
  },
  movieDetailed: (req, res)=>{
    const index = req.params.id -1
    const renderData = movieDatas[index]
    res.render('show', { renderData })
  },
  movieScraper: (req, res) => {
    movieScraper()
      .then(() => {
        res.redirect('back')
      })
    }
}

module.exports = movieListControllers
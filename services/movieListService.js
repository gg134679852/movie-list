const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const ScrapedDate = db.ScrapedDate
const moment = require('moment')
const momentDay = moment().format('L')
const { movieDatas, totalLength, movieScraper } = require('../public/movie-data')

const movieListService = {
  getMovie: (req, res,callback) => {
    if (movieDatas.length === totalLength[0]) {
      if (req.session.cartId) {
        return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items' }] }
        )
        .then(cart => {
          cart = cart || { items: [] }
          let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
          cart = cart.toJSON()
          return callback({
            movieDatas,
            cart,
            totalPrice: totalPrice,
          })
        })
      } else {
        callback({ movieDatas })
      }
    } else {
      ScrapedDate.findAll({
        raw: true,
        nest: true
      })
        .then((date) => {
          if (date[0].date !== momentDay || movieDatas.length === 0) {
            movieScraper()
          }
        })
    }
  },
  movieDetailed: (req, res, callback) => {
    const index = req.params.id - 1
    const renderData = movieDatas[index]
    callback({renderData})
  }
}

module.exports = movieListService
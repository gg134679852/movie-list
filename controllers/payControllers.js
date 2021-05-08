const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem
const Oder = db.Oder
const OderItem = db.OderItem
const Payment = db.Payment

const payControllers = {
  getCart:(req,res)=>{
    res.render('cart')
  },
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: 'items' }).then(cart => {
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart,
        totalPrice
      })
    })
  },
  postCart: (req, res) => {
    return Cart.findOrCreate({
      where: {
        id: req.session.cartId || 0,
      },
    }).spread(function (cart, created) {
      return CartItem.findOrCreate({
        where: {
          CartId: cart.id,
          ProductId: req.body.productId
        },
        default: {
          CartId: cart.id,
          ProductId: req.body.productId,
        }
      }).spread(function (cartItem, created) {
        return cartItem.update({
          quantity: (cartItem.quantity || 0) + 1,
        })
          .then((cartItem) => {
            req.session.cartId = cart.id
            return req.session.save(() => {
              return res.redirect('back')
            })
          })
      })
    });
  },
}

module.exports = payControllers
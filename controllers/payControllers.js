const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const Payment = db.Payment

const payControllers = {
  renderCart:(req,res)=>{
    res.render('cart')
  },
  getCart: (req, res) => {
    return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items' }] }).then(cart => {
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      return res.render('cart', {
        cart: cart.toJSON(),
        totalPrice
      })
    })
  },
  postCart: async (req, res, callback) => {
    try {
      const cart = await Cart.findOrCreate({ where: { id: req.session.cartId || 0 } })
      const { id: CartId } = cart[0].dataValues
      let cartItem = await CartItem.findOrCreate({
        where: {
          CartId,
          ProductId: req.body.productId
        },
        default: {
          CartId,
          ProductId: req.body.productId,
        }
      })
      await cartItem[0].update({
        quantity: (cartItem[0].dataValues.quantity || 0) + 1
      })
      req.session.cartId = CartId
      req.session.save()
      res.redirect('back')
    } catch (error) {
      console.log(error)
    }
  },
  addCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1,
      })
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  },
  subCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1,
      })
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  },
  deleteCartItem: (req, res) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.destroy()
        .then((cartItem) => {
          return res.redirect('back')
        })
    })
  },
  getOrders: (req, res) => {
    Order.findAll(
      {
        nest: true,
        include: [{ model: Product, as: 'items' }]}).then(orders => {
      return res.render('orders', {
        orders
      })
    })
  },
  postOrder: (req, res) => {
    return Cart.findByPk(req.body.cartId, { include: 'items' }).then(cart => {
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
      }).then(order => {
        const results = [];
        for (var i = 0; i < cart.items.length; i++) {
          results.push(
            OrderItem.create({
              OrderId: order.id,
              ProductId: cart.items[i].id,
              price: cart.items[i].price,
              quantity: cart.items[i].CartItem.quantity,
            })
          );
        }
        return Promise.all(results).then(() =>
          res.redirect('/orders')
        );

      })
    })
  },
  cancelOrder: (req, res) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return res.redirect('back')
      })
    })
  }
}

module.exports = payControllers
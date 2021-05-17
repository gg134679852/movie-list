const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const Payment = db.Payment
const { getTradeInfo, create_mpg_aes_decrypt} = require('../public/javascript/tradeinfo')

const payControllers = {
  getCart: (req, res,callback) => {
    return Cart.findByPk(req.session.cartId, { include: [{ model: Product, as: 'items' }] })
    .then(cart => {
      cart = cart || { items: [] }
      let totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
      cart = cart.toJSON()
      return callback({
        cart,
        totalPrice: totalPrice
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
      callback({ status: 'success', message: '' })
    } catch (error) {
      console.log(error)
    }
  },
  addCartItem: (req, res, callback) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity + 1,
      })
        .then((cartItem) => {
          callback({ status: 'success', message: '' })
        })
    })
  },
  subCartItem: (req, res, callback) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.update({
        quantity: cartItem.quantity - 1 >= 1 ? cartItem.quantity - 1 : 1,
      })
        .then((cartItem) => {
          return callback({ status: 'success', message: '' })
        })
    })
  },
  deleteCartItem: (req, res,callback) => {
    CartItem.findByPk(req.params.id).then(cartItem => {
      cartItem.destroy()
        .then((cartItem) => {
          return callback({ status: 'success', message: '' })
        })
    })
  },
  getOrders: (req, res, callback) => {
    Order.findAll(
      {
        nest: true,
        include: [{ model: Product, as: 'items' }]})
        .then(orders => {
          return callback({ orders })
      })
    },
  postOrder: (req, res, callback) => {
    return Cart.findByPk(req.body.cartId, { include: 'items' })
    .then(cart => {
      return Order.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        shipping_status: req.body.shipping_status,
        payment_status: req.body.payment_status,
        amount: req.body.amount,
      })
      .then(order => {
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
        return Promise.all(results).then(() =>{
          return callback({ status: 'success', message: '' })
        });
      })
    })
  },
  cancelOrder: (req, res, callback) => {
    return Order.findByPk(req.params.id, {}).then(order => {
      order.update({
        ...req.body,
        shipping_status: '-1',
        payment_status: '-1',
      }).then(order => {
        return callback({ status: 'success', message: '' })
      })
    })
  },
  getPayment: (req, res, callback) => {
    console.log('===== getPayment =====')
    console.log(req.params.id)
    console.log('==========')

    return Order.findByPk(req.params.id, {}).then(order => {
      const tradeInfo = getTradeInfo(order.amount, '電影票', order.email)
      order.update({
        ...req.body,
        sn: tradeInfo.MerchantOrderNo,
      })
      .then(order => {
        order = order.toJSON()
        return callback({ order, tradeInfo })
      })
    })
  },
  spgatewayCallback: (req, res, callback) => {
    console.log('===== spgatewayCallback =====')
    console.log(req.method)
    console.log(req.query)
    console.log(req.body)
    console.log('==========')

    console.log('===== spgatewayCallback: TradeInfo =====')
    console.log(req.body.TradeInfo)


    const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))

    console.log('===== spgatewayCallback: create_mpg_aes_decrypt、data =====')
    console.log(data)

    return Order.findAll({ where: { sn: data['Result']['MerchantOrderNo'] } }).then(orders => {
      orders[0].update({
        ...req.body,
        payment_status: 1,
      }).then(order => {
        return callback({ status: 'success', message: '' })
      })
    })

  }
}

module.exports = payControllers
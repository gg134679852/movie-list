const db = require('../../models')
const Product = db.Product
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const Payment = db.Payment
const { getTradeInfo, create_mpg_aes_decrypt} = require('../../public/javascript/tradeinfo')

const payService = require('../../services/payService')

const payControllers = {
  getCart: (req, res) => {
    payService.getCart(req,res,(data)=>{
      res.json(data)
    })
  },
  postCart: async (req, res, callback) => {
    payService.postCart(req, res, (data) => {
      res.json(data)
  })
},
  addCartItem: (req, res) => {
    payService.addCartItem(req, res, (data) => {
      res.json(data)
    })
  },
  subCartItem: (req, res) => {
    payService.subCartItem(req, res, (data) => {
      res.json(data)
    })
  },
  deleteCartItem: (req, res) => {
    payService.deleteCartItem(req, res, (data) => { res.json(data)})
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
        email: req.body.email,
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
  },
  getPayment: (req, res) => {
    console.log('===== getPayment =====')
    console.log(req.params.id)
    console.log('==========')

    return Order.findByPk(req.params.id, {}).then(order => {
      const tradeInfo = getTradeInfo(order.amount, '電影票', order.email)
      order.update({
        ...req.body,
        sn: tradeInfo.MerchantOrderNo,
      }).then(order => {
        res.render('payment', { order, tradeInfo })
      })
    })
  },
  spgatewayCallback: (req, res) => {
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
        return res.redirect('/orders')
      })
    })

  }
}

module.exports = payControllers
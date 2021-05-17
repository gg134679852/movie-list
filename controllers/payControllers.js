const payService = require('../services/payService')

const payControllers = {
  renderCart:(req,res)=>{
    res.render('cart')
  },
  getCart: (req, res) => {
    payService.getCart(req,res,(data)=>{
      const cartRenderData = data.cart
      const totalPrice = data.totalPrice
      res.render('cart', { cartRenderData, totalPrice})
    })
  },
  postCart: async (req, res, callback) => {
    payService.postCart(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },
  addCartItem: (req, res) => {
    payService.addCartItem(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },
  subCartItem: (req, res) => {
    payService.subCartItem(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },
  deleteCartItem: (req, res) => {
    payService.deleteCartItem(req,res,(data)=>{
      if (data['status'] === 'success') {
        return res.redirect('/movieList')
    }
  })
},
  getOrders: (req, res) => {
    payService.getOrders(req, res, (data) => {
      const orders = data.orders
      return res.render('orders', { orders})
    })
  },
  postOrder: (req, res) => {
    payService.postOrder(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/orders')
      }
    })
  },
  cancelOrder: (req, res) => {
    payService.postOrder(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  },
  getPayment: (req, res) => {
    payService.getPayment(req, res, (data) => {
      const order = data.order
      const tradeInfo = data.tradeInfo
      return res.render('payment', { order, tradeInfo })
    })
  },
  spgatewayCallback: (req, res) => {
    payService.spgatewayCallback(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/orders')
      }
    })
  }
}

module.exports = payControllers
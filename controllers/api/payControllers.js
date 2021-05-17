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
    payService.getOrders(req, res, (data) => { res.json(data) })
},
  postOrder: (req, res) => {
    payService.postOrder(req, res, (data) => { res.json(data) })
  },
  cancelOrder: (req, res) => {
    payService.cancelOrder(req, res, (data) => { res.json(data) })
  },
  getPayment: (req, res) => {
    payService.getPayment(req, res, (data) => { res.json(data) })
  },
  spgatewayCallback: (req, res) => {
    payService.spgatewayCallback(req, res, (data) => { res.json(data) })
  }
}

module.exports = payControllers
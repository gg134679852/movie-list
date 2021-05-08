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
  }
}

module.exports = payControllers
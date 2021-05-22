const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  // proFile: (req, res) => {
  //   return User.findByPk(req.params.id, {
  //     include: [
  //       { model: Comment, include: [Restaurant] }
  //     ]
  //   })
  //     .then((user) => {
  //       let commentLength = user.toJSON().Comments.length
  //       res.render('profile', { profile: user.toJSON(), restaurant: user.toJSON().Comments,commentLength})
  //     })
  // }
}
module.exports = userController
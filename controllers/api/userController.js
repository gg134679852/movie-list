const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User
const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.data.email || !req.body.data.password) {
      return res.json({ status: 'error', message: "電子郵件或密碼沒有輸入" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.data.email
    let password = req.body.data.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.json({ status: 'error', message: '找不到使用者' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: '密碼錯誤' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: '成功登陸',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    })
  },
  signUp: (req, res) => {
    if (req.body.data.confirmPassword !== req.body.data.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      User.findOne({ where: { email: req.body.data.email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        } else {
          User.create({
            name: req.body.data.name,
            email: req.body.data.email,
            password: bcrypt.hashSync(req.body.data.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  }
}

module.exports = userController

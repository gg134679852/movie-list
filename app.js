const express = require('express')
const methodOverride = require('method-override');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())

app.use(express.static('public'))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(cookieParser());
app.use(session({
  secret: 'user',
  name: 'user',
  cookie: { maxAge: 80000 },
  resave: false,
  saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())

app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`)
})
require('./routes')(app)

module.exports = app
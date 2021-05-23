const express = require('express')
const { urlencoded } = require('body-parser');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars')
const Promise = require('bluebird')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const passport = require('./config/passport')
const app = express()
const PORT = process.env.PORT || 3000
global.Promise = Promise
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main.handlebars',
    helpers: require('./config/handlebars-helpers')
  })
);
app.set('view engine', 'handlebars');
app.use(express.static('public'))
app.use(urlencoded({ extended: true }));
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

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  // res.locals.user = helpers.getUser(req)
  res.locals.user = req.user
  next()
})

app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`)
})
require('./routes')(app)

module.exports = app
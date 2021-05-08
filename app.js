const express = require('express')
const { urlencoded } = require('body-parser');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars')
const Promise = require('bluebird')
const session = require('express-session')
const cookieParser = require('cookie-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT

app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main.handlebars',
    // helpers: require('./config/handlebars-helpers'),
  })
);
global.Promise = Promise
app.set('view engine', 'handlebars');
app.use(express.static('public'))
// app.use('/img', express.static(__dirname + '/img'))
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
app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`)
})
require('./routes')(app)

module.exports = app
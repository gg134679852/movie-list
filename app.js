const express = require('express')
const { urlencoded } = require('body-parser');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars')
const Promise = require('bluebird')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')

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
app.use('/img', express.static(__dirname + '/img'))
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`)
})
require('./routes')(app)

module.exports = app
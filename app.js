const express = require('express')
const { urlencoded } = require('body-parser');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars')
const session = require('express-session');
const flash = require('connect-flash');
const Promise = require('bluebird')
const app = express()
const port = 3000
global.Promise = Promise
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main.handlebars',
    // helpers: require('./config/handlebars-helpers'),
  })
);
app.set('view engine', 'handlebars');
app.use(express.static('public'))
app.use('/img', express.static(__dirname + '/Img'))
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
require('./routes')(app)

module.exports = app
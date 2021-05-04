const express = require('express')
const { urlencoded } = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const app = express()
const port = 3000
const handlebars = require('express-handlebars')

// app.use(express.static(__dirname + '/public'));

app.use(express.static('public'))

// app.use('/img', express.static(__dirname + '/Img'))

app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main.handlebars',
    // helpers: require('./config/handlebars-helpers'),
  })
);
app.set('view engine', 'handlebars');
app.use(urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
require('./routes')(app)

module.exports = app
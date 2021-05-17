const routes = require('./routes');
const api = require('./api');

module.exports = (app) => {
  app.use('/', routes)
  app.use('/api', api)
}

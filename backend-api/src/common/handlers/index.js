const apiResponseHandler = require('./response-handler');
const CustomError = require('./custom-error');
const general = require('./general');
const Cruds = require('./Cruds');
const parseRoutes = require('./parse-routes');

module.exports = {
  ...apiResponseHandler,
  CustomError,
  ...general,
  Cruds,
  parseRoutes,
};

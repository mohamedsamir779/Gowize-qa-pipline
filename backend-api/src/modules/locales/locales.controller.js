const i18n = require('i18n');
const translator = require('../../common/handlers/translator');

module.exports.missingKeyHandler = (req, res, next) => {
  req.body && Object.keys(req.body).forEach((key) => {
    translator(req.params.lng, key);
  });
  return res.json && res.json({ status: true }) || res.send({ status: true });
};

module.exports.getResourcesHandler = (req, res, next) => {
  // console.log(i18n);
  if (req.params && req.params.lng) {
    return res.json(i18n.getCatalog(req.params.lng));
  }
  return res.send({});
};

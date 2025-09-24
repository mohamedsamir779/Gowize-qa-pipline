const i18n = require('i18n');

const translate = (lang, message) => {
  i18n.setLocale(lang);
  // eslint-disable-next-line no-underscore-dangle
  return i18n.__(message);
};

module.exports = translate;

const layout = require('./layout');
const layoutArabic = require('./layout-ar');
const layoutFarsi = require('./layout-fa');
const layoutSorani = require('./layout-so');
const layoutJapnese = require('./layout-jp');
const layoutChinese = require('./layout-zh');
const layoutSpanish = require('./layout-es');
const layoutRussian = require('./layout-ru');

const createContent = (content, lang = 'en') => {
  switch (lang) {
    case 'ar':
      return layoutArabic.replace(new RegExp('______CONTENT_______', 'gi'), content);/// RTL
    case 'fa':
      return layoutFarsi.replace(new RegExp('______CONTENT_______', 'gi'), content);/// RTL
    case 'so':
      return layoutSorani.replace(new RegExp('______CONTENT_______', 'gi'), content);/// RTL
    case 'jp':
      return layoutJapnese.replace(new RegExp('______CONTENT_______', 'gi'), content);/// LTR
    case 'es':
      return layoutSpanish.replace(new RegExp('______CONTENT_______', 'gi'), content);/// LTR
    case 'ru':
      return layoutRussian.replace(new RegExp('______CONTENT_______', 'gi'), content);/// LTR
    case 'zh':
      return layoutChinese.replace(new RegExp('______CONTENT_______', 'gi'), content);/// LTR
    default:
      return layout.replace(new RegExp('______CONTENT_______', 'gi'), content);/// LTR
  }
};

module.exports = {
  createContent,
};

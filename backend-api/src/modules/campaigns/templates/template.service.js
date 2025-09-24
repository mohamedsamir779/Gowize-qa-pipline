const { keys } = require('src/common/data');
const { createContent } = require('./templates-ui');

const replaceFieldValues = (content, fields = [], params = {}) => {
  if (fields) {
    fields.push('cpUrl');
    fields.push('crmUrl');
    fields.push('clientName');
    fields.push('customerSupportName');
  }
  params.cpUrl = keys.cpUrl;
  params.crmUrl = keys.crmUrl;
  params.clientName = keys.clientName;
  params.customerSupportName = keys.customerSupportName;

  let str = content;
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    str = str.replace(new RegExp(`_${field}_`, 'gi'), params[field] ? params[field] : `_${field}_`);
  }
  str = str.replace(new RegExp(`${'<p'}`, 'gi'), '<p style="margin:0px" ');
  return str;
};

module.exports.getSubjectBody = (record, params, lang = 'en') => ({
  subject: record.content[lang] ? replaceFieldValues(record.content[lang].subject, record.fields, params) : '',
  body: createContent(record.content[lang] ? replaceFieldValues(record.content[lang].body, record.fields, params) : '', lang),
});

module.exports.getBody = (body, fields, params, lang = 'en') => createContent(replaceFieldValues(body, fields, params), lang);

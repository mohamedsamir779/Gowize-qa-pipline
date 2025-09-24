/* eslint-disable no-console */
const fs = require('fs');
const fsp = require('fs').promises;

const generateModel = (name) => {
  console.log('generating model');
  return `
const {
  model, Schema,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const ModelSchema = new Schema({
  recordId: { type: Number },
},
{ timestamps: true });

ModelSchema.index({
  createdAt: 1,
});

ModelSchema.plugin(mongoosePaginate);
ModelSchema.plugin(AutoIncrement, {
  id: '${name}Counter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('${name}', ModelSchema);
module.exports.Schema = ModelSchema;
    `;
};

const modelName = process.argv[2];
if (!modelName || modelName === '') {
  console.group('Model name invalid');
  process.exit();
}
const model = generateModel(modelName);

(async () => {
  if (fs.existsSync(`./src/models/${modelName}.js`)) {
    console.log('Model already there');
    process.exit();
  }
  await fsp.appendFile(
    `./src/models/${modelName}.js`, model,
  );
  await fsp.appendFile(
    './src/models/index.js', `\nmodule.exports.${modelName} = require('./${modelName}');`,
  );
})();

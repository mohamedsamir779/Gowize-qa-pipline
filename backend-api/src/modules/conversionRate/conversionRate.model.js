const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { model, Schema } = mongoose;
const ConversionRateSchema = new Schema(
  {
    recordId: { type: Number },
    baseCurrency: { type: String, default: 'USD' },
    targetCurrency: { type: String },
    value: { type: String },
    isFromCRM: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ConversionRateSchema.plugin(mongoosePaginate);
ConversionRateSchema.plugin(AutoIncrement, {
  id: 'conversionRateCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('conversion-rate', ConversionRateSchema);
module.exports.Schema = ConversionRateSchema;

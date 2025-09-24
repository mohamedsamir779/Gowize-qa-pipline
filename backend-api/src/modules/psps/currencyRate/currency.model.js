const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { model, Schema } = mongoose;
const CurrencyRatesSchema = new Schema(
    {
        recordId: Number,
        baseCurrency: String,
        targetCurrency: String,
        value: Number,
        key: {
            type: String,
            unique: true,
        },
        gateways: Object,
    },
  { timestamps: true },
);

CurrencyRatesSchema.plugin(mongoosePaginate);
CurrencyRatesSchema.plugin(AutoIncrement, {
  id: 'currency-rates',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('currency-rates', CurrencyRatesSchema);
module.exports.Schema = CurrencyRatesSchema;

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { model, Schema } = mongoose;
const KlineSchema = new Schema(
  {
    recordId: { type: Number },
    s: { type: String, required: true },
    e: { type: String },
    t: { type: Number },
    o: { type: String },
    h: { type: String },
    l: { type: String },
    c: { type: String },
    v: { type: String },
    x: { type: Boolean, default: true },
    i: { type: String, default: '1m' },
  },
  { timestamps: false },
);

KlineSchema.plugin(mongoosePaginate);
KlineSchema.plugin(AutoIncrement, {
  id: 'klineCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('kline', KlineSchema);
module.exports.Schema = KlineSchema;

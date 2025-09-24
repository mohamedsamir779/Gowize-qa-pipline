const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { model, Schema } = mongoose;
const OrderBookSchema = new Schema(
  {
    recordId: { type: Number },
    pairName: { type: String, required: true },
    marketId: { type: mongoose.Types.ObjectId, required: true },
    lastUpdateId: { type: Number, default: 0 },
    bids: { type: Array },
    asks: { type: Array },
    buffer: { type: Array },
    exchange: { type: String },
  },
  { timestamps: true },
);

OrderBookSchema.plugin(mongoosePaginate);
OrderBookSchema.plugin(AutoIncrement, {
  id: 'orderBookCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('orderBook', OrderBookSchema);
module.exports.Schema = OrderBookSchema;

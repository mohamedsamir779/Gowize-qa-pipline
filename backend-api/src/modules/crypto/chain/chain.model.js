const {
  model, Schema,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const ChainSchema = new Schema({
  recordId: { type: Number },
  name: { type: String },
  cryptoapiName: { type: String },
  symbol: { type: String },
  active: {
    type: Boolean,
    default: true,
  },
  rpc: {
    host: { type: String },
    ws: { type: String },
    port: { type: String },
    user: { type: String },
    pass: { type: String },
    key: { type: String },
  },
  testnetRpc: {
    host: { type: String },
    ws: { type: String },
    port: { type: String },
    user: { type: String },
    pass: { type: String },
    key: { type: String },
  },
  blockchain: { type: String },
  address: { type: String },
  hasTokens: { type: Boolean, default: false },
},
  { timestamps: true });

ChainSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

ChainSchema.plugin(mongoosePaginate);
ChainSchema.plugin(AutoIncrement, {
  id: 'chainCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('chain', ChainSchema);
module.exports.Schema = ChainSchema;

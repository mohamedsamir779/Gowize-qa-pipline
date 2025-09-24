const {
  model, Schema,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const AddressSchema = new Schema({
  recordId: { type: Number },
  // assetId: { type: Schema.Types.ObjectId, required: true, ref: 'asset' },
  chainId: { type: Schema.Types.ObjectId, required: true, ref: 'chain' },
  address: { type: String },
  privateKey: { type: String },
  publicKey: { type: String },
  subscriptionReference: { type: String },
  coinSubscriptionReference: { type: String },
}, {
  timestamps: true,
});

AddressSchema.index({
  title: 1,
  createdAt: 1,
});

AddressSchema.plugin(mongoosePaginate);
AddressSchema.plugin(AutoIncrement, {
  id: 'addressCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('address', AddressSchema);
module.exports.Schema = AddressSchema;

const {
  model, Schema,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const AddressTrackerSchema = new Schema({
  recordId: { type: Number },
  symbol: { type: String },
  chainId: { type: Schema.Types.ObjectId, required: true, ref: 'chain' },
  address: [{ type: String }],
},
{ timestamps: true });

AddressTrackerSchema.index({
  title: 1,
  createdAt: 1,
});

AddressTrackerSchema.plugin(mongoosePaginate);
AddressTrackerSchema.plugin(AutoIncrement, {
  id: 'addressTrackerCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('address-tracker', AddressTrackerSchema);
module.exports.Schema = AddressTrackerSchema;

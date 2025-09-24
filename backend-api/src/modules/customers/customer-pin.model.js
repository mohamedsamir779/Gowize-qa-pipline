const { model, Schema } = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const mongoosePaginate = require('mongoose-paginate-v2');
const { PIN_TYPES, DEFAULT_PIN_TYPE } = require('../../common/data').CONSTANTS;

const CustomerPinSchema = new Schema(
  {
    recordId: { type: Number },
    value: { type: Number, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: false },

    isActive: { type: Boolean, default: true },
    pinType: { type: String, enum: PIN_TYPES, default: DEFAULT_PIN_TYPE },

  },
  { timestamps: true },
);
CustomerPinSchema.plugin(mongoosePaginate);
CustomerPinSchema.plugin(AutoIncrement, {
  id: 'customerPinCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});
module.exports.Model = model('customer-pins', CustomerPinSchema);
module.exports.Schema = CustomerPinSchema;

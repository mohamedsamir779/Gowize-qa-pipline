const { model, Schema, SchemaType } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const { CONSTANTS } = require('src/common/data');

const products = CONSTANTS.FOREX_SUPPORTED_PRODUCTS;

const getProductsSchema = () => {
  const dict = {};
  products.forEach((product) => {
    dict[product] = {
      rebate: { type: Number },
      commission: { type: Number },
    };
  });
  return dict;
};

const getTotalsSchema = () => ({
  rebate: { type: Number },
  commission: { type: Number },
  accountTypeId: { type: Schema.ObjectId, ref: 'TradingAccountType' },
});

const IbAgrementSchema = new Schema(
  {
    recordId: { type: Number },
    oldRecordId: { type: String },
    isMaster: { type: Boolean, default: true },
    title: { type: String, required: true },

    isHidden: { type: Boolean, default: false },
    totals: [getTotalsSchema()],
    members: [{
      customerId: { type: Schema.ObjectId, required: true, ref: 'customers' },
      ibMT5: { type: Number },
      ibMT4: { type: Number },
      walletId: { type: Schema.ObjectId, ref: 'Wallet' },
      level: { type: Number, default: 1 },
      values: [{
        accountTypeId: {
          type: Schema.ObjectId,
          ref: 'TradingAccountType',
        },
        rebate: { type: Number },
        commission: { type: Number },
        markup: { type: String },
        products: getProductsSchema(),
        group: { type: String },
      }],
    }],

  },
  { timestamps: true, strict: true },
);

IbAgrementSchema.plugin(mongoosePaginate);
IbAgrementSchema.plugin(AutoIncrement, {
  id: 'IbAgrementSchemaCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('IbAgrement', IbAgrementSchema);
module.exports.Schema = IbAgrementSchema;

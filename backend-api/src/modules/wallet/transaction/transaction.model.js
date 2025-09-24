const { model, Schema, Decimal128 } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const { CONSTANTS } = require('src/common/data');

const TransactionSchema = new Schema(
  {

    recordId: { type: Number },
    type: {
      type: String,
      enum: Object.keys(CONSTANTS.TRANSACTIONS_TYPES),
    },
    gateway: {
      type: String,
      enum: Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS),
    },
    status: {
      type: String,
      enum: Object.keys(CONSTANTS.TRANSACTIONS_STATUS),
      default: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'customers' },
    walletId: { type: Schema.Types.ObjectId, refPath: 'walletModel' },
    walletModel: {
      type: String,
      default: 'wallet',
      enum: ['wallet', 'demo-wallet'],
    },
    processedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    reason: { type: String },
    amount: { type: Decimal128, default: 0 },
    paid: { type: Decimal128, default: 0 },
    frozenAmount: { type: Decimal128, default: 0 },
    currency: { type: String, default: 'USD' },
    refrence: { type: String },
    txId: { type: String },
    from: { type: String },
    to: { type: String },
    fee: {
      currency: { type: String },
      cost: { type: Decimal128 },
    },
    fees: { type: Decimal128, default: 0 },
    mFee: {
      currency: { type: String },
      cost: { type: Decimal128 },
    },
    mFeeGroup: {
      value: { type: Decimal128 },
      minValue: { type: Decimal128 },
      maxValue: { type: Decimal128 },
      isPercentage: { type: Boolean },
    },
    note: { type: String },
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    rawData: {
      type: Schema.Types.Mixed,
    },
    testnet: {
      type: Boolean,
      default: false,
    },
    isApproving: {
      type: Boolean,
      default: false,
    },
    receipt: {
      type: String,
    },
    recievedTime: { type: Date },
    receivedTime: { type: Date },
    confirmedTime: { type: Date },
    confirmations: { type: Number, default: 0 },
    assetId: { type: Schema.Types.ObjectId, ref: 'asset' },
    addressId: { type: Schema.Types.ObjectId, ref: 'address' },
    chainId: { type: Schema.Types.ObjectId, ref: 'chain' },
    cryptoapiName: { type: String },
    withdrawalApprovalRequestId: { type: String },
    withdrawCallbackReferenceId: { type: String },
    blockChainReferenceId: { type: String },
    cryptoAPIRequestId: { type: String },
    cryptoAPIConfirmations: { type: Number },
    cryptoAPIRejections: { type: Number },
    crypto: { type: Boolean, default: false },
    content: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

TransactionSchema.index({
  type: 1,
  amount: 1,
  status: 1,
  customerId: 1,
  createdAt: 1,
});

TransactionSchema.plugin(mongoosePaginate);
TransactionSchema.plugin(aggregatePaginate);
TransactionSchema.plugin(AutoIncrement, {
  id: 'transactionCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('transaction', TransactionSchema);
module.exports.DemoModel = model('demo-transaction', TransactionSchema);
module.exports.Schema = TransactionSchema;

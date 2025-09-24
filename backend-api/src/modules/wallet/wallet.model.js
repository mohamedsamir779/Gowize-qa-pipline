const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { model, Schema } = mongoose;

const WalletSchema = new Schema({

  recordId: { type: Number },
  asset: {
    type: String,
    required: true,
  },
  assetId: {
    type: Schema.Types.ObjectId,
    ref: 'asset',
  },
  active: {
    type: Boolean,
    default: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  pk: {
    type: String,
  },
  puk: {
    type: String,
  },
  mnemonic: {
    type: String,
  },
  xpub: {
    type: String,
  },
  tatumVirtualId: {
    type: String,
  },
  isCrypto: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
  },
  freezeAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  belongsTo: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
  },
  derivationKey: {
    type: Number,
  },
  testnet: {
    type: Boolean,
    default: false,
  },
  networks: [{
    type: Schema.Types.ObjectId,
    ref: 'address',
  }],
  isIb: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

WalletSchema.plugin(mongoosePaginate);
WalletSchema.plugin(AutoIncrement, {
  id: 'walletCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('wallet', WalletSchema);
module.exports.DemoModel = model('demo-wallet', WalletSchema);
module.exports.Schema = WalletSchema;

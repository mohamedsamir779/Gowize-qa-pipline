/* eslint-disable indent */
const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Target = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    fx: {
      deposit: Number,
    },
    crypto: {
      deposit: Number,
    },
    accounts: Number,
    ibAccounts: Number,
    volume: Number,
}, { timestamps: true });

Target.plugin(mongoosePaginate);

module.exports.Model = model('target', Target);
module.exports.Schema = Target;

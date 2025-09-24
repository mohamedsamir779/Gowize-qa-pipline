/* eslint-disable indent */
const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const CompanyBankAccountSchema = new Schema({

    recordId: { type: Number },
    accountHolderName: {
        type: String,
        // required: true,
    },
    bankName: {
        type: String,
        // required: true,
    },
    accountNumber: {
        type: String,
        // required: true,
    },
    swiftCode: {
        type: String,
        // required: true,
    },
    address: {
        type: String,
        // required: true,
    },
    iban: {
        type: String,
        // required: true,
    },
    currency: {
        type: String,
        // required: true,
    },
     intermediaryBank: {
        type: String,
        // required: true,
    },
    intermediaryAccountNo: {
        type: String,
        // required: true,
    },
    intermediaryBankSwiftCode: {
        type: String,
        // required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
}, { timestamps: true });

CompanyBankAccountSchema.plugin(mongoosePaginate);
CompanyBankAccountSchema.plugin(AutoIncrement, {
  id: 'companyBankAccountCounter',
   inc_field: 'recordId',
  start_seq: 10000,
});
module.exports.Model = model('company-bank-accounts', CompanyBankAccountSchema);
module.exports.Schema = CompanyBankAccountSchema;

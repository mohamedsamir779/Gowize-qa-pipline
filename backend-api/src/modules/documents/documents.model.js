/* eslint-disable indent */
const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const { CONSTANTS } = require('src/common/data');

const DocumentSchema = new Schema({

    recordId: { type: Number },
    type: {
        type: String,
        required: true,
    },
    ipAddress: {type: String, required: false},
    subType: String,
    shareholderId: String,
    file1: { type: Object, required: true },
    file2: { type: Object, required: false },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'customers',
        required: true,
    },
    status: {
        type: String,
        enum: Object.keys(CONSTANTS.DCOUMENTS_STATUS),
        default: CONSTANTS.DCOUMENTS_STATUS.PENDING,
      },
    rejectionReason: { type: String },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false,
      },
    location: {
      type: String,
      default: 'azure',
    },
}, { timestamps: true });

DocumentSchema.plugin(mongoosePaginate);
DocumentSchema.plugin(AutoIncrement, {
  id: 'documentCounter',
   inc_field: 'recordId',
  start_seq: 10000,
});
// BankAccountSchema.index({ rec: 1 });
module.exports.Model = model('documents', DocumentSchema);
module.exports.Schema = DocumentSchema;

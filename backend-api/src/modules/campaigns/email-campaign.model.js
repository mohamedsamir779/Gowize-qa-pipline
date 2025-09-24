/* eslint-disable indent */

const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const EmailCampaigneSchema = new Schema({
    recordId: { type: Number },
    name: {
        type: String,
        required: true,
    },
    templateId: {
        type: Types.ObjectId,
        required: true,
        ref: 'campaign-template',
    },
    jobId: {
        type: Types.ObjectId,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    groups: [{
        name: { type: String, required: true },
        list: { type: Array, required: true },
    }],
    scheduleDate: {
        type: Date,
        required: true,
    },
    fromEmail: {
        type: String,
        required: true,
    },
    replyTo: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
}, { timestamps: true, strict: false });

EmailCampaigneSchema.plugin(mongoosePaginate);
EmailCampaigneSchema.plugin(AutoIncrement, {
    id: 'EmailCampaigneCounter',
    inc_field: 'recordId',
    start_seq: 1000,
  });

module.exports.Model = model('email-campaign', EmailCampaigneSchema);
module.exports.Schema = EmailCampaigneSchema;

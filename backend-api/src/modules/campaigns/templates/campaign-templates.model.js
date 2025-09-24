/* eslint-disable indent */

const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const emailBody = {
    type: {
      subject: { type: String, default: '' },
      body: { type: String, default: '' },
    },
};

const CampaignTemplateSchema = new Schema({
    recordId: { type: Number },
    title: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
    },
    fields: {
        type: Array,
        required: true,
        default: [],
    },
    content: {
        type: {
          ar: emailBody,
          en: emailBody,
        },
        default: {
            ar: { subject: '', body: '' },
            en: { subject: '', body: '' },
        },
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
}, { timestamps: true, strict: false });

CampaignTemplateSchema.plugin(mongoosePaginate);
CampaignTemplateSchema.plugin(AutoIncrement, {
    id: 'campaignTemplateCounter',
    inc_field: 'recordId',
    start_seq: 1000,
  });

module.exports.Model = model('campaign-template', CampaignTemplateSchema);
module.exports.Schema = CampaignTemplateSchema;

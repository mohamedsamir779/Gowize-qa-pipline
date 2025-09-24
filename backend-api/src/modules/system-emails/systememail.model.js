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

const EmailTemplateSchema = new Schema({
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
    action: {
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
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        // required: true,
      },
      userTemplate: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, strict: false });

EmailTemplateSchema.plugin(mongoosePaginate);
EmailTemplateSchema.plugin(AutoIncrement, {
    id: 'systemEmailCounter',
    inc_field: 'recordId',
    start_seq: 1000,
  });

module.exports.Model = model('system-email', EmailTemplateSchema);
module.exports.Schema = EmailTemplateSchema;

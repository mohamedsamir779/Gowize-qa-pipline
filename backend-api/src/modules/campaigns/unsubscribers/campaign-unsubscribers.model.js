/* eslint-disable indent */

const { model, Schema, Types } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const EmailCampaigneSchema = new Schema({
    recordId: { type: Number },
    customerId: {
        type: Types.ObjectId,
        required: true,
        unique: true,
        ref: 'customers',
    },
}, { timestamps: true, strict: false });

EmailCampaigneSchema.plugin(mongoosePaginate);
EmailCampaigneSchema.plugin(AutoIncrement, {
    id: 'CampaignUnsubscriberCounter',
    inc_field: 'recordId',
    start_seq: 1000,
  });

module.exports.Model = model('campaign-unsubscriber', EmailCampaigneSchema);
module.exports.Schema = EmailCampaigneSchema;

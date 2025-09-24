const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const UTMCampaignSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    urlType: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    fullUrl: {
      type: String,
      required: true,
    },
    demoBalance: { type: Number },
    recordId: { type: Number },
    isActive: { type: Boolean },
    accountGroups: { type: Object },
    campaginToken: { type: String, required: true, unique: true },
    source: { type: String, required: true },
    section: { type: String, required: true },
  }, { timestamps: true },
);

UTMCampaignSchema.index({
  login: 1,
  platform: 1,
  type: 1,
  createdAt: 1,
  customerId: 1,
});

UTMCampaignSchema.plugin(mongoosePaginate);
UTMCampaignSchema.plugin(aggregatePaginate);
UTMCampaignSchema.plugin(AutoIncrement, {
  id: 'utmCampaignCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.UTMCampaignModel = model('UtmCampaign', UTMCampaignSchema);
module.exports.UTMCampaignSchema = UTMCampaignSchema;

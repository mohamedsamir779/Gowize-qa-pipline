const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const SumsubCallbackSchema = new Schema(
  {
    recordId: { type: Number, default: 10000 },
    applicantId: { type: String },
    inspectionId: { type: String },
    applicationType: { type: String },
    correlationId: { type: String },
    levelName: { type: String },
    externalUserId: { type: String },
    type: { type: String },
    sandboxMode: { type: String },
    reviewStatus: { type: String },
    createdAtMs: { type: Date },
    clientId: { type: String },
    reviewResult: { type: Object },
  },
  { timestamps: true },
);

SumsubCallbackSchema.plugin(mongoosePaginate);
SumsubCallbackSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});
SumsubCallbackSchema.plugin(AutoIncrement, {
  id: 'sumsubCallbackSchemaCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('sumsub-events', SumsubCallbackSchema);
module.exports.Schema = SumsubCallbackSchema;

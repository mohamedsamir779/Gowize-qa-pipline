const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const TeamSchema = new Schema(
  {

    recordId: { type: Number },
    title: {
      type: String,
    },
    managerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  },
  { timestamps: true },
);

TeamSchema.plugin(mongoosePaginate);
TeamSchema.plugin(AutoIncrement, {
  id: 'teamCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('Team', TeamSchema);
module.exports.Schema = TeamSchema;

const {
  model, Schema,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const LogsSchema = new Schema({
  recordId: { type: Number },
  type: { type: String },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  // triggered by is 0 if a client/customer triggers the log and 1 if a crm user
  triggeredBy: {
    type: Number,
    enum: [0, 1, 2],
    default: null,
  },
  userLog: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    default: 0,
  },
  details: {
    type: Schema.Types.Mixed,
  },
  content: {
    type: Schema.Types.Mixed,
  },
},
{ timestamps: true });

LogsSchema.index({
  title: 1,
  createdAt: 1,
});

LogsSchema.plugin(mongoosePaginate);
LogsSchema.plugin(AutoIncrement, {
  id: 'logsCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('logs', LogsSchema);
module.exports.DemoModel = model('demo-logs', LogsSchema);
module.exports.Schema = LogsSchema;

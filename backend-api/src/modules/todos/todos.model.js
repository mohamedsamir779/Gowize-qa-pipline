const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const TodosSchema = new Schema({
  recordId: { type: Number },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: false,
  },
  timeEnd: {
    type: Date,
    required: false,
  },
  type: {
    type: Number,
    default: 0,
    enum: [0, 1, 2, 3],
  },
  byAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['open', 'ongoing', 'completed'],
    default: 'open',
  },
}, { timestamps: true });

TodosSchema.plugin(mongoosePaginate);
TodosSchema.plugin(AutoIncrement, {
  id: 'todosCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('todos', TodosSchema);
module.exports.Schema = TodosSchema;

const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const NotificationsSchema = new Schema(
  {
    recordId: { type: Number, default: 10000 },
    from: { type: Schema.Types.ObjectId, refPath: 'fromModel' },
    fromModel: {
      type: String,
      default: 'users',
      enum: ['users', 'customers'],
    },
    to: [{
      clientId: { type: Schema.Types.ObjectId, refPath: 'clientModel' },
      clientModel: {
        type: String,
        default: 'users',
        enum: ['users', 'customers'],
      },
      read: { type: Boolean, default: false },
      readTime: { type: Date },
    }],
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: {
      cpClickUrl: { type: String },
      crmClickUrl: { type: String },
      actions: [{
        action: { type: String },
        title: { type: String },
        icon: { type: String },
      }],
      extraParams: { type: Object },
    },
    badge: { type: String },
    dir: { type: String, default: 'ltr' },
    icon: { type: String },
    image: { type: String },
    lang: { type: String, default: 'en' },
  },
  { timestamps: true },
);

NotificationsSchema.plugin(mongoosePaginate);
NotificationsSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});
NotificationsSchema.plugin(AutoIncrement, {
  id: 'notificationsCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('notifications', NotificationsSchema);
module.exports.Schema = NotificationsSchema;

const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const { getInitialPushNotificationsSettings } = require('../notifications/notifications.service');

const RoleSchema = new Schema(
  {

    recordId: { type: Number },
    title: {
      type: String,
      unique: true,
      required: true,
    },
    key: { type: String },
    permissions: {
      type: Schema.Types.Mixed,
    },
    pushNotifications: {
      type: [{
        enabled: { type: Boolean },
        key: { type: String },
        actions: {
          type: [{
            action: { type: String },
            enabled: { type: Boolean },
          }],
        },
      }],
      default: () => getInitialPushNotificationsSettings('other'),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
  },
  { timestamps: true },
);

RoleSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

RoleSchema.plugin(mongoosePaginate);
RoleSchema.plugin(AutoIncrement, {
  id: 'roleCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('Role', RoleSchema);
module.exports.Schema = RoleSchema;

const { EVENT_TYPES, PUSH_NOTIFICATION_GROUPS } = require('../../common/data/constants');
const { SendEvent } = require('../../common/handlers');

module.exports = async function (agenda) {
  agenda.define('scheduleReminder', async (job) => {
    const user = job.attrs.data.userDetails;
    SendEvent(
      EVENT_TYPES.SEND_PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.USERS.USER_REMINDER,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'USERS'),
        to: [user._id],
      },
      {
        note: job.attrs.data.note,
        user,
      },
    );
    // SendEvent(
    //   EVENT_TYPES.SEND_PUSH_NOTIFICATION,
    //   {
    //     pushNotificationType: PUSH_NOTIFICATION_GROUPS.USERS.USER_REMINDER,
    //     to: [user._id],
    //   },
    //   {
    //     _id: user._id,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     email: user.email,
    //     recordId: user.recordId,
    //     note: job.attrs.data.note,
    //   },
    // );
  });
  // agenda.every('minute', 'scheduleReminder', {
  //   note: 'Hello',
  //   userDetails: {
  //     _id: '62dec6f52641902740edbd7a',
  //     firstName: 'admin',
  //     lastName: 'Use`r',
  //     email: 'admin@admin.com',
  //     recordId: 10000,
  //   },
  // });
};

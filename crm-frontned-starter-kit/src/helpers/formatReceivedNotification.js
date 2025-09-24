export default function formatReceivedNotification(notification) {
  const {
    data,
    body,
    title,
    icon,
  } = notification;
  const {
    notificationId,
    to,
    ...rest
  } = data;
  return {
    _id: notificationId,
    data: {
      ...rest,
    },
    body,
    title,
    icon,
    to,
    createdAt: new Date(),
  };
}
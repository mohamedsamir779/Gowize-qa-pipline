const {
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  MARK_NOTIFICATIONS_READ,
  MARK_NOTIFICATIONS_READ_SUCCESS,
  MARK_NOTIFICATIONS_READ_ERROR,
  RECEIVED_NOTIFICATION,
} = require("./actionTypes");

const initialState = {
  loading: false,
  markReadLoading: false,
  error: "",
  success: "",
  notifications: {
    docs: [],
    totalDocs: 0,
  },
  unreadNotifications: {
    docs: [],
    totalDocs: 0,
  },
};

const markNotificationsRead = (state, payload) => {
  const { notifications, unreadNotifications } = state;
  let newNotifications = { ...notifications }, newUnreadNotifications = { ...unreadNotifications };
  const { docs: unreadDocs } = newUnreadNotifications;
  const { docs: readDocs } = newNotifications;
  const { _id } = JSON.parse(localStorage.getItem("authUser"));
  const {
    notificationIds,
    all,
  } = payload;
  if (all) {
    const notificationDocs = readDocs.map((doc) => {
      const foundIndex = doc.to && doc.to.findIndex((toDocs) => toDocs.clientId === _id);
      if (foundIndex !== -1) {
        doc.to[foundIndex].read = true;
      }
      return doc;
    });
    return {
      ...state,
      loading: false,
      notifications: {
        ...newNotifications,
        docs: notificationDocs,
      },
      unreadNotifications: {
        ...newUnreadNotifications,
        docs: [],
        totalDocs: 0,
      },
    };
  } else {
    notificationIds.forEach((id) => {
      const findNotification = unreadDocs.findIndex((doc) => doc._id.toString() === id);
      if (findNotification !== -1) {
        unreadDocs.splice(findNotification, 1);
        newUnreadNotifications.totalDocs = newUnreadNotifications.totalDocs - 1;
      }
    });
    const notificationDocs = readDocs.map((doc) => {
      if (notificationIds.includes(doc._id.toString())) {
        const foundIndex = doc.to && doc.to.findIndex((toDocs) => toDocs.clientId === _id);
        if (foundIndex !== -1) {
          doc.to[foundIndex].read = true;
        }
      }
      return doc;
    });
    return {
      ...state,
      loading: false,
      notifications: {
        ...newNotifications,
        docs: notificationDocs,
      },
      unreadNotifications: {
        ...newUnreadNotifications,
        docs: [
          ...unreadDocs
        ],
      },
    };
  }
};

const handleReceivedNotification = (state, payload) => {
  const { notifications, unreadNotifications } = state;
  const { docs: unreadDocs } = unreadNotifications;
  const { docs: readDocs } = notifications;
  const { _id } = payload;
  if (unreadDocs.findIndex((doc) => doc._id.toString() === _id) === -1) {
    state = {
      ...state,
      unreadNotifications: {
        ...unreadNotifications,
        docs: [
          payload,
          ...unreadDocs
        ],
        totalDocs: unreadNotifications.totalDocs + 1,
      },
    };
  }
  if (readDocs.findIndex((doc) => doc._id.toString() === _id) === -1) {
    state = {
      ...state,
      notifications: {
        ...notifications,
        docs: [
          payload,
          ...readDocs
        ],
        totalDocs: notifications.totalDocs + 1,
      },
    };
  }
  return state;
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_NOTIFICATIONS_SUCCESS:
      if (action.payload.unread) {
        state = {
          ...state,
          loading: false,
          unreadNotifications: action.payload,
        };
      } else {
        state = {
          ...state,
          loading: false,
          notifications: action.payload,
        };
      }
      break;
    case FETCH_NOTIFICATIONS_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;
    case MARK_NOTIFICATIONS_READ:
      state = {
        ...state,
        loading: true,
      };
      break;
    case MARK_NOTIFICATIONS_READ_SUCCESS:
      state = markNotificationsRead(state, action.payload);
      break;
    case MARK_NOTIFICATIONS_READ_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;
    case RECEIVED_NOTIFICATION:
      state = handleReceivedNotification(state, action.payload);
      // state = {
      //   ...state,
      //   unreadNotifications: {
      //     ...state.unreadNotifications,
      //     docs: [
      //       action.payload,
      //       ...state.unreadNotifications.docs
      //     ],
      //     totalDocs: state.unreadNotifications.totalDocs + 1,
      //   },
      //   notifications: {
      //     ...state.notifications,
      //     docs: [
      //       action.payload,
      //       ...state.notifications.docs
      //     ],
      //     totalDocs: state.notifications.totalDocs + 1,
      //   },
      // };
      break;
    default:
      break;
  }
  return state;
};

export default notificationsReducer;
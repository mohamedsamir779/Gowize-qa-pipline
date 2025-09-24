import {
  GET_TODOS_START,
  GET_TODOS_END,
  ADD_TODO_START,
  ADD_TODO_END,
  ADD_TODO_CLEAR,
  DELETE_TODO_START,
  DELETE_TODO_END,
  MODAL_CLEAR_ERROR,
  GET_REMINDERS_START,
  GET_REMINDERS_END,
  ADD_REMINDER_END,
  ADD_REMINDER_START,
  GET_NOTES_START,
  GET_NOTES_END,
  ADD_NOTE_START,
  ADD_NOTE_END,
  GET_REMARKS_START,
  GET_REMARKS_END,
  ADD_REMARK_START,
  ADD_REMARK_END,
  EDIT_TODO_END,
} from "./actionTypes";

const INIT_STATE = {
  loading: false,
  todos: { docs: [] },
  reminders: { docs: [] },
  notes: { docs: [] },
  remarks: { docs: [] },
  clearingCounter: 0,
  deletingClearCounter: 0,
};

const Calendar = (state = INIT_STATE, action) => {
  let docs = state.list && state.list.docs || [];
  switch (action.type) {
    case GET_TODOS_START:
    case GET_REMINDERS_START:
    case GET_NOTES_START:
    case GET_REMARKS_START:
      return {
        ...state,
        loading: true,
      };
    case GET_TODOS_END:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        todos: action.payload.data
      };
    case GET_REMINDERS_END:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        reminders: action.payload.data,
      };
    case GET_NOTES_END:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        notes: action.payload.data,
      };
    case GET_REMARKS_END:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        remarks: action.payload.data,
      };
    case ADD_TODO_START:
    case ADD_REMINDER_START:
    case ADD_NOTE_START:
    case ADD_REMARK_START:
      return {
        ...state,
        adding: true,
      };
    case ADD_TODO_END:
      if (action.payload.id) {
        docs = state.todos.docs.map(obj => {
          if (obj._id === action.payload.id) {
            return {
              ...obj,
              ...action.payload.data,
            };
          }
          return obj;
        });
      }
      if (action.payload.data && !action.payload.id) {
        docs = [action.payload.data, ...state.todos.docs];
      }
      return {
        ...state,
        adding: false,
        addError: action.payload.error,
        todos: {
          ...state.todos,
          docs,
        },
      };
    case ADD_REMINDER_END:
      if (action.payload.id) {
        docs = state.reminders.docs.map(obj => {
          if (obj._id === action.payload.id) {
            return {
              ...obj,
              ...action.payload.data,
            };
          }
          return obj;
        });
      }
      if (action.payload.data && !action.payload.id) {
        docs = [action.payload.data, ...state.reminders.docs];
      }
      return {
        ...state,
        adding: false,
        addError: action.payload.error,
        reminders: {
          ...state.reminders,
          docs,
        },
      };
    case ADD_NOTE_END:
      if (action.payload.id) {
        docs = state.notes.docs.map(obj => {
          if (obj._id === action.payload.id) {
            return {
              ...obj,
              ...action.payload.data,
            };
          }
          return obj;
        });
      }
      if (action.payload.data && !action.payload.id) {
        docs = [action.payload.data, ...state.notes.docs];
      }
      return {
        ...state,
        adding: false,
        addError: action.payload.error,
        notes: {
          ...state.notes,
          docs,
        },
      };
    case ADD_REMARK_END:
      if (action.payload.id) {
        docs = state.remarks.docs.map(obj => {
          if (obj._id === action.payload.id) {
            return {
              ...obj,
              ...action.payload.data,
            };
          }
          return obj;
        });
      }
      if (action.payload.data && !action.payload.id) {
        docs = [action.payload.data, ...state.remarks.docs];
      }
      return {
        ...state,
        adding: false,
        addError: action.payload.error,
        remarks: {
          ...state.remarks,
          docs,
        },
      };
    case ADD_TODO_CLEAR:
      return {
        ...state,
        clearingCounter: state.clearingCounter + 1
      };
    case DELETE_TODO_START:
      return {
        ...state,
        deleting: true,
      };
    case DELETE_TODO_END:
      return {
        ...state,
        deleting: false,
        deletingClearCounter: state.deletingClearCounter + 1,
      };
    case MODAL_CLEAR_ERROR:
      return {
        ...state,
        addError: ""
      };
    case EDIT_TODO_END:
      return {
        ...state,
        editDone: true,
      };
    default:
      return { ...state };
  }
};

export default Calendar;

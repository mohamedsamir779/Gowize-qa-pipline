import {
  GET_TODOS_START,
  GET_TODOS_END,
  ADD_TODO_START,
  ADD_TODO_END,
  ADD_TODO_CLEAR,
  DELETE_TODO_START,
  DELETE_TODO_END,
  MODAL_CLEAR_ERROR,
  EDIT_TODO_START,
  EDIT_TODO_END,
  GET_REMINDERS_START,
  GET_REMINDERS_END,
  ADD_REMINDER_START,
  ADD_REMINDER_END,
  GET_NOTES_START,
  GET_NOTES_END,
  ADD_NOTE_START,
  ADD_NOTE_END,
  ADD_REMARK_START,
  ADD_REMARK_END,
  GET_REMARKS_START,
  GET_REMARKS_END
} from "./actionTypes";

export const fetchTodosStart = (params = {}) => {
  return {
    type: GET_TODOS_START,
    payload: params
  };
};
export const fetchTodosEnd = (data) => {
  return {
    type: GET_TODOS_END,
    payload: data
  };
};

export const fetchRemindersStart = (params = {}) => {
  return {
    type: GET_REMINDERS_START,
    payload: params
  };
};
export const fetchRemindersEnd = (data) => {
  return {
    type: GET_REMINDERS_END,
    payload: data
  };
};

export const fetchNotesStart = (params = {}) => {
  return {
    type: GET_NOTES_START,
    payload: params
  };
};
export const fetchNotesEnd = (data) => {
  return {
    type: GET_NOTES_END,
    payload: data
  };
};

export const fetchRemarksStart = (params = {}) => {
  return {
    type: GET_REMARKS_START,
    payload: params
  };
};
export const fetchRemarksEnd = (data) => {
  return {
    type: GET_REMARKS_END,
    payload: data
  };
};

export const addTodosStart = (params = {}) => {
  return {
    type: ADD_TODO_START,
    payload: params
  };
};
export const addTodosEnd = (data) => {
  return {
    type: ADD_TODO_END,
    payload: data
  };
};
export const addReminderStart = (params = {}) => {
  return {
    type: ADD_REMINDER_START,
    payload: params
  };
};
export const addReminderEnd = (data) => {
  return {
    type: ADD_REMINDER_END,
    payload: data
  };
};
export const addNoteStart = (params = {}) => {
  return {
    type: ADD_NOTE_START,
    payload: params
  };
};
export const addNoteEnd = (data) => {
  return {
    type: ADD_NOTE_END,
    payload: data
  };
};
export const addRemarkStart = (params = {}) => {
  return {
    type: ADD_REMARK_START,
    payload: params
  };
};
export const addRemarkEnd = (data) => {
  return {
    type: ADD_REMARK_END,
    payload: data
  };
};

export const addTodoClear = (data) => {
  return {
    type: ADD_TODO_CLEAR,
    payload: data
  };
};

export const deleteTodosStart = (params = {}) => {
  return {
    type: DELETE_TODO_START,
    payload: params
  };
};

export const deleteTodosEnd = (data) => {
  return {
    type: DELETE_TODO_END,
    payload: data
  };
};

export const clearError = () => {
  return {
    type: MODAL_CLEAR_ERROR,
    payload: ""
  };
};


export const editTodoStart = (params = {})=>{
  return {
    type:EDIT_TODO_START,
    payload:params
  };
};

export const editTodoEnd = (params = {})=>{
  return {
    type:EDIT_TODO_END,
    payload:params
  };
};
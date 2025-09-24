/* eslint-disable object-property-newline */
import {
  takeEvery, put, call, delay
} from "redux-saga/effects";

// Calender Redux States
import {
  GET_TODOS_START,
  ADD_TODO_START,
  DELETE_TODO_START,
  EDIT_TODO_START,
  GET_REMINDERS_START,
  ADD_REMINDER_START,
  GET_NOTES_START,
  ADD_NOTE_START,
  GET_REMARKS_START,
  ADD_REMARK_START
} from "./actionTypes";

import {
  fetchTodosEnd,
  addTodosEnd,
  addTodoClear,
  deleteTodosEnd,
  clearError,
  fetchRemindersEnd,
  addReminderEnd,
  addNoteEnd,
  fetchNotesEnd,
  fetchRemarksEnd,
  addRemarkEnd,
  editTodoEnd,
} from "./actions";
import * as todosApi from "../../apis/reminder";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function* fetchTodos(params) {
  try {
    params.payload.type = 0;
    const data = yield call(todosApi.getTodos, params);
    yield put(fetchTodosEnd({ data }));
  }
  catch (error) {
    yield put(fetchTodosEnd({ error }));
  }
}

function* fetchReminders(params) {
  try {
    params.payload.type = 1;
    const data = yield call(todosApi.getTodos, params);
    yield put(fetchRemindersEnd({ data }));
  }
  catch (error) {
    yield put(fetchRemindersEnd({ error }));
  }
}

function* fetchNotes(params) {
  try {
    params.payload.type = 2;
    const data = yield call(todosApi.getTodos, params);
    yield put(fetchNotesEnd({ data }));
  }
  catch (error) {
    yield put(fetchNotesEnd({ error }));
  }
}

function* fetchRemarks(params) {
  try {
    params.payload.type = 3;
    const data = yield call(todosApi.getTodos, params);
    yield put(fetchRemarksEnd({ data }));
  }
  catch (error) {
    yield put(fetchRemarksEnd({ error }));
  }
}

function* addTodo(params) {
  try {
    const data = yield call(todosApi.addTodo, params.payload);
    yield put(addTodosEnd({ data: params.payload.id ? params.payload : data, id: params.payload.id }));
    if (params.payload.id) {
      yield put(showSuccessNotification("Todo updated successfully"));
    } else {
      yield put(showSuccessNotification("Todo added successfully"));
    }
    yield put(addTodoClear());

  }
  catch (error) {
    yield put(addTodosEnd({ error }));
    yield delay(2500);
    yield put(clearError());
  }
}
function* addReminder(params) {
  try {
    const data = yield call(todosApi.addTodo, params.payload);
    yield put(addReminderEnd({ data: params.payload.id ? params.payload : data, id: params.payload.id }));
    if (params.payload.id) {
      yield put(showSuccessNotification("Reminder updated successfully"));
    } else {
      yield put(showSuccessNotification("Reminder added successfully"));
    }
    yield put(addTodoClear());

  }
  catch (error) {
    yield put(addTodosEnd({ error }));
    yield delay(2500);
    yield put(clearError());
  }
}
function* addNote(params) {
  try {
    const data = yield call(todosApi.addTodo, params.payload);
    yield put(addNoteEnd({ data: params.payload.id ? params.payload : data, id: params.payload.id }));
    if (params.payload.id) {
      yield put(showSuccessNotification("Note updated successfully"));
    } else {
      yield put(showSuccessNotification("Note added successfully"));
    }
    yield put(addTodoClear());
  }
  catch (error) {
    yield put(addTodosEnd({ error }));
    yield delay(2500);
    yield put(clearError());
  }
}

function* addRemark(params) {
  try {
    const data = yield call(todosApi.addTodo, params.payload);
    yield put(addRemarkEnd({ data: params.payload.id ? params.payload : data, id: params.payload.id }));
    if (params.payload.id) {
      yield put(showSuccessNotification("Remark updated successfully"));
    } else {
      yield put(showSuccessNotification("Remark added successfully"));
    }
    yield put(addTodoClear());
  }
  catch (error) {
    yield put(addTodosEnd({ error }));
    yield delay(2500);
    yield put(clearError());
  }
}

function* deleteTodo(params) {
  try {
    yield call(todosApi.deleteTodo, params.payload);
    yield put(deleteTodosEnd({ id: params.payload }));
    yield put(showSuccessNotification(`${params.payload.type === 1 ? "Reminder" : "Todo" } deleted successfully`));
  }
  catch (error) {
    yield put(deleteTodosEnd({ error }));
    yield put(showErrorNotification(error.message));
  }
}

function * editTodo(params){
  try {
    const data = yield call(todosApi.editTodo, params.payload);
    if (data){
      yield put(showSuccessNotification("Note updated successfully"));
      yield put(editTodoEnd(data));
    }
  }
  catch (error){
    yield put(showErrorNotification(error.message));
  } 
}

function* calendarSaga() {
  yield takeEvery(GET_TODOS_START, fetchTodos);
  yield takeEvery(GET_REMINDERS_START, fetchReminders);
  yield takeEvery(GET_NOTES_START, fetchNotes);
  yield takeEvery(GET_REMARKS_START, fetchRemarks);
  yield takeEvery(ADD_TODO_START, addTodo);
  yield takeEvery(ADD_REMINDER_START, addReminder);
  yield takeEvery(ADD_NOTE_START, addNote);
  yield takeEvery(ADD_REMARK_START, addRemark);
  yield takeEvery(DELETE_TODO_START, deleteTodo);
  yield takeEvery(EDIT_TODO_START, editTodo);

}

export default calendarSaga;

import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";

import {
  Card,
  CardBody,
  Container,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import {
  useDispatch, connect,
} from "react-redux";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import BootstrapTheme from "@fullcalendar/bootstrap";

import TodoAdd from "components/Common/TodoAdd";
// import Loader from "components/Common/Loader";

import "@fullcalendar/bootstrap/main.css";
import {
  editTodoStart,
  fetchNotesStart,
  fetchRemindersStart,
  fetchTodosStart,
  fetchRemarksStart,
} from "store/actions";

//redux
import ViewTodo from "./ViewTodo";
import moment from "moment";
import { getReminderClassName } from "common/utils/getNoteType";

const Calendar = (props) => {
  const { create: addTodos } = props.todosPermissions;
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [dateRange, setDateRange] = useState({
    startStr: "",
    endStr: "",
  });
  const [addModal, setAddReminderModal] = useState(false);
  const [todoObj, setTodoObj] = useState({
    note: "",
    timeEnd: "",
    type: "1",
    _id: "",
  });
  const [showViewModal, setShowViewModal] = useState(false);

  const [tasks, setTasks] = useState(true);
  const [notes, setNotes] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [remarks, setRemarks] = useState(true);

  useEffect(() => {
    const data = [];
    reminders && data.push(...props.reminders);
    tasks     && data.push(...props.todos);
    notes     && data.push(...props.notes);
    remarks   && data.push(...props.remarks);
    setEvents(data.map(obj => {
      const calData = {
        ...obj,
        className: `text-white ${getReminderClassName(obj.type)}`,
        id: obj._id,
        title: obj.note,
        start: obj.createdAt,
        timeEnd: obj.createdAt,
      };
      if (obj.type === 1) {
        calData.start = obj.timeEnd;
        calData.timeEnd = obj.timeEnd;
      }
      return calData;
    }));
  }, [props.reminders, props.todos, props.notes, props.remarks, tasks, notes, reminders, remarks]);

  const handleDateClick = (arg) => {
    var date = new Date(arg["date"]);
    setSelectedDay(date.toISOString());
    setAddReminderModal(true);
  };

  const handleEventClick = (arg) => {
    setTodoObj({
      ...arg.event.extendedProps,
      _id: arg.event.id
    });
    setShowViewModal(true);
  };

  const dateRangeChange = (arg) => {
    if (dateRange.startStr !== arg.startStr || dateRange.endStr !== arg.endStr) {
      setDateRange({
        ...dateRange,
        ...arg,
      });
      const params = {
        page: 1,
        limit: 1000,
        start: arg.startStr,
        end: arg.endStr,
      };
      dispatch(fetchRemindersStart(params));
      dispatch(fetchTodosStart(params));
      dispatch(fetchNotesStart(params));
      dispatch(fetchRemarksStart(params));
    }
  };

  const handleDrop = (args) => {
    const todo = args.oldEvent._def.extendedProps;
    const end = moment(args.event.start);
    const now = moment();
    if (now.diff(end) > 0) {
      args.revert();
    } else
      dispatch(editTodoStart({
        id: todo._id,
        timeEnd: args.event.start,
        note: todo.note,
        time: todo.createAt,
        type: todo.type,
        status: todo.status
      }));
  };

  return (
    <React.Fragment>
      <TodoAdd
        show={addModal}
        selectedDay={selectedDay}
        hidenAddButton={true}
        selectedDate={selectedDay}
        onClose={() => { setAddReminderModal(false) }}
      />
      <ViewTodo
        show={showViewModal}
        data={todoObj}
        type={todoObj.type}
        onClose={() => { setShowViewModal(false) }}
      />
      <div className="page-content">
        <MetaTags>
          <title>{props.t("Calendar")}</title>
        </MetaTags>
        <Container fluid={true}>
          <Card>
            <CardBody>
              {/* legend */}
              <div className="d-flex justify-content-end text-white mb-1">
                <span className={`cursor-pointer rounded-1 px-1 me-1 ${reminders ? "bg-info" : "bg-secondary"}`}
                  onClick={() => setReminders(!reminders)}
                >Reminders</span>
                <span className={`cursor-pointer rounded-1 px-1 me-1 ${tasks ? "bg-success" : "bg-secondary"}`}
                  onClick={() => setTasks(!tasks)}
                >Tasks</span>
                <span className={`cursor-pointer rounded-1 px-1 me-1 ${notes ? "bg-warning" : "bg-secondary"}`}
                  onClick={() => setNotes(!notes)}
                >Notes</span>
                <span className={`cursor-pointer rounded-1 px-1 me-1 ${remarks ? "bg-danger" : "bg-secondary"}`}
                  onClick={() => setRemarks(!remarks)}
                >Remarks</span>
              </div>
              <FullCalendar
                timeZone= 'local'
                plugins={[
                  BootstrapTheme,
                  dayGridPlugin,
                  interactionPlugin,
                ]}
                slotDuration={"00:15:00"}
                handleWindowResize={true}
                themeSystem="bootstrap"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                events={events}
                editable={true}
                // droppable={true}
                selectable={true}
                dateClick={addTodos && handleDateClick}
                eventClick={handleEventClick}
                eventDrop={handleDrop}
                datesSet={dateRangeChange}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  clientDetails: state.clientReducer.clientDetails || {},
  reminders: state.todosReducer.reminders && state.todosReducer.reminders.docs || [],
  todos: state.todosReducer.todos && state.todosReducer.todos.docs || [],
  notes: state.todosReducer.notes && state.todosReducer.notes.docs || [],
  remarks: state.todosReducer.remarks && state.todosReducer.remarks.docs || [],
  loading: state.todosReducer.loading,
  deletingClearCounter: state.todosReducer.deletingClearCounter,
  todosPermissions: state.Profile.todosPermissions || {},
});

export default connect(mapStateToProps, null)(withTranslation()(Calendar));

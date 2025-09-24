export const getReminderClassName = (type = 0) => {
  type = parseInt(type);
  switch (type) {
    case 0:
      return "bg-success ";
    case 1:
      return "bg-info ";
    case 2:
      return "bg-warning ";
    case 3:
      return "bg-danger ";
    default:
      return "bg-success ";
  }
};

export const getNoteType = (type = 0) => {
  type = parseInt(type);
  switch (type) {
    case 0:
      return "Task";
    case 1:
      return "Reminder";
    case 2:
      return "Note";
    case 3:
      return "Remark";
    default:
      return "Task";
  }
};
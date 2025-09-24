const { Cruds, SendEvent } = require('src/common/handlers');
const agenda = require('src/common/lib/agenda');
const {
  EVENT_TYPES, LOG_TYPES, LOG_LEVELS, PUSH_NOTIFICATION_GROUPS,
} = require('../../common/data/constants');
const { customerService } = require('../services');
const TodosModel = require('./todos.model');

class Todos extends Cruds {
  async addTodo(params = {}) {
    const customer = await customerService.findById(params.customerId, {}, true, [{
      path: 'agent',
      select: 'firstName lastName email recordId',
    }]);
    const {
      userDetails,
      ...rest
    } = params;
    const todo = await this.create(rest);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.ADD_TODO,
      {
        customerId: params.customerId,
        userId: params.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          ...params,
          id: todo.recordId,
          customerName: `${customer.firstName} ${customer.lastName}`,
        },
      },
    );
    if (parseInt(params.type, 10) === 1) {
      const date = new Date(params.timeEnd);
      agenda.schedule(date, 'scheduleReminder', {
        ...params,
      });
    }
    // send a notification to the user if a remark is added by the admin
    if (parseInt(params.type, 10) === 3) {
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.USERS.CLIENT_REMARK,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'USERS'),
          from: params.createdBy,
          fromModel: 'users',
          to: [customer?.agent?._id?.toString()],
        },
        {
          remark: {
            note: params.note,
            type: params.type,
            time: params.time,
          },
          admin: {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            _id: userDetails._id.toString(),
          },
          client: {
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            recordId: customer.recordId,
            _id: customer._id.toString(),
          },
          agent: {
            _id: customer?.agent?._id?.toString(),
            firstName: customer?.agent?._id?.firstName,
            lastName: customer?.agent?._id?.lastName,
            email: customer?.agent?._id?.email,
            recordId: customer?.agent?._id?.recordId,
          },
        },
      );
    }
    return todo;
  }

  async editTodo(id, params = {}) {
    const customer = await customerService.findById(params.customerId);
    const oldTodo = await this.findById(id);
    const todo = await this.createOrUpdate({ _id: id }, params);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.EDIT_TODO,
      {
        customerId: params.customerId,
        userId: params.updatedBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          ...params,
          oldNote: oldTodo.note,
          id: todo.recordId,
          customerName: `${customer.firstName} ${customer.lastName}`,
        },
      },
    );
    return todo;
  }

  async deleteTodo(id, params = {}) {
    const customer = await customerService.findById(params.customerId);
    const todo = await this.findById(id, { recordId: 1 });
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.DELETE_TODO,
      {
        customerId: params.customerId,
        userId: params.deletedBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          ...params,
          id: todo.recordId,
          customerName: `${customer.firstName} ${customer.lastName}`,
        },
      },
    );
    return this.deleteById(id);
  }
}

module.exports = new Todos(TodosModel.Model, TodosModel.Schema);

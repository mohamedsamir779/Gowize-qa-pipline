const {
  Cruds,
} = require('src/common/handlers');
const LogsModel = require('./logs.model');

class LogsService extends Cruds {
  async addLog(
    type,
    customerId = null,
    userId = null,
    triggeredBy = null,
    userLog = false,
    level = 0,
    details = {},
    content = {},
  ) {
    return this.create({
      type,
      customerId,
      userId,
      triggeredBy,
      userLog,
      level,
      details,
      content,
    });
  }
}

module.exports = new LogsService(LogsModel.DemoModel, LogsModel.Schema);

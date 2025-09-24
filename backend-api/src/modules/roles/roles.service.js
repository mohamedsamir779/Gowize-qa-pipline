//

const { Cruds, SendEvent } = require('src/common/handlers');
const { permissionsGroup, CONSTANTS } = require('src/common/data');
const RoleModel = require('./roles.model');

class Role extends Cruds {
  async createNewRole(params) {
    const role = await this.create({
      ...params,
      permissions: permissionsGroup,
    });
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.ROLES,
      {
        customerId: null,
        userId: params.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: {},
        content: params,
      },
    );
    return this.findById(role._id, {}, true, [{
      path: 'createdBy',
      select: 'firstName lastName',
    }]);
  }

  async updateById(id, params, force = false, updatedBy) {
    const role = await this.findById(id);
    if (!role) throw new Error('Role does not exist');
    if (role.title === 'Admin' && !force) throw new Error('This Role Cannot be Updated');
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.UPDATE_ROLE,
      {
        customerId: null,
        userId: updatedBy,
        triggeredBy: 1,
        userLog: true,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: { previousData: role, newData: params },
        content: {},
      },
    );
    return super.updateById(id, params);
  }

  async deleteById(id, deletedBy) {
    const role = await this.findById(id);
    if (!role) throw new Error('Role does not exist');
    if (role.title === 'Admin') throw new Error('This Role Cannot be Deleted');
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.DELETE_ROLE,
      {
        customerId: null,
        userId: deletedBy,
        triggeredBy: 1,
        userLog: true,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: {},
        content: { deletedRole: role.title },
      },
    );
    return super.deleteById(id);
  }

  // async update() {
  //   throw new Error('This function not allowed here');
  // }
}

module.exports = new Role(RoleModel.Model, RoleModel.Schema);

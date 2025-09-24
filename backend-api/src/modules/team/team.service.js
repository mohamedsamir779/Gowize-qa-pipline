//
const { ObjectId } = require('mongoose').Types;
const { Cruds, SendEvent } = require('src/common/handlers');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../common/data/constants');
const TeamModel = require('./team.model');

let userService;
class TeamService extends Cruds {
  async createTeam(params) {
    const teamCreated = await this.create(params);
    await userService.update({
      _id: {
        $in: params.members,
      },
    }, {
      memberTeamId: teamCreated._id,
    });
    const team = await this.findById(teamCreated._id, {}, true, [{
      path: 'managerId',
      select: 'firstName lastName email',
    }, {
      path: 'members',
      select: 'firstName lastName email',
    }]);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CREATE_TEAM,
      {
        customerId: null,
        userId: params.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: params,
      },
    );
    return team;
  }

  async addTeamMember(teamId, members, createdBy) {
    const res = await Promise.all([
      this.Model.update({ _id: ObjectId(teamId) }, {
        $push: {
          members,
        },
      }),
      userService.Model.updateMany({ _id: { $in: members.map((obj) => ObjectId(obj)) } }, {
        $set: { memberTeamId: teamId },
      }),

    ]);
    const team = await this.findById(teamId, {}, true, [{
      path: 'members',
      select: 'firstName lastName email',
    }]);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.ADD_TEAM_MEMBER,
      {
        customerId: null,
        userId: createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: { team: team.title, member: team.members[team.members.length - 1] },
      },
    );
    return res[0];
  }

  async removeTeamMember(teamId, members, deletedBy) {
    const res = await Promise.all([
      this.Model.update({ _id: ObjectId(teamId) }, {
        $pullAll: {
          members,
        },
      }),
      userService.Model.updateMany({ _id: { $in: members.map((obj) => ObjectId(obj)) } }, {
        $set: { memberTeamId: null },
      }),

    ]);
    const team = await this.findById(teamId);
    const member = await userService.findById(members[0]);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.DELETE_TEAM_MEMBER,
      {
        customerId: null,
        userId: deletedBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: { member: member.email, team: team.title },
      },
    );
    return res[0];
  }

  async updateTeam(teamId, body, updatedBy) {
    const team = await this.findById(teamId);
    const { title, managerId } = team;
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.UPDATE_TEAM,
      {
        customerId: null,
        userId: updatedBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: { oldData: { title, managerId }, newData: body },
        content: {},
      },
    );
    return this.updateById(teamId, body);
  }

  async deleteTeam(teamId) {
    const res = await Promise.all([
      this.findById(teamId),
      this.deleteById(teamId),
    ]);
    if (res[0] && res[0].members) {
      await userService.Model.updateMany({ _id: { $in: res[0].members } }, {
        $set: { memberTeamId: null },
      });
    }
    const team = await this.deleteById(teamId);
    return team;
  }

  async isCurrentUserManagerOfAssignedAgent(currentUser, assignedAgentId) {
    const team = await this.findOne({
      managerId: currentUser,
      members: assignedAgentId,
    });
    return !!team;
  }
}

module.exports = new TeamService(TeamModel.Model, TeamModel.Schema);

setTimeout(() => {
  // eslint-disable-next-line global-require
  const services = require('src/modules/services');
  userService = services.userService;
}, 0);

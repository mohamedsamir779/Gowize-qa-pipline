//
const { ObjectId } = require('mongoose').Types;
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { todoService: service } = allServices;

class TodoController {
  async createRecord(req, res, next) {
    try {
      if (req.user.roleId?.isAdmin) {
        req.body.byAdmin = true;
      }
      req.body.customerId = ObjectId(req.body.customerId);
      const rec = await service.addTodo({
        ...req.body,
        createdBy: ObjectId(req.user._id),
        userDetails: req.user,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
        ...rec._doc,
        customerId: req.customer,
        createdBy: req.user,
      });
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const { start, end, ...query } = req.query;
      if (query.customerId) {
        query.customerId = ObjectId(query.customerId);
      }
      if (start && end) {
        if (query.type === '1') {
          query.timeEnd = {
            $gte: start,
            $lte: end,
          };
        } else {
          query.createdAt = {
            $gte: start,
            $lte: end,
          };
        }
        query.createdBy = ObjectId(req.user._id);
      }
      if (query.type === '3') {
        query.type = 3;
      } else {
        query.createdBy = ObjectId(req.user._id);
      }
      const rec = await service.findWithPagination(query, {
        populate: [{
          path: 'createdBy',
          select: 'firstName lastName',
        }, {
          path: 'customerId',
          select: 'firstName lastName phone mobile',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const oldRec = await service.findById(id);
      const { customerId, type } = oldRec;
      const rec = await service.editTodo(id, {
        ...req.body,
        updatedBy: ObjectId(req.user._id),
        customerId,
        type,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const oldRec = await service.findById(id);
      const { customerId, type } = oldRec;
      const rec = await service.deleteTodo(id,
        {
          ...req.body,
          deletedBy: ObjectId(req.user._id),
          customerId,
          type,
        });
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecords(req, res, next) {
    try {
      const rec = await service.find();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const rec = await service.findById(req.params.id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordPaginated(req, res, next) {
    try {
      const rec = await service.find({});
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new TodoController();

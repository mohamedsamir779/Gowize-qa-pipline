//
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const service = require('./systememail.service');

class RoleController {
  async createRecord(req, res, next) {
    try {
      const rec = await service.create({ ...req.body, createdBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getPaginate(req, res, next) {
    try {
      const rec = await service.findWithPagination({
        ...req.query,
        userTemplate: { $ne: true },
      }, {
        populate: [{
          path: 'createdBy',
          select: 'firstName lastName',
        }],
      });
      if (req.query.page && parseInt(req.query.page) === 1) {
        rec.actionsUsed = await service.getUsedActions();
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getUserTemplates(req, res, next) {
    try {
      const rec = await service.find({
        createdBy: req.user._id,
        userTemplate: true,
      });
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

  async updateRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.updateById(id, req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateContentById(req, res, next) {
    try {
      const { id } = req.params;
      const { language, subject, body } = req.body;
      const rec = await service.updateContentById(id, language, subject, body);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.deleteById(id);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getContentPreview(req, res, next) {
    try {
      const { id, lang } = req.params;
      const rec = await service.getPreviewContent(id, lang);
      return res.send(rec.body);
      // return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async updateRecordStatus(req, res, next) {
    try {
      const { id, status } = req.params;
      const rec = await service.updateStatus(id, { isActive: status === 'activate' });
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async createUserTemplate(req, res, next) {
    try {
      const rec = await service.createUserTemplate({ ...req.body, createdBy: req.user._id });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new RoleController();

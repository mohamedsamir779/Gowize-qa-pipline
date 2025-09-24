/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { logger } = require('src/common/lib');
const { ApiResponse } = require('src/common/handlers');
const {
  cpUrl,
} = require('src/common/data/keys');

const service = require('../documents.service');
const fileHandler = require('../../azure-multer/file-handler');
// service.deleteById('5feef943595c4a2186eeff62')
class DocumentController {
  async getMyDocuments(req, res, next) {
    try {
      const rec = await service.find({
        customerId: req.user._id,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async addDocument(req, res, next) {
    try {
      const ip = req.headers['x-real-ip'] ?? req.ip;
      console.log("Adding Document CP ==== from ip: ",ip);
      logger.info(req.body);
      const fileUploadResp = await Promise.all(
        req.files.map(async (file) => fileHandler.uploadFile(
          file.buffer,
          file.mimetype,
          file.originalname,
          `${req.user._id}/${req.body.type}`,
          false,
          false,
          false,
        )),
      );
      const resp = await service.addNewdocument({
        customerId: req.user._id,
        customer: req.user,
        ipAddress: ip,
        type: req.body.type,
        subType: req.body?.subType,
        shareholderId: req.body?.shareholderId,
        files: fileUploadResp.map((file) => ({
          ...file,
        })),
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, resp);
    } catch (err) {
      return next(err);
    }
  }

  async getDocument(req, res, next) {
    try {
      const {
        documentId,
        index,
      } = req.params;
      const result = await service.findById(documentId);
      const file = parseInt(index, 10) === 1 ? result.file1 : result.file2;
      if (result?.location && result?.location === 'azure') {
        const fileData = await fileHandler.generateSAS(file.url ?? file.path);
        return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, fileData);
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, `${cpUrl}/assets/${file.filename}`);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new DocumentController();

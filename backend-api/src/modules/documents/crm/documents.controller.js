/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const {
  crmURL,
} = require('src/common/data/keys');

const service = require('../documents.service');
const fileHandler = require('../../azure-multer/file-handler');

class DocumentController {
  async getMyDocuments(req, res, next) {
    try {
      const rec = await service.find({
        customerId: req.params.customerId,
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async addDocument(req, res, next) {
    try {
      const ip = req.headers['x-real-ip']?? req.ip;
      console.log("Adding Document CRM ==== from ip: ",ip);
      const createdBy = req.user && req.user._id;
      const resp = await Promise.all(
        Object.keys(req.files).map(async (key) => {
          const files = req.files[key];
          // first upload both the files
          const fileData = await Promise.all(
            files.map(async (file) => fileHandler.uploadFile(
              file.buffer,
              file.mimetype,
              file.originalname,
              `${req.params.customerId}/${key}`,
              false,
              false,
              false,
            )),
          );
          // then add the document
          return service.addNewdocument({
            customerId: req.params.customerId,
            type: key,
            ipAddress: ip,
            subType: req.body?.subType,
            shareholderId: req.body?.shareholderId,
            files: fileData.map((file) => ({
              ...file,
            })),
            createdBy,
          });
        }),
      );
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, resp);
    } catch (err) {
      return next(err);
    }
  }

  async changeStatus(req, res, next) {
    try {
      const { status, documentId } = req.params;
      const { rejectionReason } = req.body;
      const updatedBy = req.user && req.user._id;
      // eslint-disable-next-line max-len
      const result = await service.changeDocumentStatus(status, documentId, rejectionReason, updatedBy);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, result);
    } catch (err) {
      return next(err);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      const { status, documentId } = req.params;
      const result = await service.deleteById(documentId);
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, result);
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
        const fileData = await fileHandler.generateSAS(file.url ?? file.url);
        return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, fileData);
      }
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, `${crmURL}/assets/${file.filename}`);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new DocumentController();

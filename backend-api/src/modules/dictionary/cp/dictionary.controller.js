//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { dictionaryService: service } = allServices;

class DictionaryController {
  async getDictionary(req, res, next) {
    try {
      const dictionary = await service.findOne({}, { countries: 1 });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }
}
module.exports = new DictionaryController();

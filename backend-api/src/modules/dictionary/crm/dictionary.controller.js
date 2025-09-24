//
const allServices = require('src/modules/services');
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');

const { dictionaryService: service } = allServices;

class DictionaryController {
  async createRecord(req, res, next) {
    try {
      const rec = await service.createDictionary(req.body);
      return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async getDictionary(req, res, next) {
    try {
      const dictionary = await service.findDictionary();
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const dictionary = await service.getDictionaryById(id);
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async deleteRecordById(req, res, next) {
    try {
      const { id } = req.params;
      const rec = await service.deleteDictionary(id);
      return ApiResponse(res, ResponseMessages.RECORD_DELETE_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async addItemToDictionary(req, res, next) {
    try {
      const { id } = req.params;
      if (req.body.color) { // for call status dict
        const dict = await service.getDictionaryById(id,
          { defaultCallStatusColors: 1, callStatus: 1 });
        // convert callStatus into constant format
        req.body.callStatus = req.body.callStatus.replace(/\s/g, '_').toUpperCase();
        if (dict.callStatus.includes(req.body.callStatus)) {
          return ApiResponse(res, false, ResponseMessages.RECORD_ALREADY_EXISTS);
        }
        const dictionary = await service.addItem(id, {
          defaultCallStatusColors: {
            ...dict.defaultCallStatusColors,
            [req.body.callStatus]: req.body.color,
          },
        },
        { push: req.body });
        return ApiResponse(res, ResponseMessages.RECORD_UPDATE_SUCCESS, dictionary);
      }
      const dictionary = await service.addItem(id, {}, { push: req.body });
      return ApiResponse(res, ResponseMessages.RECORD_UPDATE_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async updateAction(req, res, next) {
    try {
      const { newValue } = req.query;

      const dictionary = await service.updateActions(req.body, newValue);
      return res.send(dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async updateExchange(req, res, next) {
    try {
      const { newValue } = req.query;

      const dictionary = await service.updateExchanges(req.body, newValue);
      return res.send(dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async updateCallStatus(req, res, next) {
    try {
      const { newValue } = req.query;
      const result = await service.updateCallStatus(req.body, newValue);
      return res.send(result);
    } catch (error) {
      return next(error);
    }
  }

  async updateCountry(req, res, next) {
    try {
      const result = await service.updateCountries(req.body, req.query);
      return res.send(result);
    } catch (error) {
      return next(error);
    }
  }

  async removeItemFromDictionary(req, res, next) {
    try {
      const { id } = req.params;
      const dictionary = await service.removeItemFromArray(id, {}, { pull: req.body });
      return ApiResponse(res, ResponseMessages.RECORD_UPDATE_SUCCESS, dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async updateMarkup(req, res, next) {
    try {
      const { newValue } = req.query;
      const dictionary = await service.updateMarkup(req.body, newValue);
      return res.send(dictionary);
    } catch (error) {
      return next(error);
    }
  }

  async updateProducts(req, res, next) {
    try {
      const { products } = req.body;
      const dictionary = await service.updateProducts(products);
      return res.send(dictionary);
    } catch (error) {
      return next(error);
    }
  }
}
module.exports = new DictionaryController();

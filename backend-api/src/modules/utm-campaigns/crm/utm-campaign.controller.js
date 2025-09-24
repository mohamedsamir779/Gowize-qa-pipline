const slugify = require('slugify');
const { userService } = require('src/modules/services');
const { ApiResponse } = require('src/common/handlers');
const { ResponseMessages } = require('src/common/data');
const utmCampaignService = require('../utm-campaign.service');
const { UTMCampaignModel } = require('../utm-campaign.model');

class UtmCampaginController {
  async addPromotion(req, res, next) {
    try {
      const params = {
        ...req.body,
        hasForm: !!(req.body.fields && req.body.fields.length > 0),
        addedBy: req.user.id,
        userId: req.body.user,
      };
      params.campaginToken = Math.random().toString(26).slice(2) + slugify(params.name);
      const dataFind = await utmCampaignService.findOne({ campaginToken: params.campaginToken });
      if (dataFind) {
        next(new Error('URL is already Exist'), null);
      } else {
        const user = params.userId ? await userService.findById(params.userId) : null;
        params.fullUrl = user
          ? `${params.url}/register/${params.section}/${params.type.toLowerCase()}?utm-campaign=${params.campaginToken}&ref=${user.recordId}`
          : `${params.url}/register/${params.section}/${params.type.toLowerCase()}?utm-campaign=${params.campaginToken}`;

        const promotion = await utmCampaignService.create(params);
        return ApiResponse(res, true, ResponseMessages.RECORD_CREATE_SUCCESS, promotion);
      }
    } catch (error) {
      next(error, null);
    }
  }

  async getPromotions(req, res, next) {
    try {
      const rec = await utmCampaignService.findWithPagination({
        ...req.query,
      }, {
        populate: [{
          path: 'userId',
        }],
      });
      return ApiResponse(res, true, ResponseMessages.RECORD_FETCH_SUCCESS, rec);
    } catch (error) {
      return next(error);
    }
  }

  async editPromotion(req, res, next) {
    try {
      const params = {
        ...req.body,
        ...req.params,
        userId: req.body.user,
      };
      const user = params.userId ? await userService.findById(params.userId) : null;
      params.fullUrl = user
        ? `${params.url}/register/${params.section}/${params.type.toLowerCase()}?utm-campaign=${params.campaignToken}&ref=${user.recordId}`
        : `${params.url}/register/${params.section}/${params.type.toLowerCase()}?utm-campaign=${params.campaignToken}`;

      const promotion = await utmCampaignService.update({ campaginToken: params.campaignToken },
        params);
      return ApiResponse(res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, promotion);
    } catch (error) {
      next(error, null);
    }
  }

  async deletePromotion(req, res, next) {
    try {
      const { campaignToken } = req.params;
      const promotion = await UTMCampaignModel.deleteOne({ campaginToken: campaignToken });
      return ApiResponse(res, true, ResponseMessages.RECORD_DELETE_SUCCESS, promotion);
    } catch (error) {
      next(error, null);
    }
  }
}
module.exports = new UtmCampaginController();

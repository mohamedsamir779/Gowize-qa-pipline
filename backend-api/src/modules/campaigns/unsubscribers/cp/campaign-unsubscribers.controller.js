const service = require('./campaign-unsubscribers.service');

class EmailCampaignController {
  async unsubscribe(req, res, next) {
    try {
      return res.json(await service.unsubscribe(req.body));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new EmailCampaignController();

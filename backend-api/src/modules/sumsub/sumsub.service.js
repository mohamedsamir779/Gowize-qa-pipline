const axios = require('axios').default;
const crypto = require('crypto');
const FormData = require('form-data');
const { Cruds } = require('src/common/handlers');
const { documentService } = require('src/modules/services');
const { Model, Schema } = require('./sumsub-callbacks.model');

const SUMSUB_BASE_URL = 'https://api.sumsub.com';
const LEVEL_NAME = 'basic-kyc-level';
const TTL_IN_SECS = 6000;
const SUMSUB_APP_TOKEN = 'prd:GjvEJEFvDAawJoHcBSwszWDo.xk1gMhOR1gvds3bW5RN64sCNxEb6Jdhs';
// sandbox - sbx:Ir0wHa3P5azUAZF6PJYDDvPB.d5VGnrK57JwgmYeFZqaN3XXQZChCNaXd 
// sandbox - 5BRrJgLUenjsb8XBFXlvMTmJiZrEQMKK
const SUMSUB_SECRET_KEY = 'qCXtTxIuTsqn739ZNeC6uBDzjmi4S7EI';

const WEBHOOK_SECRET_KEY = 'nbhY5uDISaJYSxJJRYt6FBjEg0B';

function createSignature(config) {
  if (!config.isSumsub) return config;
  console.log('Creating a signature for the request...');

  const ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256', SUMSUB_SECRET_KEY);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = signature.digest('hex');

  return config;
}

function createAccessToken(externalUserId, levelName = LEVEL_NAME, ttlInSecs = TTL_IN_SECS) {
  const config = {};
  console.log('Creating an access token for initializng SDK...');
  config.baseURL = SUMSUB_BASE_URL;
  const method = 'post';
  const url = `/resources/accessTokens?userId=${encodeURIComponent(externalUserId)}&ttlInSecs=${ttlInSecs}&levelName=${encodeURIComponent(levelName)}`;

  const headers = {
    Accept: 'application/json',
    'X-App-Token': SUMSUB_APP_TOKEN,
  };

  config.method = method;
  config.url = url;
  config.headers = headers;
  config.data = null;

  return config;
}

axios.interceptors.request.use(createSignature, (err) => Promise.reject(err));

class SumsubService extends Cruds {
  async generateAccessToken(userId) {
    try {
      const cfg = createAccessToken(userId, LEVEL_NAME, TTL_IN_SECS);
      cfg.isSumsub = true;
      const response = await axios(cfg);
      if (response.status === 200) {
        console.log(`Found code: ${response.data}`)
        return response.data;
      }
      console.log(response);
      throw new Error('Failed to create access token');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async handleApplicantReviewed(payload) {
    const { reviewResult, externalUserId: customerId, applicantId } = payload;
    console.log('reviewResult', reviewResult, payload);
    const { reviewAnswer } = reviewResult;
    if (reviewAnswer === 'GREEN') {
      return documentService.updateKyc(customerId, applicantId, 'APPROVED');
    }
    if (reviewAnswer === 'RED') {
      return documentService.updateKyc(customerId, applicantId, 'REJECTED');
    }
    throw new Error('Unknown Review Answer');
  }

  async handleEvent(payload) {
    const { externalUserId: customerId, applicantId } = payload;
    switch (payload.type?.toUpperCase()) {
      // case 'applicantCreated':
      //   return documentService.update(customerId, 'PENDING');
      case 'applicantPending'?.toUpperCase():
        return documentService.updateKyc(customerId, applicantId, 'PENDING');
      case 'applicantReviewed'?.toUpperCase():
        return this.handleApplicantReviewed(payload);
      // case 'applicantOnHold':
      // case 'applicantActionPending':
      case 'applicantActionReviewed'?.toUpperCase():
        return this.handleApplicantReviewed(payload);
      // case 'applicantActionOnHold':
      // case 'applicantPersonalInfoChanged':
      case 'applicantWorkflowCompleted'?.toUpperCase():
        return this.handleApplicantReviewed(payload);
      // case 'applicantLevelChanged':
      case 'applicantReset'?.toUpperCase():
        return this.handleApplicantReviewed(payload);
        // return documentService.update(customerId, 'PENDING');
      // case 'applicantDeleted':
      //   return documentService.update(customerId, 'PENDING');
      // case 'applicantDeactivated':
      // case 'applicantActivated':
      // case 'applicantTagsChanged':
      default: {
        console.log(payload);
        throw new Error('unknown Event');
      }
    }
  }

  async saveEvent(payload) {
    try {
      const response = await this.create(payload);
      this.handleEvent(response);
      return response;
    } catch (error) {
      console.log(payload, 'Failed Event');
      console.log(error);
      throw error;
    }
  }
}

module.exports = new SumsubService(Model, Schema);

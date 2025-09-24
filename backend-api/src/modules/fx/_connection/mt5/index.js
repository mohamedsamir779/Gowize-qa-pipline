const demoServer = require('./auth')(true);
const liveServer = require('./auth')(false);
const { generatePassword } = require('src/common/handlers');

const TradingInterface = require('../trading.interface');
const { logger } = require('../../../../common/lib');

const getServer = (isDemo) => {
  if (isDemo) return demoServer;
  return liveServer;
};

const getRights = () => 1;

const generateAccParams = (params) => ({
  name: `${params.firstName} ${params.lastName}`,
  zipcode: params.zipCode,
  group: params.groupPath,
  city: params.city,
  state: params.state,
  comment: params.source,
  country: params.country,
  email: params.email,
  phone: params.phone,
  address: `${params.address}`,
  // agent: params.agent,
  leverage: params.leverage || 400,
  Rights: getRights(),
  pass_main: params.password,
  pass_investor: params.investorPassword,
});

class TradingMt5 extends TradingInterface {
  async createAccount(params, isDemo = true) {
    const data = generateAccParams(params);
    if (params.login) data.login = params.login;
    return getServer(isDemo).authorizedGet('/user_add', data);
  }

  /**
   *{
      "Login":"60004743",
      "Group":"real\\real",
      "CertSerialNumber":"0",
      "Rights":"1",
      "MQID":"0",
      "Registration":"1684167936",
      "LastAccess":"1684167936",
      "LastPassChange":"1684167936",
      "LastIP":"",
      "Name":"andrew hany",
      "FirstName":"andrew hany",
      "LastName":"",
      "MiddleName":"",
      "Company":"",
      "Account":"",
      "Country":"Algeria",
      "Language":"0",
      "ClientID":"0",
      "City":"Tanta",
      "State":"",
      "ZipCode":"123123",
      "Address":"asdas",
      "Phone":"+213123123",
      "Email":"andrew@mailinator.com",
      "ID":"",
      "Status":"",
      "Comment":"FOREX_LIVE",
      "Color":"4278190080",
      "PhonePassword":"",
      "Leverage":"1",
      "Agent":"0",
      "LimitPositions":"0",
      "LimitOrders":"0",
      "CurrencyDigits":"2",
      "Balance":"0.00",
      "Credit":"0.00",
      "InterestRate":"0.00",
      "CommissionDaily":"0.00",
      "CommissionMonthly":"0.00",
      "CommissionAgentDaily":"0.00",
      "CommissionAgentMonthly":"0.00",
      "BalancePrevDay":"0.00",
      "BalancePrevMonth":"0.00",
      "EquityPrevDay":"0.00",
      "EquityPrevMonth":"0.00",
      "TradeAccounts":"",
      "LeadCampaign":"",
      "LeadSource":"",
    }
   */
  async getAccount(login, isDemo = true, { noReject = false } = {}) {
    return getServer(isDemo).authorizedGet('/user_get', { login }, noReject);
  }

  async getEquity(login, isDemo = true) {
    if (login.length === 0) return [];
    const url = typeof (login) === 'object' ? '/user_account_get_batch' : '/user_account_get';
    try {
      const resp = await getServer(isDemo).authorizedGet(url, {
        login,
      });
      return {
        isError: false,
        ...resp,
      };
    } catch (error) {
      logger.error(`[MT5] Error getting equity for ${login} [${error}]`);
      return {
        isError: true,
        Login: login,
        CurrencyDigits: '2',
        Balance: '0.00',
        Credit: '0.00',
        Margin: '0.00',
        MarginFree: '0.00',
        MarginLevel: '0.00',
        MarginLeverage: '0',
        Profit: '0.00',
        Storage: '0.00',
        Floating: '0.00',
        Equity: '0.00',
        SOActivation: '0',
        SOTime: '0',
        SOLevel: '0.00',
        SOEquity: '0.00',
        SOMargin: '0.00',
        Assets: '0.00',
        Liabilities: '0.00',
        BlockedCommission: '0.00',
        BlockedProfit: '0.00',
        MarginInitial: '0.00',
        MarginMaintenance: '0.00',
      };
    }
  }

  async getBalance(params, isDemo = true) {
    console.log('mt5 account created', params, isDemo);
    return { Login: 1001 };
  }

  /**
   *
   {
    "Login":"60004743",
    "Group":"real\\real",
    "CertSerialNumber":"0",
    "Rights":"1",
    "MQID":"0",
    "Registration":"1684167936",
    "LastAccess":"1684167936",
    "LastPassChange":"1684167936",
    "LastIP":"",
    "Name":"andrew hany",
    "FirstName":"andrew hany",
    "LastName":"",
    "MiddleName":"",
    "Company":"",
    "Account":"",
    "Country":"Algeria",
    "Language":"0",
    "ClientID":"0",
    "City":"Tanta",
    "State":"",
    "ZipCode":"123123",
    "Address":"asdas",
    "Phone":"+213123123",
    "Email":"andrew@mailinator.com",
    "ID":"",
    "Status":"",
    "Comment":"FOREX_LIVE",
    "Color":"4278190080",
    "PhonePassword":"",
    "Leverage":"400",
    "Agent":"0",
    "LimitPositions":"0",
    "LimitOrders":"0",
    "CurrencyDigits":"2",
    "Balance":"0.00",
    "Credit":"0.00",
    "InterestRate":"0.00",
    "CommissionDaily":"0.00",
    "CommissionMonthly":"0.00",
    "CommissionAgentDaily":"0.00",
    "CommissionAgentMonthly":"0.00",
    "BalancePrevDay":"0.00",
    "BalancePrevMonth":"0.00",
    "EquityPrevDay":"0.00",
    "EquityPrevMonth":"0.00",
    "TradeAccounts":"",
    "LeadCampaign":"",
    "LeadSource":""
    }
   */
  async updateAccount(login, params, isDemo = true) {
    console.log('mt5 updateAccount', params, isDemo);
    return getServer(isDemo).authorizedGet('/user_update', { login, ...params });
  }

  async changePassword(login, type, password, isDemo = true) {
    console.log('mt5 changePassword ', type, isDemo, login);
    return getServer(isDemo).authorizedGet('/user_pass_change', { login, type, password });
  }

  async changeLeverage(params, isDemo = true) {
    console.log('mt5 account created', params, isDemo);
    return { Login: 1001 };
  }

  // {ticket: '41944'}
  async deposit(login, balance, comment, isDemo = true) {
    return getServer(isDemo).authorizedGet('trade_balance', {
      login,
      balance,
      comment,
    });
  }

  // {ticket: '41944'}
  async withdraw(login, balance, comment, isDemo = true) {
    return getServer(isDemo).authorizedGet('trade_balance', {
      login,
      balance: -(balance),
      comment,
    });
  }

  async creditIn(login, balance, comment, isDemo = true) {
    return getServer(isDemo).authorizedGet('trade_balance', {
      login,
      balance,
      comment,
      type: 3,
    });
  }

  async creditOut(login, balance, comment, isDemo = true) {
    return getServer(isDemo).authorizedGet('trade_balance', {
      login,
      balance,
      comment,
      type: 3,
    });
  }

  async credit(login, balance, comment, isDemo = true) {
    return getServer(isDemo).authorizedGet('trade_balance', {
      login,
      balance,
      comment,
      type: 3,
    });
  }

  // reduce commision from client and fix flag
  async reduceCommission(login, dealId, amount) {
    const dealCommission = await getServer(false).authorizedGet('deal/get', {
      ticket: dealId,
    });
    const previousCommission = (dealCommission && dealCommission.Commission)
      ? parseFloat(dealCommission.Commission)
      : 0;
    const commissionRes = await getServer(false).authorizedPost('/deal_update', {
      Deal: dealId,
      Login: login,
      Commission: previousCommission - (amount),
    });
    if (commissionRes) {
      await getServer(false).authorizedGet('user/check_balance', {
        Login: login,
        fixflag: 1,
      });
      return true;
    }
    return false;
  }

  // add commission to ib
  async makeCommission(login, dealId, amount, ib) {
    await getServer(false).authorizedGet('/trade_balance', {
      login: ib,
      type: 18,
      balance: amount,
      comment: `A:${login}_D:${dealId}`,
    });
    return true;
  }

  async addCommission(params, isDemo = true) {
    console.log('mt5 account created', params, isDemo);
    return { Login: 1001 };
  }

  // add rebate
  async addRebate(login, dealId, amount, ib) {
    const res = await getServer(false).authorizedGet('/trade_balance', {
      login: ib,
      type: 10,
      balance: amount,
      comment: `A:${login}_D:${dealId}`,
    });
    return true;
  }

  async getTotalOpenPositions(login, isDemo = true) {
    console.log('mt5 account created', login, isDemo);
    return getServer(isDemo).authorizedGet('/position_get_total', {
      login,
    });
  }

  async getOpenPositions({
    login, total, offset,
  }, isDemo = true) {
    return getServer(isDemo).authorizedGet('/position_get_page', {
      login, total, offset,
    });
  }

  async getAllPositions({
    login, total = 10, offset = 0, from, to,
  }, isDemo = true) {
    return from && to
      ? getServer(isDemo).authorizedGet('/deal_get_page', {
        login,
        total,
        offset,
        from: from / 1000,
        to: to / 1000,
      })
      : getServer(isDemo).authorizedGet('/deal_get_page', {
        login,
        total,
        offset,
      });
  }

  async getTotalAllPositions(login, isDemo = true) {
    return getServer(isDemo).authorizedGet('/deal_get_total', {
      login,
    });
  }

  async getClosePositions() {
    return false;
  }

  async getUserRights(login, isDemo = false) {
    const user = await getServer(isDemo).authorizedGet('/user_get', { login });
    const rightsNum = parseInt(user.Rights, 10);
    return this.fetchRights(rightsNum);
  }

  async setUserRights(login, rights = {
    USER_RIGHT_ENABLED: false,
    USER_RIGHT_PASSWORD: false,
    USER_RIGHT_TRADE_DISABLED: false,
    USER_RIGHT_INVESTOR: false,
    USER_RIGHT_CONFIRMED: false,
    USER_RIGHT_TRAILING: false,
    USER_RIGHT_EXPERT: false,
    USER_RIGHT_OBSOLETE: false,
    USER_RIGHT_REPORTS: false,
    USER_RIGHT_READONLY: false,
    USER_RIGHT_RESET_PASS: false,
    USER_RIGHT_OTP_ENABLED: false,
    USER_RIGHT_SPONSORED_HOSTING: false,
    USER_RIGHT_API_ENABLED: false,
  }, isDemo = false) {
    const rightsNum = this.setRights(rights);
    const rep = await getServer(isDemo).authorizedGet('/user_update', { login, Rights: rightsNum });
    return { ...rep, USER_RIGHT_TRADE_DISABLED: rights.USER_RIGHT_TRADE_DISABLED };
  }

  fetchRights(rightsInp) {
    const rights = {
      USER_RIGHT_ENABLED: false,
      USER_RIGHT_PASSWORD: false,
      USER_RIGHT_TRADE_DISABLED: false,
      USER_RIGHT_INVESTOR: false,
      USER_RIGHT_CONFIRMED: false,
      USER_RIGHT_TRAILING: false,
      USER_RIGHT_EXPERT: false,
      USER_RIGHT_OBSOLETE: false,
      USER_RIGHT_REPORTS: false,
      USER_RIGHT_READONLY: false,
      USER_RIGHT_RESET_PASS: false,
      USER_RIGHT_OTP_ENABLED: false,
      USER_RIGHT_SPONSORED_HOSTING: false,
      USER_RIGHT_API_ENABLED: false,
    };
    let rightsNum = rightsInp;

    if (rightsNum === 0) return rights;

    if (rightsNum > 0 && Math.floor(rightsNum / 16384) >= 1) rights.USER_RIGHT_API_ENABLED = true;
    rightsNum %= 16384;

    if (rightsNum > 0 && Math.floor(rightsNum / 8194) >= 1) rights.USER_RIGHT_SPONSORED_HOSTING = true;
    rightsNum %= 8194;

    if (rightsNum > 0 && Math.floor(rightsNum / 2048) >= 1) rights.USER_RIGHT_OTP_ENABLED = true;
    rightsNum %= 2048;

    if (rightsNum > 0 && Math.floor(rightsNum / 1024) >= 1) rights.USER_RIGHT_RESET_PASS = true;
    rightsNum %= 1024;

    if (rightsNum > 0 && Math.floor(rightsNum / 512) >= 1) rights.USER_RIGHT_READONLY = true;
    rightsNum %= 512;

    if (rightsNum > 0 && Math.floor(rightsNum / 256) >= 1) rights.USER_RIGHT_REPORTS = true;
    rightsNum %= 256;

    if (rightsNum > 0 && Math.floor(rightsNum / 128) >= 1) rights.USER_RIGHT_OBSOLETE = true;
    rightsNum %= 128;

    if (rightsNum > 0 && Math.floor(rightsNum / 64) >= 1) rights.USER_RIGHT_EXPERT = true;
    rightsNum %= 64;

    if (rightsNum > 0 && Math.floor(rightsNum / 32) >= 1) rights.USER_RIGHT_TRAILING = true;
    rightsNum %= 32;

    if (rightsNum > 0 && Math.floor(rightsNum / 16) >= 1) rights.USER_RIGHT_CONFIRMED = true;
    rightsNum %= 16;

    if (rightsNum > 0 && Math.floor(rightsNum / 8) >= 1) rights.USER_RIGHT_INVESTOR = true;
    rightsNum %= 8;

    if (rightsNum > 0 && Math.floor(rightsNum / 4) >= 1) rights.USER_RIGHT_TRADE_DISABLED = true;
    rightsNum %= 4;

    if (rightsNum > 0 && Math.floor(rightsNum / 2) >= 1) rights.USER_RIGHT_PASSWORD = true;
    rightsNum %= 2;

    if (rightsNum > 0 && Math.floor(rightsNum / 1) >= 1) rights.USER_RIGHT_ENABLED = true;

    return rights;
  }

  setRights(rightsObj = {
    USER_RIGHT_ENABLED: false,
    USER_RIGHT_PASSWORD: false,
    USER_RIGHT_TRADE_DISABLED: false,
    USER_RIGHT_INVESTOR: false,
    USER_RIGHT_CONFIRMED: false,
    USER_RIGHT_TRAILING: false,
    USER_RIGHT_EXPERT: false,
    USER_RIGHT_OBSOLETE: false,
    USER_RIGHT_REPORTS: false,
    USER_RIGHT_READONLY: false,
    USER_RIGHT_RESET_PASS: false,
    USER_RIGHT_OTP_ENABLED: false,
    USER_RIGHT_SPONSORED_HOSTING: false,
    USER_RIGHT_API_ENABLED: false,
  }) {
    let rights = 0;
    if (rightsObj.USER_RIGHT_ENABLED) rights += 1;
    if (rightsObj.USER_RIGHT_PASSWORD) rights += 2;
    if (rightsObj.USER_RIGHT_TRADE_DISABLED) rights += 4;
    if (rightsObj.USER_RIGHT_INVESTOR) rights += 8;
    if (rightsObj.USER_RIGHT_CONFIRMED) rights += 16;
    if (rightsObj.USER_RIGHT_TRAILING) rights += 32;
    if (rightsObj.USER_RIGHT_EXPERT) rights += 64;
    if (rightsObj.USER_RIGHT_OBSOLETE) rights += 128;
    if (rightsObj.USER_RIGHT_REPORTS) rights += 256;
    if (rightsObj.USER_RIGHT_READONLY) rights += 512;
    if (rightsObj.USER_RIGHT_RESET_PASS) rights += 1024;
    if (rightsObj.USER_RIGHT_OTP_ENABLED) rights += 2048;
    if (rightsObj.USER_RIGHT_SPONSORED_HOSTING) rights += 8194;
    if (rightsObj.USER_RIGHT_API_ENABLED) rights += 16384;
    return rights;
  }
}

module.exports = new TradingMt5();

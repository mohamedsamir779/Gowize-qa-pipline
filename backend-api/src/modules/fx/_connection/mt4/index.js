// const routes = require('express').Router();
// const { router } = require('./routes/mt4Connection.routes');
// const demoServer = require('./auth')(true);
// const liveServer = require('./auth')(false);

const ax = require('axios');
const { keys } = require('src/common/data');
const TradingInterface = require('../trading.interface');

const configKeys = keys.mt4.live;

const axios = ax.create({
  baseURL: configKeys.MT4_HOST,
  timeout: 1000,
  headers: {
    Authorization: `Basic ${Buffer.from(`${configKeys.MT4_USERNAME}:${configKeys.MT4_PASSWORD}`).toString('base64')}`,
  },
});

// In Case we seperate demo and live servers
// const getServer = (isDemo) => {
//   if (isDemo) return demoServer;
//   return liveServer;
// };

const getRights = () => 1;

const generateAccParams = (params) => ({
  name: `${params.firstName} ${params.lastName}`,
  zipcode: params.zipCode,
  group: params.groupPath,
  city: params.city,
  state: params.state || 'test',
  comment: params.source,
  country: params.country,
  email: params.email,
  phone: params.phone,
  address: `${params.address}`,
  agent_account: params.agent || 0,
  leverage: params.leverage || 400,
  enable: getRights(),
  enable_read_only: 0,
  password: params.password,
  pass_investor: params.investorPassword,
  login: params.sequence || 0,
  demo: false,
  success: true,
});

const transformGetAccountData = (data) => (data ? {
  Login: data.login || '-',
  Group: data.group || '-',
  Leverage: data.leverage || '-',
  MarginLeverage: data.leverage || '-',
  Equity: data.equity || '-',
  Margin: data.margin || '-',
  MarginFree: data.margin_free || '-',
  MarginLevel: data.margin_level || '-',
  MarginType: data.margin_type || '-',
  Balance: data.balance || '-',
  Credit: data.credit || '-',
} : false);

// [{
//   "Deal":"19090",
//   "ExternalID":"15339",
//   "Login":"10027",
//   "Dealer":"1",
//   "Order":"18547",
//   "Action":"0",
//   "Entry":"1",
//   "Reason":"16",
//   "Digits":"3",
//   "DigitsCurrency":"2",
//   "ContractSize":"100.00",
//   "Time":"1659456120",
//   "TimeMsc":"1659456120804",
//   "Symbol":"XAUUSD.e",
//   "Price":"1783.450",
//   "Volume":"2500",
//   "VolumeExt":"25000000",
//   "Profit":"64.25",
//   "Storage":"0.00",
//   "Commission":"0.00",
//   "Fee":"0.00",
//   "RateProfit":"1.00000000",
//   "RateMargin":"1783.45000000",
//   "ExpertID":"0",
//   "PositionID":"18531",
//   "Comment":"",
//   "ProfitRaw":"64.25",
//   "PricePosition":"1786.020",
//   "PriceSL":"1789.500",
//   "PriceTP":"1782.000",
//   "VolumeClosed":"2500",
//   "VolumeClosedExt":"25000000",
//   "TickValue":"0.00000000",
//   "TickSize":"0.00000000",
//   "Flags":"0",
//   "Gateway":"MT5C24GWT",
//   "PriceGateway":"1783.450",
//   "ModifyFlags":"0",
//   "Value":"0.00",
//   "MarketBid":"1783.190",
//   "MarketAsk":"1783.450",
//   "MarketLast":"0.000"}]

const transformUpdateAccountData = (data) => ({
  Login: data.login || '-',
  Leverage: data.leverage || '-',
  Balance: data.balance || '-',
  BalancePrevDay: data.prevbalance || '-',
  BalancePrevMonth: data.prevmonthbalance || '-',
  Group: data.group || '-',
  Credit: data.credit || '-',
  Equity: data.equity || '-',
  EquityPrevDay: data.prevequity || '-',
  EquityPrevMonth: data.prevmonthequity || '-',
  Margin: data.margin || '-',
  MarginFree: data.margin_free || '-',
  MarginLevel: data.margin_level || '-',
  MarginType: data.margin_type || '-',
  Name: data.name || '-',
  Email: data.email || '-',
  Phone: data.phone || '-',
  ZipCode: data.zipcode || '-',
  Address: data.address || '-',
  City: data.city || '-',
  State: data.state || '-',
  Country: data.country || '-',
  LastIP: data.last_ip || '-',
  MQID: data.mqid || '-',
  Status: data.status || '-',
});

const transformOpenAndCloseDealsData = (id, x) => (x.map((data) => ({
  Login: id || data.login || '-',
  Position: data.order || '-',
  Action: data?.cmd?.toString() || '-',
  Time: data.close_time || '-',
  Symbol: data.symbol || '-',
  PriceCurrent: data.close_price || '-',
  PriceOpen: data.open_price || '-',
  PriceSL: data.sl || '-',
  PriceTP: data.tp || '-',
  Price: data.close_price || '-',
  Volume: (data?.volume || 0) * 100 || '-',
  VolumeClosed: (data?.volume || 0) * 100 || '-',
  Profit: data.profit || '0',
  TimeCreate: data.timestamp || 0,
})));

class TradingMt4 extends TradingInterface {

  async createAccount(params, isDemo) {
    const result = {};

    const data = generateAccParams(params);
    const userData = await axios.post(`CreateUser?isDemo=${isDemo}`, data);
    if (userData && userData?.data?.Data) {
      const isDemoAccount = isDemo;
      result.Login = data.login;
      result.accountType = userData.data.Data.group;
      result.platform = 'MT4';
      result.type = isDemo ? 'Demo' : 'Live';
      result.Currency = 'USD';
      result.Leverage = userData.data.Data.leverage;
      result.dateCreated = Date.now();

      const equityData = await this.getEquity(result.Login, isDemoAccount);
      result.Balance = equityData?.data?.Data?.balance || '-';
      result.Credit = equityData?.data?.Data?.credit || '-';
      result.Equity = equityData?.data?.Data?.equity || '-';
      result.Margin = equityData?.data?.Data?.margin || '-';
      result.MarginFree = equityData?.data?.Data?.margin_free || '-';
      result.MarginLevel = equityData?.data?.Data?.margin_level || '-';
      return result;
    }
    throw new Error(`Error Creating Account: ${(userData?.data?.Errors && userData?.data?.Errors[0]) || userData?.data?.Message || 'unknown error'}`);
  }

  /**
   *
   * Data Format: {
   *  "login": 1011,
   *  "group": "manager",
   *  "leverage": 100,
   *  "updated": 0,
   *  "equity": 0,
   *  "volume": 0,
   *  "margin": 0,
   *  "margin_free": 0,
   *  "margin_level": 0,
   *  "margin_type": 0,
   *  "level_type": 0,
   *  "balance": 0,
   *  "credit": 0
   *  }
   */
  async getAccount(id, isDemo) {
    const res = await axios.get(`GetSummary/${id}?isDemo=${isDemo}`);
    return res?.data?.Message === 'User Not Found' ? false : transformGetAccountData(res?.data?.Data);
  }

  async getEquity(id, isDemo) {
    const res = await axios.get(`GetSummary/${id}?isDemo=${isDemo}`);
    return transformGetAccountData(res?.data?.Data || {});
  }

  async getBalance(id, isDemo) {
    const res = await axios.get(`GetSummary/${id}?isDemo=${isDemo}`);
    return transformGetAccountData(res?.data?.Data || {});
  }

  /**
   *
   * @param {
        "comment": "string",
        "enable": 0,
        "enable_read_only": 0,
        "login": 0,
        "group": "string",
        "name": "string",
        "password": "string",
        "email": "string",
        "country": "string",
        "state": "string",
        "city": "string",
        "address": "string",
        "phone": "string",
        "zipcode": "string",
        "leverage": 0,
        "agent_account": 0,
        "success": true,
        "demo": true
      }
   * @param {*} isDemo
   * @returns  {
      "users": null,
      "total": 0,
      "userID": 1011,
      "leverage": 100,
      "agent_account": 0,
      "send_reports": 1,
      "last_ip": 0,
      "enable": 1,
      "enable_change_password": 1,
      "enable_read_only": 0,
      "enable_otp": 0,
      "mqid": 0,
      "balance": 0,
      "prevmonthbalance": 0,
      "prevbalance": 0,
      "credit": 0,
      "interestrate": 0,
      "taxes": 0,
      "prevmonthequity": 0,
      "prevequity": 0,
      "group": "manager",
      "name": "stri 123",
      "country": "string",
      "city": "string",
      "state": "string",
      "zipcode": "",
      "address": "",
      "lead_source": "",
      "phone": "string",
      "email": "root123@string.com",
      "comment": "comment2",
      "id": "",
      "status": "",
      "password": "\u0005}nRy°Ù›,Ä½ìÒ)&§\u0001"
    }
   */
  async updateAccount(login, params, isDemo) {
    const res = await axios.post(`UpdateUser?isDemo=${isDemo}`, { 
      ...params,
      login,
    });
    return transformUpdateAccountData(res?.data?.Data || {});
  }

  async changePassword(id, newPassword, changeInvestr, isDemo) {
    const result = {};

    const res = await axios.get(`ChangePassword?id=${id}&new_password=${newPassword}&change_investr=${changeInvestr}&isDemo=${isDemo}`);
    result.status = res.data.status;
    return result;
  }

  async changeLeverage(params, isDemo) {
    const res = await this.updateAccount(params, isDemo);
    return transformUpdateAccountData(res?.data?.Data || {});
  }

  async deposit(login, amount, comment, isDemo = true) {
    const result = await axios.post(
      `Deposit?isDemo=${isDemo}`,
      {
        login,
        amount: Math.abs(amount),
        comment,
      },
    );
    if (result?.data?.Status) {
      return true;
    }
    return false;
  }

  async withdraw(login, amount, comment, isDemo = true) {
    const result = await axios.post(
      `Withdraw?isDemo=${isDemo}`,
      {
        login,
        amount: Math.abs(amount),
        comment,
      },
    );
    if (result?.data?.Status) {
      return true;
    }
    return false;
  }

  async creditIn(login, amount, comment, isDemo = true) {
    const result = axios.post(
      `creditIn?isDemo=${isDemo}`,
      {
        login,
        amount: Math.abs(amount),
        comment,
      },
    );
    if (result?.data?.Status) {
      return true;
    }
    return false;
  }

  async creditOut(login, amount, comment, isDemo = true) {
    const result = await axios.post(
      `creditOut?isDemo=${isDemo}`,
      {
        login,
        amount: Math.abs(amount),
        comment,
      },
    );
    if (result?.data?.Status) {
      return true;
    }
    return false;
  }

  async reduceCommission(login, dealId, amount) {
    // const dealCommission = await axios.get(`GetTradeRecord/${dealId}?isDemo=false`);
    // const previousCommission = (dealCommission && dealCommission.commission)
    //   ? parseFloat(dealCommission.Commission)
    //   : 0;
    const commission = parseFloat(amount);
    const commissionRes = await axios.post(
      `UpdateTradeCommission/${login}?orderId=${dealId}&comission=${commission}&isDemo=false`,
    );
    return commissionRes?.data?.Status || false;
  }

  async makeCommission(login, dealId, amount, ib) {
    return this.deposit(
      ib,
      amount,
      `18_A:${login}_D:${dealId}`,
      false,
    );
  }

  // not used
  async addCommission(loginId, orderId, commission, isDemo) {
    const result = await axios.post(
      `UpdateTradeCommission/${loginId}?orderId=${orderId}&comission=${commission}&isDemo=${isDemo}`,
      {},
    );
    return result;
  }

  async addRebate(login, dealId, amount, ib) {
    return this.deposit(
      ib,
      amount,
      `10_A:${login}_D:${dealId}`,
      false,
    );
  }

  async getOpenPositions(id, isDemo = true) {
    const closePositionsData = await axios.get(`GetLiveTrades/${id}?isDemo=${isDemo}`);
    return transformOpenAndCloseDealsData(id, closePositionsData?.data?.Data || []);
  }

  // gets all closed positions
  async getAllPositions({ login, fromDate, toDate }, isDemo = true) {
    const closePositionsData = await axios.get(`GetOpenCLosePosition/${login}?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}&isDemo=${isDemo}`);
    return transformOpenAndCloseDealsData(login, closePositionsData?.data?.Data || []);
  }

  getClosePositions() {
    return false;
  }
}

module.exports = new TradingMt4();

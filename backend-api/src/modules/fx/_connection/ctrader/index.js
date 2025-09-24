const crypto = require('crypto');
const { keys } = require('src/common/data');
const demoServer = require('./auth')(true);
const liveServer = require('./auth')(false);
const TradingInterface = require('../trading.interface');
const { logger } = require('src/common/lib');
const { ConvertCountryToID } = require('src/common/data/countries.js');
// const BROKER_NAME = "chsandbox";
// const  ENABLE_CID_LINK = false;
//const BROKER_NAME = "ZTFX";
//TODO

const config = keys.broker;

function generateAccParams(params) {
  //TODO: contactDetails
  let countryCode = ConvertCountryToID(params.country);
  let accessRights = params.type === 'IB' ? 'NO_TRADING' : 'FULL_ACCESS';
  const body = {
    //TODO: groupname
    groupName: params.group ? params.group : params.groupPath,
    hashedPassword: crypto.createHash('md5').update(params.password).digest('hex'),
    depositCurrency: params.currency || 'USD',
    accessRights: accessRights,
    brokerName: config.WHITE_LABEL,
    balance: 0,
    bonus: 0,
    nonWithdrawableBonus: 0,
    leverageInCents: params.leverage * 100,
    maxLeverage: params.leverage * 100,
    contactDetails: {
      address: params.address,
      city: params.city,
      countryId: countryCode,
      documentId: '0123',
      email: params.email,
      phone: params.pgone,
      state: params.state,
      zipCode: params.zipCode,
      introducingBroker1: '',
      introducingBroker2: '',
    },
    registrationTimestamp: Date.now(),
    lastUpdateTimestamp: Date.now(),
    equity: 0,
    usedMargin: 0,
    freeMargin: 0,
    accountType: 'HEDGED',
    limitedRisk: false,
    sendOwnStatement: false,
    swapFree: true,
    totalMarginCalculationType: 'MAX',
    isLimitedRisk: false,
    moneyDigits: 2,
    name: params.firstName,
    lastName: params.lastName,
  };
  return body;
}
function getServer(isDemo) {
  if (isDemo) return demoServer;
  return liveServer;
}
class CTraderService extends TradingInterface {
  async createUserAccount(broker, email, isDemo = true) {
    logger.log('info', 'CTRADER::CreateUserAccount');
    // return getServer(isDemo).Post('ctid/create', { email: email},true);
    return getServer(isDemo).Post('ctid/create', {
      brokerName: broker,
      email,
    }, true);
  }

  async createAccount(params, isDemo = true) {
    // TODO
    logger.log('info', 'CTRADER::CreateAccount');
    const data = generateAccParams(params);
    logger.log(
      'info',
      `account create params: leverage in cents: ${data.leverageInCents} Max leverage: ${data.maxLeverage}`,
    );
    if (config.ENABLE_CID_LINK === 'true') {
      const accountRes = await this.createUserAccount(config.BROKER_NAME, params.email, isDemo);
      const res = await getServer(isDemo).Post('traders', data);
      const linkResp = await this.linkWithCTID(
        res.login,
        data.hashedPassword,
        accountRes.userId,
        config.WHITE_LABEL,
        isDemo ? 'demo' : 'live',
        isDemo,
      );
      return res;
    }
    return getServer(isDemo).Post('traders', data);
  }

  async linkWithCTID(_login, _password, _userId, _brokerName, _environmentName, isDemo = true) {
    logger.log('info', 'CTRADER::Linking with CTID');
    const param = {
      environmentName: _environmentName,
      brokerName: _brokerName,
      traderLogin: _login,
      traderPasswordHash: _password,
      userId: _userId,
    };
    return getServer(isDemo).Post('ctid/link', param, true, true);
  }

  async getAccount(login, isDemo = true) {
    try {
      // TODO
      logger.log('info', 'CTRADER::Get Account');
      return getServer(isDemo).Get(`traders/${login}`);
    } catch (error) {
      console.log(error);
      return {
        login,
        Login: login,
        leverageInCents: 0,
        balance: 0,
        bonus: 0,
        equity: 0,
        usedMargin: 0,
        freeMargin: 0, 
      };
    }
  }

  async getAccounts(from, to, groupId = '', isDemo = true) {
    // TODO
    logger.log('info', 'CTRADER::Get Accounts');
    let param = `from=${from}&to=${to}`;
    if (groupId) param += `&groupId=${groupId}`;
    return getServer(isDemo).authorizedGet('traders', param, true);
  }

  async getEquity(login, isDemo = true) {
    // TODO
    logger.log('info', 'CTRADER::GetEquity');
    if (login.length === 0) return [];

    
    try {
      const resp = await getServer(isDemo).Get(`traders/${login}`, login, false);
      console.log(`Response, `, resp);
      return resp;
    } catch (error) {
      logger.error(`[CTRADER] Error getting equity for ${login} [${error}]`);
      return {
        login,
        Login: login,
        leverageInCents: 0,
        balance: 0,
        bonus: 0,
        equity: 0,
        usedMargin: 0,
        freeMargin: 0, 
      };
    }
  }

  async getBalance(params, isDemo = true) {
    // TODO
    console.log('cTrader account created', params, isDemo);
    return { Login: 1001 };
  }

  async updateAccount(login, params, isDemo = true) {
    // TODO
    console.log('cTrader updateAccount', params, isDemo);
    return getServer(isDemo).Patch('traders/' + login, params);
  }

  async changePassword(login, type, password, isDemo = true) {
    // TODO
    console.log('cTrader changePassword ', type, isDemo, login);
    return getServer(isDemo).authorizedGet('/user_pass_change', { login, type, password });
  }

  async changeLeverage(params, isDemo = true) {
    // TODO
    console.log('cTrader account created', params, isDemo);
    return { Login: 1001 };
  }

  async deposit(login, balance, comment, isDemo = true) {
    // TODO
    const TYPE = 'DEPOSIT';
    const param = {
      login,
      preciseAmount: balance,
      type: TYPE,
      comment,
      externalNote: comment, // externalNote
    };
    logger.log(
      'info',
      `Params: login:${login} | balance: ${balance} | type: ${TYPE}| comment: ${comment} | note: ${comment}`,
    );

    return getServer(isDemo).Post(`traders/${login}/changebalance`, param);
  }

  async withdraw(login, balance, comment, isDemo = true) {
    // TODO
    const TYPE = 'WITHDRAW';
    const param = {
      login,
      preciseAmount: balance,
      type: TYPE,
      comment,
      externalNote: comment,
    };
    logger.log(
      'info',
      `WD. Params: login:${login} | balance: ${balance} | type: ${TYPE}| comment: ${comment} | note: ${comment}`
    );

    return getServer(isDemo).Post(`traders/${login}/changebalance`, param);
  }

  async creditIn(login, balance, comment, isDemo = true) {
    // TODO
    const TYPE = 'DEPOSIT'; //  bonus= credit
    const param = {
      login,
      preciseAmount: balance,
      type: TYPE,
      comment,
      externalNote: comment,
    };
    logger.log(
      'info',
      `Params: login:${login} | balance: ${balance} | type: ${TYPE}| comment: ${comment} | note: ${comment}`,
    );
    return getServer(isDemo).Post(`traders/${login}/changebonus`, param);
  }

  async creditOut(login, balance, comment, isDemo = true) {
    // TODO
    const TYPE = 'WITHDRAW'; // bonus= credit
    const param = {
      login,
      preciseAmount: balance,
      type: TYPE,
      comment,
      externalNote: comment,
    };
    return getServer(isDemo).Post(`traders/${login}/changebonus`, param);
  }

  async credit(login, balance, comment, type, isDemo = true) {
    // TODO
    if (type === 'CREDIT_IN') {
      return this.creditIn(login, balance, comment, isDemo);
    }
    if (type === 'CREDIT_OUT') {
      return this.creditOut(login, balance, comment, isDemo);
    }
    return getServer(isDemo).authorizedGet('trade_balance', {
      login,
      balance,
      comment,
      type: 3,
    });
  }

  async reduceCommission(login, dealId, amount) {
    // TODO
    const dealCommission = await getServer(false).authorizedGet('deal/get', {
      ticket: dealId,
    });
    // eslint-disable-next-line max-len
    const previousCommission = dealCommission && dealCommission.Commission ? parseFloat(dealCommission.Commission) : 0;
    const commissionRes = await getServer(false).authorizedPost('/deal_update', {
      Deal: dealId,
      Login: login,
      Commission: previousCommission - amount,
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

  async makeCommission(login, dealId, amount, ib) {
    // TODO
    await getServer(false).authorizedGet('trade_balance', {
      login: ib,
      type: 18,
      balance: amount,
      comment: `A:${login}_D:${dealId}`,
    });
    return true;
  }

  async addCommission(params, isDemo = true) {
    console.log('cTrader account created', params, isDemo);
    // TODO
    return { Login: 1001 };
  }

  async addRebate(login, dealId, amount, ib) {
    // TODO
    const res = await getServer(false).authorizedGet('trade_balance', {
      login: ib,
      type: 10,
      balance: amount,
      comment: `A:${login}_D:${dealId}`,
    });
    console.log(res);
    return true;
  }

  async getTotalOpenPositions(login, isDemo = true) {
    // TODO
    logger.log('info', 'CTRADER::Get Total open positions');
    return getServer(isDemo).Get('openPositions', login);
  }

  async getOpenPositions({ login, total, offset }, isDemo = true) {
    // TODO
    logger.log('info', 'CTRADER::Get Total open positions');
    const positionsStr = await getServer(isDemo).GetText('openPositions', `login=${login}`, true);
    const split = positionsStr.split('\r\n');

    const obj = [];
    split.forEach((row, index) => {
      if (index > 0 && row.includes(',')) {
        const positions = row.split(',');
        const position = {
          Login: positions[0],
          Position: positions[1],
          TimeCreate: new Date(positions[2]).getTime() ?? '',
          PriceOpen: positions[3],
          Action: positions[4],
          Volume: positions[5],
          Symbol: positions[6],
          Commission: positions[7],
          Swap: positions[8],
          bookType: positions[9],
          stake: positions[10],
          spreadBetting: positions[11],
          usedMargin: positions[12],
        };
        obj.push(position);
      }
    });

    console.log(split);
    return obj;
  }

  async getAllPositions({ login, total = 10, offset = 0, fromDate, toDate }, isDemo = true) {
    // TODO
    logger.log('info', 'CTRADER::Get closed positions');
    let orders = {};
    const from = new Date();
    from.setDate(from.getDate() - 1);
    console.log(`From: ${from}`);
    // eslint-disable-next-line no-unused-expressions
    fromDate && toDate
      ? (orders = await getServer(isDemo).GetText(
        'closedPositions',
        `login=${login}&from=${from.toISOString()}&to=${new Date(toDate).toISOString()}`,
        true,
      ))
      : (orders = await getServer(isDemo).GetText('closedPositions', `login=${login}`, true));
    const split = orders.split('\r\n');

    const obj = [];
    split.forEach((row, index) => {
      if (index > 0 && row.includes(',')) {
        const _orders = row.split(',');
        const _order = {
          Login: _orders[0],
          Position: _orders[1],
          TimeCreate: new Date(_orders[2]).getTime() ?? '',
          TimeClose: new Date(_orders[3]).getTime() ?? '',
          PriceClose: _orders[4],
          Action: _orders[5],
          Volume: _orders[6],
          Symbol: _orders[7],
          Commission: _orders[8],
          Swap: _orders[9],
          Profit: _orders[10],
          bookType: _orders[13],
          stake: _orders[14],
          spreadBetting: _orders[15],
          PriceOpen: _orders[16],
          DealID: _orders[17],
        };
        obj.push(_order);
      }
    });

    console.log(split);
    return obj;
    // return getServer(isDemo).authorizedGet('/deal_get_page', {
    //   login,
    //   total,
    //   offset,
    // });
  }

  async getTotalAllPositions(login, isDemo = true) {
    // TODO
    return getServer(isDemo).authorizedGet('/deal_get_total', {
      login,
    });
  }

  async getClosePositions(login, isDemo = false) {
    // TODO
    logger.log('info', 'CTRADER::Get Total closed positions');
    const positionsStr = await getServer(isDemo).GetText('closedPositions', `login=${login}`, true);
    const split = positionsStr.split('\r\n');
    console.log(positionsStr);
    return false;
  }

  async getUserRights(login, isDemo = false) {
    // TODO
    const user = await getServer(isDemo).authorizedGet('/user_get', { login });
    const rightsNum = parseInt(user.Rights, 10);
    return this.fetchRights(rightsNum);
  }

  async setUserRights(
    login,
    rights = {
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
    },
    isDemo = false,
  ) {
    // TODO
    const rightsNum = this.setRights(rights);
    const rep = await getServer(isDemo).authorizedGet('/user_update', { login, Rights: rightsNum });
    return { ...rep, USER_RIGHT_TRADE_DISABLED: rights.USER_RIGHT_TRADE_DISABLED };
  }
}

module.exports = new CTraderService();

const crypto = require('crypto');
const { keys } = require('src/common/data');
const { logger } = require('src/common/lib');
const axios = require('axios');

const config = keys.ctrader;
let demoServer;
let liveServer;

class CTraderClient {
  constructor(url, server, port, login, password) {
    this.url = url;
    this.server = server;
    this.port = port;
    this.login = login;
    this.password = password;
    this.token = null;
  }

  // eslint-disable-next-line consistent-return
  async generateToken() {
    try {
      const endpoint = `${this.url}managers/token`;
      const hash = crypto.createHash('md5').update(this.password).digest('hex');

      const param = {
        login: this.login,
        hashedPassword: hash,
      };

      logger.log('info', `Requesting: ${endpoint}`);
      const res = await axios(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: JSON.stringify(param),
      });

      console.log('Response. Status code:', res.status);
      if (!(res.status >= 400)) {
        const resp = await res.data;
        const { webservToken } = resp;
        console.log('Response:', webservToken);
        return webservToken;
      }
      const resp = await res.data;
      console.log('Response:', resp);
      return null;
    } catch (ex) {
      console.log(ex);
      console.log('An exception error:', ex);
    }
  }

  // eslint-disable-next-line consistent-return
  async GetText(path, params, queryParam = false) {
    if (!this.token) this.token = await this.generateToken();
    const authToken = this.token;
    let endpoint = `${this.url}${path}`;
    if (queryParam) endpoint += `?${params}&token=${authToken}`;
    else endpoint += `?token=${this.token}`;
    console.log('Requesting:', endpoint);
    const res = await axios(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const { status } = res;
    if (status === 200 || status === 201) {
      const data = await res.data; 
      console.log('Response:', data);
      return data;
    }
    console.log('Response status code:', res.status);
  }

  // eslint-disable-next-line consistent-return
  async Get(path, params, queryParam = false) {
    if (!this.token) this.token = await this.generateToken();
    const authToken = this.token;
    let endpoint = `${this.url}${path}`;
    if (queryParam) endpoint += `?${params}&token=${authToken}`;
    else endpoint += `?token=${this.token}`;
    console.log('Requesting:', endpoint);
    const res = await axios(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    const { status } = res;
    if (status === 200 || status === 201) {
      const data = await res.data;
      console.log('Response:', data);
      return data;
    }
    console.log('Response status code:', res.status);
  }

  async Post(path, body, isCid = false, isText = false) {
    if (!this.token) this.token = await this.generateToken();
    const authToken = this.token;
    if (!authToken) {
      console.log('Response::Invalid Token');
      throw new Error('Invalid token');
    }
    const endpoint = isCid
      ? `${this.server}:${this.port}/cid/${path}?token=${authToken}`
      : `${this.url}${path}?token=${authToken}`;

    // const endpoint =`${this.url}${path}?token=${authToken}`;

    console.log('Requesting:', endpoint);
    console.log('Request body:', JSON.stringify(body));
    const res = await axios(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body),
    });
    console.log('Response::Status code =>', res.status);
    if (isText) {
      const resp = await res.data;
      console.log('Response:', resp);
      return;
    }
    if (res.status >= 400 && res.status !== 403) {
      const resp = await res.data;
      console.log('Response:', resp);
      throw new Error(`Transaction failed with status code: ${res.status} .Reason: ${resp}`);
    }
    if (res.status === 200 || res.status === 201) {
      // eslint-disable-next-line consistent-return
      return res.data;
    }
    if (res.status !== 403 && res.status !== 400) {
      const resp = await res.data;
      console.log('Response:', resp);
      return res.body;
    }
    const resp = await res.data;
    console.log('Response:', resp);
    console.log('Response::Forbidden');
    // eslint-disable-next-line consistent-return
    return res;
  }

  async Patch(path, body) {
    if (!this.token) this.token = await this.generateToken();
    const authToken = this.token;
    if (!authToken) {
      console.log('Response::Invalid Token');
      throw new Error('Invalid token');
    }
    const endpoint = `${this.url}${path}?token=${authToken}`;
    console.log('Requesting:', endpoint);
    console.log('Request body:', JSON.stringify(body));

    const res = await axios(endpoint, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(body),
    });
    console.log('Response::Status code =>', res.status);
    if (res.status >= 400) {
      const resp = await res.data;
      console.log('Response:', resp);
      throw new Error(`Transaction failed with status code: ${res.status}`);
    }
    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
    if (res.status !== 403 && res.status !== 400) {
      const resp = await res.data;
      console.log('Response:', resp);
      return res.body;
    }
    const resp = await res.data;
    console.log('Response:', resp);
    console.log('Response::Forbidden');
    // eslint-disable-next-line consistent-return
    return res;
  }

  // async authorizedGet(path, params) {
  //   const self = this;
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const paramsStringify = Object.keys(params)
  //         .map((key) => `${key}=${encodeURI(params[key])}`)
  //         .join("&");
  //       self.Get(`${path}?${paramsStringify}`, async (err, res, body) => {
  //         if (err) {
  //           return reject(new Error(err));
  //         }
  //         if (parseInt(body) === 403) {
  //           return reject(new Error(403));
  //         }
  //         const resp = JSON.parse(body);
  //         if (parseInt(resp.retcode, 10) === 0) {
  //           return resolve(resp.answer || { status: true });
  //         }
  //         if (resp.retcode === '13 Not found') {
  //           resp.retcode = "Account deosn't exist";
  //         }
  //         return reject(new Error(resp.retcode));
  //       });
  //     } catch (error) {
  //       return reject(error);
  //     }
  //   });
  // }
  // async authorizedPost(path, params) {
  //   const self = this;
  //   return new Promise((resolve, reject) => {
  //     try {
  //       const paramsStringify = JSON.stringify(params);

  //       self.Post(path, paramsStringify, (err, res, body) => {
  //         if (err) {
  //           return reject(new Error(err));
  //         }
  //         const resp = JSON.parse(body);
  //         if (parseInt(resp.retcode) === 0) {
  //           return resolve(resp.answer || { status: true });
  //         }
  //         return reject(new Error(resp.retcode));
  //       });
  //     } catch (error) {
  //       return reject(error);
  //     }
  //   });
  // }
}

const getReq = (isDemo = false) => {
  let ctraderObj = config.live;
  if (isDemo) {
    ctraderObj = config.demo;
  } else {
    ctraderObj = config.live;
  }
  if (isDemo) {
    if (!demoServer) {
      demoServer = new CTraderClient(
        ctraderObj.URL,
        ctraderObj.HOST,
        ctraderObj.PORT, // 443,
        ctraderObj.USERNAME,
        ctraderObj.PASSWORD,
      );
    }
    return demoServer;
  }
  if (!liveServer) {
    liveServer = new CTraderClient(
      ctraderObj.URL,
      ctraderObj.HOST,
      ctraderObj.PORT,
      ctraderObj.USERNAME,
      ctraderObj.PASSWORD,
      // ctraderObj.MT5_VERSION,
      // ctraderObj.MT5_AGENT,
    );
    // TODO : Connect
    // liveServer.pingConnection(5, 'live');
  }
  return liveServer;
};

module.exports = getReq;

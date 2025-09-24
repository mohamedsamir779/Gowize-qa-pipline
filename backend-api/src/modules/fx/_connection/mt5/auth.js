/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
/* eslint-disable radix */
const https = require('https');
const crypto = require('crypto');
const buffer = require('buffer');

const { keys } = require('src/common/data');
const { logger } = require('src/common/lib');

const configKeys = keys.mt5;

let demoServer; let
  liveServer;

class MT5Request {
  // server;
  // port;
  // https;
  constructor(server, port, login, password, build, agent) {
    this.server = server;
    this.port = port;
    // this.https = new https.Agent({
    //   keepAlive: true,
    //   // keepAliveMsecs: 20000
    // });
    // this.https.maxSockets = 1; // only one connection is used
    // this.https.keepAlive = true;

    this.login = login;
    this.password = password;
    this.build = build;
    this.agent = agent;
    console.log('this.agent', this.agent);
    console.log('this.server', this.server);
    console.log('this.port', this.port);
    console.log('this.login', this.login);

    this.req;

    this.startConnection();
  }

  Get(path, callback) {
    const options = {
      hostname: this.server,
      port: this.port,
      path,
      agent: this.https,
      headers: { Connection: 'Keep-Alive' },
      rejectUnauthorized: false, // comment out this line if you use self-signed certificates
    };
    const req = https.get(options, (res) => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        callback(null, res, body);
      });
    });
    req.on('error', (e) => {
      callback(e);
    });
  }

  Post(path, body, callback) {
    const options = {
      hostname: this.server,
      port: this.port,
      path,
      agent: this.https,
      method: 'POST',
      headers: {
        Connection: 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': body.length,
      },
      rejectUnauthorized: false, // comment out this line if you use self-signed certificates
    };

    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let bodyValue = '';
      res.on('data', (chunk) => {
        bodyValue += chunk;
      });
      res.on('end', () => {
        callback(null, res, bodyValue);
      });
    });
    req.on('error', (e) => callback(e));
    req.write(body);
    req.end();
  }

  ParseBodyJSON(error, res, body, callback) {
    if (error) {
      callback && callback(error);
      return (null);
    }
    if (res.statusCode !== 200) {
      callback && callback(res.statusCode);
      return (null);
    }
    let answer = null;
    try {
      answer = JSON.parse(body);
    } catch {
    }
    if (!answer) {
      callback && callback('invalid body answer');
      return (null);
    }
    const retcode = parseInt(answer.retcode);
    if (retcode !== 0) {
      callback && callback(answer.retcode);
      return (null);
    }
    return (answer);
  }

  ProcessAuth(answer, password) {
    //---
    const pass_md5 = crypto.createHash('md5');
    const buf = buffer.transcode(Buffer.from(password, 'utf8'), 'utf8', 'utf16le');
    pass_md5.update(buf, 'binary');
    const pass_md5_digest = pass_md5.digest('binary');
    //---
    const md5 = crypto.createHash('md5');
    md5.update(pass_md5_digest, 'binary');
    md5.update('WebAPI', 'ascii');
    const md5_digest = md5.digest('binary');
    //---
    const answer_md5 = crypto.createHash('md5');
    answer_md5.update(md5_digest, 'binary');
    const buf2 = Buffer.from(answer.srv_rand, 'hex');
    answer_md5.update(buf2, 'binary');
    //---
    return (answer_md5.digest('hex'));
  }

  ProcessAuthFinal(answer, password, cli_random) {
    //---
    const pass_md5 = crypto.createHash('md5');
    const buf = buffer.transcode(Buffer.from(password, 'utf8'), 'utf8', 'utf16le');
    pass_md5.update(buf);
    const pass_md5_digest = pass_md5.digest();
    //---
    const md5 = crypto.createHash('md5');
    md5.update(pass_md5_digest);
    md5.update('WebAPI', 'ascii');
    const md5_digest = md5.digest();
    //---
    const answer_md5 = crypto.createHash('md5');
    answer_md5.update(md5_digest);
    answer_md5.update(cli_random);
    return (answer.cli_rand_answer == answer_md5.digest('hex'));
  }

  async Auth(callback) {
    const self = this;

    return new Promise((resolve, reject) => {
      self.Get(`/auth_start?version=${self.build}&agent=${self.agent}&login=${self.login}&type=${self.agent}`, (error, res, body) => {
        const answer = self.ParseBodyJSON(error, res, body);
        if (answer && answer.retcode) {
          const srv_rand_answer = self.ProcessAuth(answer, self.password);
          const cli_random_buf = crypto.randomBytes(16);
          const cli_random_buf_hex = cli_random_buf.toString('hex');

          self.Get(`/auth_answer?srv_rand_answer=${srv_rand_answer}&cli_rand=${cli_random_buf_hex}`, (error, res, body2) => {
            const innerAnswer = self.ParseBodyJSON(error, res, body2);
            if (innerAnswer) {
              if (self.ProcessAuthFinal(innerAnswer, self.password, cli_random_buf)) {
                //   return resolve(true)
                callback();
              } else {
                return reject(new Error('invalid final auth answer'));
              }
            }
          });
        } else {
          return reject(new Error('unhandled error'));
        }
      });
    });
  }

  async authorizedGet(path, params, noReject = false) {
    const self = this;
    return new Promise(async (resolve, reject) => {
      try {
        const paramsStringify = Object.keys(params).map((key) => `${key}=${encodeURI(params[key])}`).join('&');
        self.Get(`${path}?${paramsStringify}`, async (err, res, body) => {
          if (err) {
            return reject(new Error(err));
          }
          if (parseInt(body) === 403) {
            return reject(new Error(403));
          }
          const resp = JSON.parse(body);
          if (parseInt(resp.retcode) === 0) {
            return resolve(resp.answer || { status: true });
          }
          if (resp.retcode === '13 Not found') {
            if (noReject) return resolve(null);
            resp.retcode = 'Account deosn\'t exist';
          }
          return reject(new Error(resp.retcode));
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async authorizedPost(path, params) {
    const self = this;
    return new Promise((resolve, reject) => {
      try {
        const paramsStringify = JSON.stringify(params);

        self.Post(path, paramsStringify, (err, res, body) => {
          if (err) {
            return reject(new Error(err));
          }
          const resp = JSON.parse(body);
          if (parseInt(resp.retcode) === 0) {
            return resolve(resp.answer || { status: true });
          }
          return reject(new Error(resp.retcode));
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async startConnection() {
    const self = this;

    this.https = new https.Agent({
      keepAlive: true,
    });
    this.https.maxSockets = 1; // only one connection is used

    return new Promise((resolve, reject) => self.Get(`/auth_start?version=${self.build}&agent=${self.agent}&login=${self.login}&type=${self.agent}`, (error, res, body) => {
      const answer = self.ParseBodyJSON(error, res, body);
      if (answer && answer.retcode) {
        const srv_rand_answer = self.ProcessAuth(answer, self.password);
        const cli_random_buf = crypto.randomBytes(16);
        const cli_random_buf_hex = cli_random_buf.toString('hex');

        self.Get(`/auth_answer?srv_rand_answer=${srv_rand_answer}&cli_rand=${cli_random_buf_hex}`, (error, res, body2) => {
          const innerAnswer = self.ParseBodyJSON(error, res, body2);
          if (innerAnswer) {
            if (self.ProcessAuthFinal(innerAnswer, self.password, cli_random_buf)) {
              // self.myConnection = self;
              logger.info(`MT5 server ${this.server} with login ${this.login} connected`);
              return resolve(true);
            }
            logger.error(`MT5 server ${this.server} with login ${this.login} failed to Connect`);
            return resolve(false);
          }
          // eslint-disable-next-line no-else-return
          else {
            logger.error(`MT5 server ${this.server} with login ${this.login} failed to Connect`);
            return resolve(false);
          }
        });
      } else {
        logger.error(`MT5 server ${this.server} with login ${this.login} failed to Connect`);
        return resolve(false);
      }
    }));
  }

  async pingConnection(seconds = 20, account = '') {
    setInterval(async () => {
      try {
        const status = await this.authorizedGet('/test_access', {});
        // logger.info([`${account} => ` + 'Connection status test => ', status]);
      } catch (error) {
        logger.error([`Error connecting to ${account} MT5 => `, error.message]);
        if (parseInt(error.message) === 403 || isNaN(parseInt(error.message))) {
          this.startConnection();
        }
      }
    }, seconds * 1000);
  }
}

const getReq = (isDemo = false) => {
  let mt5Obj = configKeys.live;
  if (isDemo) {
    mt5Obj = configKeys.demo;
  }
  if (isDemo) {
    if (!demoServer) {
      demoServer = new MT5Request(
        mt5Obj.MT5_HOST,
        443,
        mt5Obj.MT5_USERNAME,
        mt5Obj.MT5_PASSWORD,
        mt5Obj.MT5_VERSION,
        mt5Obj.MT5_AGENT,
      );
      demoServer.pingConnection(5, 'demo');
    }
    return demoServer;
  }

  if (!liveServer) {
    liveServer = new MT5Request(
      mt5Obj.MT5_HOST,
      443,
      mt5Obj.MT5_USERNAME,
      mt5Obj.MT5_PASSWORD,
      mt5Obj.MT5_VERSION,
      mt5Obj.MT5_AGENT,
    );
    liveServer.pingConnection(5, 'live');
  }
  return liveServer;
};
module.exports = getReq;

// const pingConnection = async (seconds = 20) => {
//   setInterval(async () => {
//     try {
//       const status = await req.authorizedGet('/test_access', { });
//       logger.info(['Connection status test => ', status]);
//     } catch (error) {
//       logger.error(['Error connecting to MT5 => ', error.message]);
//       if (parseInt(error.message) === 403 || isNaN(parseInt(error.message))) {
//         this.startConnection();
//       }
//     }
//   }, seconds * 1000);
// };
// pingConnection(10);

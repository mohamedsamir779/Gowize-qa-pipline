const amqp = require('amqplib/callback_api');
const { rabbitMqConfig } = require('src/common/data').keys;
const { logger } = require('src/common/lib');
const { dealsService, accountService, symbolInfoService } = require('src/modules/services');

const sleep = async (sec) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(true), sec * 1000);
});

const startReceiver = () => {
  amqp.connect(rabbitMqConfig.url, (error0, connection) => {
    if (error0) {
      throw error0;
    }

    // changell for open deals
    //mt5 open deals
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(rabbitMqConfig.mt5OpenDeals, {
        durable: false,
        exclusive: false,
        autoDelete: false,
      });
      logger.info([' [*] Waiting for messages in %s. To exit press CTRL+C'], rabbitMqConfig.mt5OpenDeals);
      channel.prefetch(1);
      channel.consume(rabbitMqConfig.mt5OpenDeals, async (msg) => {
        try {
          const msgJson = JSON.parse(msg.content.toString());
          logger.info(['Got Open Deal => ', msgJson.dealId]);
          const deal = await dealsService.createMT5(msgJson);
          await accountService.processCommission(deal);
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg);
          // channel.nack(msg); to re add in queue
          logger.error(['error in deal processing => ', error]);
        }
      }, {
        noAck: false,
      });
    });

    // changell for close deals
    //ctrader open deals
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(rabbitMqConfig.ctraderOpenDeals, {
        durable: false,
        exclusive: false,
        autoDelete: false,
      });
      logger.info([' [*] Waiting for messages in %s. To exit press CTRL+C']);
      channel.prefetch(1);
      channel.consume(rabbitMqConfig.ctraderOpenDeals, async (msg) => {
        try {
          let msgJson = JSON.parse(msg.content.toString());
          logger.info(['Got Open Deal => ', msgJson.dealId]);
          msgJson.time /=1000;
          msgJson.volume /= (msgJson.contractSize ?? 1000000);
          logger.info(['contract size => ', msgJson.contractSize]);
          logger.info(['volume => ', msgJson.volume]);
          const deal = await dealsService.createCTrader(msgJson);          
          logger.info(['open deal details => ',JSON.stringify(deal)]);
          await accountService.processCommission(deal);
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg);
          // channel.nack(msg); to re add in queue
          logger.error(['error in deal processing => ', error]);
        }
      }, {
        noAck: false,
      });
    });
    // changell for close deals
    //ctrader close deals
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(rabbitMqConfig.ctraderCloseDeals, {
        durable: false,
        exclusive: false,
        autoDelete: false,
      });
      logger.info([' [*] Waiting for messages in %s. To exit press CTRL+C']);
      channel.prefetch(1);
      channel.consume(rabbitMqConfig.ctraderCloseDeals, async (msg) => {
        try {
          const msgJson = JSON.parse(msg.content.toString());
          let msgPurify = msgJson;
          msgPurify.dealId = parseInt(msgPurify?.dealId) ?? 0 
          msgPurify.time /=1000;
          msgPurify.profit = msgPurify.profit != 0 
                    ? msgPurify.profit / 100
                    : msgPurify.profit;
          logger.info(['contract size => ', msgJson.contractSize]);
          msgPurify.volume /= (msgJson.contractSize ?? 1000000);
          msgPurify.volumeClosed /= (msgJson.contractSize ?? 1000000);
          logger.info(['volume => ', msgPurify.volume]);
          logger.info(['Got Close Deal => ', msgJson.dealId]);
          const deal = await dealsService.createCTrader(msgPurify);
          logger.info(['close deal details => ',JSON.stringify(deal)]);
          await accountService.processRebate(deal);
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg);
          // channel.nack(msg); to re add in queue
          logger.error(['error in deal processing => ', error]);
        }
      }, {
        noAck: false,
      });
    });
    //ctrader symbols
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(rabbitMqConfig.ctraderSymbols, {
        durable: false,
        exclusive: false,
        autoDelete: false,
      });
      logger.info([' [*] Waiting for messages in %s. To exit press CTRL+C']);
      channel.prefetch(1);
      channel.consume(rabbitMqConfig.ctraderSymbols, async (msg) => {
        try {
          const symbolsJson = JSON.parse(msg.content.toString());
          for(let i = 0; i < symbolsJson.length ; i++){
            logger.info(['symbol  => ', symbolsJson[i].name]);
            await symbolInfoService.createSymbolInfo(symbolsJson[i]);
          };
          
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg);
          // channel.nack(msg); to re add in queue
          logger.error(['error in symbol info processing => ', error]);
        }
      }, {
        noAck: false,
      });
    });

    // changell for deals
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(rabbitMqConfig.mt5Deals, {
        durable: false,
        exclusive: false,
        autoDelete: false,
      });
      logger.info([' [*] Waiting for messages in %s. To exit press CTRL+C']);
      channel.prefetch(1);
      channel.consume(rabbitMqConfig.mt5Deals, async (msg) => {
        try {
          const msgJson = JSON.parse(msg.content.toString());
          logger.info(['Got Deal => ', msgJson.dealId]);
          if (/A:\d{4,}_D:\d{4,}/gm.test(msgJson.comment)) {
            msgJson.clientDealId = parseInt(msgJson.comment.split('_')[1].split(':')[1], 10);
            msgJson.clientLogin = parseInt(msgJson.comment.split('_')[0].split(':')[1], 10);
            const clientDeal = await dealsService.getDealById(msgJson.clientDealId);
            if (clientDeal) {
              msgJson.clientEntry = parseInt(clientDeal.entry, 10);
              msgJson.clientVolume = parseInt(clientDeal.volume, 10);
              msgJson.clientVolumeClosed = parseInt(clientDeal.volumeClosed, 10);
            }
          }
          const deal = await dealsService.createMT5(msgJson);
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg);
          // channel.nack(msg); to re add in queue
          logger.error(['error in deal processing => ', error]);
        }
      }, {
        noAck: false,
      });
    });
  });
};

module.exports = (start = false) => {
  if (start) {
    startReceiver();
  }
};

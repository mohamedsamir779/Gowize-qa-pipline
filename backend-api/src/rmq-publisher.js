const amqp = require('amqplib');
const { rabbitMqConfig } = require('src/common/data').keys;
const { logger } = require('src/common/lib');

class RabbitMqPublisher {
  constructor() {
    this.connection = null;
    this.openDealsChannel = null;
    this.closeDealsChannel = null;
    this.dealsChannel = null;
    this.openDealsQueueName = rabbitMqConfig.mt5OpenDeals;
    this.closeDealsQueueName = rabbitMqConfig.mt5CloseDeals;
    this.dealsQueueName = rabbitMqConfig.mt5Deals;
    this.connect();
  }

  async connect() {
    try {
      logger.info(`rabbitmqUrl ${rabbitMqConfig.url}`);
      this.connection = await amqp.connect(rabbitMqConfig.url);
      this.openDealsChannel = await this.connection.createChannel();
      await this.openDealsChannel.assertQueue(this.openDealsQueueName, { durable: false });
      logger.info([`${this.openDealsQueueName} [*] Waiting to push messages in queue`]);
      this.closeDealsChannel = await this.connection.createChannel();
      await this.closeDealsChannel.assertQueue(this.closeDealsQueueName, { durable: false });
      logger.info([`${this.closeDealsQueueName} [*] Waiting to push messages in queue`]);
      this.dealsChannel = await this.connection.createChannel();
      await this.dealsChannel.assertQueue(this.dealsQueueName, { durable: false });
      logger.info([`${this.dealsQueueName} [*] Waiting to push messages in queue`]);
    } catch (err) {
      logger.error(err);
      throw new Error('Connection failed');
    }
  }

  async pushData(data, queueType = rabbitMqConfig?.queueType?.open) {
    if (!this.connection) await this.connect();
    try {
      switch (queueType) {
        case 0:
          this.openDealsChannel.sendToQueue(
            this.openDealsQueueName,
            Buffer.from(JSON.stringify(data)),
          );
          logger.info(' [x] Sent open %s', JSON.stringify(data));
          break;
        case 1:
          this.closeDealsChannel.sendToQueue(
            this.closeDealsQueueName,
            Buffer.from(JSON.stringify(data)),
          );
          logger.info(' [x] Sent closed %s', JSON.stringify(data));
          break;
        default:
          this.dealsChannel.sendToQueue(
            this.dealsQueueName,
            Buffer.from(JSON.stringify(data)),
          );
          logger.info(' [x] Sent deal %s', JSON.stringify(data));
          break;
      }
    } catch (err) {
      logger.error(err);
    }
  }
}
module.exports = new RabbitMqPublisher();

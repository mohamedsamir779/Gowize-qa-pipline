const { DataTypes } = require('sequelize');

const { dbMysql } = require('src/common/lib');

const Schema = {
  dealId: DataTypes.BIGINT,
  positionId: DataTypes.DECIMAL(18, 5),
  login: DataTypes.INTEGER,
  walletId: DataTypes.STRING,
  action: DataTypes.INTEGER,
  entry: DataTypes.INTEGER,
  time: DataTypes.INTEGER,
  symbol: DataTypes.STRING,
  volume: DataTypes.DECIMAL(18, 4),
  rateProfit: DataTypes.DECIMAL(18, 4),
  rateMargin: DataTypes.DECIMAL(18, 4),
  profit: DataTypes.DECIMAL(18, 4),
  volumeClosed: DataTypes.DECIMAL(18, 4),
  contractSize: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(18, 4),
  priceSL: DataTypes.DECIMAL(18, 4),
  priceTP: DataTypes.DECIMAL(18, 4),
  comment: DataTypes.STRING,
  platform: DataTypes.INTEGER,
  clientDealId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: 'deals',
    referencesKey: 'dealId',
  },
  clientLogin: DataTypes.INTEGER,
  clientEntry: DataTypes.INTEGER,
  clientVolume: DataTypes.DECIMAL(18, 4),
  clientVolumeClosed: DataTypes.DECIMAL(18, 4),
};

const Model = dbMysql.sequelize.define('deals', Schema);

Model.belongsTo(Model, {
  foreignKey: 'clientDealId',
  targetKey: 'dealId',
  as: 'clientDeal',
});
// to create table if table doesn't exist.
Model.sync();

module.exports.Model = Model;
module.exports.Schema = Schema;

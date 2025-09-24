const { Cruds , SendEvent} = require('src/common/handlers');
const { logger } = require('src/common/lib');
const SymbolInfoModel = require('./symbolinfo.model');
const { CONSTANTS } = require('../../common/data');
class SymbolInfo extends Cruds {
    async createSymbolInfo(params) {
        const query = {
            symbolId: params.symbolId,
            name: params.name
        };
        const symbolInfo = await this.findOne(query);
        if(!symbolInfo){
            const resp = await this.create({
                ...params
            });
            return resp._id;
            // SendEvent(
            //       CONSTANTS.EVENT_TYPES.EVENT_LOG,
            //       CONSTANTS.LOG_TYPES.SYMBOL,
            //       {
            //         customerId: null,
            //         userId: params.createdBy,
            //         triggeredBy: 1,
            //         userLog: true,
            //         level: CONSTANTS.LOG_LEVELS.INFO,
            //         details: {},
            //         content: params,
            //       },
            //     );
        }
        else {
            return await this.update(params);
        }
      }
    
      async updateById(id, params, force = false, updatedBy) {
        const symbolInfo = await this.findById(id);
        if (!symbolInfo) throw new Error('Symbol does not exist');
        return super.updateById(id, params);
      }
      async update(params){
        const query = {
            symbolId: params.symbolId,
            name: params.name
        };
        const symbolInfo = await this.findOne(query);
        if(!symbolInfo)throw new Error('Symbol does not exist');
        return super.updateById(symbolInfo._id);

      }
    
      async deleteById(id, deletedBy) {
        const symbolInfo = await this.findById(id);
        if (!symbolInfo) throw new Error('Symbol does not exist');
        return super.deleteById(id);
      }

      async delete(params){
        const query = {
            symbolId: params.symbolId,
            name: params.name
        };
        const symbolInfo = await this.findOne(query);
        if(!symbolInfo)throw new Error('Symbol does not exist');
        return super.deleteById(symbolInfo._id);
      }

      async getSymbolInfoByName(params){
        const query = {
            name: params.name
        };
        const resp = await this.findOne(query);
        if(!resp) throw new Error('Symbol does not exist');
        return resp;
      }
      async getSymbolInfoBySymbolId(params){
        const query = {
            symbolId: params.symbolId
        };
        const resp = await this.findOne(query);
        if(!resp) throw new Error('Symbol does not exist');
        return resp;
      }

      async getSymbolInfo(){
        const symbols = await this.find({enabled: true},{name: 1, digits: 1, lotSize: 1, _id: 0});
        return symbols;
        let symbolsList = new Array();
        symbols.forEach((element, i) => {
            symbolsList.push(symbols[i]); 
        });
        return symbolsList;
      }
}

module.exports = new SymbolInfo(SymbolInfoModel.Model, SymbolInfoModel.Schema);
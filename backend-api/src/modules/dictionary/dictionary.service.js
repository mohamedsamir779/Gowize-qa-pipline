//

const { Cruds } = require('src/common/handlers');
const DictionaryModal = require('./dictionary.model');

class DictionaryService extends Cruds {
  async createDictionary(params) {
    const dictionary = await this.create(params);
    return dictionary;
  }

  async getAllDictionaries(params, projections = {}, options = {}) {
    const dictionaries = await this.find(params, projections, options);
    return dictionaries;
  }

  async getDictionaryById(id) {
    const dictionary = await this.findById(id);
    if (!dictionary) throw new Error('Dictionary does not exist');
    return dictionary;
  }

  async deleteDictionary(id) {
    const deletedDictionary = await this.findById(id);
    if (!deletedDictionary) throw new Error('Dictionary does not exist');
    return super.deleteById(id);
  }

  async addItem(id, params, options) {
    const updatedDictionary = await this.findById(id);
    if (!updatedDictionary) throw new Error('Dictionary does not  exist');
    return super.update({ _id: id }, params, options);
  }

  async findDictionary(params = {}, options = {}) {
    return super.find(params, { ...options });
  }

  async removeItemFromArray(id, params, option) {
    const updatedDictionary = await this.findById(id);
    if (!updatedDictionary) throw new Error('Dictionary does not exist');
    return super.update({ _id: id }, params, option);
  }

  async updateValue(query, params) {
    return super.updateAnElementInArray(query, params);
  }

  async updateActions(query, value) {
    return super.update(query, { 'actions.$': value }, {});
  }

  async updateCallStatus(query, value) {
    return super.update(query, { 'callStatus.$': value }, {});
  }

  async updateExchanges(query, value) {
    return super.update(query, { 'exchanges.$': value }, {});
  }

  async updateCountries(query, newValues) {
    const values = Object.values(query);
    // eslint-disable-next-line arrow-spacing
    Object.keys(newValues).map((key) => super.update({ 'countries._id': [`${values[0]._id}`] }, { [`countries.$.${key}`]: newValues[key] }, {}));
    return { message: 'Country is updated successfully' };
  }

  async listCountries() {
    const dict = await super.findOne({});
    return dict?.countries;
  }

  async updateMarkup(query, newValue) {
    // eslint-disable-next-line arrow-spacing
    return super.update(query, { 'markups.$': newValue }, {});
  }

  async updateProducts(newValue) {
    global.fxProducts = newValue || global.fxProducts;
    // eslint-disable-next-line arrow-spacing
    return super.update({}, { products: newValue }, {});
  }
}

module.exports = new DictionaryService(DictionaryModal.Model, DictionaryModal.Schema);

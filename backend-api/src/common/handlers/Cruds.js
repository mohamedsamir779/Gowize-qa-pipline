/* eslint-disable prefer-rest-params */
/* eslint-disable linebreak-style */
/**
 * General cruds class
 */

const { ObjectId } = require('mongoose').Types;

class Cruds {
  constructor(Model, Schema = {}) {
    this.Model = Model;
    this.keys = Object.keys(Schema);
    if (this._constructor) this._constructor(...arguments);
  }

  async create(params, returnOnlyId = false) {
    const newObj = new this.Model({ ...params });
    if (!returnOnlyId) {
      return newObj.save();
    }
    const result = await newObj.save();
    return { _id: result.id };
  }

  async createBulk(paramsArr) {
    // const modelObj = [];
    // paramsArr.forEach((element) => {
    //   modelObj.push(new this.Model(element));
    // });
    return this.Model.insertMany(paramsArr);
  }

  async find(params = {}, projection = {}, options = {}) {
    let findRes = this.Model.find(params, projection, { ...options, lean: true });
    if (options.populate) findRes = findRes.populate(options.populate);
    return findRes;
  }

  async count(params = {}) {
    return this.Model.find(params).count();
  }

  async findOne(params = {}, projection = {}, options = {}) {
    return this.Model.findOne(params, projection, { lean: true, ...options });
  }

  async findById(id, projection = {}, lean = true, populate = []) {
    if (projection) return this.Model.findById(id, projection, { lean, populate });
    return this.Model.findById(id, null, { lean });
  }

  async deleteById(_id) {
    return this.Model.deleteOne({ _id: ObjectId(_id) });
  }

  async updateById(_id, params = {}, option = {}) {
    const {
      push = {},
      pull = {},
      ...rest
    } = option;
    return this.Model.updateOne({ _id: ObjectId(_id) }, {
      $set: params,
      $push: push,
      $pull: pull,
    }, {
      new: true,
      ...rest,
    });
  }

  async update(query, params = {}, option = {}) {
    const {
      push = {},
      pull = {},
      ...rest
    } = option;
    if (option) {
      return this.Model.update(query, {
        $set: params,
        $push: push,
        $pull: pull,
      }, {
        new: true,
        ...rest,
      });
    }

    return this.Model.updateMany(query, {
      $set: params,
      $push: push,
      $pull: pull,
    }, {
      new: true,
    });
  }

  async updateMany(query, params = {}, option = {}) {
    const {
      push = {},
      pull = {},
      ...rest
    } = option;
    return this.Model.updateMany(query, {
      $set: params,
      $push: push,
      $pull: pull,
    }, {
      new: true,
      ...rest,
    });
  }

  async aggregateWithStrictSearch(aggregation = [], searchText = '', options = {}) {
    const {
      page = 1,
      limit = process.env.PAGINATION_LIMIT || 10,
      sort = { createdAt: -1 },
      ...pagOptions
    } = options;
    const newAggregation = [];
    if (searchText !== '') {
      // need to push this first in the aggregation pipeline
      newAggregation.push({
        $addFields: {
          searchText: {
            $toLower: {
              $concat: [
                '$firstName',
                ' ',
                '$lastName',
                ' ',
                '$email',
                ' ',
                '$phone',
              ],
            },
          },
        },
      });
      newAggregation.push({
        $match: {
          searchText: { $regex: String(searchText)?.toLowerCase(), $options: 'i' },
        },
      });
    }
    newAggregation.push(...aggregation);
    const dcs = this.Model.aggregate(newAggregation);
    return this.Model.aggregatePaginate(dcs, {
      limit, page, ...pagOptions, lean: true, sort,
    });
  }

  async findWithPagination(params = {}, options = {}) {
    console.log(params);
    // const { projection }
    delete params.filteredValues;
    const {
      searchText = '', page = 1, limit = process.env.PAGINATION_LIMIT || 10, ...filter
    } = params;
    if (searchText !== '') {
      filter.$text = { $search: searchText };
    }
    console.log('filter', JSON.stringify(filter));
    return this.Model.paginate(filter, {
      limit, page, ...options, lean: true, sort: { createdAt: -1 },
    });
  }

  async aggregateWithPagination(aggregation = [], options = {}) {
    const {
      page = 1,
      limit = process.env.PAGINATION_LIMIT || 10,
      sort = { createdAt: -1 },
      ...pagOptions
    } = options;
    const dcs = this.Model.aggregate(aggregation);
    return this.Model.aggregatePaginate(dcs, {
      limit, page, ...pagOptions, lean: true, sort,
    });
  }

  async findOneWithPopulate(params, populateObj) {
    return this.Model.findOne({ _id: params.id }).populate(populateObj);
  }

  async aggregate(pipeline = []) {
    return this.Model.aggregate(pipeline);
  }

  async newFindWithPagination(params = {}, options = {}) {
    const {
      searchText = '', page = 1, limit = process.env.PAGINATION_LIMIT || 10, ...filter
    } = params;
    let match = {};

    if (filter.fromDate) {
      match = {
        ...match,
        createdAt: {
          $gte: new Date(filter.fromDate),
        },
      };
      delete filter.fromDate;
    }

    if (filter.toDate) {
      const date = new Date(filter.toDate);
      match = {
        ...match,
        createdAt: {
          ...match.createdAt,
          $lte: date.setDate(date.getDate() + 1),
        },
      };
      delete filter.toDate;
    }
    const newFilterWithDateMatch = {
      ...filter,
      ...match,
    };

    if (searchText !== '') {
      filter.$text = { $search: searchText };
    }

    return this.Model.paginate(newFilterWithDateMatch, {
      limit, page, ...options, lean: true, sort: { createdAt: -1 },
    });
  }

  async createOrUpdate(query, data) {
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    return this.Model.findOneAndUpdate(query, data, options);
  }
}

module.exports = Cruds;

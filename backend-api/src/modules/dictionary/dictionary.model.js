const { model, Schema } = require('mongoose');
const { DEFAULT_CALL_STATUS_COLOR_MAP } = require('../../common/data/constants');

const DictionarySchema = new Schema(
  {
    recordId: { type: Number, default: 10000 },
    countries: [{
      alpha2: { type: String },
      alpha3: { type: String },
      callingCode: { type: Number },
      en: { type: String },
      ar: { type: String },
    }],
    exchanges: [{ type: String }],
    actions: [{ type: String }],
    emailProviders: [{ type: String }],
    markups: [{ type: String }],
    products: {
      forex: [{ type: String }],
      commodities: [{ type: String }],
      indices: [{ type: String }],
      stocks: [{ type: String }],
      crypto: [{ type: String }],
      energy: [{ type: String }],
      metals: [{ type: String }],
      bullion: [{ type: String }],
    },
    callStatus: [{ type: String }],
    defaultCallStatusColors: {
      type: Object,
      default: DEFAULT_CALL_STATUS_COLOR_MAP,
    },
  },
  { timestamps: true },
);

DictionarySchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

module.exports.Model = model('dictionary', DictionarySchema);
module.exports.Schema = DictionarySchema;

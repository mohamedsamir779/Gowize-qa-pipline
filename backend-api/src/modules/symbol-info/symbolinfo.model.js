const { model, Schema } = require('mongoose');

const SymbolInfoSchema = new Schema(
  {
    symbolId: { type: Number, default: 10000 },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    digits: { type: Number, default: 1 },
    lotSize: { type: Number, default: 0 },
    enabled: { type: Boolean, default: false },    
  },
  { timestamps: true },
);


module.exports.Model = model('symbolinfo', SymbolInfoSchema);
module.exports.Schema = SymbolInfoSchema;

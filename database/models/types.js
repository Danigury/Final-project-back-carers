const { Schema, model } = require("mongoose");

const TypeSchema = new Schema({
  Type: {
    type: String,
    required: true,
  },
});

const Type = model("Type", TypeSchema);

module.exports = Type;

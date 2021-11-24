const { Schema, Types, model } = require("mongoose");

const genderSchema = new Schema({
  type: {
    type: String,
    location: [Types.ObjectId],
    ref: "Location",
    required: true,
  },
});

const Gender = model("Gender", genderSchema);

module.exports = Gender;

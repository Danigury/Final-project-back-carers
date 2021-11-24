const { Schema, model, Types } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  agenda: {
    type: [Types.ObjectId],
    ref: "locations",
  },
});

const User = model("User", userSchema);

module.exports = User;

const { Schema, model, Types } = require("mongoose");

const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  gender: {
    type: Boolean,
    required: true,
  },

  type: {
    type: [Types.ObjectId],
    ref: "Type",
    required: true,
  },

  address: {
    street: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
    },
    coordinates: {
      longitude: {
        type: Number,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
    },
  },
  phonenumber: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  timetable: [
    {
      day: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],
});

const Location = model("Location", locationSchema);

module.exports = Location;

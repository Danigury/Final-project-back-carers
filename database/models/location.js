const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  woman: {
    type: Boolean,
    required: true,
  },

  type: {
    type: String,
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

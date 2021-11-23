const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  addres: {
    street: {
      type: String,
      required: true,
    },
    postcode: {
      type: Number,
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
        type: Number,
        required: true,
      },
    },
  ],
});

const Location = model("Location", locationSchema);

module.exports = Location;

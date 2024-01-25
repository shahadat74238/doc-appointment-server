const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    service: {
      type: "string",
      require: true,
    },
    firstName: {
      type: "string",
      require: true,
    },
    lastName: {
      type: "string",
      require: true,
    },
    email: {
      type: "string",
      require: true,
    },
    date: {
      type: "Object",
      require: true,
    },
  },
  {
    versionKey: false,
  }
);

const Appointment = mongoose.model("appointments", AppointmentSchema);
module.exports = Appointment;

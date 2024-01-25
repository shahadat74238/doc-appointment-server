const Appointment = require("../Schema/appointment.model");

module.exports = {
  createAppointments: async (req) => {
    const appointment = req.body;
    const appointmentSchema = Appointment(appointment);
    await appointmentSchema.save();

    return {
      data: appointmentSchema,
    };
  },
};

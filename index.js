const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// ** Import Schema:
const Appointment = require("./Src/Schema/appointment.model");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y5jebou.mongodb.net/mobile_order?retryWrites=true&w=majority`;

mongoose
  .connect(uri, {})
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// ------------ post appointment data -----------------
app.post("/api/v1/appointment", async (req, res) => {
  const appointment = req.body;
  const appointmentSchema = Appointment(appointment);
  await appointmentSchema.save();
  res.send(appointmentSchema);
});

//  ------------- get all appointment data ------------------
app.get("/api/v1/appointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.send(appointments);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

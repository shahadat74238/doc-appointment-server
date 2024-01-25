require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
var cron = require("node-cron");

// ** Import Schema:
const Appointment = require("./Src/Schema/appointment.model");
const appointments = require("./Src/Schema/Controler/postAppointment");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: process.env.NODE_ENV === "production",
  auth: {
    user: "shahadat74238@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

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
app.post("/api/v1/appointment", appointments.createAppointments);

//  ------------- get all appointment data ------------------
app.get("/api/v1/appointments", async (req, res) => {
  const appointments = await Appointment.find();
  res.send(appointments);
});

// ------------ Node Crone ---------------
cron.schedule("1 * * * * *", async () => {
  try {
    const currentDate = new Date();
    const currentDay = currentDate.toDateString();
    const currentHour = currentDate.getHours();
    const currentMin = currentDate.getMinutes();
    console.log(currentHour, currentMin, currentDate);
    const appointments = await Appointment.find({
      date: {
        $gte: currentDate.toISOString(),
      },
    });
    console.log(appointments);

    for (const appointment of appointments) {
      const { firstName, lastName, email, date } = appointment;
      const appointmentDate = new Date(appointment.date);
      const appointmentDay = appointmentDate.toDateString();
      const appointmentHour = appointmentDate.getHours();
      console.log(
        appointmentDay,
        appointmentHour,
        currentDate.toDateString(),
        currentHour
      );
      console.log(
        appointmentDay === currentDate.toDateString(),
        currentHour === appointmentHour,
        "60"
      );

      if (appointmentDay === currentDay && currentHour === appointmentHour) {
        console.log("working");
        transporter.sendMail({
          from: "shahadat74238@gmail.com",
          to: `${email}`,
          subject: "Your Appointment!",
          text: `Hi ${firstName} ${lastName} Your appointment right now!`,
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Email Subject</title>
            <style>
              /* Reset some default styles for email clients */
              body, p, h1, h2, h3, h4, h5, h6 {
                margin: 0;
                padding: 0;
              }
          
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                color: #333;
              }
          
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
          
              h1 {
                color: #0088cc;
              }
          
              p {
                margin-bottom: 20px;
              }
          
              .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                text-align: center;
                text-decoration: none;
                background-color: #0088cc;
                color: #fff;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to Doc House</h1>
              <p>Hello ${firstName} ${lastName},</p>
              <p>Your Appointment is appearing...!</p>
              <p>Date: ${new Date(date).toLocaleString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true, // Use 12-hour format
              })}</p>
              <p>Thank you for using our services!</p>
          
              <p>Best regards,<br>
              Shahadat</p>
          
              <p style="text-align: center;">
                <a class="button" href="#">Click Me</a>
              </p>
            </div>
          </body>
          </html>
          `,
        });
      }
    }

    console.log("running a task every minute");
  } catch (error) {
    console.log(error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import express from "express";
import getMqttData from "./Controller/tripmqtt.js";
import cors from "cors";
import LoginRouter from "./Routes/login.js";
import VehicleRouter from "./Routes/vehicles.js";
import { authetication } from "./Middleware/authetication.js";
import DevicesRouter from "./Routes/devices.js";
import CustomerRoute from "./Routes/customer.js";
import OngoingTripsRouter from "./Routes/ongoingTrips.js";
import CompletedTripRoute from "./Routes/completedTrip.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
getMqttData();

app.use("/api/login", LoginRouter);
app.use(authetication);
app.use("/api/vehicles", VehicleRouter);
app.use("/api/devices", DevicesRouter);
app.use("/api/customers", CustomerRoute);
app.use("/api/completedTrip", CompletedTripRoute);
app.use("/api/ongoingTrip", OngoingTripsRouter);

app.listen(8080, () => {
  console.log("Listening on Port 8080");
});

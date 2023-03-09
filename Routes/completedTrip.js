import express from "express";
import {
  getCompletedTrips,
  getCompletedTripsAll,
  getFaultCountByTripId,
  getTripDataById,
  getCompletedTripsByVehicleId,
} from "../Controller/CompletedTripController.js";

const CompletedTripRoute = express.Router();

CompletedTripRoute.get("/getTripById/:id", getTripDataById);
CompletedTripRoute.get("/getFaultsByTripId/:id", getFaultCountByTripId);
CompletedTripRoute.get(
  "/getCompletedTrips/:offset/:user_id",
  getCompletedTrips
);
CompletedTripRoute.get("/getCompletedTrips/:user_id", getCompletedTripsAll);
CompletedTripRoute.get(
  "/getCompletedTripsByVehicleId/:id",
  getCompletedTripsByVehicleId
);

export default CompletedTripRoute;

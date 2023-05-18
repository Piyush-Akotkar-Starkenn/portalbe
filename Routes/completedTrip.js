import express from "express";
import {
  getCompletedTrips,
  getCompletedTripsAll,
  getFaultCountByTripId,
  getTripDataById,
  getCompletedTripsByVehicleId,
  getTripSummaryById,
  getAllAlertsByVehicleId,
} from "../Controller/CompletedTripController.js";

const CompletedTripRoute = express.Router();

CompletedTripRoute.get("/getTripById/:id", getTripDataById);
CompletedTripRoute.get("/getTripSummaryById/:id", getTripSummaryById);
CompletedTripRoute.get("/getFaultsByTripId/:id", getFaultCountByTripId);
CompletedTripRoute.get("/getCompletedTrips/:offset/:user_id",getCompletedTrips);
CompletedTripRoute.get("/getCompletedTripsAll/:user_id", getCompletedTripsAll);
CompletedTripRoute.get("/getCompletedTripsByVehicleId/:id",getCompletedTripsByVehicleId);
CompletedTripRoute.get("/getAllAlertsByVehicleId/:userid/:vehicleId/:fault/:startDate/:endDate",getAllAlertsByVehicleId);

export default CompletedTripRoute;

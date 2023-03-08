import express from "express";
import {
  getCompletedTrips,
  getCompletedTripsAll,
  getFaultCountByTripId,
  getTripDataById,
} from "../Controller/CompletedTripController.js";

const CompletedTripRoute = express.Router();

CompletedTripRoute.get("/getTripById/:id", getTripDataById);
CompletedTripRoute.get("/getFaultsByTripId/:id", getFaultCountByTripId);
CompletedTripRoute.get("/getCompletedTrips/:offset", getCompletedTrips);
CompletedTripRoute.get("/getCompletedTrips/", getCompletedTripsAll);

export default CompletedTripRoute;

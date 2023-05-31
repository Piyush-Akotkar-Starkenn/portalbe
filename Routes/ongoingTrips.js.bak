import express from "express";
import {
  getOngoingTripdataById,
  getOngoingTrips,
  getOngoingFaultByTripId,
} from "../Controller/OngoingTripController.js";

const OngoingTripsRouter = express.Router();

OngoingTripsRouter.get("/getOngoingTrips/:user_id", getOngoingTrips);
OngoingTripsRouter.get("/getOngoingTripdataById/:id", getOngoingTripdataById);
OngoingTripsRouter.get("/getOngoingFaultByTripId/:id", getOngoingFaultByTripId);

export default OngoingTripsRouter;

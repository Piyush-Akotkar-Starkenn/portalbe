import express from "express";
import {
  endTripById,
  getOngoingTripdataById,
  getOngoingTrips,
} from "../Controller/OngoingTripController.js";

const OngoingTripsRouter = express.Router();

OngoingTripsRouter.get("/getOngoingTrips/:user_id", getOngoingTrips);
OngoingTripsRouter.get("/getOngoingTripdataById/:id", getOngoingTripdataById);
OngoingTripsRouter.put("/endTripById/:id", endTripById);

export default OngoingTripsRouter;

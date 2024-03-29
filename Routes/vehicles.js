import express from "express";
import {
  addVehicle,
  deleteVehicle,
  editVehicle,
  getAllVehicles,
  getECU,
  getIoT,
  getDMS,
  getusersVehicle,
  getVehicle,
  getVehicleByTripId,
} from "../Controller/VehiclesController.js";

const VehicleRouter = express.Router();

VehicleRouter.get("/getall", getAllVehicles);

VehicleRouter.post("/addvehicle/:user_id", addVehicle);

VehicleRouter.put("/editvehicle/:user_id/:vehicle_id", editVehicle);

VehicleRouter.delete("/deletevehicle/:vehicle_id", deleteVehicle);

// Getting Data of Particular vehicle
VehicleRouter.get("/vehicle-card/:vehicle_id", getVehicle);

// Getting vehicle Data of particular user
VehicleRouter.get("/user-vehicle/:user_id", getusersVehicle);

// Getting IoT Data which is not assign to any vehicle
VehicleRouter.get("/get-iot/:user_id", getIoT);

// Getting ECU Data which is not assign to any vehicle
VehicleRouter.get("/get-ecu/:user_id", getECU);

// Get DMS data which is not assign to any vehicle
VehicleRouter.get("/get-dms/:user_id", getDMS);

// Get Vehicle by trip id
VehicleRouter.get("/getVehicleByTripId/:id", getVehicleByTripId);

export default VehicleRouter;

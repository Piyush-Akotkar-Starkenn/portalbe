import express from "express";
import {
  addVehicle,
  deleteVehicle,
  editVehicle,
  getAllVehicles,
  getECU,
  getIoT,
  getusersVehicle,
  getVehicle,
  getVehicleByTripId,
} from "../Controller/VehiclesController.js";

const VehicleRouter = express.Router();

VehicleRouter.get("/getall", getAllVehicles);
VehicleRouter.post("/addvehicle/:user_id", addVehicle);
VehicleRouter.put("/editvehicle/:user_id/:vehicle_id", editVehicle);
VehicleRouter.delete("/deletevehicle/:vehicle_id", deleteVehicle);
//////////////////////Getting Data of Particular vehicle/////////////////////
VehicleRouter.get("/vehicle-card/:vehicle_id", getVehicle);
//////////////////////Getting vehicle Data of particular user /////////////////////
VehicleRouter.get("/user-vehicle/:user_id", getusersVehicle);
//////////////////////Getting IoT Data which is not assign to any vehicle/////////////////////
VehicleRouter.get("/get-iot", getIoT);
//////////////////////Getting ECU Data which is not assign to any vehicle/////////////////////
VehicleRouter.get("/get-ecu", getECU);
///////////////////////////////Get Vehicle by trip id/////////////////////
VehicleRouter.get("/getVehicleByTripId/:id", getVehicleByTripId);
export default VehicleRouter;

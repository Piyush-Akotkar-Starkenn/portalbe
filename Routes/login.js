import express from "express";

import { login, signup } from "../Controller/LoginController.js";

const LoginRouter = express.Router();

LoginRouter.post("/login-user", login);

export default LoginRouter;


export const getTripDataById = (req, res) => {
    const tripId = req.params.id;
    const event = req.query.event || 'LOC';
  
    const q = "CALL get_trip_data_by_id_event(?, ?)";
    db.query(q, [tripId, event], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  };
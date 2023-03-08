import { db } from "../Config/db.js";

//////////////////////Getting All Vehicle Data/////////////////////
export const getAllVehicles = (req, res) => {
  const Query = "SELECT * FROM vehicle_master";

  db.query(Query, (err, data) => {
    if (err) {
      res.status(500).send({ ErrorGet: err });
    } else {
      res.status(200).send({ getData: data });
    }
  });
};

//////////////////////Adding vehicle Into DataBase/////////////////////
export const addVehicle = (req, res) => {
  const { user_id } = req.params;

  const checkQuery =
    "SELECT * FROM vehicle_master WHERE vehicle_registration=?";

  db.query(checkQuery, [req.body.vehicle_registration], (err, data) => {
    if (err) {
      res.status(500).send({ Error: err });
    } else {
      if (data.length > 0) {
        res.status(500).send({ Error: "User Already Exists" });
      } else {
        const addQuery =
          "INSERT INTO vehicle_master(`user_id`,`vehicle_name`,`vehicle_registration`,`ecu`,`iot`,`featureset`,`status`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";

        const values = [
          user_id,
          req.body.vehicle_name,
          req.body.vehicle_registration,
          req.body.ecu,
          req.body.iot,
          req.body.featureset,
          req.body.status,
        ];
        db.query(addQuery, values, (err, data) => {
          if (err) {
            res.status(500).send({ Error: err });
          } else {
            res.status(200).send({ addData: data });
          }
        });
      }
    }
  });
};

//////////////////////Editing Vehicle Data of Particular Customer User Data/////////////////////
export const editVehicle = (req, res) => {
  const { vehicle_id, user_id } = req.params;

  const { vehicle_name, vehicle_registration, ecu, iot, featureset, status } =
    req.body;
  const checkQuery = "SELECT * FROM vehicle_master WHERE vehicle_name=? ";

  db.query(checkQuery, [vehicle_registration], (err, datacheck) => {
    if (err) {
      res.status(500).send({ ErrorCheck: err });
    } else {
      if (datacheck.length > 0) {
        res.status(500).send({ Error: "Vehicle Already Exists" });
      } else {
        const editQuery =
          "UPDATE vehicle_master SET user_id=?,vehicle_name=?,vehicle_registration=?,ecu=?,iot=?,featureset=?,status=? WHERE vehicle_id=?";

        db.query(
          editQuery,
          [
            user_id,
            vehicle_name,
            vehicle_registration,
            ecu,
            iot,
            featureset,
            status,
            vehicle_id,
          ],
          (err, data) => {
            if (err) {
              res.status(500).send({ Error: err });
            } else {
              res.status(200).send({ editData: data });
            }
          }
        );
      }
    }
  });
};

//////////////////////Deleting Vehicle Data using vehicle_id /////////////////////
export const deleteVehicle = (req, res) => {
  const { vehicle_id } = req.params;
  const deleteQuery = "DELETE FROM vehicle_master WHERE vehicle_id=?";

  db.query(deleteQuery, [vehicle_id], (err, data) => {
    if (err) {
      res.status(500).send({ ErrorDelete: err });
    } else {
      res.status(200).send({ DeleteData: data });
    }
  });
};

//////////////////////Getting Data of Particular vehicle/////////////////////

export const getVehicle = (req, res) => {
  const { vehicle_id } = req.params;
  const getQuery = "SELECT * FROM vehicle_master WHERE vehicle_id=?";

  db.query(getQuery, [vehicle_id], (err, data) => {
    if (err) {
      res.status(500).send({ ErrorIdGet: err });
    } else {
      res.status(200).send({ IdData: data });
    }
  });
};

//////////////////////Getting vehicle Data of particular user /////////////////////

export const getusersVehicle = (req, res) => {
  const { user_id } = req.params;
  const getcustovehi = "SELECT * FROM vehicle_master WHERE user_id=?";

  db.query(getcustovehi, [user_id], (err, data) => {
    if (err) {
      res.status(500).send({ Error: err });
    } else {
      res.status(200).send({ VehiData: data });
    }
  });
};

//////////////////////Getting IoT Data which is not assign to any vehicle/////////////////////

export const getIoT = (req, res) => {
  const getiotQuery =
    "SELECT * FROM devices_master LEFT JOIN vehicle_master ON devices_master.device_id=vehicle_master.iot WHERE devices_master.device_type='IoT' AND vehicle_master.vehicle_id IS null";

  db.query(getiotQuery, (err, data) => {
    if (err) {
      res.status(500).send({ Erroriotget: err });
    } else {
      res.status(200).send({ IotData: data });
    }
  });
};

//////////////////////Getting ECU Data which is not assign to any vehicle/////////////////////

export const getECU = (req, res) => {
  const ecugetQuery =
    "SELECT * FROM devices_master LEFT JOIN vehicle_master ON devices_master.device_id=vehicle_master.ecu WHERE devices_master.device_type='ECU' AND vehicle_master.vehicle_id IS null";

  db.query(ecugetQuery, (err, data) => {
    if (err) {
      res.status(500).send({ Errorecu: err });
    } else {
      res.status(200).send({ ECUData: data });
    }
  });
};
///////////////////get vehicle by trip id////////////
export const getVehicleByTripId = (req, res) => {
  const tripId = req.params.id;
  const q = `SELECT * FROM vehicle_master INNER JOIN trip_summary ON trip_summary.vehicle_id=vehicle_master.vehicle_id WHERE trip_summary.trip_id = ?`;
  db.query(q, tripId, (err, data) => {
    if (err) return err;
    return res.json(data);
  });
};

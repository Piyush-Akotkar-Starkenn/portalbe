import { db } from "../Config/db.js";
//////////////////////Getting All Devices Data/////////////////////
export const getall = (req, res) => {
  const queryGet = "SELECT * FROM devices_master";
  db.query(queryGet, (err, data) => {
    if (err) {
      res.status(500).send({ ErrorGET: err });
    } else {
      res.status(200).send({ AllData: data });
    }
  });
};

//////////////////////Adding Devices Data Into Database /////////////////////

export const addDevice = (req, res) => {
  const checkQuery = "SELECT * FROM devices_master WHERE device_id=? ";

  db.query(checkQuery, [req.body.device_id], (checkerr, results) => {
    if (checkerr) {
      res.status(500).send({ ErrorCheck: checkerr });
    } else {
      if (results.length > 0) {
        res.status(200).send({ Message: "Device Already Exists" });
      } else {
        const insertQuery =
          "INSERT INTO devices_master(`device_id`,`device_type`,`user_id`,`sim_number`,`status`) VALUES (?)";

        const values = [
          req.body.device_id,
          req.body.device_type,
          req.body.user_id,
          req.body.sim_number,
          req.body.status,
        ];

        db.query(insertQuery, [values], (err, deviceData) => {
          if (err) {
            res.status(500).send({ Error: err });
          } else {
            res.status(200).send({ DeviceData: deviceData });
          }
        });
      }
    }
  });
};

//////////////////////Editing Devices Data/////////////////////

export const editDevice = (req, res) => {
  const { id } = req.params;
  const checkQuery = "SELECT * FROM devices_master WHERE device_id=? ";

  db.query(checkQuery, [req.body.device_id], (err, data) => {
    if (err) {
      res.status(500).send({ ErrorCheck: err });
    } else {
      const updateQuery =
        "UPDATE devices_master SET device_id=?,device_type=?,user_id=?,sim_number=?,status=? WHERE id=?";

      db.query(
        updateQuery,
        [
          req.body.device_id,
          req.body.device_type,
          req.body.user_id,
          req.body.sim_number,
          req.body.status,
          id,
        ],
        (err, data) => {
          if (err) {
            res.status(500).send({ ErrorUpdating: err });
          } else {
            res.status(200).send({ updatedData: data });
          }
        }
      );
    }
  });
};

//////////////////////Deleting Devices Data/////////////////////

export const deleteDevice = (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE fROM devices_master WHERE id=?";

  db.query(deleteQuery, [id], (err, data) => {
    if (err) {
      res.status(500).send({ ErrorDelete: err });
    } else {
      res.status(200).send({ DeletedData: data });
    }
  });
};

//////////////////////Getting which device assign to which User/////////////////////

export const getuserDevice = (req, res) => {
  const { user_id } = req.params;
  const getquery = "SELECT * FROM devices_master WHERE user_id=?";

  db.query(getquery, [user_id], (err, data) => {
    if (err) {
      res.status(500).send({ Error: err });
    } else {
      res.status(200).send({ idData: data });
    }
  });
};

//////////////////////Getting Particular Device Data/////////////////////

export const getdevice = (req, res) => {
  const { id } = req.params;
  const getquery = "SELECT * FROM devices_master WHERE id=?";

  db.query(getquery, [Number(id)], (err, data) => {
    if (err) {
      res.status(500).send({ Error: err });
    } else {
      res.status(200).send({ idData: data });
    }
  });
};

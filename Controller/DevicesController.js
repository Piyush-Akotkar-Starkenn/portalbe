import { db } from "../Config/db.js";

//Getting All Devices Data----START//
export const getall = (req, res) => {
  const queryGet =
    "SELECT dm.*, u.first_name, u.last_name, dm.status AS device_status, u.status AS user_status FROM devices_master AS dm INNER JOIN users AS u ON dm.user_id = u.user_id ORDER BY dm.id DESC";
  db.query(queryGet, (err, data) => {
    if (err) {
      res.status(500).send({ ErrorGET: err });
    } else {
      res.status(200).send({ AllData: data });
    }
  });
};
//Getting All Devices Data-Store Procedure---END//


//Adding-Devices-Data-Into-Database--START//
export const addDevice = (req, res) => {
//----------------------Check-Device Already Exists---to the Device Id--------------------------//
  const checkQuery = "SELECT * FROM devices_master WHERE device_id=? ";

  db.query(checkQuery, [req.body.device_id], (checkerr, results) => {
    if (checkerr) {
      res.status(500).send({ ErrorCheck: checkerr });
    } else {
      if (results.length > 0) {
        res.status(200).send({ Message: "Device Already Exists" });
      } else {
        // const insertQuery =
        //   "INSERT INTO devices_master(`device_id`,`device_type`,`user_id`,`sim_number`,`status`) VALUES (?)";

//---------------------Insert Devices Data With Store Procedure----START------------------------//        
const insertQuery = 'CALL InsertDevicesMaster(?,?,?,?,?)';
        const values = [
          req.body.device_id,
          req.body.device_type,
          req.body.user_id,
          req.body.sim_number,
          req.body.status,
        ];

        db.query(insertQuery, values, (err, result) => {
          if (err) {
            res.status(500).send({ Error: err.message });
          } else {
            res.status(200).send({message: 'Insert Devices Data successfully' });
          }
        });
      }
    }
  });
};
//Insert Devices Data With Store Procedure--END//   
//Adding-Devices-Data-Into-Databas-Store Procedure-END//


//Update Devices Data With Store Procedure--START//   
export const editDevice = (req, res) => {
  const { id } = req.params;

  let { ...columns } = req.body;

  const checkQuery = "SELECT * FROM devices_master WHERE device_id=? ";

  db.query(checkQuery, [req.body.device_id], (err, data) => {
    if (err) {
      res.status(500).send({ ErrorCheck: err });
    } else {
      let updateQuery = `UPDATE devices_master SET `;
      let updateData = [];

      Object.keys(columns).forEach((key, index) => {
        updateQuery += `${key}=?`;
        updateData.push(columns[key]);

        if (index < Object.keys(columns).length - 1) {
          updateQuery += ", ";
        }
      });

      updateQuery += `WHERE id=?`;
      updateData.push(id);

      db.query(updateQuery, updateData, (error, results, fields) => {
        if (error) throw error;
        res.send({ editResult: results });
      });
    }
  });
};
//Update Devices Data With Store Procedure--END//   


//Deleting Devices Data-With Store Procedure-START//
export const deleteDevice = (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'CALL deleteDevice(?)';

  db.query(deleteQuery, [id], (err, data) => {
    if (err) {
      res.status(500).send({ ErrorDelete: err });
    } else {
      res.status(200).send({ DeletedData: data });
    }
  });
};
//Deleting Devices Data-With Store Procedure-END//


//Getting which device assign to which User--START//
export const getuserDevice = (req, res) => {
  const { user_id } = req.params;
  const getquery = "SELECT * FROM devices_master WHERE user_id=? ORDER BY id DESC";

  db.query(getquery, [user_id], (err, data) => {
    if (err) {
      res.status(500).send({ Error: err });
    } else {
      res.status(200).send({ idData: data });
    }
  });
};
//Getting which device assign to which User--END//


//Getting Particular Device Data--START//
export const getdevice = (req, res) => {
  const { id } = req.params;
  const getquery =
    "SELECT * FROM devices_master INNER JOIN users ON users.user_id = devices_master.user_id WHERE id=?";

  db.query(getquery, [Number(id)], (err, data) => {
    if (err) {
      res.status(500).send({ Error: err });
    } else {
      res.status(200).send({ idData: data });
    }
  });
};
//Getting Particular Device Data--END//
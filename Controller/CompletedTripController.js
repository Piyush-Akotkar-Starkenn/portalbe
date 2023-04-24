import { db } from "../Config/db.js";

export const getTripDataById = (req, res) => {
  const tripId = req.params.id;

  const q =
    "SELECT * FROM tripdata WHERE trip_id = ? AND event = ? ORDER BY timestamp ASC";
  let event = "LOC";
  db.query(q, [tripId, event], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

export const getFaultCountByTripId = (req, res) => {
  const tripID = req.params.id;

  const q =
    "SELECT * FROM tripdata WHERE trip_id = ? AND event != 'IGS' AND event != 'NSQ' AND event != 'LOC' AND event != 'RFID'";

  db.query(q, [tripID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

export const getCompletedTrips = (req, res) => {
  let { offset, user_id } = req.params;

  // "SELECT * FROM trip_summary INNER JOIN vehicle_master ON vehicle_master.vehicle_id=trip_summary.vehicle_id WHERE trip_summary.user_id = ? AND trip_summary.trip_status = ? ORDER BY trip_summary.id DESC  ";
  const q = `SELECT * FROM trip_summary INNER JOIN vehicle_master ON vehicle_master.vehicle_id=trip_summary.vehicle_id WHERE trip_summary.user_id = ? AND trip_summary.trip_status = ? ORDER BY trip_summary.id DESC LIMIT 10 OFFSET ${offset}`;
  const status = 1;
  db.query(q, [user_id, status], (err, results) => {
    if (err) return res.json(err);
    return res.json(results);
  });
};
export const getCompletedTripsAll = (req, res) => {
  let { offset, user_id } = req.params;

  const q = `SELECT * FROM trip_summary INNER JOIN vehicle_master ON vehicle_master.vehicle_id=trip_summary.vehicle_id WHERE trip_summary.user_id = ? AND trip_summary.trip_status = ? ORDER BY trip_summary.id DESC`;
  const status = 1;
  db.query(q, [user_id, status], (err, results) => {
    if (err) return res.json(err);
    return res.json(results);
  });
};

export const getCompletedTripsByVehicleId = (req, res) => {
  let vehicleId = req.params.id;

  try {
    const q = `SELECT * FROM trip_summary INNER JOIN vehicle_master ON vehicle_master.vehicle_id=trip_summary.vehicle_id WHERE trip_summary.trip_status = ? AND vehicle_master.vehicle_id = ? ORDER BY trip_summary.id DESC`;
    const status = 1;
    db.query(q, [status, vehicleId], async (err, results) => {
      if (err) return res.json(err);
      if (results) {
        return res.json(results);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllAlertsByVehicleId = (req, res) => {
  try {
    let userid = req.params.userid;
    let vehicleId = req.params.vehicleId;
    let fault = req.params.fault;
    let startDate = Date.parse(req.params.startDate) / 1000;
    let endDate = Date.parse(req.params.endDate) / 1000;

    // console.log("start:", startDate, "end:", endDate);
    let q =
      "SELECT trip_id, vehicle_id FROM `trip_summary` WHERE user_id =? AND vehicle_id = ?";
    db.query(q, [userid, vehicleId], (err, result) => {
      if (err) return err;

      let dataAr = result.map((row) => row.trip_id);
      // console.log(dataAr);

      let getTripQuery = `SELECT * FROM tripdata WHERE trip_id IN (?) AND event NOT IN (?) AND timestamp >= ${startDate} AND timestamp <= ${endDate}`;
      db.query(getTripQuery, [dataAr, "LOC"], (err, results) => {
        if (err) return err;

        let harshAcc = 0;
        let sleepAlert = 0;
        let laneChange = 0;
        let spdBump = 0;
        let suddenBrk = 0;
        let tailgating = 0;
        let overspd = 0;
        let autoBrk = 0;
        let accSaved = 0;
        let drowsiness = 0;
        let distraction = 0;
        let dms_overspd = 0;
        let no_seatbelt = 0;
        let using_phn = 0;
        let unknown_driver = 0;
        let no_driver = 0;
        let smoking = 0;
        let rash_driving = 0;
        let dms_accdnt = 0;

        results.forEach((item) => {
          if (item.event == "NTF") {
            let jsonData = JSON.parse(item.jsondata);
            // console.log("Due to:", jsonData.notification);
            if (jsonData.notification == 2) {
              harshAcc = harshAcc + 1;
            }
            if (jsonData.notification == 13) {
              sleepAlert = sleepAlert + 1;
            }
            if (jsonData.notification == 5) {
              laneChange = laneChange + 1;
            }
            if (jsonData.notification == 4) {
              spdBump = spdBump + 1;
            }
            if (jsonData.notification == 3) {
              suddenBrk = suddenBrk + 1;
            }
            if (jsonData.notification == 6) {
              tailgating = tailgating + 1;
            }
            if (jsonData.notification == 7) {
              overspd = overspd + 1;
            }
          }

          if (item.event == "BRK") {
            autoBrk = autoBrk + 1;
            let parseJson = JSON.parse(item.jsondata);
            let ttcdiff = parseJson.data.on_ttc - parseJson.data.off_ttc;
            let acd = ttcdiff / parseJson.data.off_ttc;
            let accSvd = acd * 100;
            if (accSvd > 50 && accSvd < 100) {
              accSaved = accSaved + 1;
            }
          }

          if (item.event == "DMS") {
            let dmsData = JSON.parse(item.jsondata);
            if (dmsData.data.alert_type == "DROWSINESS") {
              drowsiness = drowsiness + 1;
            }
            // if(dmsData.data.alert_type == "TRIP_START") {
            //   drowsiness = drowsiness +1;
            // }
            if (dmsData.data.alert_type == "DISTRACTION") {
              distraction = distraction + 1;
            }
            if (dmsData.data.alert_type == "OVERSPEEDING") {
              dms_overspd = dms_overspd + 1;
            }
            if (dmsData.data.alert_type == "NO_SEATBELT") {
              no_seatbelt = no_seatbelt + 1;
            }
            if (dmsData.data.alert_type == "USING_PHONE") {
              using_phn = using_phn + 1;
            }
            if (dmsData.data.alert_type == "UNKNOWN_DRIVER") {
              unknown_driver = unknown_driver + 1;
            }
            if (dmsData.data.alert_type == "NO_DRIVER") {
              no_driver = no_driver + 1;
            }
            if (dmsData.data.alert_type == "RASH_DRIVING") {
              rash_driving = rash_driving + 1;
            }
            if (dmsData.data.alert_type == "SMOKING") {
              smoking = smoking + 1;
            }
            if (dmsData.data.alert_type == "ACCIDENT") {
              dms_accdnt = dms_accdnt + 1;
            }
          }
        });

        if (fault == 2) {
          return res.send({ count: harshAcc });
        }
        if (fault == 13) {
          return res.send({ count: sleepAlert });
        }
        if (fault == 5) {
          return res.send({ count: laneChange });
        }
        if (fault == 4) {
          return res.send({ count: spdBump });
        }
        if (fault == 3) {
          return res.send({ count: suddenBrk });
        }
        if (fault == 6) {
          return res.send({ count: tailgating });
        }
        if (fault == 7) {
          return res.send({ count: overspd });
        }
        if (fault == "AutoBrk") {
          return res.send({ count: autoBrk });
        }
        if (fault == "AccSaved") {
          return res.send({ count: accSaved });
        }
        if (fault == "Drowsiness") {
          return res.send({ count: drowsiness });
        }
        if (fault == "Distraction") {
          return res.send({ count: distraction });
        }
        if (fault == "DMS_Overspeeding") {
          return res.send({ count: dms_overspd });
        }
        if (fault == "No_Seatbelt") {
          return res.send({ count: no_seatbelt });
        }
        if (fault == "Using_Phone") {
          return res.send({ count: using_phn });
        }
        if (fault == "Unknown_Driver") {
          return res.send({ count: unknown_driver });
        }
        if (fault == "Smoking") {
          return res.send({ count: smoking });
        }
        if (fault == "Rash_Driving") {
          return res.send({ count: rash_driving });
        }
        if (fault == "DMS_Accident") {
          return res.send({ count: dms_accdnt });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const getTripSummaryById = (req, res) => {
  const tripId = req.params.id;

  const q = "SELECT * FROM trip_summary WHERE trip_id = ?";

  db.query(q, [tripId], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

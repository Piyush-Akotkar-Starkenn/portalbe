import { db } from "../Config/db.js";

export const getTripDataById = (req, res) => {
  const tripId = req.params.id;

  const q = "SELECT * FROM tripdata WHERE trip_id = ?";

  db.query(q, [tripId], (err, data) => {
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
  let { offset } = req.params;

  // "SELECT * FROM trip_summary INNER JOIN vehicle_master ON vehicle_master.vehicle_id=trip_summary.vehicle_id WHERE trip_summary.trip_status = ? ORDER BY trip_summary.id DESC  LIMIT 3 OFFSET 0";
  const q = `SELECT * FROM trip_summary INNER JOIN vehicle_master ON vehicle_master.vehicle_id=trip_summary.vehicle_id WHERE trip_summary.trip_status = ? ORDER BY trip_summary.id DESC LIMIT 2 OFFSET ${offset}`;
  const status = 1;
  db.query(q, status, (err, results) => {
    if (err) return res.json(err);
    return res.json(results);
  });
};
export const getCompletedTripsAll = (req, res) => {
  let { offset } = req.params;

  const q = `SELECT * FROM trip_summary INNER JOIN vehicle_master ON vehicle_master.vehicle_id=trip_summary.vehicle_id WHERE trip_summary.trip_status = ? ORDER BY trip_summary.id DESC`;
  const status = 1;
  db.query(q, status, (err, results) => {
    if (err) return res.json(err);
    return res.json(results);
  });
};

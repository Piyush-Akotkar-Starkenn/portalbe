import { db } from "../Config/db.js";

export const getOngoingTrips = (req, res) => {
  let { user_id } = req.params;
  const q =
    "SELECT * FROM trip_summary INNER JOIN vehicle_master ON vehicle_master.vehicle_id=trip_summary.vehicle_id WHERE trip_summary.user_id = ? AND trip_summary.trip_status = ? ORDER BY trip_summary.id DESC";
  const status = 0;
  db.query(q, [user_id, status], (err, results) => {
    if (err) return res.json(err);
    return res.json(results);
  });
};

export const getOngoingTripdataById = (req, res) => {
  const tripId = req.params.id;

  const q =
    "SELECT * FROM tripdata WHERE trip_id = ? AND event = ? ORDER BY timestamp ASC";
  let event = "LOC";
  db.query(q, [tripId, event], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

export const endTripById = (req, res) => {
  const tripId = req.params.id;
  const data = req.body;

  const q = "UPDATE trip_summary SET ? WHERE trip_id = ?";

  db.query(q, [data, tripId], (err, results) => {
    if (err) return res.json(err);
    return res.json({
      status: 200,
      message: "Success",
    });
  });
};

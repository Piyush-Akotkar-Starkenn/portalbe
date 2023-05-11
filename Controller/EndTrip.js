import { db } from "../Config/db.js";
import cronJobForEndTrip from "./Cronjob.js";

const EndTrip = (jsonData) => {
  // console.log("entrip call");
  // return false;
  try {
    // get ongoing trip details of current active device
    let q = `SELECT * FROM trip_summary WHERE device_id = ? AND trip_status = ?`;
    db.query(q, [jsonData.device_id, 0], (err, data) => {
      if (err) return err;
      // check if more than 1 trip is ongoing with the same device id
      if (data.length > 1) {
        data.forEach((item) => {
          // console.log("Trip end wali id", item.trip_id);
          if (item.trip_id == jsonData.trip_id) {
             console.log("Data coming from:", item.trip_id);
          } else {
            // console.log("Trip should be end:", item.trip_id);
            const updateOngoingTrip = `UPDATE trip_summary SET trip_status=? WHERE trip_id=?`;
            db.query(updateOngoingTrip, [2, item.trip_id], (err, results) => {
              if (err) return err;
              // console.log(results);
              cronJobForEndTrip();
            });
          }
        });
      } else {
         console.log("Double trip not found!");
      }
    });
  } catch (error) {
     console.log(error);
  }
};

export default EndTrip;

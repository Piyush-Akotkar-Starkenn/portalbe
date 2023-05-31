import { db } from "../Config/db.js";
import pkg from "geolib";

const cronJobForEndTrip = () => {
  // get all the ongoing data from trip_summary
  try {
    let q =
      "SELECT trip_id,trip_status FROM trip_summary WHERE trip_status = ?";
    db.query(q, 2, (err, results) => {
      if (err) return err;
      if (results) {
        results.forEach((row) => {
          // for duration calculation
          let startTime = 0;
          let endTime = 0;
          let duration = 0;

          let q =
            "SELECT * FROM tripdata WHERE trip_id = ? AND event = 'LOC' ORDER BY timestamp ASC";
          try {
            db.query(q, row.trip_id, (err, results) => {
              if (err) return err;
              if (results) {
                let path = []; // get lat lng seperately
                let allSpd = []; // get all speed data

                let tripID = row.trip_id;

                results.forEach((item, index) => {
                  if (index === 0) {
                    startTime = item.timestamp;
                  } else if (index === results.length - 1) {
                    endTime = item.timestamp;
                    console.log(endTime);
                  }
                  if (item.event == "LOC") {
                    let geodata = { latitude: item.lat, longitude: item.lng };
                    path.push(geodata);
                  }
                  allSpd.push(item.spd);
                });

                let maxSpd = 0;
                maxSpd = Math.max(...allSpd.map(parseFloat));
                if (maxSpd < 0) {
                  maxSpd = 0;
                }
                let difference = "";
                let distance = 0;
                // calculate the total distance traveled
                if (endTime > 0 && startTime > 0) {
                  const totalDistance = pkg.getPathLength(path); // In meters
                  distance = totalDistance / 1000; // In Kms

                  difference = endTime - startTime; // seconds
                  let hours = Math.floor(difference / 3600);
                  difference = difference % 3600;
                  let minutes = Math.floor(difference / 60);
                  difference = difference % 60;
                  let seconds = difference;
                  if (hours > 0) {
                    duration =
                      hours + " hours " + minutes + " Mins " + seconds + " Sec";
                  } else {
                    duration = minutes + " Mins " + seconds + " Sec";
                  }
                }

                // Avg speed
                const sumOfSpeed = allSpd.reduce(
                  (acc, curr) => acc + parseFloat(curr),
                  0
                );
                const avgSpd = Math.round(sumOfSpeed) / allSpd.length;
                const averageSpeed = avgSpd.toFixed(2);

                let currentTime = Math.floor(+new Date() / 1000);
                let timeDiff = currentTime - endTime;
                let timeDiffInMin = timeDiff / 60;

                console.log(
                  "TripID:",
                  tripID,
                  " & Distance:",
                  distance,
                  "time:",
                  difference,
                  "& Avg:",
                  averageSpeed,
                  "EndTime: ",
                  endTime,
                  "Timediff",
                  timeDiffInMin
                );

                // return false;
                const q =
                  "UPDATE trip_summary SET trip_start_time=?, trip_end_time=?,total_distance=?,duration=?,avg_spd=?,max_spd=?, trip_status=? WHERE trip_id = ?";
                db.query(
                  q,
                  [
                    startTime,
                    endTime,
                    distance,
                    duration,
                    averageSpeed,
                    maxSpd,
                    1,
                    tripID,
                  ],
                  (err, data) => {
                    if (err) console.log(err);
                    console.log(data);
                  }
                );
              }
            });
          } catch (error) {
            console.log(error);
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default cronJobForEndTrip;

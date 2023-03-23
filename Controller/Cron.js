import { db } from "../Config/db.js";

function updateEndTrip(tripID, startTime, endTime, duration, distance, maxSpd) {
  let difference = endTime - startTime; // seconds
  let hours = Math.floor(difference / 3600);
  difference = difference % 3600;
  let minutes = Math.floor(difference / 60);
  difference = difference % 60;
  let seconds = difference;
  if (hours > 0) {
    duration = hours + " hours " + minutes + " Mins " + seconds + " Sec";
  } else {
    duration = minutes + " Mins " + seconds + " Sec";
  }

  //   console.log(tripID);

  // Avg speed
  let distanceInKM = parseFloat(distance);
  let distanceInMeter = distanceInKM * 1000; // meters
  let time = difference; // seconds
  let averageSpeed = distanceInMeter / time; // meters per second
  if (averageSpeed >= 0 && averageSpeed != null && averageSpeed != NaN) {
    averageSpeed = averageSpeed;
  } else {
    averageSpeed = 0;
  }

  let currentTime = Math.floor(+new Date() / 1000);
  let timeDiff = currentTime - endTime;
  let timeDiffInMin = timeDiff / 60;

  if (parseInt(timeDiffInMin) > 30) {
    try {
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
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Trip continued");
  }
}

// for calulate distance
let distancefunc = (lat1, lng1, lat2, lng2) => {
  let R = 6371;
  let dLat = 0.0174533 * (lat1 - lat2);
  let dLng = 0.0174533 * (lng1 - lng2);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(0.0174533 * lat1) *
      Math.cos(0.0174533 * lat2) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
};
let sum = 0;

const cronJob = () => {
  // get all the ongoing data from trip_summary
  let q = "SELECT trip_id,trip_status FROM trip_summary WHERE trip_status = ?";
  try {
    db.query(q, 0, (err, results) => {
      if (err) return err;
      if (results) {
        results.forEach((row) => {
          // for duration calculation
          let startTime = 0;
          let endTime = 0;
          let duration = 0;

          let q =
            "SELECT * FROM tripdata WHERE trip_id = ? ORDER BY timestamp ASC";
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
                  }
                  let geodata = { lat: item.lat, lng: item.lng };
                  path.push(geodata);
                  allSpd.push(item.spd);
                });

                for (let i = 0; i < path.length - 1; i++) {
                  sum =
                    sum +
                    distancefunc(
                      path[i].lat,
                      path[i].lng,
                      path[i + 1].lat,
                      path[i + 1].lng
                    );
                }
                let distance = sum.toFixed(2);
                let maxSpd = Math.max(...allSpd.map(parseFloat));

                updateEndTrip(
                  tripID,
                  startTime,
                  endTime,
                  duration,
                  distance,
                  maxSpd
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

export default cronJob;

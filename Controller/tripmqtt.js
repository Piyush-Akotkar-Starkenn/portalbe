import { db } from "../Config/db.js";

import async from "async";
import EndTrip from "./EndTrip.js";
import { client } from "../Config/mqttConnection.js";

const getMqttData = () => {
  // Connect to the topics
    client.on("connect", () => {
      let q =
        "SELECT * FROM devices_master WHERE device_type = 'IoT' OR device_type = 'DMS' AND status = '1'";
      db.query(q, (err, results) => {
        if (err) return err;
        if (results) {
          results.forEach((row) => {
            let getTopic = "starkennInv3/" + row.device_id + "/data";
            client.subscribe(getTopic, (err) => {
              if (err) {
                console.log("Error subscribing to topic:", getTopic);
              } else {
                console.log("Subscribed to topic:", getTopic);
              }
            });
          });
        }
      });
    });


  // Get the real time message data from the device
  client.on("message", function (topic, message) {
    try {
      // Use the async.queue() function to handle multiple topics at the same time
      const insertData = async.queue(function (task, callback) {
        let jsonData = task.message;
        console.log(jsonData);
        EndTrip(jsonData);

        // Insert Into Trip Summary
        let cq = "SELECT * FROM trip_summary WHERE trip_id = ?";
        db.query(cq, [jsonData.trip_id], (error, results) => {
          if (error) return error;
          if (results.length == 0) {
            if (
              jsonData.device_id != "EC0000A" &&
              jsonData.trip_id != "" &&
              jsonData.td.lat != undefined &&
              jsonData.td.lat != "" &&
              jsonData.td.lng != undefined &&
              jsonData.td.lng != "" &&
              jsonData.event == "LOC"
            ) {
              // get vehicle id and user id

              // Insert query for ECU ID
              const q = `SELECT * FROM vehicle_master WHERE ecu = ?`;
              // const q = `SELECT * FROM vehicle_master WHERE iot = ?`;
              db.query(q, jsonData.device_id, (err, data) => {
                if (err) return err;
                if (data.length > 0) {
                  let q =
                    "INSERT INTO trip_summary (trip_id, user_id, vehicle_id, device_id, trip_start_time, trip_status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";

                  let istTime = jsonData.timestamp;
                  let params = [
                    jsonData.trip_id,
                    data[0].user_id,
                    data[0].vehicle_id,
                    jsonData.device_id,
                    istTime,
                    0,
                  ];
                  db.query(q, params, (err, result) => {
                    if (err) return err;
                    console.log("Trip summary insterted!");
                  });
                } else {
                  console.log(results, "results");
                  console.log("Vehicle Data not found");
                }
              });

              // Insert query for DMS ID
              const qd = `SELECT * FROM vehicle_master WHERE dms = ?`;
              db.query(qd, jsonData.device_id, (err, data) => {
                if (err) return err;
                if (data.length > 0) {
                  let q =
                    "INSERT INTO trip_summary (trip_id, user_id, vehicle_id, device_id, trip_start_time, trip_status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";

                  let istTime = jsonData.timestamp;
                  let params = [
                    jsonData.trip_id,
                    data[0].user_id,
                    data[0].vehicle_id,
                    jsonData.device_id,
                    istTime,
                    0,
                  ];
                  db.query(q, params, (err, result) => {
                    if (err) return err;
                    console.log("Trip summary insterted!");
                  });
                } else {
                  console.log(results);
                  console.log("Vehicle Data not found");
                }
              });
            }
          } else {
            console.log("Continue trip");
          }
        });

        // Insert Into Trip Data
        if (
          jsonData.device_id != "EC0000A" &&
          jsonData.trip_id != "" &&
          jsonData.td.lat != undefined &&
          jsonData.td.lat != "" &&
          jsonData.td.lng != undefined &&
          jsonData.td.lng != ""
        ) {
          let q = "SELECT trip_id FROM tripdata WHERE trip_id = ?";

          db.query(q, [jsonData.trip_id], (err, results) => {
            if (err) return console.log(err);

            if (results.length >= 0) {
              function updateTripData() {
                let istTime = jsonData.timestamp;
                let cpu_load = null;
                let cpu_temp = null;
                let memory = null;
                if (jsonData.device_health) {
                  if (
                    jsonData.device_health.cpu_load != undefined &&
                    jsonData.device_health.cpu_load != "" &&
                    jsonData.device_health.cpu_temp != undefined &&
                    jsonData.device_health.cpu_temp != "" &&
                    jsonData.device_health.memory != undefined &&
                    jsonData.device_health.memory != ""
                  ) {
                    cpu_load = jsonData.device_health.cpu_load;
                    cpu_temp = jsonData.device_health.cpu_temp;
                    memory = jsonData.device_health.memory;
                  } else {
                    cpu_load = null;
                    cpu_temp = null;
                    memory = null;
                  }
                }

                let values = {
                  trip_id: jsonData.trip_id,
                  device_id: jsonData.device_id,
                  event: jsonData.event,
                  message: jsonData.message,
                  timestamp: istTime,
                  ignition: jsonData.ignition,
                  lat: jsonData.td.lat,
                  lng: jsonData.td.lng,
                  spd: jsonData.td.spd,
                  cpu_load: cpu_load,
                  cpu_temp: cpu_temp,
                  memory: memory,
                  jsonData: JSON.stringify(task.message),
                };

                let q = "INSERT INTO tripdata SET ?";
                        db.query(q, values, function (error, results) {
                          if (error) throw error;
                          console.log("Inserted");
                          callback();
                        });
              }
              // All the mqtt data should store in tripdata table with the trip id
              updateTripData();
            }
          });
        }
      }, 10);

      // Parse the message as JSON
      const msg = JSON.parse(message.toString());

      // Add the message to the insertData queue
      insertData.push({ topic: topic, message: msg }, function (error) {
        if (error) throw error;
      });
    } catch (error) {
      console.log(error);
    }
  });
};

export default getMqttData;

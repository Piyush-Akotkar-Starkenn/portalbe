import mysql from "mysql";

export const db = mysql.createConnection({
  host: "stknportal.cuce9do7mxez.ap-south-1.rds.amazonaws.com",
  user: "starkennadmin",
  password: "4x7SbTLSLH5NC9Yn43E0",
  database: "stakennportal",
  port: 3306,
  connectionLimit: 10,
});

db.connect((err) => {
  if (err) {
    console.log({ ErrorDB: err });
  } else {
    console.log("Connected to Database");
  }
});

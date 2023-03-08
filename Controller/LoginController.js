import { db } from "../Config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export const login = (req, res) => {
  const getDataQuery = "SELECT * FROM users WHERE email = ? ";

  db.query(getDataQuery, [req.body.email], (err, data) => {
    if (err) {
      return res.status(500).send({ Error: err });
    } else {
      if (data.length > 0) {
        const hash = data[0].password;

        bcrypt.compare(req.body.password, hash, function (err, result) {
          if (err) {
            return res.status(500).send({ ErrorPassComp: err });
          } else {
            if (result) {
              const token = jwt.sign(
                { id: data[0].id },
                process.env.JWT_SECRET
              );

              return res.status(200).send({
                Message: "Login Successfull",
                token,
                user_type: data[0].user_type,
                user_id: data[0].user_id,
              });
            } else {
              return res.status(500).send({ ErrorPass: "Wrong Password" });
            }
          }
        });
      } else {
        return res.status(500).send("Wrong Email");
      }
    }
  });
};

export const signup = (req, res) => {
  const checkuserQuery = "SELECT * FROM users WHERE  username=? OR email=? ";

  db.query(checkuserQuery, [req.body.username, req.body.email], (err, data) => {
    if (err) {
      res.send({ ErrorCheckUser: err });
    } else {
      if (data.length > 0) {
        res.status(500).send("User Already Exists");
      } else {
        bcrypt.hash(req.body.password, 4, function (err, hash) {
          if (err) {
            res.status(500).send({ ErrorHashPass: err });
          } else {
            const insertUserQuery =
              "INSERT INTO users(`first_name`,`last_name`,`username`,`email`,`password`,`user_type`,`status`) VALUES (?)";

            const values = [
              req.body.first_name,
              req.body.last_name,
              req.body.username,
              req.body.email,
              hash,
              req.body.user_type,
              req.body.status,
            ];

            db.query(insertUserQuery, [values], (err, userData) => {
              if (err) {
                res.status(500).send({ ErrorUser: err });
              } else {
                res.status(200).send({ SignupData: userData });
              }
            });
          }
        });
      }
    }
  });
};

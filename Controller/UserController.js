import { db } from "../Config/db.js";

export const getAllUsers = (req, res) => {
  const q =
    "SELECT user_id, first_name, last_name, status FROM users WHERE status = 1";
  db.query(q, (err, results) => {
    if (err) return err;
    if (results) {
      return res.status(200).send(results);
    }
  });
};

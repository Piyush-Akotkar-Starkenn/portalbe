import { db } from "../Config/db.js";

export const getAllUsers = (req, res) => {
  const q =
    "SELECT user_id, first_name, last_name, status FROM users WHERE status = 1 AND user_type = 2";
  db.query(q, (err, results) => {
    if (err) return err;
    if (results) {
      return res.status(200).send(results);
    }
  });
};

// DELIMITER //
// CREATE PROCEDURE insertUserData(
//       user_id INT AUTO_INCREMENT PRIMARY KEY,
//    first_name VARCHAR(255) NOT NULL,
//    last_name VARCHAR(255) NOT NULL,
//    username VARCHAR(255) NOT NULL,
//    email VARCHAR(255) NOT NULL,
//    password VARCHAR(255) NOT NULL,
//    user_type VARCHAR(255) NOT NULL,
//    status VARCHAR(255) NOT NULL,
//    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//    created_by VARCHAR(255) NOT NULL,
//    modified_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//    modified_by VARCHAR(255) NOT NULL
//  );
// BEGIN
// INSERT INTO boat (user_id, first_name, last_name, username, email, password, user_type, status, created_at, created_by, modified_at, modified_by)
//  VALUES (user_id, first_name, last_name, username, email, password, user_type, status, created_at, created_by, modified_at, modified_by) ;
// END //
// DELIMITER ;
  
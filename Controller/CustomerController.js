import { db } from "../Config/db.js";
import bcrypt from "bcryptjs";


//-Getting Customers from user_id  START//
export const getall = (req, res) => {
  const { user_id } = req.params;

  const getQuery = "SELECT * FROM customer_master WHERE user_id=?";

  db.query(getQuery, [user_id], (err, data) => {
    if (err) {
      res.status(500).send({ Error: err });
    } else {
      res.status(200).send({ getData: data });
    }
  });
};
//-Getting Customers from user_id  END//

//Adding Master_Customer Data With Store Procedure-- START//
export const addCustomer = (req, res) => {
  const { user_id } = req.params;

  const checkQuery = "SELECT * FROM customer_master WHERE user_id=?";

  db.query(checkQuery, [user_id], (checkerr, result) => {
    if (checkerr) {
      res.status(500).send({ Error: checkerr });
    } else {
      if (result.length > 0) {
        res.status(500).send("Customer Already Exists");
      } else {
        // const insertQuery =
        //   "INSERT INTO customer_master(`user_id`,`company_name`,`address`,`state`,`city`,`pincode`,`phone`,`status`,`created_at`) VALUES(?,?,?,?,?,?,?,?,NOW()) ";
        const insertQuery = 'CALL insertCustomer(?,?,?,?,?,?,?,?)';
        const values = [
          user_id,
          req.body.company_name,
          req.body.address,
          req.body.state,
          req.body.city,
          req.body.pincode,
          req.body.phone,
          req.body.status,
        ];

        db.query(insertQuery, values, (err, data) => {
          if (err) {
            res.status(500).send({ Errorpost: err });
          } else {
            res.status(200).send({ master_customerData: data });
          }
        });
      }
    }
  });
};
//Adding Master_Customer Data With Store Procedure-- END//

//Editing Master_customer Data using user_id && customer_id  START//
export const editCustomer2 = (req, res) => {
  const { customer_id } = req.params;

  let { ...columns } = req.body;

  let updateQuery = `UPDATE customer_master SET `;
  let updateData = [];

  Object.keys(columns).forEach((key, index) => {
    updateQuery += `${key}=?`;
    updateData.push(columns[key]);

    if (index < Object.keys(columns).length - 1) {
      updateQuery += ", ";
    }
  });

  updateQuery += `WHERE customer_id=?`;
  updateData.push(customer_id);

  db.query(updateQuery, updateData, (error, results, fields) => {
    if (error) throw error;
    res.send({ editResult: results });
  });
};


export const editCustomer = (req, res) => {
  const { field, value } = req.body;
  const { customer_id } = req.params;

  if (!field || !value) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let sql;
  switch (field) {
    case 'company_name':
      sql = 'CALL updatecompany_name(?, ?)';
      break;
    case 'address':
      sql = 'CALL updateaddress(?, ?)';
      break;
    case 'state':
      sql = 'CALL updatestate(?, ?)';
      break;
    case 'city':
      // Check if the phone field contains a valid phone number
     
      sql = 'CALL updatecity(?, ?)';
      break;
    case 'pincode':
      sql = 'CALL updatepincode(?, ?)';
      break;
    case 'phone':
      // Check if the password and confirm_password fields match
     
      sql = 'CALL updatephone(?, ?)';
      break;
    case 'status':
      sql = 'CALL updatestatus(?, ?)';
      break;
    default:
      return res.status(400).json({ error: 'Invalid field' });
  }

  db.query(sql, [value, customer_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result[0][0].status !== 'OK') {
      return res.status(404).json({ error: result[0][0].status });
    }

    res.status(200).json({ message: 'User updated successfully' });
  });
};

//Editing Master_customer Data using user_id && customer_id  END//

//Getting all the users for admin side-- START//
export const getallusers = (req, res) => {
  const queryall =
    "SELECT * from users WHERE user_type = ? ORDER BY user_id DESC";

  db.query(queryall, [2], (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send({ usersData: data });
    }
  });
};
//Getting all the users for admin side-- END//

//Adding users in admin side With store Procedure START//
export const addUsers = (req, res) => {
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
            let user_type = 2;
            // const insertUserQuery =
            //   "INSERT INTO users(`first_name`,`last_name`,`username`,`email`,`password`,`user_type`,`status`) VALUES (?)";
               const insertUserQuery = 'CALL insertUserCutomer(?)';
            const values = [
              req.body.first_name,
              req.body.last_name,
              req.body.username,
              req.body.email,
              hash,
              user_type,
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
//Adding users in admin side with store proceduter END//

// Editing the Users data START //
export const editUser = (req, res) => {
  let { user_id } = req.params;
  let { ...columns } = req.body;

  let updateQuery = `UPDATE users SET `;
  let updateData = [];

  Object.keys(columns).forEach((key, index) => {
    updateQuery += `${key}=?`;
    updateData.push(columns[key]);

    if (index < Object.keys(columns).length - 1) {
      updateQuery += ", ";
    }
  });

  updateQuery += `WHERE user_id=?`;
  updateData.push(user_id);

  db.query(updateQuery, updateData, (error, results, fields) => {
    if (error) throw error;
    res.send({ editResult: results });
  });
};
export const editUser1 = (req, res) => {
  const { field, value } = req.body;
  const { user_id } = req.params;

  if (!field || !value) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let sql;
  switch (field) {
    case 'first_name':
      sql = 'CALL updateFirstName(?, ?)';
      break;
    case 'last_name':
      sql = 'CALL updateLastName(?, ?)';
      break;
    case 'username':
      sql = 'CALL updateusername(?, ?)';
      break;
    case 'email':
      sql = 'CALL updateemail(?, ?)';
      break;
      case 'password':
        sql = 'CALL updatepassword(?, ?,?)';
        // const hashedPassword = bcrypt.hashSync(value, 10);
        // value = hashedPassword;
        value = bcrypt.hashSync(value, 10);
        break;
    case 'user_type':
      sql = 'CALL updateUserUserType(?, ?)';
      break;
    case 'status':
      sql = 'CALL updatestatus(?, ?)';
      break;
    default:
      return res.status(400).json({ error: 'Invalid field' });
  }

  db.query(sql, [value, user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result[0][0].status !== 'OK') {
      return res.status(404).json({ error: result[0][0].status });
    }

    res.status(200).json({ message: 'User updated successfully' });
  });
};

// Editing the Users data END //

//get user data by user_id START //
export const getuserById = (req, res) => {
  const { user_id } = req.params;
  const getQuery = "SELECT * FROM users WHERE user_id=?";

  db.query(getQuery, [user_id], (err, data) => {
    if (err) {
      res.status(500).send({ ErrorIdGet: err });
    } else {
      res.status(200).send({ IdData: data });
    }
  });
};
//get user data by user_id END //

// Get Customer Detail By User Id START //
export const getCustomerDetailByUserId = (req, res) => {
  const { user_id } = req.params;
  const getQuery = "SELECT * FROM customer_master WHERE user_id=?";

  db.query(getQuery, [user_id], (err, data) => {
    if (err) {
      res.status(500).send({ ErrorIdGet: err });
    } else {
      res.status(200).send({ IdData: data });
    }
  });
};
// Get Customer Detail By User Id END //
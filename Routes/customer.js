import express from "express";
import {
  addCustomer,
  addUsers,
  editCustomer,
  editUser,
  getall,
  getallusers,
  getuserById,
  getCustomerDetailByUserId,
} from "../Controller/CustomerController.js";

const CustomerRoute = express.Router();

////get all customers
CustomerRoute.get("/getall/:user_id", getall);
///////add customers data
CustomerRoute.post("/add-customer/:user_id", addCustomer);
//////update customers data
CustomerRoute.put("/edit-customer/:customer_id", editCustomer);
///////////////////////////////////////////////////////////////////////
//////get all users for admin
CustomerRoute.get("/getall", getallusers);

/////////add users
CustomerRoute.post("/add-user", addUsers);
/////////////Edit users
CustomerRoute.put("/edit-user/:user_id", editUser);
/////////////////////////get Particular User
CustomerRoute.get("/get-user/:user_id", getuserById);
CustomerRoute.get("/get-customer-details/:user_id", getCustomerDetailByUserId);

export default CustomerRoute;

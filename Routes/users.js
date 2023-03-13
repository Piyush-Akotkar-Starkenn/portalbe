import express from "express";
import { getAllUsers } from "../Controller/UserController.js";
const UsersRouter = express.Router();

UsersRouter.get("/get-all-users", getAllUsers);

export default UsersRouter;

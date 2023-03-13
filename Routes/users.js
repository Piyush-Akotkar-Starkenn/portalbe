import express from "express";
import { getAllUsers } from "../Controller/UserController.js";
const UsersRouter = express.Router();

UsersRouter.get("/getall", getAllUsers);

export default UsersRouter;

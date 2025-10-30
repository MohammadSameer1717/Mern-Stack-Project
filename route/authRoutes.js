import express from "express";
import { login, logOut, Signup } from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", Signup);  // <-- same spelling
authRouter.post("/login", login);
authRouter.get("/logout", logOut);

export default authRouter;

import {
    login,
    signup,
    getAllUsers,
    resetpassword,
  } from "../Controllers/UserController.js";
  import express from "express";
  const router = express.Router();
  router.post("/signup", signup);
  router.post("/login", login);
  router.get("/getuser", getAllUsers);
  router.post("/resset", resetpassword);
  export default router;
  
import express from "express";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  updateMovie,
  getMovieById,
} from "../Controllers/CrudController.js";

const router = express.Router();

router.post("/create", addMovie);
router.get("/getallmovie", getAllMovies);
router.get("/getMovieById/:id", getMovieById);
router.put("/updated/:id", updateMovie);

router.delete("/delete/:id", deleteMovie);

export default router;

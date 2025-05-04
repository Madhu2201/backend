import express from 'express';
import { addMovie, deleteMovie, getAllMovies, updateMovie, getMovieById, verifyToken } from '../Controllers/CrudController.js';

const router = express.Router();

router.post('/create',verifyToken, addMovie);
router.get('/getallmovie',verifyToken, getAllMovies);
router.get('/getMovieById/:id', getMovieById);
router.put('/updated/:id', updateMovie);

router.delete('/delete/:id',verifyToken, deleteMovie)

export default router;
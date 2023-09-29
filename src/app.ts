import express from "express";
import "dotenv/config";
import { connectDatabase, createDatabaseTable } from "./database";
import {
  createMovies,
  deleteMovies,
  getAllMovies,
  getMoviesById,
  updateMovies,
} from "./logic";
import { isIdValid, isMovieNameUnique } from "./middlewares";

const app = express();

app.use(express.json());

app.post("/movies", isMovieNameUnique, createMovies);
app.get("/movies", getAllMovies);
app.get("/movies/:movieId", isIdValid, getMoviesById);
app.patch("/movies/:movieId", isIdValid, isMovieNameUnique, updateMovies);
app.delete("/movies/:movieId", isIdValid, deleteMovies);

const PORT = 3000;

app.listen(PORT, async () => {
  await connectDatabase();
  await createDatabaseTable();
  console.log(`Server started on port ${PORT}`);
});

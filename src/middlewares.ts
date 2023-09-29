import { NextFunction, Request, Response } from "express";
import { client } from "./database";
import format from "pg-format";

export const isIdValid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryString = format(
    `SELECT * FROM movies WHERE id = %L;`,
    req.params.movieId
  );

  const data = await client.query(queryString);

  if (data.rowCount === 0) {
    return res.status(404).json({ message: "Movie not found!" });
  }

  res.locals.movie = data.rows[0];

  next();
};

export const isMovieNameUnique = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryString = `SELECT * FROM movies;`;

  const data = await client.query(queryString);

  const searchSameNameMovie = data.rows.some(
    (movie) => movie.name === req.body.name
  );

  if (searchSameNameMovie) {
    return res.status(409).json({ message: "Movie name already exists!" });
  }

  next();
};

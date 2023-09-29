import { Request, Response } from "express";
import { client } from "./database";
import format from "pg-format";
import { IMovies, TMoviesUpdateData } from "./interfaces";

export const createMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const newMovie: Omit<IMovies, "id"> = {
    name: req.body.name,
    category: req.body.category,
    duration: req.body.duration,
    price: req.body.price,
  };

  const queryString = format(
    `INSERT INTO movies (%I) VALUES (%L) RETURNING *;`,
    Object.keys(newMovie),
    Object.values(newMovie)
  );

  const data = await client.query(queryString);

  return res.status(201).json(data.rows[0]);
};

export const getAllMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let queryString = format(
    `SELECT * FROM movies WHERE category ILIKE %L`,
    req.query.category
  );

  const search = await client.query(queryString);

  if (search.rowCount === 0) {
    queryString = `SELECT * FROM movies;`;
  }

  const data = await client.query(queryString);

  return res.status(200).json(data.rows);
};

export const getMoviesById = (_req: Request, res: Response) => {
  return res.status(200).json(res.locals.movie);
};

export const updateMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const objectData: TMoviesUpdateData = {};

  Object.entries(req.body).forEach((entry) => {
    const [key, value] = entry;
    if (
      key === "name" ||
      key === "category" ||
      key === "duration" ||
      key === "price"
    ) {
      objectData[key] = value as never;
    }
  });

  const queryString = format(
    `UPDATE movies SET(%I) = ROW(%L) WHERE id = %L RETURNING *;`,
    Object.keys(objectData),
    Object.values(objectData),
    req.params.movieId
  );

  const data = await client.query(queryString);

  return res.status(200).json(data.rows[0]);
};

export const deleteMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString = format(
    `DELETE FROM movies WHERE id = %L;`,
    req.params.movieId
  );

  await client.query(queryString);

  return res.status(204).json();
};

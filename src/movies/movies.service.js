const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

function list() {
  return knex("movies").select("*").groupBy("movies.movie_id");
}

function listActiveMovies() {
  return knex("movies")
    .join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
    .select("movies.*")
    .where({ "movies_theaters.is_showing": true })
    .groupBy("movies.movie_id");
}

function read(id) {
  return knex("movies")
    .select("*")
    .where({ movie_id: id })
    .groupBy("movies.movie_id")
    .first();
}

function listTheaters(id) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ movie_id: id, is_showing: true });
}

function listReviews(id) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({ "r.movie_id": id })
    .then((result) => {
      const movieList = [];
      result.forEach((item) => {
        const appendedObject = addCritic(item);
        movieList.push(appendedObject);
      });
      return movieList;
    });
}

module.exports = {
  list,
  listActiveMovies,
  read,
  listTheaters,
  listReviews,
};

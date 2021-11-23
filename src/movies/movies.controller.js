const service = require("./movies.service");
const boundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res, next) {
  const isShowing = req.query.is_showing;
  if (isShowing) {
    res.json({ data: await service.listActiveMovies() });
  } else {
    res.json({ data: await service.list() });
  }
}

async function read(req, res, next) {
  const movie = res.locals.movie;
  res.json({ data: movie });
}

async function listTheaters(req, res, next) {
  const { movieId } = req.params;
  const theaters = await service.listTheaters(movieId);
  res.json({ data: theaters });
}

async function listReviews(req, res, next) {
  const { movieId } = req.params;
  const reviews = await service.listReviews(movieId);
  res.json({ data: reviews });
}

module.exports = {
  list: boundary(list),
  read: [boundary(movieExists), read],
  listTheaters: [boundary(movieExists), boundary(listTheaters)],
  listReviews: [boundary(movieExists), boundary(listReviews)],
};

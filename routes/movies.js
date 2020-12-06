const express = require('express');
const router = express.Router();
const graphql = require('./common')

function contributing(req, res, next) {
    if (req.user) {
        if (req.user.Role === 'contributing') {
            return next()
        }
    }
    req.session.returnTo = req.originalUrl
    res.send("Not enough rights")
}

function secured(req, res, next) {
    if (req.user) {
        return next()
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

/* GET users listing. */
router.get('/', (req, res, next) => {
    const request =
        `query Movies($query: MovieQuery) {
            movies(query: $query) {
                _id
                Title
                Genre
                Year
                Poster
                Plot
                Reviews {
                    Value
                }
            }
        }`
    if (req.query && req.query.Year) {
        req.query.Year = parseInt(req.query.Year)
    }
    if (req.query && req.query.minrating) {
        req.query.minrating = parseInt(req.query.minrating)
    }
    graphql('http://localhost:8000/graphql', request, req, {
        query: req.query
    })
        .then(r => {
            if (r.status >= 300) {
                res.status(r.status)
                res.send(r.body)
            } else {
                return r.json()
            }
        })
        .then(movies => {
            res.render("index", { movies: movies.data.movies, user: req.user })
        })
});

router.post('/', contributing, (req, res, next) => {
    const request =
        `mutation CreateMovie($movie: MovieInput) {
            createMovie(movie: $movie) {
                _id
                Title
                Genre
                Year
            }
        }`
    if (req.body && req.body.Year) {
        req.body.Year = parseInt(req.body.Year)
    }
    graphql('http://localhost:8000/graphql', request, req, {
        movie: req.body
    })
        .then(r => {
            if (r.status >= 300) {
                res.status(r.status)
                res.send(r.body)
            } else {
                return r.json()
            }
        })
        .then(movies => {
            res.send(movies)
        })
});

router.get('/:movieID', (req, res, next) => {
    const request =
        `query Movie($id: ID) {
            movie(id: $id) {
                _id
                Title
                Genre
                Year
                Director {
                    _id
                    Name
                }
                Writer {
                    _id
                    Name
                }
                Actors {
                    _id
                    Name
                }
                Runtime
                Plot
                Poster
                Country
                Reviews {
                    Source {
                        _id
                        Username
                    }
                    Value
                }
            }
        }`
    graphql('http://localhost:8000/graphql', request, req, {
        id: req.params.movieID
    })
        .then(r => {
            if (r.status >= 300) {
                res.status(r.status)
                res.send(r.body)
            } else {
                return r.json()
            }
        })
        .then(movie => {
            res.render("moviedetails", { movie: movie.data.movie, user: req.user })
        })
})

router.post('/:movieID/reviews', secured, (req, res, next) => {
    const request =
        `mutation CreateReview($id: ID, $value: Int) {
            createReview(movieId: $id, value: $value) {
                _id
                Title
                Genre
                Year
            }
        }`
    graphql('http://localhost:8000/graphql', request, req, {
        id: req.params.movieID,
        value: req.body.value
    })
        .then(r => {
            if (r.status >= 300) {
                res.status(r.status)
                res.send(r.body)
            } else {
                return r.json()
            }
        })
        .then(movie => {
            res.send(movie)
        })
})

module.exports = router;

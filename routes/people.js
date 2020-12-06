const express = require('express');
const router = express.Router();
const graphql = require('./common')

function secured(req, res, next) {
    if (req.user) {
        return next()
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

router.get('/:personId', (req, res, next) => {
    const request =
        `query Person($id: ID) {
            person(id: $id) {
                _id
                Name
                Movies {
                    _id
                    Title
                    Genre
                    Year
                    Plot
                    Poster                
                }
            }
        }`
    graphql('http://localhost:8000/graphql', request, req, {
        id: req.params.personId
    })
        .then(r => {
            if (r.status >= 300) {
                res.status(r.status)
                res.send(r.body)
            } else {
                return r.json()
            }
        })
        .then(person => {
            res.render("personpage", { person: person.data.person, user: req.user })
        })
})

router.post('/:personId/subscribe', secured, (req, res, next) => {
    const request =
        `mutation Subscribe($id: ID) {
            subscribe(id: $id) {
                Username
            }
        }`
    graphql('http://localhost:8000/graphql', request, req, {
        id: req.params.personId
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

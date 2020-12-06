const express = require('express');
const router = express.Router();
const graphql = require('./common')

router.get('/:personId', (req, res, next) => {
    const request =
        `query Person($id: ID) {
            person(id: $id) {
                _id
                Name
                Movies {
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
        .then(movie => {
            res.send(movie)
        })
})

module.exports = router;

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const graphql = require('./common')

/* GET users listing. */
router.get('/', (req, res, next) => {
    const request =
        `{
            users {
                _id
                Username
                Password
                Email
            }
        }`
    graphql('http://localhost:8000/graphql', request, req)
        .then(r => {
            if (r.status >= 300) {
                res.status(r.status)
                res.send(r.body)
            } else {
                return r.json()
            }
        })
        .then(users => {
            res.send(users)
        })
});

router.get('/:userId', (req, res, next) => {
    const request =
        `
        query User($id: ID) {
            user(id: $id) {
                Username
                UserSubscriptions {
                    Username
                }
                PersonSubscriptions {
                    Name
                }
            }
        }
        `
    graphql('http://localhost:8000/graphql', request, req, {
        id: req.params.userId
    })
        .then(r => {
        if (r.status >= 300) {
            res.status(r.status)
            res.send(r.body)
        } else {
            return r.json()
        }
    })
        .then(users => {
            res.send(users)
        })
})

router.put('/:userId', (req, res, next) => {
    const request =
        `
        mutation ChangeUser($user: UserUpdate) {
            changeUser(user: $user) {
                _id
                Username
            }
        } 
        `
    graphql("http://localhost:8000/graphql", request, req, {
        id: req.user._id,
        user: req.body
    })
        .then(r => {
            if (r.status >= 300) {
                res.status(r.status)
                res.send(r.body)
            } else {
                return r.json()
            }
        })
        .then(users => {
            res.send(users)
        })
})

module.exports = router;

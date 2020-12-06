const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const graphql = require('./common')
const User = require('../graphql/schema/UserSchema')

function contributing(req, res, next) {
    if (req.user) {
        if (req.user.Role === 'contributing') {
            return next()
        }
    }
    req.session.returnTo = req.originalUrl
    res.send("Not enough rights")
}

/* GET users listing. */
router.get('/', contributing, (req, res, next) => {
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

router.get('/:userId', async (req, res, next) => {
    const user = await User.findOne({ Username: req.user.Username }).exec()
    if (user._id.toString() === req.params.userId) {
        res.redirect('/me')
    }
    next()
}, (req, res, next) => {
    const request =
        `
        query User($id: ID) {
            user(id: $id) {
                _id
                Username
                Email
                UserSubscriptions {
                    _id
                    Username
                }
                PersonSubscriptions {
                    _id
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
        .then(user => {
            res.render("userprofile", { user: user.data.user })
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

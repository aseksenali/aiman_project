const express = require('express');
const router = express.Router();
const User = require('../graphql/schema/UserSchema')
const graphql = require('./common')

function secured(req, res, next) {
    if (req.user) {
        return next()
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

function contributing(req, res, next) {
    if (req.user) {
        if (req.user.Role === 'contributing') {
            return next()
        }
    }
    req.session.returnTo = req.originalUrl
    res.send("Not enough rights")
}

/* GET home page. */
router.get('/', (req, res, next) => {
    res.redirect('http://' + req.headers.host + '/movies')
});

router.get('/me', secured, async (req, res, next) => {
    const user = await User.findOne({ Username: req.user.Username }).exec()
    const request =
        `
        query User($id: ID) {
            user(id: $id) {
                _id
                Username
                Email
                Role
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
        id: user._id
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
});

router.get('/movies/create', contributing, (req, res, next) => {
    res.render("createmovie", { user: req.user })
})

module.exports = router;

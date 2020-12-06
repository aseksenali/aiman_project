const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')

router.get('/', (req, res, next) => {
    res.render('registration');
});

router.post('/', (req, res, next) => {
    const modify =
        `mutation RegisterUser($user: UserInput) {
           saveUser(user: $user) {
              Username
           }
        }`
    fetch("http://localhost:8000/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: modify,
            variables: { user: req.body }
        })
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
            if (Object.keys(user).includes("data")) {
                if (user.data.saveUser !== null) {
                    res.send(`User with username ${user.data.saveUser.Username} created successfully`)
                } else {
                    res.send(`User already exists`)
                }
            } else {
                res.send("Error occurred")
            }
        })
})

module.exports = router;

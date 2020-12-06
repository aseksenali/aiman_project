const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.redirect('http://' + req.headers.host + '/movies')
});

router.get('/me', (req, res, next) => {
    res.render("userprofile", {user: req.user})
})

module.exports = router;

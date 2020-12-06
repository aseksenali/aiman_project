const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../graphql/schema/UserSchema')

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ Username: username }, (err, user) => {
        if (err) {
            return done(err)
        }
        if (!user) {
            console.log("Incorrect username.")
            return done(null, false, { message: 'Incorrect username.' })
        }
        if (!user.validPassword(password)) {
            console.log("Incorrect password.")
            return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)
    })
}))
const passportOptions = {
    successRedirect: '/movies',
    failureRedirect: '/login',
    failureFlash: true,
};

router.post('/login', passport.authenticate('local', passportOptions))
router.get('/login', (req, res, next) => {
    res.render('login')
})
router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/movies')
})

module.exports = router

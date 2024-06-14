const passport = require('passport')
const passportlocal = require('passport-local')
const login = require('../models/registermodel');
const passportLocal = require('passport-local').Strategy;

passport.use(new passportLocal({
    usernameField: "email"
},
    async (email,password, cb) => {
        try {
            const user = await login.findOne({ email })
            if (user) {
                if (user.password == password) {
                    return cb(null, user);
                } else {
                    // req.flash('success', "Login Successfully");
                    console.log("wrong password")
                    return cb(null, false);
                }
            } else {

                console.log("wrong email");
                return cb(null, false);
            }
        } catch (err) {
            return cb(err)
        }
    }
))

passport.checkAuthentication = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login');
}

passport.serializeUser(async (user, cb) => {
    try {
        return cb(null, user.id)
    } catch (err) {
        return cb(err)
    }

})

passport.deserializeUser(async (id, cb) => {
    try {
        const user = await login.findById(id)
        if (user) {
            return cb(null, user)
        } else {
        }
    } catch (err) {
        return cb(err)
    }
})
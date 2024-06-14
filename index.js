const express = require('express');
const app = express();
const port = 6000;
const db = require('./config/mongoose');
const flash = require('connect-flash')
const path = require('path');
const cookie = require("cookie-parser");
const session = require("express-session");
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');


const multer = require('multer');
// const mystorage = multer.diskStorage({
//     destination : (req,file,cb) => {
//         cb(null,imagePath);  
//     },
//     filename : (req,file,cb) => {
//         cb(null,file.fieldname+"-"+Date.now()); 
//     }
// })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  });

// Define mystorage before using it in multer configuration

// const imageUpload = multer({ storage: mystorage }).single('avatar');

app.use('/uploads', express.static(path.join('uploads')))


const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
    name: "Hitesh",
    secret: "hitesh",
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookie());
app.use(flash());

app.use((req,res,next)=>{
  res.locals.message = {
      'success' : req.flash('success'),
      'danger' : req.flash('danger')
  }
  next();
})

app.use(express.urlencoded({ extended: false }));
app.use('/', require('./routes'));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    } else {
        console.log('server start on port:-' + port);
    }
});

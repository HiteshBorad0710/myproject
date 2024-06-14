const express = require('express');
const routes = express.Router();
const menucontroller = require('../controllers/menucontroller');
const passport = require('passport');
const imageUpload = require('../middleware/imageupload');


routes.get('/', menucontroller.index);
routes.get('/login', menucontroller.login);
routes.post('/loginData', menucontroller.loginData);
// routes.post('/loginData', menucontroller.loginData);

routes.get('/register', menucontroller.register);
routes.post('/registerData', menucontroller.registerData);
routes.get('/forgetpassword', menucontroller.forgetpassword);
routes.post('/forgotpass', menucontroller.forgotpass);
routes.post('/loginData', menucontroller.loginData);
routes.get('/otp', menucontroller.otp);
routes.post('/otpData', menucontroller.otpData);
routes.get('/newpass', menucontroller.newpass);
routes.post('/newpassData', menucontroller.newpassData);

// routes.get('/logout', menucontroller.logout);

routes.get('/contactus', menucontroller.contactus);
routes.post('/contactUs', menucontroller.contactUs);
routes.get('/viewcontactus', menucontroller.viewcontactus);

// ----------------------------------------------------Add Time Slot------------------------------------------------------------------------------------------

routes.get('/addtimeslot', menucontroller.addtimeslot);
routes.post('/addTimeSlot', menucontroller.addTimeSlot);
routes.get('/viewtimeslot', menucontroller.viewtimeslot);
routes.get('/timeslotActive/:_id', menucontroller.timeslotActive);
routes.get('/timeslotDeactive/:_id', menucontroller.timeslotDeactive);
routes.get('/timeslotEdit/:id', menucontroller.timeslotEdit);
routes.post('/updatetimeslot/:_id', menucontroller.updatetimeslot);
routes.get('/timeslotDelete/:_id', menucontroller.timeslotDelete);

// ----------------------------------------------------Book Time Slot------------------------------------------------------------------------------------------

routes.get('/bookslot', menucontroller.bookslot);
routes.post('/addbookslot', menucontroller.addbookslot);
// routes.post('/checkslot',menucontroller.checkslot)

routes.get('/userdetails', menucontroller.userdetails);
routes.post('/Userdetails', menucontroller.Userdetails);
routes.get('/viewuserdetails', menucontroller.viewuserdetails);
routes.get('/payment', menucontroller.payment);
routes.get('/addqrcode', menucontroller.addqrcode);
routes.post('/Addqrcode', imageUpload, menucontroller.Addqrcode);
routes.get('/viewqrcode', menucontroller.viewqrcode);
routes.get('/qrcodeEdit/:id', menucontroller.qrcodeEdit);
routes.post('/updateqrcode/:_id', imageUpload, menucontroller.updateqrcode);
routes.get('/qrcodeDelete/:_id', menucontroller.qrcodeDelete);

routes.get('/adminform', menucontroller.adminform);
routes.post('/Adminform', menucontroller.Adminform);
routes.get('/viewadminform', menucontroller.viewadminform);

routes.get('/editadminform/:id', menucontroller.editadminform);
routes.post('/updateadminform/:_id', menucontroller.updateadminform);
routes.get('/deleteadminform/:_id', menucontroller.adminformDelete);

module.exports = routes;
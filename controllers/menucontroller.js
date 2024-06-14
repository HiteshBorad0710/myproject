const express = require('express');
const timeslotmodel = require('../models/timeslotmodel');
const bookslotmodel = require('../models/bookslotmodel');
const userdetailsmodel = require('../models/userdetailsmodel');
const RegisterModel = require('../models/registermodel');
const adminformmodel = require('../models/adminformmodel');
const contactusmodel = require('../models/contactusmodel');
const qrcodemodel = require('../models/qrcodemodel');
const { responseStatusCode, responseStatusText } = require("../helper/responseHelper");
const { userLoginValidation } = require("../validation/user.validation");
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
// const Moment = require('moment')
const path = require("path");
const currentTime = new Date();
const timeZone = 'Asia/Kolkata';
const currentTimeWithTimeZone = new Date(currentTime.toLocaleString('en-US', { timeZone: timeZone }));
const fs = require('fs');
let imgPath = path.join("uploads");
const qrScanner = require('qr-scanner');
const qr = require('qr-image');


const cookie = require('cookie-parser');

const { default: mongoose } = require('mongoose');
const { title } = require('process');
const signup = require('../models/signupmodel');

// const index = (req, res) => {
//     return res.render('index');
// };

const index = (req,res) => {
    return res.render('index');
}

const login = (req, res) => {
    return res.render('login');
};

const register = (req,res) => {
    return res.render('register');
};

const registerData = async (req, res) => {
    try {
        const { name, email, password, cpassword } = req.body;
        const nameRegex = /^[A-Z][a-z]*$/;
        const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]+$/;
      
        // Check if all required fields are present
        if (!name || !email || !password || !cpassword) {
            console.log("All fields are required");
            req.flash('danger', "All fields are required");
            return res.redirect('back');
        }

        if (!nameRegex.test(name)) {
            console.log("Name must start with a capital letter and contain only alphabets");
            req.flash('danger', "Name must start with a capital letter and contain only alphabets");
            return res.redirect('back');
        }

        if (!emailRegex.test(email)) {
            console.log("Email address is invalid");
            req.flash('danger', "Email Address is invalid. Please enter a valid Gmail address.");
            return res.redirect('back');
        }
        
        // Check if password matches confirm password
        if (password !== cpassword) {
            console.log("Password and Confirm password do not match");
            req.flash('danger', "Password and Confirm password do not match");
            return res.redirect('back');
        }

        // Create user if all validations pass
        let user = await RegisterModel.create({
            name: name,
            email: email,
            password: password,
        });

        if (user) {
            console.log("User successfully registered");
            req.flash('success', "User successfully registered");
            return res.redirect('back');
        } else {
            console.log("User registration failed");
            req.flash('danger', "User registration failed");
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        req.flash('danger', "An error occurred while registering user");
        return res.redirect('back');
    }
};


const forgetpassword = (req, res) => {
    return res.render('forgetpassword');
};

// const forgotpass = async(req,res) => {
//    try{
//         let email = req.body.email;
//         let user = await loginmodel.findOne({email : email});
//         if(user){
//             let otp = Math.floor(Math.random() * 1000000);

//             let transporter = nodemailer.createTransport({
//                 host: 'smtp.gmail.com',
//                 port: 587,
//                 secure: false,
//                 auth: {
//                   user: 'hitesh.cminfotech@gmail.com',
//                   pass: 'jdrxtjsjmcpzkbqg'
//                 }
//               });

//               let mailOptions = {
//                 from: 'hitesh.cminfotech@gmail.com',
//                 to: email,
//                 subject: 'Forgot password',
//                 text: 'Otp :- '+otp
//               };

//               transporter.sendMail(mailOptions, function(error, info){
//                 if(error) {
//                   console.log(error);
//                 } else {
//                     let obj = {
//                         email : email,
//                         otp : otp
//                     }
//                     res.cookie('otp',obj)
//                   console.log('Email sent: ' + info.response);
//                   return res.redirect('/otp');
//                 }
//               });
//         }else{
//             console.log("User not found");
//             return res.redirect('back');
//         }
//    }catch(err){
//         console.log(err);
//         return res.redirect('back');
//    }
// }

const forgotpass = async (req, res) => {
    try {
        let email = req.body.email;
        let user = await RegisterModel.findOne({ email: email });
        if (user) {
            let otp = Math.floor(Math.random() * 1000000);

            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'boradhitesh007@gmail.com',
                    pass: 'uvikeolmyaknqacx'
                }
            });

            let mailOptions = {
                from: 'boradhitesh007@gmail.com',
                to: email,
                subject: 'Rudra infotech Forgot password',
                text: 'Otp :- ' + otp
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    let obj = {
                        email: email,
                        otp: otp
                    }
                    res.cookie('otp', obj)
                    req.flash('success', "Otp sent Successfully");
                    console.log("Otp sent Successfully");
                    console.log('Email sent: ' + info.response);
                    return res.redirect('/otp');
                }
            });
        } else {
            console.log("User not found");
            return res.redirect('back');
        }
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};


const otp = (req, res) => {
    return res.render('otp');
};

const otpData = (req, res) => {
    let otp = req.cookies.otp.otp;
    if (otp == req.body.otp) {
        return res.redirect('/newpass');
    } else {
        req.flash('danger', "Otp is wrong");
        console.log("Otp is wrong");
        return res.redirect('back');
    }
};

const newpass = (req, res) => {
    return res.render('newpass');
};

const newpassData = async (req, res) => {
    try {
        if (req.body.password == req.body.cpassword) {
            let email = req.cookies.otp.email;
            let data = await RegisterModel.findOneAndUpdate({ email }, {
                password: req.body.password
            });
            if (data) {
                // req.flash('success', "Passworrd successfully update");
                console.log("Passworrd successfully update");
                res.clearCookie('otp');
                return res.redirect('/login');
            } else {
                console.log("Password not update");
                return res.redirect('back');
            }
        } else {
            req.flash('danger', "Password and confirm password not match");
            console.log("Password and confirm password not match");
            return res.redirect('back');
        }

    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};


const loginData = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the email exists in the database
        const user = await signup.findOne({ Email_Address : email });
        if (!user) {
            // Email not found
            req.flash('danger', 'Email not found');
            return res.redirect("/login");
        }

        // Check if the password matches
        if (user.Password !== password) {
            // Incorrect password
            req.flash('danger', 'Incorrect password');
            return res.redirect("/login");
        }

        if (user.status === "0") {
            // Incorrect password
            req.flash('danger', 'Deactuve user');
            return res.redirect("/login");
        }
        
        // If email and password are correct, login successfully
        // req.flash('success', "Login Successfully");
        console.log("Login Successfully");
        return res.redirect("/index");
    } catch (error) {
        console.error("Error in login:", error);
        req.flash('danger', 'Something went wrong. Please try again later.');
        return res.redirect("/login");
    }
};

const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return false;
        }
        return res.redirect('/login');
    })
};

const contactus = (req,res) =>{
    return res.render('contactus');
};

const contactUs = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
       
        
        if (!phone || !/^\d{10}$/.test(phone)) {
            req.flash('danger', "Mobile number is invalid. Please enter a 10-digit numeric value.");
            return res.redirect("back");
        }

        // const emailRegex = /^[a-z]\w*\d*@gmail\.com$/i;
        // if (!email || !emailRegex.test(email)) {
        //     req.flash('danger', "Email Address is invalid. Please enter a valid Gmail address.");
        //     return res.redirect("back");                
        // }
        
        const emailRegex = /^[a-z][a-zA-Z0-9._%+-]*@gmail\.com$/;
        if (!email || !emailRegex.test(email)) {
            req.flash('danger', "Email Address is invalid. Please enter a valid Gmail address.");
            return res.redirect("back");                
        }
        
        const nameRegex = /^[A-Z][a-z]*$/;
        if (!name ||  !nameRegex.test(name)) {
            req.flash('danger', "First Name and Last Name must start with a capital letter and contain only alphabets.");
            return res.redirect("back");
        }

        let user = await contactusmodel.create({
            name: name,
            email: email,
            phone: phone,
            message :message

        });
        if (user) {
            console.log("Contactus successfully Add");
            req.flash('success', "Contactus successfully Add");
            return res.redirect('back');
        } else {
            console.log("Contactus Add failed");
            req.flash('danger', "Contactus Add failed");
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
};

const viewcontactus = async (req, res) => {
    try {
        const data = await contactusmodel.find({})
        // return res.json({ data: data })
        res.render('viewcontactus', { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};
// ----------------------------------------------------Add Time Slot------------------------------------------------------------------------------------------

const addtimeslot = (req, res) => {
    return res.render('addtimeslot');
};


const addTimeSlot = async (req, res) => {
    try {
        // Check if the time slot already exists
        const existingTimeSlot = await timeslotmodel.findOne({
            starttime: req.body.starttime,
            endtime: req.body.endtime
        });

        if (existingTimeSlot) {
            req.flash('danger', "TimeSlot already exists");
            return res.redirect("back");
        }

        // If the time slot doesn't exist, create it
        const data = await timeslotmodel.create(req.body);
        if (data) {
            req.flash('success', "TimeSlot successfully added");
            console.log("TimeSlot added successfully");
            return res.redirect("back");
        } else {
            req.flash('danger', "Failed to add TimeSlot");
            return res.redirect("back");
        }
    } catch (error) {
        console.error("Error adding TimeSlot:", error);
        req.flash('danger', "Failed to add TimeSlot");
        return res.redirect("back");
    }
};


const viewtimeslot = async (req, res) => {
    try {
        const data = await timeslotmodel.find({})
        // return res.json({ data: data })
        res.render('viewtimeslot', { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const timeslotActive = async (req, res) => {
    try {
        const { params: { _id } } = req
        await timeslotmodel.findByIdAndUpdate(_id, {
            status: '0'
        })
        req.flash('success', "TimeSlot Deactive Successfully")
        console.log("TimeSlot Deactive Successfully");
        res.redirect('back')
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const timeslotDeactive = async (req, res) => {
    try {
        const { params: { _id } } = req
        await timeslotmodel.findByIdAndUpdate(_id, {
            status: '1'
        })
        req.flash('success', "TimeSlot Active Successfully")
        console.log("TimeSlot Active Successfully");
        res.redirect('back')
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const timeslotEdit = async (req, res) => {
    try {
        const id = req.params.id
        const data = await timeslotmodel.findOne({ _id: id })
        // console.log("data::::::", data);
        res.render('updatetimeslot', { data })
        // res.render('updatesubmenu')
        // res.redirect("/updatesubmenu", { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const updatetimeslot = async (req, res) => {
    try {
        const { params: { _id } } = req
        const data = await timeslotmodel.updateOne({ _id: _id }, { $set: { starttime: req.body.starttime, endtime: req.body.endtime } })
        req.flash('success', "TimeSlot Update Successfully");
        console.log(data);
        res.redirect('/viewtimeslot')
        console.log("TimeSlot Update Successfully");
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const timeslotDelete = async (req, res) => {
    try {
        const { params: { _id } } = req
        const deleteData = await timeslotmodel.findByIdAndDelete({ _id });
        req.flash('success', "TimeSlot Delete Successfully")
        console.log("TimeSlot Delete Successfully");
        await res.redirect('back')
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

// ----------------------------------------------------Book Time Slot------------------------------------------------------------------------------------------

// const bookslot = async (req, res) => {
//     try {
//         const bookSlotData = await userdetailsmodel.find();
//         const timeSlotData = await timeslotmodel.find();
       
//         // console.log(timeSlotData,'data-------------------------->')

//         if (!bookSlotData || !timeSlotData) {
//             throw new Error('Failed to fetch data from the database');
//         }


//         // Check if data is fetched successfully

//         // Get today's date and tomorrow's date 
//         const today = moment().format('YYYY-MM-DD');
//         const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
//         var Today = new Date();

//         // Format today's date as YYYY-MM-DD
//         var formattedDate = Today.getFullYear() + '-' + (Today.getMonth() + 1).toString().padStart(2, '0') + '-' + Today.getDate().toString().padStart(2, '0');

//         // Assuming you have a selectedDate variable available in your req object
//         const selectedDate = req.query.selectedDate;
//         // console.log("selecteDate", selectedDate);

    
//         // Render the EJS template with the fetched data and today/tomorrow dates
//         return res.render("bookslot", {
//             bookSlotData: bookSlotData,
//             timeSlotData: timeSlotData,
//             selectedDate: selectedDate || today, // Use selectedDate if provided, otherwise default to today
//             today: today,
//             tomorrow: tomorrow,
//             timeZone: timeZone,
//             formattedDate: formattedDate,
//             currentTimeWithTimeZone: currentTimeWithTimeZone
//         });

      
        
//     } catch (error) {
//         console.log("Error fetching data:", error);
//         // Handle the error appropriately, such as rendering an error page
//         return res.status(500).send(error.message);
//     }
// }

// const bookslot = async (req, res) => {
//     try {
//         const bookSlotData = await userdetailsmodel.find();
//         const timeSlotData = await timeslotmodel.find();
       
//         if (!bookSlotData || !timeSlotData) {
//             throw new Error('Failed to fetch data from the database');
//         }

//         // Get today's date and tomorrow's date 
//         const timeZone = 'Asia/Kolkata'; // Set the desired timezone, for example 'Asia/Kolkata'
//         const today = moment().tz(timeZone).format('YYYY-MM-DD');
//         const tomorrow = moment().tz(timeZone).add(1, 'day').format('YYYY-MM-DD');

//         // Format today's date in 24-hour format based on the timezone
//         const formattedDate = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');

//         // Assuming you have a selectedDate variable available in your req object
//         const selectedDate = req.query.selectedDate || today;

//         // Get the current time with timezone
//         const currentTimeWithTimeZone = moment().tz(timeZone);

//         // Render the EJS template with the fetched data and today/tomorrow dates
//         return res.render("bookslot", {
//             bookSlotData: bookSlotData,
//             timeSlotData: timeSlotData,
//             selectedDate: selectedDate, // Use selectedDate if provided, otherwise default to today
//             today: today,
//             tomorrow: tomorrow,
//             timeZone: timeZone,
//             formattedDate: formattedDate,
//             currentTimeWithTimeZone: currentTimeWithTimeZone,
//             moment: moment 
//         });
        
//     } catch (error) {
//         console.log("Error fetching data:", error);
//         // Handle the error appropriately, such as rendering an error page
//         return res.status(500).send(error.message);
//     }
// };

const bookslot = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const bookSlotData = await userdetailsmodel.find({}, 'requiredField1 requiredField2') // Replace with actual fields
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const timeSlotData = await timeslotmodel.find({}, 'requiredField1 requiredField2'); // Replace with actual fields

        if (!bookSlotData || !timeSlotData) {
            throw new Error('Failed to fetch data from the database');
        }

        // Get today's date and tomorrow's date
        const timeZone = 'Asia/Kolkata';
        const today = moment().tz(timeZone).format('YYYY-MM-DD');
        const tomorrow = moment().tz(timeZone).add(1, 'day').format('YYYY-MM-DD');
        const formattedDate = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
        const selectedDate = req.query.selectedDate || today;
        const currentTimeWithTimeZone = moment().tz(timeZone);

        return res.render("bookslot", {
            bookSlotData,
            timeSlotData,
            selectedDate,
            today,
            tomorrow,
            timeZone,
            formattedDate,
            currentTimeWithTimeZone,
            moment
        });

    } catch (error) {
        console.log("Error fetching data:", error);
        return res.status(500).send(error.message);
    }
};


// const addbookslot = async (req, res) => {
//     try {
//         const { date, time_slot } = req.body; // Extract date and time_slot from req.body
//         if (!date) {
//             req.flash('danger', "Date is required");
//             return res.redirect("back");
//         }

//         if (!time_slot) {
//             req.flash('danger', "Timeslot is required");
//             return res.redirect("back");
//         }

//         const bookslot = await userdetailsmodel.findOne({
//             date: date, // Use extracted date
//             time_slot: time_slot 
//         });
  
//         if (bookslot) {
//             req.flash('danger', "Book slot already exists");
//             return res.redirect("back");
//         }
//         return res.redirect(`/userdetails?selectedDate=${date}&time_slot=${time_slot}`);
//     } catch (error) {
//         console.error("Error adding book slot:", error);
//         req.flash('danger', "Failed to add book slot");
//         return res.redirect("back");
//     }
// };

const addbookslot = async (req, res) => {
    try {
        const { date, time_slot } = req.body;
        if (!date) {
            req.flash('danger', "Date is required");
            return res.redirect("back");
        }

        if (!time_slot) {
            req.flash('danger', "Timeslot is required");
            return res.redirect("back");
        }

        const bookslot = await userdetailsmodel.findOne({
            date,
            time_slot
        });

        if (bookslot) {
            req.flash('danger', "Book slot already exists");
            return res.redirect("back");
        }
        return res.redirect(`/userdetails?selectedDate=${date}&time_slot=${time_slot}`);
    } catch (error) {
        console.error("Error adding book slot:", error);
        req.flash('danger', "Failed to add book slot");
        return res.redirect("back");
    }
};


// const userdetails = async (req, res) => {
//     try {
//         // Fetch data from the database
//         const bookSlotData = await bookslotmodel.find();
//         const timeSlotData = await timeslotmodel.find();
//         const date = await userdetailsmodel.find({}).populate('date');
//         const bookslot = await userdetailsmodel.find({}).populate('time_slot');
       
//         // Get today's date
//         const today = moment().format('YYYY-MM-DD');

//         // Get selectedDate and time_slot from the request query
//         const selectedDate = req.query.selectedDate;
//         let time_slot = req.query.time_slot || ''; // Default to an empty string if time_slot is undefined

//         // Ensure time_slot is a string before splitting it
//         if (!Array.isArray(time_slot)) {
//             time_slot = time_slot.toString(); // Convert to string if it's not already
//         }

//         let totalSlots = 0;
//         let totalPrice = 0;
//         const slotPrice = 900
//         if (time_slot) {
//             const timeRanges = time_slot.split(',');
//             // Calculate totalSlots based on distinct starting times of time ranges
//             totalSlots = new Set(timeRanges.map(range => range.trim().split(" to ")[0])).size;
//             // Calculate total slot price based on the selected slots
//             totalPrice = totalSlots * slotPrice; // Calculate the total price
//         }

//         // Render the EJS template with the fetched data, today's date, slot price, and total price
//         return res.render("userdetails", {
//             bookSlotData: bookSlotData,
//             timeSlotData: timeSlotData,
//             date: date,
//             time_slot: time_slot,
//             bookslot: bookslot,
//             selectedDate: selectedDate, // Use selectedDate if provided, otherwise default to today
//             today: today,
//             slotPrice: slotPrice, // Pass slotPrice to the frontend
//             totalPrice: totalPrice, // Pass totalPrice to the frontend
//             totalSlots: totalSlots,
           
        

//         });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).send(error.message);
//     }
// };

// const userdetails = async (req, res) => {
//     try {
//         // Fetch data from the database
//         const bookSlotData = await bookslotmodel.find();
//         const timeSlotData = await timeslotmodel.find();
//         const data = await adminformmodel.find({})
//         const date = await userdetailsmodel.find({}).populate('date');
//         const bookslot = await userdetailsmodel.find({}).populate('time_slot');
       
//         // Get today's date
//         const today = moment().format('YYYY-MM-DD');

//         // Get selectedDate and time_slot from the request query
//         const selectedDate = req.query.selectedDate;
//         let time_slot = req.query.time_slot || ''; // Default to an empty string if time_slot is undefined

//         // Ensure time_slot is a string before splitting it
//         if (!Array.isArray(time_slot)) {
//             time_slot = time_slot.toString(); // Convert to string if it's not already
//         }

//         let totalSlots = 0;
//         let dayTotalPrice = 0;
//         let nightTotalPrice = 0;
//         let daySlotsCount = 0; // Variable to count day slots
//         let nightSlotsCount = 0; // Variable to count night slots   

//         // Find the slot price for the day and night from adminform collection
//         const dayPriceDocument = await adminformmodel.findOne({ Timing: "Day" });
//         const nightPriceDocument = await adminformmodel.findOne({ Timing: "Night" });

//         // Extract the price from the found documents        
//         const daySlotPrice = dayPriceDocument ? dayPriceDocument.Price : 0;
//         const nightSlotPrice = nightPriceDocument ? nightPriceDocument.Price : 0;

//         if (time_slot) {
//             const timeRanges = time_slot.split(',');
//             // Check each time range
//             timeRanges.forEach(range => {
//                 const [startHour] = range.trim().split(" to ")[0].split(":");
//                 const [endHour] = range.trim().split(" to ")[1].split(":");
//                 const startHourInt = parseInt(startHour);
//                 const endHourInt = parseInt(endHour);
                
//                 // Calculate price for each slot
//                 let slotPrice = 0;
//                 if (
//                     (startHourInt >= 6 && startHourInt < 7) || // 6:00 am to 7:00 am
//                     (startHourInt >= 7 && startHourInt < 8) || // 7:00 am to 8:00 am
//                     (startHourInt >= 8 && startHourInt < 9) || // 8:00 am to 9:00 am
//                     (startHourInt >= 9 && startHourInt < 10) || // 9:00 am to 10:00 am
//                     (startHourInt >= 10 && startHourInt < 11) || // 10:00 am to 11:00 am
//                     (startHourInt >= 11 && startHourInt < 12) || // 11:00 am to 12:00 pm
//                     (startHourInt >= 12 && startHourInt < 13)  || //12:00 pm to 1:00 pm
//                     (startHourInt >= 13 && startHourInt < 14) || // 1:00 pm to 2:00 pm
//                     (startHourInt >= 14 && startHourInt < 15) || // 2:00 pm to 3:00 pm
//                     (startHourInt >= 15 && startHourInt < 16) || // 3:00 pm to 4:00 pm
//                     (startHourInt >= 16 && startHourInt < 17) || // 4:00 pm to 5:00 pm
//                     (startHourInt >= 17 && startHourInt < 18)  // 5:00 pm to 6:00 pm
//                 ) {
//                     // Day slot
//                     slotPrice = daySlotPrice; // Set day slot price
//                     daySlotsCount++; // Increment day slots count
//                 } else if (
//                     (startHourInt >= 18 && startHourInt < 19) || // 6:00 pm to 7:00 pm
//                     (startHourInt >= 19 && startHourInt < 20) || // 7:00 pm to 8:00 pm
//                     (startHourInt >= 20 && startHourInt < 21) || // 8:00 pm to 9:00 pm
//                     (startHourInt >= 21 && startHourInt < 22) || // 9:00 pm to 10:00 pm
//                     (startHourInt >= 22 && startHourInt < 23) || // 10:00 pm to 11:00 pm
//                     (startHourInt >= 23 && startHourInt < 24) || // 11:00 pm to 12:00 am
//                     (startHourInt >= 0 && startHourInt < 1) || // 12:00 am to 1:00 am
//                     (startHourInt >= 1 && startHourInt < 2) || // 1:00 am to 2:00 am
//                     (startHourInt >= 2 && startHourInt < 3) || // 2:00 am to 3:00 am
//                     (startHourInt >= 3 && startHourInt < 4) || // 3:00 am to 4:00 am
//                     (startHourInt >= 4 && startHourInt < 5) || // 4:00 am to 5:00 am
//                     (startHourInt >= 5 && startHourInt < 6)    // 5:00 am to 6:00 am
//                 ) {
//                     // Night slot
//                     slotPrice = nightSlotPrice; // Set night slot price
//                     nightSlotsCount++; // Increment night slots count
//                 }
//                 else if (
//                     (startHourInt >= 0 && startHourInt < 1) // 12:00 am to 1:00 am
//                 ) {
//                     // Night slot (for slots between 12:00 am and 1:00 am)
//                     slotPrice = nightSlotPrice; // Set night slot price
//                     nightSlotsCount++; // Increment night slots count
//                 }
                
//                 // Calculate slot duration in hours
//                 const durationHours = endHourInt - startHourInt;
                
//                 // Increment totalSlots
//                 totalSlots += durationHours;
                
//                 // Increment total price based on slot price and duration
//                 if (slotPrice === daySlotPrice) {
//                     dayTotalPrice += slotPrice * durationHours;
//                 } else {
//                     nightTotalPrice += slotPrice * durationHours;
//                 }
//             });
//         }

//         // Calculate total price
//         const totalPrice = dayTotalPrice + nightTotalPrice;

//         // Render the EJS template with the fetched data, today's date, slot price, and total price
//         return res.render("userdetails", {
//             bookSlotData: bookSlotData,
//             timeSlotData: timeSlotData,
//             date: date,
//             data : data,
//             time_slot: time_slot,
//             bookslot: bookslot,
//             selectedDate: selectedDate, // Use selectedDate if provided, otherwise default to today
//             today: today,
//             daySlotPrice: daySlotPrice, // Pass day slotPrice to the frontend
//             nightSlotPrice: nightSlotPrice, // Pass night slotPrice to the frontend
//             dayTotalPrice: dayTotalPrice, // Pass day total price to the frontend
//             nightTotalPrice: nightTotalPrice, // Pass night total price to the frontend
//             totalPrice: totalPrice, // Pass total price to the frontend
//             totalSlots: totalSlots,
//             adminform : adminform,
//             daySlotsCount: daySlotsCount, // Pass day slots count to the frontend
//             nightSlotsCount: nightSlotsCount, // Pass night slots count to the frontend
//             nightSlots: time_slot.split(',').filter(slot => { // Pass the night slots array to the frontend
//                 const [startHour] = slot.trim().split(" to ")[0].split(":");
//                 return parseInt(startHour) >= 18 || parseInt(startHour) < 6; // Assuming nighttime starts from 6:00 PM to 6:00 AM
//             }),
//             daySlots: time_slot.split(',').filter(slot => {
//                 const [startHour] = slot.trim().split(" to ")[0].split(":");
//                 return parseInt(startHour) >= 6 && parseInt(startHour) < 18; // Daytime slots
//             })
//         });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).send(error.message);
//     }
// };

const userdetails = async (req, res) => {
    try {
        const bookSlotData = await bookslotmodel.find({}, 'requiredField1 requiredField2').exec();
        const timeSlotData = await timeslotmodel.find({}, 'requiredField1 requiredField2').exec();
        const data = await adminformmodel.find({}).exec();
        const date = await userdetailsmodel.find({}).populate('date').exec();
        const bookslot = await userdetailsmodel.find({}).populate('time_slot').exec();

        const today = moment().format('YYYY-MM-DD');
        const selectedDate = req.query.selectedDate;
        let time_slot = req.query.time_slot || '';

        if (!Array.isArray(time_slot)) {
            time_slot = time_slot.toString();
        }

        let totalSlots = 0;
        let dayTotalPrice = 0;
        let nightTotalPrice = 0;
        let daySlotsCount = 0;
        let nightSlotsCount = 0;

        const dayPriceDocument = await adminformmodel.findOne({ Timing: "Day" });
        const nightPriceDocument = await adminformmodel.findOne({ Timing: "Night" });

        const daySlotPrice = dayPriceDocument ? dayPriceDocument.Price : 0;
        const nightSlotPrice = nightPriceDocument ? nightPriceDocument.Price : 0;

        if (time_slot) {
            const timeRanges = time_slot.split(',');
            timeRanges.forEach(range => {
                const [startHour] = range.trim().split(" to ")[0].split(":");
                const [endHour] = range.trim().split(" to ")[1].split(":");
                const startHourInt = parseInt(startHour);
                const endHourInt = parseInt(endHour);

                let slotPrice = 0;
                if (startHourInt >= 6 && startHourInt < 18) {
                    slotPrice = daySlotPrice;
                    daySlotsCount++;
                } else {
                    slotPrice = nightSlotPrice;
                    nightSlotsCount++;
                }

                const durationHours = endHourInt - startHourInt;
                totalSlots += durationHours;

                if (slotPrice === daySlotPrice) {
                    dayTotalPrice += slotPrice * durationHours;
                } else {
                    nightTotalPrice += slotPrice * durationHours;
                }
            });
        }

        const totalPrice = dayTotalPrice + nightTotalPrice;

        return res.render("userdetails", {
            bookSlotData,
            timeSlotData,
            date,
            data,
            time_slot,
            bookslot,
            selectedDate,
            today,
            daySlotPrice,
            nightSlotPrice,
            dayTotalPrice,
            nightTotalPrice,
            totalPrice,
            totalSlots,
            daySlotsCount,
            nightSlotsCount,
            nightSlots: time_slot.split(',').filter(slot => {
                const [startHour] = slot.trim().split(" to ")[0].split(":");
                return parseInt(startHour) >= 18 || parseInt(startHour) < 6;
            }),
            daySlots: time_slot.split(',').filter(slot => {
                const [startHour] = slot.trim().split(" to ")[0].split(":");
                return parseInt(startHour) >= 6 && parseInt(startHour) < 18;
            })
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
    }
};


// const Userdetails = async (req, res) => {
//     try {
//         const { date, time_slot, Firstname, Lastname, Email_Address, Mobile_No, Notes } = req.body;

//         // Validate mobile number format, Firstname, Lastname, Email_Address, and other fields...

//         // Ensure that time_slot is not empty
//         if (!time_slot) {
//             req.flash('danger', "Time slot is required.");
//             return res.redirect("back");
//         }

//         let totalSlots = 0;
//         let dayTotalPrice = 0;
//         let nightTotalPrice = 0;
//         let slotPrice = 0; // Initialize slot price variable

//         // Find the slot price for the day and night from adminform collection
//         const dayPriceDocument = await adminformmodel.findOne({ Timing: "Day" });
//         const nightPriceDocument = await adminformmodel.findOne({ Timing: "Night" });

//         // Extract the price from the found documents
//         const daySlotPrice = dayPriceDocument ? dayPriceDocument.Price : 0;
//         const nightSlotPrice = nightPriceDocument ? nightPriceDocument.Price : 0;

//         if (time_slot) {
//             const timeRanges = time_slot.split(',');
//             // Check each time range
//             timeRanges.forEach(range => {
//                 const [startHour] = range.trim().split(" to ")[0].split(":");
//                 const [endHour] = range.trim().split(" to ")[1].split(":");
//                 const startHourInt = parseInt(startHour);
//                 const endHourInt = parseInt(endHour);
                
//                 // Calculate price for each slot
//                 if ((startHourInt >= 6 && startHourInt < 18) || (endHourInt >= 6 && endHourInt < 18)) {
//                     // Day slot
//                     slotPrice = daySlotPrice; // Assign day slot price
//                 } else {
//                     // Night slot
//                     slotPrice = nightSlotPrice; // Assign night slot price
//                 }
                
//                 // Calculate slot duration in hours
//                 const durationHours = endHourInt - startHourInt;
                
//                 // Increment totalSlots
//                 totalSlots += durationHours;
                
//                 // Increment total price based on slot price and duration
//                 if (slotPrice === daySlotPrice) {
//                     dayTotalPrice += slotPrice * durationHours;
//                 } else {
//                     nightTotalPrice += slotPrice * durationHours;
//                 }
//             });
//         }

//         // Calculate total price
//         const totalPrice = dayTotalPrice + nightTotalPrice;

//         let selectedDate;
//         if (Array.isArray(date)) {
//             selectedDate = date.length > 0 ? date[0] : null;
//         } else {
//             selectedDate = date;
//         }

//         // Create user details in the database   
//         const userDetails = await userdetailsmodel.create({
//             date: selectedDate,
//             time_slot: time_slot?.split(','),
//             slotPrice: slotPrice, // Pass slotPrice to the frontend
//             totalPrice: totalPrice, // Pass totalPrice to the frontend
//             totalSlots : totalSlots,
//             daySlotPrice: daySlotPrice, // Pass daySlotPrice to the frontend
//             nightSlotPrice: nightSlotPrice, // Pass nightSlotPrice to the frontend
//             daySlotsCount : daySlotsCount,
//             nightSlotsCount :  nightSlotsCount,
//             Firstname: Firstname,
//             Lastname: Lastname,
//             Email_Address: Email_Address,
//             Mobile_No: Mobile_No,
//             Notes: Notes
//         });

//         // Check if user details were successfully created
//         if (userDetails) {
//             return res.redirect(`/payment?totalPrice=${totalPrice}`); // Redirect to a confirmation page
//         } else {
//             req.flash('danger', "Failed to add user details"); // Flash error message
//             return res.redirect("back"); // Redirect back to the previous page
//         }
//     } catch (error) {
//         console.error("Error adding user details:", error);
//         req.flash('danger', "Failed to add user details"); // Flash error message
//         return res.redirect("back"); // Redirect back to the previous page
//     }
// };


const Userdetails = async (req, res) => {
    try {
        const { date, time_slot, Firstname, Lastname, Email_Address, Mobile_No, Notes } = req.body;

        const day_address = await adminformmodel.find({ Timing: 'Day' });
        const night_address = await adminformmodel.find({ Timing: 'Night' });

        // Initialize arrays to store the selected addresses
        let selectedDayAddresses = [];
        let selectedNightAddresses = [];

        if (!Mobile_No || !/^\d{10}$/.test(Mobile_No)) {
            req.flash('danger', "Mobile number is invalid. Please enter a 10-digit numeric value.");
            return res.redirect("back");
        }

        const nameRegex = /^[A-Z][a-z]*$/;
        if (!Firstname || !Lastname || !nameRegex.test(Firstname) || !nameRegex.test(Lastname)) {
            req.flash('danger', "First Name and Last Name must start with a capital letter and contain only alphabets.");
            return res.redirect("back");
        }
             
        const emailRegex = /^[a-z]\w*\d*@gmail\.com$/i;
        if (!Email_Address || !emailRegex.test(Email_Address)) {
            req.flash('danger', "Email Address is invalid. Please enter a valid Gmail address.");
            return res.redirect("back");                
        }

        if (!Firstname || !Lastname || !Email_Address || !Mobile_No || !Notes) {
            req.flash('danger', "All fields are required");
            return res.redirect("back");
        }
        // Validate mobile number format, Firstname, Lastname, Email_Address, and other fields...

        // Validate mobile number format, Firstname, Lastname, Email_Address, and other fields...

        // Ensure that time_slot is not empty
        if (!time_slot) {
            req.flash('danger', "Time slot is required.");
            return res.redirect("back");
        }

        let totalSlots = 0;
        let dayTotalPrice = 0;
        let nightTotalPrice = 0;
        let daySlotsCount = 0; // Initialize day slots count
        let nightSlotsCount = 0; // Initialize night slots count
        let slotPrice = 0; // Initialize slot price variable

        // Find the slot price for the day and night from adminform collection
        const dayPriceDocument = await adminformmodel.findOne({ Timing: "Day" });
        const nightPriceDocument = await adminformmodel.findOne({ Timing: "Night" });

        // Extract the price from the found documents
        const daySlotPrice = dayPriceDocument ? dayPriceDocument.Price : 0;
        const nightSlotPrice = nightPriceDocument ? nightPriceDocument.Price : 0;   

        if (time_slot) {
            const timeRanges = time_slot.split(',');
            // Check each time range
            timeRanges.forEach(range => {
                const [startHour] = range.trim().split(" to ")[0].split(":");
                const [endHour] = range.trim().split(" to ")[1].split(":");
                const startHourInt = parseInt(startHour);
                const endHourInt = parseInt(endHour);
                
                // Calculate price for each slot
                if ((startHourInt >= 6 && startHourInt < 18) || (endHourInt >= 6 && endHourInt < 18)) {
                    // Day slot
                    selectedDayAddresses = selectedDayAddresses.concat(day_address.map(val => val.Address));
                    slotPrice = daySlotPrice; // Assign day slot price
                    daySlotsCount++; // Increment day slots count
                } else {
                    // Night slot
                    selectedNightAddresses = selectedNightAddresses.concat(night_address.map(val => val.Address));
                    slotPrice = nightSlotPrice; // Assign night slot price
                    nightSlotsCount++; // Increment night slots count
                }
                
                // Calculate slot duration in hours
                const durationHours = endHourInt - startHourInt;
                
                // Increment totalSlots
                totalSlots += durationHours;
                
                // Increment total price based on slot price and duration
                if (slotPrice === daySlotPrice) {
                    dayTotalPrice += slotPrice * durationHours;
                } else {
                    nightTotalPrice += slotPrice * durationHours;
                }
            });
        }

        // Calculate total price
        const totalPrice = dayTotalPrice + nightTotalPrice;

        let selectedDate;
        if (Array.isArray(date)) {
            selectedDate = date.length > 0 ? date[0] : null;
        } else {
            selectedDate = date;
        }

        // Create user details in the database   
        const userDetails = await userdetailsmodel.create({
            date: selectedDate,
            time_slot: time_slot?.split(','),
            slotPrice: slotPrice, // Pass slotPrice to the frontend
            totalPrice: totalPrice, // Pass totalPrice to the frontend
            totalSlots : totalSlots,
            daySlotPrice: daySlotPrice, // Pass daySlotPrice to the frontend
            nightSlotPrice: nightSlotPrice, // Pass nightSlotPrice to the frontend
            daySlotsCount : daySlotsCount,
            nightSlotsCount :  nightSlotsCount,
            Firstname: Firstname,
            Lastname: Lastname,
            Email_Address: Email_Address,
            Mobile_No: Mobile_No,
            Notes: Notes,
            day_address : selectedDayAddresses,
            night_address : selectedNightAddresses

        });

        // Check if user details were successfully created
        if (userDetails) {
            return res.redirect(`/payment?totalPrice=${totalPrice}`); // Redirect to a confirmation page
        } else {
            req.flash('danger', "Failed to add user details"); // Flash error message
            return res.redirect("back"); // Redirect back to the previous page
        }
    } catch (error) {
        console.error("Error adding user details:", error);
        req.flash('danger', "Failed to add user details"); // Flash error message
        return res.redirect("back"); // Redirect back to the previous page
    }
};

// const viewuserdetails = async (req, res) => {
//     try {
//         const data = await userdetailsmodel.find({})
//         // return res.json({ data: data })
//         res.render('viewuserdetails', { data })
//     } catch (error) {
//         console.log(error.message);
//         res.redirect('back')
//     }
// };

const viewuserdetails = async (req, res) => {
    try {
        // Extract the selectedDate query parameter from the request URL
        const selectedDate = req.query.selectedDate;

        let data;
        if (selectedDate) {
            // Query the database to find data for the selected date
            data = await userdetailsmodel.find({ date: selectedDate });
        } else {
            // Query the database to find all data
            data = await userdetailsmodel.find({});
        }

        // Assuming formattedDate is also obtained from somewhere
        const formattedDate = "2024-04-10"; // Example date

        // Render the EJS template with the data and other variables
        res.render('viewuserdetails', { data, selectedDate, formattedDate });
    } catch (error) {
        console.log(error.message);
        res.redirect('back');
    }
};

const payment = async (req, res) => {
    try {
        const data = await qrcodemodel.find({})
        // Extract total price from query parameters or default to 0 if not provided
        const totalPrice = req.query.totalPrice || 0;

        // Render the payment page and pass the total price as a variable
        res.render('payment', { totalPrice ,data});
    } catch (error) {
        console.error("Error rendering payment page:", error);
        // Handle the error appropriately, such as rendering an error page
        res.status(500).send("Internal Server Error");
    }
};

const adminform = async(req,res) =>{
    return res.render('adminform')
};

const Adminform = async(req,res) => {
  try{

    const data = await adminformmodel.create({
        Title : req.body.Title,
        Amenities : req.body.Amenities,
        Timing : req.body.Timing,
        Price : req.body.Price,
        Address : req.body.Address
    })
    if (data) {
        req.flash('success', "Add Box Cricket"); // Flash success message
        // return res.redirect('/bookslot'); // Redirect to a confirmation page
        return res.redirect('back'); // Redirect to a confirmation page
    }else {
        req.flash('danger', "Failed to add user details"); // Flash error message
        return res.redirect("back"); // Redirect back to the previous page
    }
  }catch(error){
    console.log(error.message);
    res.redirect('back');
  }
};

const viewadminform = async(req,res) => {
    try {
        
        const data = await adminformmodel.find({})
        // return res.json({ data: data })
        res.render('viewadminform', { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const editadminform = async (req, res) => {
    try {
        const id = req.params.id
        const data = await adminformmodel.findOne({ _id: id })
        // console.log("data::::::", data);
        res.render('updateadminform', { data })
        // res.render('addproduct')
        // res.redirect("/addproduct", { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const updateadminform  = async (req, res) => {
    try {
        const { params: { _id } } = req
        const data = await adminformmodel.updateOne({ _id: _id }, { $set: {Title : req.body.Title, Amenities : req.body.Amenities, Timing : req.body.Timing,Price : req.body.Price,Address : req.body.Address} })
        req.flash('success', "Box Cricket Update Successfully");
        console.log(data);
        res.redirect('/viewadminform')
        console.log("Box Cricket Update Successfully");
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const adminformDelete = async (req, res) => {
    try {
        const { params: { _id } } = req
        const deleteData = await adminformmodel.findByIdAndDelete({ _id });
        req.flash('success', "Box Cricket Delete Successfully")
        console.log("Box Cricket Delete Successfully");
        await res.redirect('back')
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const addqrcode  = async(req,res)=> {
    return res.render('addqrcode')
};

const Addqrcode = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        let image = `${imgPath}/${req.file.filename}`;
        const addqrcode = await qrcodemodel.create(Object.assign({ image }, req.body));
        if (addqrcode) {
            req.flash('success', "QR Code Add Successfully");
            console.log("QR Code Add Successfully");
            return res.redirect('back');
        }
        console.log(addqrcode);
    } catch (error) {
        console.log(error.message);
        res.redirect('back');
    }
};

const viewqrcode = async (req, res) => {
    try {
        const data = await qrcodemodel.find({})
        res.render('viewqrcode', { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const qrcodeEdit = async (req, res) => {
    try {
        const id = req.params.id
        const data = await qrcodemodel.findOne({ _id: id })
        // console.log("data::::::", data);
        res.render('updateqrcode', { data })
        // res.render('updatesubmenu')
        // res.redirect("/updatesubmenu", { data })
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const updateqrcode = async (req, res) => {
    try {
        const { params: { _id } } = req
        if (req.file) {
            let image = `${imgPath}/${req.file.filename}`;
            const updateData = await qrcodemodel.findByIdAndUpdate(_id, Object.assign({ image }, req.body))
            if (updateData) {
                fs.unlinkSync(updateData.image)
            }
            req.flash('success', "QR Code Update Successfully")
            console.log("QR Code Update Successfully");
            res.redirect('/viewqrcode')
        } else {
            let obj = req.body
            const data = await qrcodemodel.findByIdAndUpdate(_id, obj)
            if (data) {
                return res.redirect('/viewqrcode')
            }
        }
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

const qrcodeDelete = async (req, res) => {
    try {
        const { params: { _id } } = req;
        const deleteData = await qrcodemodel.findByIdAndDelete({ _id });
        req.flash('success', "QR Code Delete Successfully")
        console.log("QR Code Delete Successfully");
        await res.redirect('back')
    } catch (error) {
        console.log(error.message);
        res.redirect('back')
    }
};

module.exports = {
    index,
    login,
    loginData,
    register,
    registerData,
    logout,
    forgetpassword,
    forgotpass,
    otp,
    otpData,
    newpass,
    newpassData,
    contactus,
    contactUs,
    viewcontactus,
    
    addtimeslot,
    addTimeSlot,
    viewtimeslot,
    timeslotActive,
    timeslotDeactive,
    timeslotEdit,
    updatetimeslot,
    timeslotDelete,

    // ----------------------------------------------------Book Time Slot------------------------------------------------------------------------------------------

    bookslot,
    addbookslot,
    adminform,
    Adminform,
    viewadminform,
    editadminform,
    updateadminform,
    adminformDelete,
    userdetails,
    Userdetails,
    viewuserdetails,
    payment,
    addqrcode,
    Addqrcode,
    viewqrcode,
    qrcodeEdit,
    updateqrcode,
    qrcodeDelete

}
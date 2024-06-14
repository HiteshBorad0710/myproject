const mongoose = require('mongoose');
const schema = mongoose.Schema({
    First_Name : {
        type : String,
        required : true
    },
    Last_Name : {
        type : String,
        required : true
    },
    Email_Address : {
        type : String,
        required : true
    },
    Password : {
        type : String,
        required : true
    },
    Box_Contact_Number : {
        type : String,
        required : true
    },
    Person_Contact_Number : {
        type : String,
        required : true
    },
    Box_Name : {
        type : String,
        required : true
    },
    Box_Address : {
        type : String,
        required : true
    },
    City : {
        type : String,
        required : true
    },
    State : {
        type : String,
        required : true
    },
    status: {
        type: String,
        default : 1
    },
});

const signup = mongoose.model('signup',schema);
module.exports = signup;
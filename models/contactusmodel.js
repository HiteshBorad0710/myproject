const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    }
});

const contactus = mongoose.model('contactus',schema);
module.exports = contactus;
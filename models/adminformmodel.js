const mongoose = require('mongoose');

const schema = mongoose.Schema({
    
    Title: {
        type: String,
        required: true
    },
    Amenities: [{
        type: String,
        required: true
    }],
    Timing : {
        type: String,
        required: true
    },
    Price :{
        type: Number,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
});

const userdetails = mongoose.model('adminform', schema);
module.exports = userdetails;

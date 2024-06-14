// const mongoose = require('mongoose');

// const schema = mongoose.Schema({
//     date: {
//         type: Date,
//         required: true
//     },
//     time_slot: [{
//         type: String,
//         required: true
//     }],
//     slotPrice: {
//         type: Number,
//         required: true
//     },
//     totalSlots : {
//         type: Number,
//         required: true
//     },
//     totalPrice :{
//         type: Number,
//         required: true
//     },
//     Firstname: {
//         type: String,
//         required: true
//     },
//     Lastname: {
//         type: String,
//         required: true
//     },
//     Email_Address: {
//         type: String,
//         required: true
//     },
//     Mobile_No: {
//         type: String,
//         required: true
//     },
//     Notes: {
//         type: String,
//         required: true
//     },
// });

// const userdetails = mongoose.model('userdetails', schema);
// module.exports = userdetails;

const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time_slot: [{
        type: String,
        required: true
    }],
    daySlotPrice: {
        type: Number,
        required: true
    },
    nightSlotPrice: {
        type: Number,
        required: true
    },
    daySlotsCount: {
        type: Number,
        required: true
    },
    nightSlotsCount: {
        type: Number,
        required: true
    },
    totalSlots: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    day_address : [{
        type : String,
        required : true
    }],
    night_address : [{
        type : String,
        required : true
    }],
    Firstname: {
        type: String,
        required: true
    },
    Lastname: {
        type: String,
        required: true
    },
    Email_Address: {
        type: String,
        required: true
    },
    Mobile_No: {
        type: String,
        required: true
    },
    Notes: {
        type: String,
        required: true
    },
});

const userdetails = mongoose.model('userdetails', schema);
module.exports = userdetails

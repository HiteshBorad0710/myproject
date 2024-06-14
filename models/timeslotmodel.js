const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({

    starttime : {
        type: String,
        required: true
    },
    
    endtime: {
        type: String,
        required : true
    },
    status: {
        type: String,
        default : 1
    },
})

const timesolt = mongoose.model('timeslot', adminSchema);
module.exports = timesolt;
const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({

    upi_id : {
        type: String,
        required: true
    },
    image: {
        type: String,
        required : true
    },
    status: {
        type: String,
        default : 1
    },
})

const qrcode = mongoose.model('qrcode', adminSchema);
module.exports = qrcode;
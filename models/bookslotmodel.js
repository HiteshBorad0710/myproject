const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time_slot: [{ // Change to array type
        type: String,
        required: true
    }],
    status: {
        type: String,
        default: '1'
    }
});

const BookSlot = mongoose.model('BookSlot', adminSchema);
module.exports = BookSlot;

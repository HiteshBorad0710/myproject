const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://127.0.0.1/hitesh');
    if(db){
        console.log('DB is connected');
    }else{
        console.log("DB is not connected");
    }
     
module.exports = mongoose;

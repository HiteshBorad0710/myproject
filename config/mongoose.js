// const mongoose = require('mongoose');
// const db = mongoose.connect('mongodb://127.0.0.1/hitesh');
//     if(db){
//         console.log('DB is connected');
//     }else{
//         console.log("DB is not connected");
//     }
     
// module.exports = mongoose;

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/hitesh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000 // Increase socket timeout to 45 seconds
}).then(() => {
    console.log('DB is connected');
}).catch((err) => {
    console.error("DB connection error:", err.message);
});
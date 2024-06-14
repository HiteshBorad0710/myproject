// const mongoose = require('mongoose');
// const db = mongoose.connect('mongodb://127.0.0.1/hitesh');
//     if(db){
//         console.log('DB is connected');
//     }else{
//         console.log("DB is not connected");
//     }
     
// module.exports = mongoose;

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1/hitesh', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
//     socketTimeoutMS: 45000 // Increase socket timeout to 45 seconds
// }).then(() => {
//     console.log('DB is connected');
// }).catch((err) => {
//     console.error("DB connection error:", err.message);
// });

const mongoose = require('mongoose');
const moment = require('moment-timezone');

// Connect to MongoDB with increased timeouts and debugging
mongoose.connect('mongodb://127.0.0.1/hitesh', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // 30 seconds
  socketTimeoutMS: 45000            // 45 seconds
});

mongoose.set('debug', true);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', err => {
  if (err.name === 'MongoNetworkError' || err.message.includes('timed out')) {
    console.error('MongoDB network error or timeout:', err);
  } else {
    console.error('MongoDB connection error:', err);
  }
});
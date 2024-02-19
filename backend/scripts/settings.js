const mongoose = require('mongoose');
const config = require('../src/config/config');

async function connectDB ()  {

    await mongoose.connect(config.mongoose.url, config.mongoose.options);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
    db.once('open', () => {
      console.log('Conexión exitosa a MongoDB.');
});
};

async function disconnectDB(){
    await mongoose.disconnect();
    console.log("mongoose disconnected")
}

module.exports ={
  connectDB,
  disconnectDB
};

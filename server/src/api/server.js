const config = require('../config/config');
const mongoose = require('mongoose');
const app = require('./express');

mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri)
  .then(() => console.log('MongoDB connected successfully...'))
  .catch(() => console.log(`Error connecting to MongoDB ${config.mongoUri}`));

  app.listen(config.port, err => {
  if (err) console.log(err);
  console.info('Server started on port %s', config.port);
});



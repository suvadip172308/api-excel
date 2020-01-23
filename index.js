const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('config');

const { getStream } = require('./shared/common');
const cors = require('./middleware/cors');
const retailers = require('./routes/retailers.route');
const users = require('./routes/users.route');
const auth = require('./routes/auth.route');
const transaction = require('./routes/transaction.route');
const path = require('./routes/path.route');
const files = require('./routes/files.route');

const app = express();

const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost/excel';

if (!config.get('jwtKey')) {
  console.log('FATAL ERROR: jwt key is not set');
  process.exit(1);
}

mongoose.connect(DB_URL, { useFindAndModify: false })
  .then(() => console.log('Connected to Mongodb...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

if (app.get('env') === 'development') {
  const { accessLogStream, errorLogStream } = getStream();

  app.use(morgan('tiny', { stream: accessLogStream }));
  app.use(morgan('tiny', {
    skip: (req, res) => { return res.statusCode < 400; },
    stream: errorLogStream
  }));
}

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/retailer', retailers);
app.use('/api/transaction', transaction);
app.use('/api/path', path);
app.use('/api/file', files);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining at port no: ${port} ...`));

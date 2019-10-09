const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const retailers = require('./routes/retailers.route');
const users = require('./routes/users.route');
const { getStream } = require('./shared/common');

const app = express();

const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost/excel';

mongoose.connect(DB_URL, { useFindAndModify: false })
  .then(() => console.log('Connected to Mongodb...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.get('env') === 'development') {
  const { accessLogStream, errorLogStream } = getStream();

  app.use(morgan('tiny', { stream: accessLogStream }));
  app.use(morgan('tiny', {
    skip: (req, res) => { return res.statusCode < 400; },
    stream: errorLogStream
  }));
}

app.use('/api/users', users);
app.use('/api/retailers', retailers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining at port no: ${port} ...`));

const express = require('express');
const mongoose = require('mongoose');

const retailers = require('./routes/retailers');

const app = express();

const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost/excel';

mongoose.connect(DB_URL, { useFindAndModify: false })
  .then(() => console.log('Connected to Mongodb...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/retailers', retailers);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining at port no: ${port} ...`));

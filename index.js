const express = require('express');
const mongoose = require('mongoose');

const app = express();

const DB_URL = process.env.MONGODB_URI || 'mongodb://localhost/playground';

mongoose.connect(DB_URL)
  .then(() => console.log('Connected to Mongodb...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Get course
app.get('/api/courses', async (req, res) => {
  const result = await getCourse();
  res.send(result);
});

// POST course
app.post('/api/courses', async (req, res) => {
  const {name, author, tags, isPublished} = {...req.body};
  const course = {
    name,
    author,
    tags,
    isPublished
  };

  const createdCourse = await createCourse(course);
  res.send(createdCourse);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listining at port no: ${port} ...`));

/************/

async function createCourse(course) {
  // create instance
  const newCourse = new Course(course);

  const result = await newCourse.save();
  console.log('Course: ', result);

  return result;
}

async function getCourse(){
  const courses = await Course.find();
  console.log('Courses: ', courses);
}

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const userSchema = new mongoose.Schema({
  username: String,
  count: Number,
  log: [{
    description: String,
    duration: Number,
    date: String,
  }],
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/api/users', async (req, res) => {
  const users = await User.find({}, 'username _id');
  res.json(users);
});
app.post('/api/users', (req, res, next) => {
  const username = req.body.username;
  const user = new User();
  user.username = username;
  user.save();
  res.json({ username: user.username, _id: user._id });
});

app.post('/api/users/:_id/exercises', async (req, res, next) => {
  const user = await User.findOne({_id: req.params._id});

  if (user.log.length > 0) {
    user.count += 1;
  } else {
    user.count = 1;
  }
  
  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  let date;
  if (req.body.date) {
    date = new Date(req.body.date).toDateString();
  }
  else {
    date = new Date().toDateString();
  }

  user.log.push({ description, duration, date });

  user.save();

  const response = {
    username: user.username,
    description: description,
    duration: duration,
    date: date,
    _id: user._id
  };

  res.json(response);
  
});

app.get('/api/users/:_id/logs', async (req, res) => {

  const user = await User.findOne({_id: req.params._id});
  const {from, to, limit} = req.query;

  let log = user.log;
  if (limit) {
    log = log.slice(0, parseInt(limit));
  };
  if (from) {
    const fromDate = new Date(from);
    const maxIndex = log.length - 1;
    for (let i = maxIndex; i >= 0; i--) {
      const entry = log[i];
      let entryDate = new Date(entry.date);
      if (entryDate < fromDate) {
        log.splice(i, maxIndex);
        continue;
      }
    }
  };
  if (to) {
    const toDate = new Date(to);
    for (let i = 0; i < log.length; i++) {
      const entry = log[i];
      let entryDate = new Date(entry.date);
      if (entryDate > toDate) {
        log.splice(0, i);
        continue;
      }
    }
  };
  
  const response = {
    username: user.username,
    count: user.count,
    _id: user._id,
    log: log,
  };

  res.json(response);
  
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyparser.toString());
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });

app.route('api/users').get((req,res) =>{

}).post((req,res,next) => {

});

app.post('/api/users/:_id/exercises', (req,res,next) => {

});

app.get('api/users/:_id/logs?[from][&to][&limit]', (req,res) => {

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

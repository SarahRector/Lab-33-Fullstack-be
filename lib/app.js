const express = require('express');
const Muppet = require('./models/muppet');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/api/v1/muppets', (req, res) => {
  Muppet
    .insert(req.body)
    .then(muppet => res.send(muppet));
});

app.get('/api/v1/muppets', (req, res) => {
  Muppet
    .find()
    .then(muppets => res.send(muppets));
});

app.get('/api/v1/muppets/:id', (req, res) => {
  Muppet
    .findById(req.params.id)
    .then(muppet => res.send(muppet));
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

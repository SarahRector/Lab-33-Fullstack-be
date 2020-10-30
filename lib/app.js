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

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 1303;
const managerRoutes = require('./routes/manager');



app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'taxi_secret', 
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', managerRoutes);

app.get('/', (req, res) => {
  res.send('Taxi Rental App Backend Running 🚕');
});

app.get('/test-db', async (req, res) => {
    try {
      const result = await db.query('SELECT NOW()');
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Database Test Failed');
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
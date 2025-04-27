const express = require('express');
const router = express.Router();
const db = require('../config/db'); // path to your db.js

router.post('/register-manager', async (req, res) => {
  const { name, ssn, email } = req.body;

  const ssnPattern = /^\d{9}$/;
  if (!ssnPattern.test(ssn)) {
    return res.status(400).json({ message: 'Invalid SSN. It must be exactly 9 digits.' });
  }

  try {
    const existing = await db.query('SELECT * FROM manager WHERE ssn = $1', [ssn]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Manager with this SSN already exists!' });
    }

    const newManager = await db.query(
      'INSERT INTO manager (name, ssn, email) VALUES ($1, $2, $3) RETURNING *',
      [name, ssn, email]
    );

    res.status(201).json({ message: 'Manager registered successfully!', manager: newManager.rows[0] });
  } catch (error) {
    console.error('Error registering manager:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/login-manager', async (req, res) => {
    const { ssn } = req.body;
    
    const ssnPattern = /^\d{9}$/;
    if (!ssnPattern.test(ssn)) {
        return res.status(400).json({ message: 'Invalid SSN format. SSN must be 9 digits.' });
    }

    try {
      const manager = await db.query('SELECT * FROM manager WHERE ssn = $1', [ssn]);
      if (manager.rows.length === 0) {
        return res.status(400).json({ message: 'Manager not found. Please register first.' });
      }
  
      res.status(200).json({ message: `Welcome, ${manager.rows[0].name}!`, manager: manager.rows[0] });
    } catch (error) {
      console.error('Error during manager login:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

module.exports = router;

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
  
router.post('/register-client', async (req, res) => {
  const { name, email, addresses, creditCard } = req.body;

  if (!name || !email || !Array.isArray(addresses) || addresses.length === 0 || !creditCard) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const existingClient = await db.query('SELECT * FROM client WHERE email = $1', [email]);
    if (existingClient.rows.length > 0) {
      return res.status(400).json({ message: 'Client with this email already exists!' });
    }

    // Insert client
    const clientResult = await db.query(
      'INSERT INTO client (name, email) VALUES ($1, $2) RETURNING client_id',
      [name, email]
    );
    const clientId = clientResult.rows[0].client_id;

    // Insert addresses and client-address mapping
    for (const addr of addresses) {
      const addressRes = await db.query(
        'INSERT INTO address (road_name, number, city) VALUES ($1, $2, $3) RETURNING address_id',
        [addr.road_name, addr.number, addr.city]
      );
      const addressId = addressRes.rows[0].address_id;

      await db.query(
        'INSERT INTO clientaddress (client_id, address_id) VALUES ($1, $2)',
        [clientId, addressId]
      );
    }

    // Insert credit card payment address
    const cardAddrParts = creditCard.address.split(',');
    if (cardAddrParts.length !== 3) {
      return res.status(400).json({ message: 'Invalid credit card address format. Use "road,number,city"' });
    }

    const [road, number, city] = cardAddrParts.map(str => str.trim());

    const cardAddrRes = await db.query(
      'INSERT INTO address (road_name, number, city) VALUES ($1, $2, $3) RETURNING address_id',
      [road, number, city]
    );
    const cardAddressId = cardAddrRes.rows[0].address_id;

    // Insert credit card
    await db.query(
      'INSERT INTO creditcard (card_number, client_id, address_id) VALUES ($1, $2, $3)',
      [creditCard.card_number, clientId, cardAddressId]
    );

    res.status(201).json({ message: 'Client registered successfully!' });

  } catch (error) {
    console.error('Error registering client:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// Client login route
router.post('/login-client', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const client = await db.query('SELECT * FROM client WHERE email = $1', [email]);
    if (client.rows.length === 0) {
      return res.status(400).json({ message: 'Client not found. Please register first.' });
    }

    res.status(200).json({ message: `Welcome, ${client.rows[0].name}!`, client: client.rows[0] });
  } catch (error) {
    console.error('Error during client login:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

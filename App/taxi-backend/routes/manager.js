const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /add-car: Insert a new car by brand
router.post('/add-car', async (req, res) => {
  const { brand } = req.body;

  if (!brand) {
    return res.status(400).json({ message: 'Brand is required.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO car (brand) VALUES ($1) RETURNING car_id',
      [brand]
    );
    res.status(201).json({ message: 'Car inserted successfully!', carId: result.rows[0].car_id });
  } catch (error) {
    console.error('Error inserting car:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /remove-car
router.post('/remove-car', async (req, res) => {
  const { car_id } = req.body;
  if (!car_id) return res.status(400).json({ message: 'Car ID is required.' });

  try {
    await db.query('DELETE FROM car WHERE car_id = $1', [car_id]);
    res.status(200).json({ message: 'Car removed successfully.' });
  } catch (error) {
    console.error('Error removing car:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /add-model
router.post('/add-model', async (req, res) => {
  const { color, transmission, year, car_id } = req.body;
  if (!color || !transmission || !year || !car_id) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO model (color, transmission, year, car_id) VALUES ($1, $2, $3, $4) RETURNING model_id',
      [color, transmission, year, car_id]
    );
    res.status(201).json({ message: 'Model inserted successfully!', modelId: result.rows[0].model_id });
  } catch (error) {
    console.error('Error inserting model:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /remove-model
router.post('/remove-model', async (req, res) => {
  console.log("🔧 /add-driver route hit");
  const { model_id, car_id } = req.body;
  if (!model_id || !car_id) {
    return res.status(400).json({ message: 'Model ID and Car ID are required.' });
  }

  try {
    await db.query('DELETE FROM model WHERE model_id = $1 AND car_id = $2', [model_id, car_id]);
    res.status(200).json({ message: 'Model removed successfully.' });
  } catch (error) {
    console.error('Error removing model:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /add-driver
router.post('/add-driver', async (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) return res.status(400).json({ message: 'Name and address are required.' });

  const [road, number, city] = address.split(',').map(s => s.trim());
  if (!road || !number || !city) {
    return res.status(400).json({ message: 'Invalid address format.' });
  }

  try {
    const addrRes = await db.query(
      'INSERT INTO address (road_name, number, city) VALUES ($1, $2, $3) RETURNING address_id',
      [road, number, city]
    );
    const address_id = addrRes.rows[0].address_id;

    await db.query(
      'INSERT INTO driver (name, address_id) VALUES ($1, $2)',
      [name, address_id]
    );

    res.status(201).json({ message: 'Driver inserted successfully!' });
  } catch (error) {
    console.error('Error inserting driver:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /remove-driver
router.post('/remove-driver', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Driver name is required.' });

  try {
    await db.query('DELETE FROM driver WHERE name = $1', [name]);
    res.status(200).json({ message: 'Driver removed successfully.' });
  } catch (error) {
    console.error('Error removing driver:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
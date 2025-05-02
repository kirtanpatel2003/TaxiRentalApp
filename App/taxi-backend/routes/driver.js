const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.put('/driver/address', async (req, res) => {
  const { driver_name, road_name, number, city } = req.body;

  try {
    const addressResult = await db.query(
      `INSERT INTO address (road_name, number, city)
       VALUES ($1, $2, $3)
       RETURNING address_id`,
      [road_name, number, city]
    );
    const newAddressId = addressResult.rows[0].address_id;

    await db.query(
      `UPDATE driver SET address_id = $1 WHERE name = $2`,
      [newAddressId, driver_name]
    );

    res.json({ message: 'Address updated successfully' });
  } catch (err) {
    console.error('Error updating driver address:', err);
    res.status(500).json({ message: 'Failed to update address' });
  }
});

router.get('/driver/models', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT M.model_id, M.car_id, C.brand, M.color, M.transmission, M.year
      FROM model M
      JOIN car C ON C.car_id = M.car_id
    `);
    res.json({ models: result.rows });
  } catch (err) {
    console.error('Error fetching car models:', err);
    res.status(500).json({ message: 'Failed to fetch models' });
  }
});

router.post('/driver/candrive', async (req, res) => {
  const { driver_name, model_id, car_id } = req.body;

  try {
    const driver = await db.query(`SELECT driver_id FROM driver WHERE name = $1`, [driver_name]);
    if (driver.rows.length === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const driver_id = driver.rows[0].driver_id;

    await db.query(
      `INSERT INTO candrive (driver_id, model_id, car_id)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [driver_id, model_id, car_id]
    );

    res.status(201).json({ message: 'Model added to driver\'s list' });
  } catch (err) {
    console.error('Error declaring car model:', err);
    res.status(500).json({ message: 'Failed to add model for driver' });
  }
});

module.exports = router;

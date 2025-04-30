const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Available Models on Date D
router.post('/client/available-models', async (req, res) => {
  const { date } = req.body;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: 'Invalid or missing date input.' });
  }

  try {
    const result = await db.query(`
      SELECT DISTINCT M.model_id, M.car_id, M.color, M.transmission, M.year, C.brand
      FROM model M
      JOIN car C ON C.car_id = M.car_id
      WHERE NOT EXISTS (
        SELECT 1 FROM rent R
        WHERE R.date = $1 AND R.model_id = M.model_id AND R.car_id = M.car_id
      )
      AND EXISTS (
        SELECT 1
        FROM candrive CD
        JOIN driver D ON D.driver_id = CD.driver_id
        WHERE CD.model_id = M.model_id AND CD.car_id = M.car_id
        AND NOT EXISTS (
          SELECT 1 FROM rent R2
          WHERE R2.date = $1 AND R2.driver_id = D.driver_id
        )
      )
    `, [date]);

    res.json({ models: result.rows });
  } catch (err) {
    console.error('Error fetching available models:', err);
    res.status(500).json({ message: 'Error fetching available models' });
  }
});

// 2. Book with any available driver
router.post('/client/book', async (req, res) => {
  const { client_id, date, model_id, car_id } = req.body;

  try {
    const driverResult = await db.query(`
      SELECT D.driver_id FROM candrive D
      WHERE D.model_id = $1 AND D.car_id = $2
      AND NOT EXISTS (
        SELECT 1 FROM rent R
        WHERE R.date = $3 AND R.driver_id = D.driver_id
      )
      LIMIT 1
    `, [model_id, car_id, date]);

    if (driverResult.rows.length === 0) {
      return res.status(400).json({ message: 'No available driver found for this model and date' });
    }

    const driver_id = driverResult.rows[0].driver_id;

    await db.query(`
      INSERT INTO rent (date, client_id, driver_id, model_id, car_id)
      VALUES ($1, $2, $3, $4, $5)
    `, [date, client_id, driver_id, model_id, car_id]);

    res.status(201).json({ message: 'Rent booked successfully!' });
  } catch (err) {
    console.error('Error booking rent:', err);
    res.status(500).json({ message: 'Error booking rent' });
  }
});

// 3. Get all rents by client
router.get('/client/rents', async (req, res) => {
  const { client_id } = req.query;

  try {
    const result = await db.query(`
      SELECT R.rent_id, R.date, D.name as driver_name, D.driver_id, M.color, M.year, M.transmission
      FROM rent R
      JOIN driver D ON D.driver_id = R.driver_id
      JOIN model M ON M.model_id = R.model_id AND M.car_id = R.car_id
      WHERE R.client_id = $1
    `, [client_id]);

    res.json({ rents: result.rows });
  } catch (err) {
    console.error('Error fetching rents:', err);
    res.status(500).json({ message: 'Error fetching rents' });
  }
});

// 4. Submit review if client rented with driver
router.post('/client/review', async (req, res) => {
  const { driver_id, client_id, rating, message } = req.body;

  try {
    const exists = await db.query(`
      SELECT 1 FROM rent
      WHERE driver_id = $1 AND client_id = $2
    `, [driver_id, client_id]);

    if (exists.rows.length === 0) {
      return res.status(400).json({ message: 'You cannot review this driver' });
    }

    await db.query(`
      INSERT INTO review (message, rating, driver_id, client_id)
      VALUES ($1, $2, $3, $4)
    `, [message, rating, driver_id, client_id]);

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (err) {
    console.error('Error submitting review:', err);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

module.exports = router;

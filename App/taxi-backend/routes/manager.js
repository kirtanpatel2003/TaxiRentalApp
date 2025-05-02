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

// GET /all-cars
router.get('/all-cars', async (req, res) => {
  try {
    const result = await db.query('SELECT car_id, brand FROM car ORDER BY car_id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /all-models
router.get('/all-models', async (req, res) => {
  try {
    const result = await db.query('SELECT model_id, color, transmission, year, car_id FROM model ORDER BY model_id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /all-drivers
router.get('/all-drivers', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.driver_id, d.name, CONCAT(a.road_name, ', ', a.number, ', ', a.city) AS address
      FROM driver d
      JOIN address a ON d.address_id = a.address_id
      ORDER BY d.name
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/data/top-k-clients', async (req, res) => {
  const { k } = req.body;
  try {
    const result = await db.query(`
      SELECT c.name, c.email
      FROM client c
      JOIN rent r ON c.client_id = r.client_id
      GROUP BY c.client_id
      ORDER BY COUNT(*) DESC
      LIMIT $1
    `, [k]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching top-k clients:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/data/car-model-usage', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT ca.brand, m.color, m.transmission, m.year, COUNT(r.rent_id) AS usageCount
      FROM model m
      JOIN car ca ON m.car_id = ca.car_id
      LEFT JOIN rent r ON m.model_id = r.model_id AND m.car_id = r.car_id
      GROUP BY ca.brand, m.color, m.transmission, m.year
      ORDER BY usageCount DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching model usage:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/data/driver-performance', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.name, COUNT(r.rent_id) AS "tripsCompleted", 
             COALESCE(ROUND(AVG(rv.rating)::numeric, 2), 0) AS rating
      FROM driver d
      LEFT JOIN rent r ON d.driver_id = r.driver_id
      LEFT JOIN review rv ON d.driver_id = rv.driver_id
      GROUP BY d.driver_id, d.name
      ORDER BY COUNT(r.rent_id) DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching driver performance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /data/client-driver-city-match
router.post('/data/client-driver-city-match', async (req, res) => {
  const { clientCity, driverCity } = req.body;
  if (!clientCity || !driverCity) {
    return res.status(400).json({ message: 'Both client and driver cities are required.' });
  }

  try {
    const result = await db.query(`
      SELECT DISTINCT c.name AS client_name, c.email AS client_email
      FROM client c
      JOIN clientaddress ca ON c.client_id = ca.client_id
      JOIN address a1 ON ca.address_id = a1.address_id
      JOIN rent r ON c.client_id = r.client_id
      JOIN driver d ON r.driver_id = d.driver_id
      JOIN address a2 ON d.address_id = a2.address_id
      WHERE a1.city = $1 AND a2.city = $2
    `, [clientCity, driverCity]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in client-driver city match:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
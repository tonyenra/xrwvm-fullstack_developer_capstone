// server/database/app.js
'use strict';

const express  = require('express');
const mongoose = require('mongoose');
const fs       = require('fs');
const path     = require('path');
const cors     = require('cors');

const Reviews     = require('./review');
const Dealerships = require('./dealership');

const app  = express();
const port = process.env.PORT || 3030;

/* -------- Middlewares -------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------- Cargar data JSON local -------- */
const reviewsPath     = path.join(__dirname, 'data', 'reviews.json');
const dealershipsPath = path.join(__dirname, 'data', 'dealerships.json');

const reviews_data     = JSON.parse(fs.readFileSync(reviewsPath, 'utf8')).reviews;
const dealerships_data = JSON.parse(fs.readFileSync(dealershipsPath, 'utf8')).dealerships;

/* -------- Conexión Mongo -------- */
mongoose
  .connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' })
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    const [revCount, dealCount] = await Promise.all([
      Reviews.countDocuments(),
      Dealerships.countDocuments(),
    ]);

    if (dealCount === 0) {
      await Dealerships.insertMany(dealerships_data);
      console.log('🌱 Seeded dealerships');
    }
    if (revCount === 0) {
      await Reviews.insertMany(reviews_data);
      console.log('🌱 Seeded reviews');
    }
  })
  .catch(err => console.error('❌ Mongo connection error:', err));

/* -------- Rutas -------- */

// Healthcheck
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Home
app.get('/', (_req, res) => res.send('Welcome to the Mongoose API'));

// 1. Todos los reviews
app.get('/fetchReviews', async (_req, res) => {
  try {
    const docs = await Reviews.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// 2. Reviews por dealer id
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const dealerId = parseInt(req.params.id, 10);
    const docs = await Reviews.find({ dealership: dealerId });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// 3. Todos los dealerships
app.get('/fetchDealers', async (_req, res) => {
  try {
    const docs = await Dealerships.find();
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// 4. Dealerships por estado (case-insensitive)
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const state = req.params.state;
    const docs = await Dealerships.find({ state: new RegExp(`^${state}$`, 'i') });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// 5. Dealer por id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const dealerId = parseInt(req.params.id, 10);
    const doc = await Dealerships.findOne({ id: dealerId });
    if (!doc) return res.status(404).json({ error: 'Dealer not found' });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// 6. Insertar review
app.post('/insert_review', async (req, res) => {
  try {
    const data = req.body;

    const last = await Reviews.findOne().sort({ id: -1 });
    const new_id = (last?.id || 0) + 1;

    const review = new Reviews({
      id: new_id,
      name: data.name,
      dealership: data.dealership,
      review: data.review,
      purchase: data.purchase,
      purchase_date: data.purchase_date,
      car_make: data.car_make,
      car_model: data.car_model,
      car_year: data.car_year,
    });

    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

/* -------- Start -------- */
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

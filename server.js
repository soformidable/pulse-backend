require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const workoutSchema = new mongoose.Schema({ date: String, duration: Number, exercises: Array }, { timestamps: true });
const recordSchema  = new mongoose.Schema({ exId: { type: String, unique: true }, weight: Number, reps: Number, date: String });
const exerciseSchema = new mongoose.Schema({ id: { type: String, unique: true }, name: String, cat: String });

const Workout  = mongoose.model('Workout',  workoutSchema);
const Record   = mongoose.model('Record',   recordSchema);
const Exercise = mongoose.model('Exercise', exerciseSchema);

app.get('/workouts',         async (_, res) => res.json(await Workout.find()));
app.post('/workouts',        async (req, res) => res.json(await Workout.create(req.body)));
app.get('/records',          async (_, res) => res.json(await Record.find()));
app.put('/records/:exId',    async (req, res) => res.json(await Record.findOneAndUpdate({ exId: req.params.exId }, req.body, { upsert: true, new: true })));
app.get('/exercises',        async (_, res) => res.json(await Exercise.find()));
app.post('/exercises',       async (req, res) => res.json(await Exercise.findOneAndUpdate({ id: req.body.id }, req.body, { upsert: true, new: true })));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 3001, () => console.log('Server running')))
  .catch(err => console.error(err));
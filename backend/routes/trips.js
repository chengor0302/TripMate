const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth')

// READ all trips
router.get('/',authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limitPerPage) || 10;
    const skip = (page - 1) *limit //Counts how many pages to skip in each fetch
    const totalTrips = await Trip.countDocuments({members: req.user.id});
    const trips = await Trip.find({members: req.user.id}).skip(skip).limit(limit).populate('members');
    res.json({trips, totalTrips});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new trip
router.post('/', authMiddleware, async (req, res) => {
    try{
        const { dest, description, startDate, endDate, hotel } = req.body;
        const trip = new Trip({
        dest,
        description,
        startDate,
        endDate,
        hotel,
        members: [req.user.id],
        });
        await trip.save();
        res.status(201).json(trip);
    } catch(err){
        res.status(400).json({error: err.message});
    }
});

//Read a specific trip
router.get('/:id',authMiddleware, async (req, res) => {
    try{
        const trip = await Trip.findById(req.params.id).populate('members');
        if(!trip) return res.status(404).json({error: 'Trip not found'});
        if(!trip.members.some(member => member._id.toString() === req.user.id)) return res.status(401).json({error: 'User can not access to trip'});
        res.json(trip);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

//Update a specific trip
router.put('/:id', authMiddleware, async (req, res) => {
    try{
        const trip = await Trip.findById(req.params.id).populate('members');
        if(!trip) return res.status(404).json({error: 'Trip not found'});
        if(!trip.members.some(member => member._id.toString() === req.user.id))
            return res.status(403).json({error: 'User can not access to trip'});
        Object.assign(trip, req.body);
        await trip.save();
        res.json(trip);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Delete a specific trip
router.delete('/:id', authMiddleware, async (req, res) =>{
    try{
        const trip = await Trip.findById(req.params.id).populate('members');
        if(!trip)
            return res.status(404).json({error: 'Trip not found'});
        if(!trip.members.some(member => member._id.toString() === req.user.id))
            return res.status(403).json({error: 'User can not access to trip'});
        await Trip.findByIdAndDelete(req.params.id);
        res.json({message: 'Trip deleted'});
    } catch (err){
        res.status(500).json({error: err.message});
    }
});

//for checks:

router.post('/', authMiddleware, async (req, res) => {
  console.log("New trip request:", req.body);
});


router.post("/:tripId/add-friend", authMiddleware, async (req, res) => {
  try {
    const { tripId } = req.params;
    const { userId } = req.body;
    const trip = await Trip.findById(tripId);
    const user = await User.findById(userId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    if (trip.members.includes(userId))
      return res.status(400).json({ error: "User already added" });
    trip.members.push(userId);
    user.trips.push(tripId);
    await trip.save();
    await user.save();
    const updatedTrip = await Trip.findById(tripId).populate("members");
    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;


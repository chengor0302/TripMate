const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    dest: {type: String, required: true},
    description: String,
    startDate: Date,
    endDate: Date,
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    hotel: String,
    flights: [{type: String, date: Date, airport: String}],
})

module.exports = mongoose.model('Trip', TripSchema);
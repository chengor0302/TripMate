const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Creating a schema for a user
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    trips: [{type: mongoose.Schema.Types.ObjectId, ref: 'Trip'}],
    profileImage: String,
}, {timestamps: true})

//Encripting the passward
userSchema.pre('save', async function(next) {
    if(!this.isModified('password'))  return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();    
})

//Exporting the model
module.exports = mongoose.model('User', userSchema);
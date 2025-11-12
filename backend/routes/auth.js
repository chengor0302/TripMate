const express = require('express'); //Import express framework
const router = express.Router(); //Creating a new router object, each one takes care of different URL addresses(for example: auth, trips etc)
const trip = require('../models/Trip');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/auth');
const upload = require('./upload'); 

//Taking care of the request
router.post('/register', async (req, res)=> {
    try{
        const email = req.body.email;
        const isUser = await User.findOne({email});
        if(isUser){
            return res.status(400).json({error: 'Email already exist'});
        }
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user); 
    } catch(err){
        res.status(400).json({error: err.message});
    }
});

router.post('/login', async (req, res)=> {
    try{
        const email = req.body.email;
        const existingUser = await User.findOne({email});
        if(existingUser == null){
            return res.status(400).json({error: 'User not exist'});
        }
        if(await bcrypt.compare(req.body.password, existingUser.password)){
            //returning jwt(token)
            const token = jwt.sign(
                {id: existingUser._id},
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
                );
            res.json({token});
        }
        else{
            return res.status(401).json({error: 'Wrong password'});
        }

    } catch(err){
        res.status(500).json({error: err.message});
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try{
        const user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({error: "user not found"});
        res.json(user);
    } catch(err){
        res.status(500).json({error: err.message});
    }
})

const fs = require("fs");
const path = require("path");

// PUT /profile
router.put('/profile', authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.isDeleted === "true") {
      if (user.profileImage) {
        const oldPath = path.join(__dirname, "..", user.profileImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profileImage = "";
    }

    if (req.file) {
      if (user.profileImage) {
        const oldPath = path.join(__dirname, "..", user.profileImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.delete("/profile/image", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.profileImage) {
      const filePath = path.join(__dirname, "..", user.profileImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      user.profileImage = "";
      await user.save();
      res.json({ message: "Image deleted" });
    } else {
      res.status(400).json({ error: "No profile image to delete" });
    }
}
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/search", authMiddleware, async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Name query is required" });

    const users = await User.find({ name: { $regex: name, $options: "i" } }).limit(5);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//Export the router to the server.js
module.exports = router;
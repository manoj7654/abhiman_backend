const express = require('express');
const profileRouter = express.Router();
const { authenticate } = require('../middleware/authentication');
const { userProfile } = require('../controller/profileController');

// Route to get user profile
profileRouter.get('/profile/:userId', authenticate, userProfile);


module.exports = profileRouter;
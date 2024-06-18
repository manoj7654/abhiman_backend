// routes/friendRequestRoutes.js
const express = require('express');
const { authenticate } = require('../middleware/authentication');
const { sendFriendRequest, respondToFriendRequest } = require('../controller/friendReuestController');



const friendRequestRouter = express.Router();

friendRequestRouter.post('/friend-requests', authenticate, sendFriendRequest);
// friendRequestRouter.post('/friend-requests/respond', authenticate, respondToFriendRequest);

module.exports = friendRequestRouter;

// controllers/friendRequestController.js

const FriendRequest = require("../modal/frientRequestModal");
const User = require("../modal/userModal");


const sendFriendRequest = async (req, res) => {
  const {receiverId}  = req.body;
   const userId=req.user.id
   console.log("receiverId",receiverId)
  
  try {
  
    // Check if sender and receiver exist
    const sender = await User.findOne({ where: { userId } });
  // console.log(receiverId)
    const receiver = await User.findOne({ where: { userId:receiverId } });
    // console.log("reciever",receiver)
    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check if the request has already been sent
    const existingRequest = await FriendRequest.findOne({
      where: {
        senderId: userId,
        receiverId
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already sent.' });
    }

    // Create the friend request
    await FriendRequest.create({ senderId: userId, receiverId, status: 'pending' });
    
    return res.status(201).json({ message: 'Friend request sent successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const respondToFriendRequest = async (req, res) => {
  const { requestId, response } = req.body;

  try {
    // Find the friend request
    const friendRequest = await FriendRequest.findByPk(requestId);

    if (!friendRequest) {
      return res.status(404).json({ error: 'Friend request not found.' });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request has already been responded to.' });
    }

    // Update the status based on the response
    friendRequest.status = response;
    await friendRequest.save();

    return res.status(200).json({ message: 'Friend request responded successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  sendFriendRequest,
  respondToFriendRequest,
};

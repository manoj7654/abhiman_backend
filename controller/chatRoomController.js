const ChatRoom = require("../modal/chatRoomModal");
const User = require("../modal/userModal");
const bcrypt = require("bcrypt");

const createChatRoom = async (req, res) => {
  try {
    const { roomId, password } = req.body;
    const userId = req.user.userId;
    const user = await User.findOne({ where: { userId } });

    if (!user.isPrime) {
      return res
        .status(403)
        .json({ error: "Only prime members can create chat rooms" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const chatRoom = await ChatRoom.create({
      roomId,
      password: hashedPassword,
      createdBy: userId,
      members: [userId],
    });
    res.status(201).json({message:"Room Created Successfully",chatRoom});
  } catch (error) {
    res.status(500).json({ error: "Room creation failed" });
  }
};
const inviteParticipant = async (req, res) => {
  const { roomId, password, inviteeId } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the user creating the invite is the creator of the chat room
    const chatRoom = await ChatRoom.findOne({
      where: { roomId, createdBy: userId },
    });
    // console.log(chatRoom)
    if (!chatRoom) {
      return res
        .status(403)
        .json({
          error: "You are not authorized to invite users to this chat room.",
        });
    }

    // Check if invitee is a prime member
    const invitee = await User.findOne({
      where: { userId: inviteeId, isPrime: true },
    });
    if (!invitee) {
      return res
        .status(404)
        .json({ error: "Invitee is not a prime member or does not exist in the database." });
    }

    // Create the invitation link
    const inviteLink = `${req.protocol}://${req.get(
      "host"
    )}/joinroom?roomId=${roomId}&password=${password}`;

    // Add invitee to the chat room members
    chatRoom.members.push(inviteeId);
    await chatRoom.save();

    res
      .status(200)
      .json({ message: "Participant invited successfully", inviteLink });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const joinChatRoom = async (req, res) => {
  const { roomId, password } = req.body;
  const userId = req.user.userId;

  try {
    // Fetch the chat room details
    const chatRoom = await ChatRoom.findOne({ where: { roomId } });
    if (!chatRoom) {
      return res.status(404).json({ error: "Room not found." });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, chatRoom.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid room password." });
    }

    // Fetch user details
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the room is full
    if (chatRoom.members.length >= chatRoom.maxCapacity) {
      return res.status(403).json({ error: "The room is already full." });
    }

    // If the user is not a prime member, return a message
    if (!user.isPrime) {
      return res.status(403).json({ error: "User is not a prime member." });
    }

    // Add user to the room if not already a member
    if (!chatRoom.members.includes(user.userId)) {
      chatRoom.members.push(user.userId);
      await chatRoom.save();
    }

    // Check if the User has Already Joined a Room for Free
    if (!user.isFreeRoomJoined) {
      // If not, mark free room access as used
      user.isFreeRoomJoined = true;
      await user.save();
    } else {
      // If the user has already used their free room access, deduct coins if necessary
      if (user.availCoins < 150) {
        return res
          .status(403)
          .json({ error: "Not enough availCoins to join the room." });
      }
      user.availCoins -= 150;
      await user.save();
    }

    return res.status(200).json({ message: "Room joined successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error." });
  }
};

module.exports = { createChatRoom, joinChatRoom, inviteParticipant };

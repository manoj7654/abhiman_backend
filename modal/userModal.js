const {  DataTypes } = require('sequelize');

// importing connection for defining users schema
const { connection } = require('../config/db');

// define UserModel
const User = connection.define('User', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  deviceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availCoins: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPrime: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isFreeRoomJoined: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  
  });
  
  User.associate = (modal) => {
    User.hasMany(modal.ChatRoom, { foreignKey: 'creatorId', as: 'chatRooms' });
    User.hasMany(modal.Message, { foreignKey: 'userId', as: 'messages' });
    User.hasMany(modal.FriendRequest, { foreignKey: 'senderId', as: 'sentRequests' });
    User.hasMany(modal.FriendRequest, { foreignKey: 'receiverId', as: 'receivedRequests' });
  };
module.exports = User;
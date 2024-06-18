// models/friendRequest.js
const { DataTypes } = require('sequelize');

const User=require("../modal/userModal");
const { connection } = require('../config/db');
const FriendRequest = connection.define('FriendRequest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
        defaultValue: 'Pending',
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
});

// Define associations
FriendRequest.associate = (modal) => {
  FriendRequest.belongsTo(modal.User, { foreignKey: 'senderId', as: 'Sender' });
  FriendRequest.belongsTo(modal.User, { foreignKey: 'receiverId', as: 'Receiver' });
};

module.exports = FriendRequest;

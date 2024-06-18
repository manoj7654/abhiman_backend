const { DataTypes } = require('sequelize');
const { connection } = require('../config/db');

const ChatRoom = connection.define('ChatRoom', {
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
},
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
},
members: {
  type: DataTypes.JSON, 
  defaultValue: [], 
},
  maxCapacity: {
    type: DataTypes.INTEGER,
    defaultValue: 6, // Default value for maxCapacity
},
  password: { 
    type: DataTypes.STRING, 
    allowNull: false },
}, {
  timestamps: true
});

ChatRoom.associate = (modal) => {
  ChatRoom.belongsTo(modal.User, { foreignKey: 'createdBy', as: 'creator' });
  ChatRoom.hasMany(modal.Message, { foreignKey: 'roomId', as: 'messages' });
};
module.exports = ChatRoom;

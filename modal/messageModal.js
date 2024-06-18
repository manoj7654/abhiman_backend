const { DataTypes } = require("sequelize");
const connection = require("../config/db");

const Message = connection.define("Message", {
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

});
Message.associate = (modal) => {
  Message.belongsTo(modal.ChatRoom, { foreignKey: 'roomId' });
  Message.belongsTo(modal.User, { foreignKey: 'senderId' });
};
module.exports = Message;

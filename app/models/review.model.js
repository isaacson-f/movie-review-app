

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("review", {
      subject: {
        type: DataTypes.STRING
      },
      post: {
        type: DataTypes.STRING
      },
    });
    return Message;
  };
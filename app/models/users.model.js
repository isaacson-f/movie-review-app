

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("users", {
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      username: {
          type : DataTypes.STRING
      },
      password: {
          type: DataTypes.STRING
      },
      profile_picture: {
          type : DataTypes.STRING
      },
      lists : {
        type: DataTypes.STRING
      },
      following : {
        type: DataTypes.LIST
      },
      
    });
    return Users;
  };
const db = require("../models");
const User = db.User;


exports.createUser = (user) => {
    return User.create({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      password: user.password,
      profile_picture: user.profile_picture,
    })
      .then((user) => {
        console.log(">> Created user: " + JSON.stringify(user, null, 4));
        return user;
      })
      .catch((err) => {
        console.log(">> Error while creating user: ", err);
      });
  };

  exports.updateUser = (userID, user) => {
    var updateUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      password: user.password,
      profile_picture: user.profile_picture,
  };
    return User.update(updateUser, { where: { id: userID }});
  }

  exports.findUserById = (userId) => {
    return User.findByPk(userId, { include: ["comments"] })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.log(">> Error while finding users: ", err);
      });
  };


module.exports = (sequelize, DataTypes) => {
    const Categories = sequelize.define("categories", {
      topic: {
        type: DataTypes.STRING
      }
    });
    return Categories;
  };
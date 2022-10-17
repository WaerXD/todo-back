const Sequelize = require("sequelize");
const { sequelizeInstance } = require("..");

class User extends Sequelize.Model {}

User.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      //defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    username: {
      type: Sequelize.STRING,
      defaultValue: "user",
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      defaultValue: "0000",
    },
  },

  { sequelize: sequelizeInstance, underscored: true, modelName: "user" }
);

module.exports = User;

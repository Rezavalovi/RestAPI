'use strict';

const { hashPassword } = require('../helpers/bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Balance, {
        foreignKey: 'Userid'
      });
      User.hasMany(models.Transaction, {
        foreignKey: 'Userid'
      })
    }
  }
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
          isEmail: {
              msg: "Parameter email tidak sesuai format"
          }
      }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        len: {
            args: [8],
            msg: "Password minimal terdiri dari 8 karakter  "
        }
    }
},
profile_image: {
  type: DataTypes.STRING,
  validate: {
      isImage(value) {
          if (value && !value.match(/\.(jpeg|jpg|png)$/i)) {
              throw new Error("Profile image must be in JPEG or PNG format");
          }
      }
  }
}
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate( (user, options) => {
    const hashedPassword = hashPassword(user.password);
    user.password = hashedPassword;
  });
  return User;
};
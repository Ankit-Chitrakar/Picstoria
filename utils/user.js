const { sequelize } = require('../models');
const User = sequelize.models.users;

const doesUserExist = async (email) => {
  try {
    // Check if a user with the given email exists
    const user = await User.findOne({ where: { email } });
    return !!user;
  } catch (err) {
    console.error('Error checking if user exists:', err);
    throw new Error('Error checking user existence');
  }
};

const doesUserExistById = async (id) => {
    try {
      // Check if a user with the given userId exists
      const user = await User.findByPk(id);
      return user;
    } catch (err) {
      console.error('Error checking if user exists:', err);
      throw new Error('Error checking user existence');
    }
  };

module.exports = {doesUserExist, doesUserExistById};

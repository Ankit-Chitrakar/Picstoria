const { Tag } = require('../models');

const doesTagExistByName = async (tag) => {
    try {
      // Check if a tag with the given userId exists
      const tagDetails = await Tag.findOne({where: {name: tag}});
      return tagDetails;
    } catch (err) {
      console.error('Error checking if tag exists:', err);
      throw new Error('Error checking tag existence');
    }
  };

module.exports = { doesTagExistByName };

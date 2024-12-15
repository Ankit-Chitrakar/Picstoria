const { Photo, Tag } = require('../models');

const doesPhotoExistById = async (photoId) => {
    try {
        // Check if a photo with the given photoId exists
        const photo = await Photo.findByPk(photoId, { include: { model: Tag, as: 'photoTags' } });
        return photo;
    } catch (err) {
        console.error('Error checking if photo exists:', err);
        throw new Error('Error checking photo existence');
    }
};

module.exports = { doesPhotoExistById }
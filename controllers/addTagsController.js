const { validateTagList } = require('../validation/photo')
const { validateRequestBody } = require('../validation/tag')
const { Tag, Photo } = require('../models');
const { doesPhotoExistById } = require('../utils/photo');


const addTagsController = async (req, res) => {
    try {
        const photoId = parseInt(req.params.photoId);
        const { tags } = req.body

        let errors = [];
        errors.push(...validateRequestBody(req.body, photoId));

        const photo = await doesPhotoExistById(photoId);
        if (!photo) {
            return res.status(404).json({ errors: [{ msg: "Invalid photoId. No photo found" }] })
        }

        // check existing tags and body tags are not same 
        const existingTags = photo.photoTags ? photo.photoTags.map((tag) => tag.name) : [];

        const newTags = tags ? tags.filter((tag) => !existingTags.includes(tag)) : []

        // chcek the new updated tagList validation
        errors.push(...validateTagList(existingTags.concat(newTags)))

        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        // now simply add into tags table 
        const addedTags = newTags.map(tag => ({
            name: tag,
            photoId: photo.id,
        }));
        await Tag.bulkCreate(addedTags);
        const updatedTagList = existingTags.concat(newTags);
        await Photo.update(
            { tagList: updatedTagList },
            { where: { id: photoId } }
        );


        res.status(201).json({
            msg: "Tags added successfully!!",
            tag: existingTags.concat(newTags),
        });

    } catch (err) {
        console.error("Error adding tags:", err);

        if (err.message.includes("Error checking photo existence")) {
            return res.status(500).json({ errors: [{ msg: "Server error when finding photo" }] })
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { addTagsController }
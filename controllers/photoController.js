const { doesUserExistById } = require("../utils/user");
const { validateImageURL, validateTagList, validateRequestBody } = require('../validation/photo')
const { Photo } = require('../models');
const { Tag } = require('../models')


const photoController = async (req, res) => {
    try {
        const { imageURL, description, altDescription, tagList = [], userId } = req.body;

        let errors = [];
        errors.push(...validateImageURL(imageURL));
        errors.push(...validateTagList(tagList));
        errors.push(...validateRequestBody(req.body))

        if (errors.length > 0) {
            return res.status(400).json({ errors })
        }

        const userExists = await doesUserExistById(parseInt(userId));
        if (!userExists) {
            return res.status(404).json({ errors: [{ msg: "User not found" }] })
        }

        // now create photo 
        const savedPhoto = await Photo.create({
            imageURL: imageURL,
            description: description || "Not available",
            altDescription: altDescription || "Not available",
            tagList: tagList,
            userId: userId,
        })

        // if tags present then insert that data into tags table 
        if (tagList.length > 0) {
            const tags = tagList.map(tag => ({
                name: tag,
                photoId: savedPhoto.id,
            }));
            await Tag.bulkCreate(tags); 
        }

        res.status(201).json({
            msg: "Photo created successfully!!",
            photo: savedPhoto,
        });

    } catch (err) {
        console.error("Error retrieving photo:", err);

        if (err.message.includes("Error checking user existence")) {
            return res.status(500).json({ errors: [{ msg: "Server error when finding user" }] })
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { photoController }
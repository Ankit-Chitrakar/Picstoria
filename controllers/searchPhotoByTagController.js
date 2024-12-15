const { validateTag } = require('../validation/tag')
const { validateSortingOrder } = require('../validation/sorting')
const { doesUserExistById } = require('../utils/user')
const { doesTagExistByName } = require('../utils/tag')
const {sequelize, Tag, Photo } = require('../models')


const SearchHistory = sequelize.models.serachHistories;

const searchPhotoByTag = async (req, res) => {
    try {
        const { tags, sort = 'ASC', userId } = req.query;

        let errors = [];
        errors.push(...validateTag(tags));
        errors.push(...validateSortingOrder(sort))

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        // check also tag is present in tags table or not
        const tagExist = await doesTagExistByName(tags)
        if (!tagExist) {
            return res.status(404).json({ errors: [{ msg: "Tag not found" }] })
        }

        // if userid present then find the user and update the query into user's search history
        if (userId) {
            const userExists = await doesUserExistById(parseInt(userId));
            if (!userExists) {
                return res.status(404).json({ errors: [{ msg: "User not found" }] })
            }

            //insert this data into searchHistory table 
            await SearchHistory.create({
                query: tags,
                userId: userId,
            })
        }


        // fetch photos by tag and sort them based on sort order
        // this is nothing but join photo table and tag table 
        // the sql btwn this is 
        /*
            SELECT photos.*,tags.name
            FROM photos
            INNER JOIN tags ON tags.photoId = photos.id
            WHERE tags.name = 'mountain'
            ORDER BY photos.dateSaved ASC;
        */
        const photos = await Photo.findAll({
            include: [
                {
                    model: Tag,
                    as: 'photoTags',
                    where: {
                        name: tags,
                    },
                }
            ],
            order: [['dateSaved', sort.toUpperCase()]]
        });


        const result = photos.map((photo) => ({
            id: photo.id,
            imageURL: photo.imageURL,
            description: photo.description,
            dateSaved: photo.dateSaved,
            tags: Array.isArray(photo.tagList) ? photo.tagList : JSON.parse(photo.tagList || '[]')
        }))

        return res.status(200).json({
            photos: result,
        });

    } catch (err) {
        console.error(err);

        if (err.message.includes("Error checking user existence")) {
            return res.status(500).json({ errors: [{ msg: "Server error when finding user" }] })
        }

        if (err.message.includes("Error checking tag existence")) {
            return res.status(500).json({ errors: [{ msg: "Server error when finding tag" }] })
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { searchPhotoByTag };
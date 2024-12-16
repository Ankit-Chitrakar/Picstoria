const express = require('express');
const { photoController } = require('../controllers/photoController');
const {createNewUser} = require('../controllers/userController')
const {searchPhoto} = require('../controllers/searchPhotoController');
const { addTagsController } = require('../controllers/addTagsController');
const { searchPhotoByTag, fetchSearchHistoryOfUser } = require('../controllers/searchPhotoByTagController');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Everything is good!');
});

router.post('/api/users', createNewUser);
router.get('/search/photos', searchPhoto)
router.post('/api/photos', photoController);
router.post('/api/photos/:photoId/tags', addTagsController)
router.get('/api/photos/tag/search', searchPhotoByTag)
router.get('/api/search-history', fetchSearchHistoryOfUser)


module.exports = router;
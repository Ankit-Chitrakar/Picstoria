const {validateSearchPhotos} = require('../validation/searchPhoto')
const {unsplashAxios} = require('../utils/axiosInstance');
require('dotenv').config()

const searchPhoto = async(req, res)=>{
    const query = req.query.query;
    const page = parseInt(req.query.page) || 1;

    let errors = [];
    errors.push(...validateSearchPhotos(query))

    if(errors.length > 0){
        res.status(400).json({errors})
    }

    try{
        const axiosInstance = await unsplashAxios(process.env.UNSPLASH_BASE_URL, process.env.UNSPLASH_ACCESS_KEY);
        const searchResponse = await axiosInstance.get('/search/photos', {
            params: {
                query: query,
                per_page: 10,
                page: page,
            }
        });
        // console.log(searchResponse.data)

        if(searchResponse.data.length === 0){
            return res.status(404).json({ error: `No images found for the given query: ${query}.` });
        }

        const {total, results} = searchResponse.data;

        // extract my necessary data
        const photos = results.map((photo)=> ({
            imageURL: photo.urls.full,
            description: photo.description || "No description provided",
            altDescription: photo.alt_description || "No alt description provided",
        })); 

        res.status(200).json({
            totalResults: total,
            currentPage: page,
            photos
        })
    }catch(err){
        // Handle all errors here, including those from unsplashAxios
        console.error('Error in searchPhoto:', err.message || err);
    
        if (err.message.includes('Unsplash API key')) {
          return res.status(500).json({ error: 'Server configuration error: API key is missing.' });
        }
    
        if (err.message.includes('Unsplash base URL')) {
          return res.status(500).json({ error: 'Server configuration error: Base URL is missing.' });
        }
    
        if (err.response && err.response.status === 401) {
          return res.status(401).json({ error: 'Unauthorized: Invalid Unsplash API key.' });
        }
    
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = {searchPhoto};
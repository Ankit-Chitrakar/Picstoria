const axios = require('axios');

const unsplashAxios = async (base_url, access_key) => {
  try {
    if (!access_key) {
      throw new Error('Unsplash API key is missing. Please configure UNSPLASH_ACCESS_KEY in the .env file.');
    }

    if (!base_url) {
      throw new Error('Unsplash base URL is missing. Please configure UNSPLASH_BASE_URL in the .env file.');
    }

    // Create an Axios instance for Unsplash
    const axiosInstance = axios.create({
      baseURL: base_url,
      headers: {
        Authorization: `Client-ID ${access_key}`,
      },
    });

    return axiosInstance;
  } catch (err) {
    console.error('Error creating Unsplash Axios instance:', err.message || err);
    throw err;
  }
};

module.exports = {unsplashAxios};

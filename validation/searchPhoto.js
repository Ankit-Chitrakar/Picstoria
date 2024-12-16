const validateSearchPhotos = (query)=>{
    let errors = [];
    if(!query || query.trim() === ''){
        errors.push({msg: 'Please provide a search query'});
    }

    return errors;
}

module.exports = {validateSearchPhotos}
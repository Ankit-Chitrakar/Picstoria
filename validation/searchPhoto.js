const validateSearchPhotos = (query)=>{
    let errors = [];
    if(!query || query.trim() === ''){
        errors.push({msg: ''});
    }

    return errors;
}

module.exports = {validateSearchPhotos}
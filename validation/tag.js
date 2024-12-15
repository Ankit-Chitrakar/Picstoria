const validateRequestBody = (body, photoId)=>{
    let errors = [];
    if(!body.tags || !photoId){
        errors.push({ msg: 'Both tags and photoId are required!' });
    }
    return errors;
}

module.exports = {validateRequestBody}
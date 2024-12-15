const validateRequestBody = (body, photoId)=>{
    let errors = [];
    if(!body.tags || !photoId){
        errors.push({ msg: 'Both tags and photoId are required!' });
    }
    return errors;
}

const validateTag = (tag) => {
    let errors = [];

    // Check if the tag is present and is a string
    if (!tag || typeof tag !== 'string' || tag.trim() === '') {
        errors.push({ msg: 'A valid tag must be provided and cannot be empty.' });
    }

    // Check if the tag length exceeds 20 characters
    if (tag && tag.length > 20) {
        errors.push({ msg: 'Each tag must be a string with a length of no more than 20 characters.' });
    }

    return errors;
};

module.exports = {validateRequestBody, validateTag}
const validateImageURL = (imageURL)=>{
    let errors = [];
    if(imageURL && !imageURL.startsWith('https://images.unsplash.com/')){
        errors.push({msg: 'Invalid image URL'})
    }
    
    return errors;
}

const validateTagList = (tagList) =>{
    let errors = [];
    // present and have less than equals 5 tags in a photo collection
    if(tagList && !Array.isArray(tagList) || tagList.length > 5){
        errors.push({msg: 'Tags must be an array with no more than 5 tags in one photo'})
    }
    // each tag conatins only 20 character.
    if(tagList && tagList.some((tag)=> typeof(tag) !== 'string' || tag.trim() === '' || tag.length > 20)){
        errors.push({msg: 'Each tag must be a string with length less than or equal to 20 characters'})
    } // some returns if anything in the arry satisfy given condition then returns true and filter return whose satisfy the condition returns with new array so in here use some

    return errors;
}

const validateRequestBody = (body)=>{
    let errors = [];
    if(!body.imageURL || !body.userId){
        errors.push({ msg: 'Both imageURL and userId are required!' });
    }
    return errors;
}

module.exports = {validateImageURL, validateTagList, validateRequestBody}
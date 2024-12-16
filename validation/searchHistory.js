const validateRequestBody = (userId) => {
    let errors = [];

    if (userId === undefined || userId === null) {
        errors.push({ msg: 'Please provide userId' });
    }
    else if (typeof userId !== 'number' || isNaN(userId)) {
        errors.push({ msg: 'userId must be a valid number' });
    }
    else if (!Number.isInteger(userId) || userId <= 0) {
        errors.push({ msg: 'userId must be a positive integer' });
    }

    return errors;
};

module.exports = { validateRequestBody };

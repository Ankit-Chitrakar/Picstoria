const validateRequestBody = (body) => {
    const errors = [];
    if (!body.username || !body.email) {
        errors.push({ msg: 'Both username and email are required!' });
    }
    return errors;
};

const validateUsername = (username) => {
    const errors = [];
    if (!username || username.length < 5) {
        errors.push({ msg: 'Username must be at least 5 characters long!' });
    }
    return errors;
};

const validateEmail = (email) => {
    const errors = [];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
        errors.push({ msg: 'Invalid email format!' });
    }
    return errors;
};

module.exports = {
    validateRequestBody,
    validateUsername,
    validateEmail,
};

const { sequelize } = require('../models');
const { validateRequestBody, validateUsername, validateEmail} = require('../validation/user')
const {doesUserExist} = require('../utils/user')

const User = sequelize.models.users;

const createNewUser = async (req, res)=>{
    try{
        const {username, email} = req.body;

        const errors = [];
        errors.push(...validateRequestBody(req.body));
        errors.push(...validateUsername(username));
        errors.push(...validateEmail(email));

        // input validation check
        if(errors.length > 0){
            return res.status(400).json({errors});
        }

        // chcek for existing email or not
        const userExists = await doesUserExist(email);
        if(userExists){
            return res.status(400).json({errors: [{msg: "Email already exists"}]})
        }


        // all are fine now create user
        const newUser = await User.create({username: username, email: email});
        res.status(201).json({
            msg: "User created successfully!!",
            user: newUser,
        });

    }catch(err){
        console.error("Error creating user:", err);

        if(err.message.includes("Error checking user existence")){
            return res.status(500).json({errors: [{msg: "Server error when finding user"}]})
        }

        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {createNewUser};
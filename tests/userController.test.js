const { createNewUser } = require('../controllers/userController');
const { sequelize } = require('../models');
const { doesUserExist } = require('../utils/user');

// Mock models and utilities
jest.mock('../models', () => ({
    sequelize: {
        models: {
            users: {
                findOne: jest.fn(),
                create: jest.fn(),
            },
        },
    },
}));
jest.mock('../utils/user', () => ({
    doesUserExist: jest.fn(),
}));

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks(); // Restore console.error
    });

    it('should create a new user successfully', async () => {
        req.body = {
            username: 'testuser',
            email: 'test@example.com',
        };
        doesUserExist.mockResolvedValue(false);
        sequelize.models.users.create.mockResolvedValue({
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
        });

        await createNewUser(req, res);

        expect(doesUserExist).toHaveBeenCalledWith('test@example.com');
        expect(sequelize.models.users.create).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'User created successfully!!',
            user: expect.objectContaining({
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
            }),
        });
    });

    it('should return error for invalid input', async () => {
        req.body = {
            username: 'test',
            email: 'invalid-email',
        };

        await createNewUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Username must be at least 5 characters long!',
                }),
                expect.objectContaining({
                    msg: 'Invalid email format!',
                }),
            ]),
        });
    });

    it('should return error if user already exists', async () => {
        req.body = {
            username: 'existinguser',
            email: 'existing@example.com',
        };
        doesUserExist.mockResolvedValue(true);

        await createNewUser(req, res);

        expect(doesUserExist).toHaveBeenCalledWith('existing@example.com');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: 'Email already exists' }],
        });
    });

    it('should handle server error when checking user existence', async () => {
        req.body = {
            username: 'testuser',
            email: 'test@example.com',
        };
        doesUserExist.mockRejectedValue(new Error('Database error'));

        await createNewUser(req, res);

        expect(doesUserExist).toHaveBeenCalledWith('test@example.com');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Internal server error',
        });
    });

    it('should handle server error when creating user', async () => {
        req.body = {
            username: 'testuser',
            email: 'test@example.com',
        };
        doesUserExist.mockResolvedValue(false);
        sequelize.models.users.create.mockRejectedValue(new Error('Error creating user'));

        await createNewUser(req, res);

        expect(doesUserExist).toHaveBeenCalledWith('test@example.com');
        expect(sequelize.models.users.create).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

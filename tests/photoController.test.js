// Mock the entire models module
jest.mock('../models', () => ({
    Photo: {
        create: jest.fn(),
        findAll: jest.fn(),
    },
    Tag: {
        bulkCreate: jest.fn(),
    },
}));

// Mock the user utility
jest.mock('../utils/user', () => ({
    doesUserExistById: jest.fn(),
}));

const { photoController } = require('../controllers/photoController');
const { doesUserExistById } = require('../utils/user');
const { Photo, Tag } = require('../models');

describe('Photo Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Suppress console.error during tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks(); // Restore console.error after tests
    });

    it('should create a photo successfully', async () => {
        req.body = {
            imageURL: 'https://images.unsplash.com/photo',
            description: 'Test Description',
            altDescription: 'Test Alt Description',
            tagList: ['tag1', 'tag2'],
            userId: 1,
        };

        doesUserExistById.mockResolvedValue(true);
        Photo.create.mockResolvedValue({
            id: 1,
            ...req.body,
        });
        Tag.bulkCreate.mockResolvedValue([]);

        await photoController(req, res);

        expect(doesUserExistById).toHaveBeenCalledWith(1);
        expect(Photo.create).toHaveBeenCalledWith({
            imageURL: 'https://images.unsplash.com/photo',
            description: 'Test Description',
            altDescription: 'Test Alt Description',
            tagList: ['tag1', 'tag2'],
            userId: 1,
        });
        expect(Tag.bulkCreate).toHaveBeenCalledWith([
            { name: 'tag1', photoId: 1 },
            { name: 'tag2', photoId: 1 },
        ]);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Photo created successfully!!',
            photo: expect.objectContaining({
                id: 1,
                imageURL: 'https://images.unsplash.com/photo',
                description: 'Test Description',
                altDescription: 'Test Alt Description',
                tagList: ['tag1', 'tag2'],
                userId: 1,
            }),
        });
    });

    it('should handle server error when creating photo', async () => {
        req.body = {
            imageURL: 'https://images.unsplash.com/photo',
            description: 'Test Description',
            altDescription: 'Test Alt Description',
            tagList: ['tag1', 'tag2'],
            userId: 1,
        };

        doesUserExistById.mockResolvedValue(true);
        Photo.create.mockRejectedValue(new Error('Error creating photo'));

        await photoController(req, res);

        expect(doesUserExistById).toHaveBeenCalledWith(1);
        expect(Photo.create).toHaveBeenCalledWith(expect.objectContaining(req.body));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

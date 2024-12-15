module.exports = (sequelize, DataTypes) => {
    const Photo = sequelize.define(
        'Photo',
        {
            imageURL: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
            altDescription: {
                type: DataTypes.STRING,
            },
            dateSaved: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            tagList: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            }
        },
        {
            tableName: 'photos',
        }
    );

    Photo.associate = (models) => {
        Photo.hasMany(models.Tag, {
            foreignKey: 'photoId',
            as: 'photoTags',
            onDelete: 'CASCADE',
        });
    };

    return Photo;
};

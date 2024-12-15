module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define(
        'Tag',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            photoId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'photos',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
        },
        {
            tableName: 'tags',
        }
    );

    Tag.associate = (models) => {
        Tag.belongsTo(models.Photo, {
            foreignKey: 'photoId',
            as: 'photo',
        });
    };

    return Tag;
};

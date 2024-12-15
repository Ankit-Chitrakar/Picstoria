module.exports = (sequelize, DataTypes) => {
    const SearchHistory = sequelize.define('serachHistories', {
        query: DataTypes.STRING,
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            onDELETE: 'CASCADE',
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    })

    return SearchHistory;
}
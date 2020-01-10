module.exports = function (sequelize, DataTypes) {
    var Mood = sequelize.define("Mood", {
        mood: DataTypes.STRING,
        genre_id: DataTypes.STRING,
        createdAt: {type: DataTypes.DATE, defaultValue: sequelize.NOW},
        updatedAt: {type: DataTypes.DATE, defaultValue: sequelize.NOW}
    });
    return Mood;
};

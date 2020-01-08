module.exports = function (sequelize, DataTypes) {
    var Mood = sequelize.define("Mood", {
        mood: DataTypes.STRING,
        genre_ids: DataTypes.STRING
    });
    return Mood;
};

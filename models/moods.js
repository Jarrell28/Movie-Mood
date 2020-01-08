module.exports = function (sequelize, DataTypes) {
    var Mood = sequelize.define("Mood", {
        mood: DataTypes.STRING,
        genre_id: DataTypes.STRING
    });
    return Mood;
};

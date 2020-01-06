module.exports = function (sequelize, DataTypes) {
    var Mood = sequelize.define("Mood", {
        mood: DataTypes.STRING,
<<<<<<< HEAD
        genre_id: DataTypes.STRING
=======
        genre_ids: DataTypes.STRING
>>>>>>> 4ac2b87fc500c487f458d32b4826380abe01f342
    });
    return Mood;
};

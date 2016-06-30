'use strict';
module.exports = function(sequelize, DataTypes) {
  var favorites = sequelize.define('favorites', {
    userId: DataTypes.INTEGER,
    runId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.favorites.belongsTo(models.run);
        models.favorites.belongsTo(models.user);
      }
    }
  });
  return favorites;
};

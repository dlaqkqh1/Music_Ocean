/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('charts', {
    _id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    month: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    week: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ranking: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    site: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    song_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'charts'
  });
};

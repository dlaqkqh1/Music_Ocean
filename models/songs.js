/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('songs', {
    _id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    song_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      unique: true
    },
    site: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    artist: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    album: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    genre: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    playtime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    like_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    reply_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    lyric: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ulike: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'songs'
  });
};

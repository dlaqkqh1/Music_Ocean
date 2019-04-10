const express = require('express');
const router = express.Router();
const fs = require('fs');
const mysql = require('mysql');

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '0000',
	database: 'music_ocean'
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});

router.get('/', (req, res, next) => {
	fs.readFile('views/index.html', (err, data) => {
		if (err) {
			console.log(err);
			next(err);
		}
		res.end(data);
	});
});

router.get('/about', (req, res, next) => {
	fs.readFile('views/about.html', (err, data) => {
		if (err) {
			console.log(err);
			next(err);
		}
		res.end(data);
	});
});

router.get('/contact', (req, res, next) => {
	fs.readFile('views/contact.html', (err, data) => {
		if (err) {
			console.log(err);
			next(err);
		}
		res.end(data);
	});
});

router.get('/login', (req, res, next) => {
	fs.readFile('views/login.html', (err, data) => {
		if (err) {
			console.log(err);
			next(err);
		}
		res.end(data);
	});
});

router.get('/register', (req, res, next) => {
	fs.readFile('views/register.html', (err, data) => {
		if (err) {
			console.log(err);
			next(err);
		}
		res.end(data);
	});
});

router.get('/search', (req, res, next) => {
	var site = req.param('site');
	var topic = req.param('topic');
	if (site == '멜론 차트') {
		site = 'melon';
	} else {
		site = 'bugs';
	}
	if (topic == 'TOP 50위에 가장 많이 든 곡은?') {
		var q = "select title, artist, album, count(*) as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and s.site = '"+site+"' group by album, title order by 4 desc limit 10";
			con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: site,
				option:1,
				field : 'TOP50안에 든 횟수',
				cell:'TOP50 횟수'
			});
		});
	}
	else if (topic == 'TOP 50위에 가장 많이 든 아티스트는?') {
		var q = "select s.artist as title, count(*) as count from songs s, charts c where s.song_id = c.song_id and c.site = s.site and s.site = '" + site + "' group by s.artist order by 2 desc limit 10";
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: site,
				option:2,
				field : 'TOP50안에 든 횟수',
				cell:'TOP50 횟수'
			});

		});
	}
	else if (topic == '1위 횟수가 가장 많은 곡은?') {
		var q = "select title, artist, album, count(*) as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and ranking = 1 and s.site = '" + site + "' group by album, title order by 4 desc limit 10"
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: site,
				option:1,
				field : '1위 횟수',
				cell:'1위 횟수'
			});
		});
	}
	else if (topic == '1위 횟수가 가장 많은 아티스트는?') {
		var q = "select artist as title, count(*) as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and ranking = 1 and s.site = '" + site + "' group by album, title order by 2 desc limit 10"
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: site,
				option:2,
				field : '1위 횟수',
				cell:'1위 횟수'
			});
		});
	}
	else if (topic == '1위 횟수가 가장 많은 장르는?') {
		var q = "select genre as title, count(*) as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and ranking = 1 and s.site = 'melon' group by genre order by 2 desc limit 10"
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: 'melon',
				option:2,
				field : '1위 횟수',
				cell:'1위 횟수'
			});
		});
	}
	else if (topic == '1위 곡 중 노래 길이가 가장 긴 곡은?') {
		var q = "select title, artist, album, playtime as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and ranking = 1 and s.site = 'bugs' group by album, title order by 4 desc limit 10"
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: 'bugs',
				option:1,
				field : '노래길이',
				cell:'노래 길이'
			});
		});
	}
	else if (topic == '1위 곡 중 노래 길이가 가장 짧은 곡은?') {
		var q = "select title, artist, album, playtime as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and ranking = 1 and s.site = 'bugs' group by album, title order by 4 limit 10"
		con.query(q, function (err, result, fields) {
			console.log(result)
			res.render('search', {
				result: result,
				topic: topic,
				site: 'bugs',
				option:1,
				field : '노래 길이',
				cell:'노래 길이'
			});
		});
	}
	else if (topic == 'TOP 50위에 가장 많은 든 장르는?') {
		var q = "select genre as title, count(*) as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and s.site = 'melon' group by genre order by 2 desc limit 10"
		con.query(q, function (err, result, fields) {
			console.log(result)
			res.render('search', {
				result: result,
				topic: topic,
				site: 'melon',
				option:2,
				field : '50위 안에 든 횟수',
				cell:'TOP50 횟수'
			});
		});
	}
	else if (topic == '1위 횟수가 가장 많은 장르는?') {
		var q = "select genre as title, count(*) as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and ranking = 1 and s.site = 'melon' group by genre order by 2 desc limit 10"
		con.query(q, function (err, result, fields) {
			console.log(result)
			res.render('search', {
				result: result,
				topic: topic,
				site: 'melon',
				option:2,
				field : '1위 횟수',
				cell:'1위 횟수'
			});
		});
	}
	else if (topic == '좋아요가 가장 많은 곡은?') {
		var q = "select title, artist, album, like_num as count from songs where site = '" + site + "' order by 4 desc limit 10"
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: site,
				option:1,
				field : '좋아요 수',
				cell:'좋아요 수'
			});
		});
	}
	else if (topic == '댓글이 가장 많은 곡은?') {
		var q = "select title, artist, album, reply_num as count from songs where site = '" + site + "' order by 4 desc limit 10"
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: site,
				option:1,
				field : '댓글 수',
				cell:'댓글 수'
			});
		});
	}
	else if (topic == 'TOP 50위에 든 곡 중 가장 긴 곡은?') {
		var q = "select title, artist, album, playtime as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and s.site = 'bugs' group by album, title order by 4 desc limit 10"
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: 'bugs',
				option:1,
				field : '댓글 수',
				cell:'노래 길이'
			});
		});
	}
	else if (topic == 'TOP 50위에 든 곡 중 가장 짧은 곡은?') {
		var q = "select title, artist, album, playtime as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and s.site = 'bugs' group by album, title order by 4 limit 10"
		con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: 'bugs',
				option:1,
				field : '댓글 수',
				cell:'노래 길이'
			});
		});
	}
	else{
		var q = "select title, artist, album, count(*) as count from songs s, charts c where s.song_id = c.song_id and s.site = c.site and s.site = 'melon' group by album, title order by 4 desc limit 10";
			con.query(q, function (err, result, fields) {
			res.render('search', {
				result: result,
				topic: topic,
				site: site,
				option:1,
				field : 'TOP50안에 든 횟수',
				cell:'TOP50 횟수'
			});
		});
	}
});

router.get('/gsm', (req, res, next) => {
	var like = req.param('like');
	var title = req.param('title');
	var album = req.param('album');
	like = Number(like);
	var q = "update songs set ulike = " + (like + 1) + " where title = '" + title + "' and album = '" + album + "'";
	con.query(q, function (err, result, fields) {});
	var q = "select title, artist, album, ulike from songs group by album, title order by ulike desc, like_num desc limit 100"
	con.query(q, function (err, result, fields) {
		res.render('gsm', {
			result: result
		});
	});
});


router.get('/analyze', (req, res, next) => {
	var title = req.param('search');
	var album = req.param('album');
	var melon = "select year, month, week, ranking, s.site as site from charts c, songs s where c.song_id = s.song_id and c.site = s.site and s.site = 'melon' and s.album = '" + album + "' and title = '" + title + "' order by year, month, week";
	var bugs = "select year, month, week, ranking, s.site as site from charts c, songs s where c.song_id = s.song_id and c.site = s.site and s.site = 'bugs' and s.album = '" + album + "' and title = '" + title + "' order by year, month, week";
	var mnames = [];
	var bnames = [];
	var mlength = 0;
	var blength = 0;
	var mvalue = [];
	var bvalue = [];
	var temp = [];
	con.query(melon, function (err, result, fields) {
		mlength = result.length;
		for (var i = 0; i < mlength; i++) {
			mnames.push(result[i].year.substring(2, 4) + result[i].month.substring(0, 2) + '-' + result[i].week);
			mvalue.push(result[i].ranking * -1);
		}
		con.query(bugs, function (err, result, fields) {
			blength = result.length;
			for (var i = 0; i < blength; i++) {
				bnames.push(result[i].year.substring(2, 4) + result[i].month.substring(0, 2) + '-' + result[i].week);
				bvalue.push(result[i].ranking * -1);
			}
			var check = 0;
			if (blength > mlength) {
				check = 1;
				var temp = mnames;
				mnames = bnames;
				bnames = temp;

				var temp1 = mlength;
				mlength = blength;
				blength = temp1;

				var temp2 = mvalue;
				mvalue = bvalue;
				bvalue = temp2;
			}
			var names = [];
			if (mlength > 12) {
				var temp = [];
				var interval = mlength / 12;
				var index = 0;
				for (var i = 0; i < 12; i++) {
					var temp1 = Math.floor(index);
					names.push(mnames[temp1]);
					temp.push(mvalue[temp1]);
					index += interval;
				}
				mvalue = temp;
				temp = [];
			} else {
				names = mnames;
			}
			temp = [];
			for (var i = 0; i < names.length; i++) {
				for (var j = 0; j < blength; j++) {
					if (names[i] == bnames[j]) {
						temp.push(bvalue[j]);
						break;
					}
				}
				if (temp.length == i)
					temp.push(-51);
			}
			bvalue = temp;
			if (check == 1) {
				var temp = mnames;
				mnames = bnames;
				bnames = temp;

				var temp1 = mlength;
				mlength = blength;
				blength = temp;

				var temp2 = mvalue;
				mvalue = bvalue;
				bvalue = temp2;
			}
			var q1 = "select count(*) as count, s.site as site from charts c, songs s where s.song_id = c.song_id and s.site = c.site and s.album = '" + album + "' and title = '" + title + "' and ranking = 1 group by s.site order by s.site";
			var q2 = "select count(*) as count, s.site as site from charts c, songs s where s.song_id = c.song_id and s.site = c.site and s.album = '" + album + "' and title = '" + title + "' group by s.site order by s.site";
			var q3 = "select count(*) as count, s.site as site, artist from charts c, songs s where s.song_id = c.song_id and s.site = c.site and ranking = 1 and s.album = '" + album + "' and title = '" + title + "' group by s.site, artist order by 1 desc;";
			var q4 = "select count(*) as count, s.site as site, artist from charts c, songs s where s.song_id = c.song_id and s.site = c.site and s.album = '" + album + "' and title = '" + title + "' group by s.site, artist order by 2";
			var q5 = "select like_num as 'like', site from songs where album = '" + album + "' and title = '" + title + "' group by site order by 2";
			var q6 = "select reply_num as reply, site from songs where album = '" + album + "' and title = '" + title + "' group by site order by 2";
			con.query(q1, function (err, result, fields) {
				var mrank1 = 0;
				var brank1 = 0;
				if (result.length == 1) {
					if (result[0].site == 'bugs')
						brank1 = result[0].count;
					else
						mrank1 = result[0].count;
				} else if (result.length == 2) {
					brank1 = result[0].count;
					mrank1 = result[1].count;
				}
				con.query(q2, function (err, result, fields) {
					var mrank50 = 0;
					var brank50 = 0;
					if (result.length == 1) {
						if (result[0].site == 'bugs')
							brank50 = result[0].count;
						else
							mrank50 = result[0].count;
					} else if (result.length == 2) {
						brank50 = result[0].count;
						mrank50 = result[1].count;
					}
					console.log(result);
					con.query(q3, function (err, result, fields) {
						var martist1 = 0;
						var bartist1 = 0;
						if (result.length == 1) {
							if (result[0].site == 'bugs')
								bartist1 = result[0].count;
							else
								martist1 = result[0].count;
						} else if (result.length == 2) {
							bartist1 = result[0].count;
							martist1 = result[1].count;
						}
						con.query(q4, function (err, result, fields) {
							var martist50 = 0;
							var bartist50 = 0;
							if (result.length == 1) {
								if (result[0].site == 'bugs')
									bartist50 = result[0].count;
								else
									martist50 = result[0].count;
							} else if (result.length == 2) {
								bartist50 = result[0].count;
								martist50 = result[1].count;
							}
							con.query(q5, function (err, result, fields) {
								console.log(q5);
								var blike = 0;
								var mlike = 0;
								if (result.length == 1) {
									if (result[0].site == 'bugs')
										blike = result[0].like;
									else
										mlike = result[0].like;
								} else if (result.length == 2) {
									blike = result[0].like;
									mlike = result[1].like;
								}
								con.query(q6, function (err, result, fields) {
									console.log(q6);
									var mreply = 0;
									var breply = 0;
									if (result.length == 1) {
										if (result[0].site == 'bugs')
											breply = result[0].reply;
										else
											mreply = result[0].reply;
									} else if (result.length == 2) {
										breply = result[0].reply;
										mreply = result[1].reply;
									}
									res.render('analyze', {
										martist1: martist1,
										bartist1: bartist1,
										martist50: martist50,
										bartist50: bartist50,
										mlike: mlike,
										blike: blike,
										mreply: mreply,
										breply: breply,
										mrank1: mrank1,
										brank1: brank1,
										mrank50: mrank50,
										brank50: brank50,
										title: title,
										names: names,
										length: names.length,
										values1: mvalue,
										values2: bvalue
									});
								});
							});
						});
					});
				});
			});
		});
	});
});


router.get('/search_2', (req, res, next) => {
	var title = req.param('search');
	var album = req.param('album');
	var like = req.param('like');
	var word = req.param('word');
	like = Number(like);
	if (like >= 0) {
		var q = "update songs set ulike = " + (like + 1) + " where title = '" + title + "' and album = '" + album + "'";
		con.query(q, function (err, result, fields) {});
		con.query("select title, artist, album, ulike from songs where title like '%" + word + "%' or artist like '%" + word + "%' group by album, title order by like_num desc limit 10", function (err, result, fields) {
			var length = result.length;
			res.render('search_2', {
				result: result,
				length: length,
				id: word
			});
			if (err) throw err;
		});
	} else {
		con.query("select title, artist, album, ulike from songs where title like '%" + title + "%' or artist like '%" + title + "%' group by album, title order by like_num desc limit 10", function (err, result, fields) {
			var length = result.length;
			if (result.length == 10)
				length = 10;

			res.render('search_2', {
				result: result,
				length: length,
				id: title
			});
			if (err) throw err;
		});
	}
});

module.exports = router;

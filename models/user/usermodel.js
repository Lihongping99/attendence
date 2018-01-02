var db = require('../dboperation');

module.exports = {
  // 员工登录
  selectUser: function(account, callback) {
    var sql = "select * from user where account = ?;";
    db.exec(sql, account, function(err, rows) {
      if (err) {
        callback(err);
      }
      callback(err, rows);
    });
  },
  // 查询员工今天是否签到
  isTodaySign: function(nowdate, userid, callback) {
    var sql = "select * from qiandao where ( datediff ( qiandaotime , '" + nowdate + "' ) = 0 ) and user_id = ?;";
    db.exec(sql, userid, function(err, rows) {
      if (err) {
        callback(err);
      }
      callback(err, rows);
    });
  },
  // 获取员工上下班时间
  getUpOrDownTime: function(userid, callback) {
    var sql = "select shangban, xiaban from user where id = ?;";
    db.exec(sql, userid, function(err, rows) {
      if (err) {
        callback(err);
      }
      callback(err, rows);
    });
  },
  // 员工签到
  userSign: function(user_id, qiandaodidian, chidao, callback) {
    var sql = "insert into qiandao(user_id, qiandaotime, shenhe, qiandaodidian, chidao) values(?,now(),0,?,?);";
		db.exec(sql, [user_id, qiandaodidian, chidao], function(err) {
			if (err) {
				callback(err);
			}
			callback(err);
		});
  },
  // 员工签退
  userSignOut: function(qiantuididian, zaotui, id, callback) {
    var sql = "update qiandao set qiantuitime = now(), shenhe = 0, qiantuididian = ?, zaotui = ? where id = ?;";
		db.exec(sql, [qiantuididian, zaotui, id], function(err) {
			if (err) {
				callback(err);
			}
			callback(err);
		});
  },
  // 获取员工签到记录的页码
  getSignPage:  function(userid, callback) {
    var sql = "select ceil(count(id)/10) as page from qiandao where user_id = ?;";
    db.exec(sql, userid, function(err, rows) {
      if (err) {
        callback(err);
      }
      callback(err, rows);
    });
  },
  // 获取员工自己的签到记录
  getSignRecord: function(user_id, page, callback) {
    var sql = "select * from qiandao where user_id = ? order by qiandao.id desc limit " + page + ", 10;";
    db.exec(sql, user_id, function(err, rows) {
			if (err) {
				callback(err);
			}
			callback(err, rows);
		});
  },
  // 员工事项申请
  userDaiBan: function(user_id, shixiang, endtime, callback) {
    var sql = "insert into daiban(user_id, shixiang, endtime) values(?,?,?);";
    db.exec(sql, [user_id, shixiang, endtime], function(err) {
			if (err) {
				callback(err);
			}
			callback(err);
		});
  },
  // 获取员工待办事项的页码
  getDaiBanPage: function(userid, callback) {
    var sql = "select ceil(count(id)/10) as page from daiban where user_id = ?;";
    db.exec(sql, userid, function(err, rows) {
      if (err) {
        callback(err);
      }
      callback(err, rows);
    });
  },
  // 获取当前员工发起过的待办事项
  getDaiban: function(user_id, page, callback) {
    var sql = "select * from daiban where user_id = ? order by daiban.id desc limit " + page + ", 10;";
    db.exec(sql, user_id, function(err, rows) {
			if (err) {
				callback(err);
			}
			callback(err, rows);
		});
  },
  // 获取请假记录页码
  getQingJiaPage: function(user_id, callback) {
    var sql = "select ceil(count(id)/10) as page from qingjia where user_id = ?;";
    db.exec(sql, user_id, function(err, rows) {
      if (err) {
        callback(err);
      }
      callback(err, rows);
    });
  },
  // 获取当前员工的请假记录
  getQingJia: function(user_id, page, callback) {
    var sql = "select * from qingjia where user_id = ? order by qingjia.id desc limit " + page + ", 10;";
    db.exec(sql, user_id, function(err, rows) {
			if (err) {
				callback(err);
			}
			callback(err, rows);
		});
  },
  // 员工请假
  userQingJia: function(reason, user_id, start_time, end_time, callback) {
    var sql = "insert into qingjia(reason, user_id, start_time, end_time, shenhe) values(?,?,?,?,0);";
    db.exec(sql, [reason, user_id, start_time, end_time], function(err) {
			if (err) {
				callback(err);
			}
			callback(err);
		});
  },
  // 获取更新员工年假时间
  getNianJiaDay: function(user_id, callback) {
    var sql = "select * from user where id = ?;";
    db.exec(sql, user_id, function(err, rows) {
      if (err) {
        callback(err);
      }
      callback(err, rows);
    });
  },
  // 更新员工年假时间和请假时间
  updateNianJia: function(nianjia, qingjia, user_id, callback) {
    var sql = "update user set nianjia = ?,qingjia = qingjia + ? where id = ?;";
    db.exec(sql, [nianjia, qingjia, user_id], function(err) {
      if (err) {
        callback(err);
      }
      callback(err);
    });
  },
  // 获取原密码
  getOldPassword: function(id, callback) {
    var sql = "select * from user where id = ?;";
    db.exec(sql, id, function(err, rows) {
			if (err) {
				callback(err);
			}
			callback(err, rows);
		});
  },
  // 修改密码
  updatePassword: function(password, id, callback) {
    var sql = "update user set password = ? where id = ?;";
    db.exec(sql, [password, id], function(err) {
      if (err) {
        callback(err);
      }
      callback(err);
    });
  },
}

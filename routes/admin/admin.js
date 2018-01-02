var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var xlsx = require('node-xlsx');
var fs = require('fs');

var adminmodel = require('../../models/admin/adminmodel');

// 管理员登录页
router.get('/', function(req, res, next) {
  res.render('admin/adminlogin', {
    title: '管理员登录'
  });
});

// 管理员首页
router.get('/home', function(req, res, next) {
  res.render('admin/home', {
    title: '考勤管理系统',
    xiugaiClass: 'adminUpdatePassword'
  });
});

// 管理员登录
router.post('/login', function(req, res, next) {
  var hash = crypto.createHash('md5');
  var username = req.body.username;
  var reqpassword = req.body.password;
  hash.update(reqpassword);
  var password = hash.digest('hex');
  adminmodel.selectAdmin(username, function(err, rows) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    if (rows.length == 0) {
      res.json({
        'error': '用户不存在'
      });
      return next(err);
    }
    if (rows[0].password != password) {
      res.json({
        'error': '密码错误'
      });
      return next(err);
    }
    req.session.name = rows[0].name;
    req.session.uid = rows[0].id;
    req.session.quanxian = rows[0].quanxian;
    res.json({
      'success': '登录成功'
    });
  });
});

// 获取员工信息
router.post('/userinfo', function(req, res, next) {
  var page = (req.body.page - 1) * 10 || 0;
  adminmodel.getbumen(function(err, bumenList) {
    if (err) {
      return next(err);
    }
    adminmodel.getZhiWei(function(err, zhiweiList) {
      if (err) {
        return next(err);
      }
      adminmodel.getUserPage(function(err, pagenum) {
        if (err) {
          return next(err);
        }
        adminmodel.getuser(page, function(err, userList) {
          for (var i = 0; i < userList.length; i++) {
            var rztime = userList[i].ruzhitime * 1000;
            var d = new Date(rztime);
            var month = d.getMonth()+1;
            if(month<9){
              month = '0'+month
            }
            var currentday = d.getDate();
            if(currentday<10){
              currentday = '0'+currentday
            }
            userList[i].ruzhitime = d.getFullYear() + '-' + month + '-' + currentday;
          }
          res.render('admin/UserInfo/_UserInfo', {
            bumenList: bumenList,
            zhiweiList: zhiweiList,
            pagenum: pagenum[0],
            userList: userList
          }, function(err, html) {
            res.json({
              'success': true,
              'view': html
            });
          });
        });
      });
    });
  });
});

// 获取其他页员工信息
router.post('/pageuserinfo', function(req, res, next) {
  var page = (req.body.page - 1) * 10;
  adminmodel.getuser(page, function(err, userList) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    res.json({
      'success': true,
      'result': userList
    });
  });
});

// 部门管理
router.post('/bumenmanage', function(req, res, next) {
  adminmodel.getbumen(function(err, rows) {
    if (err) {
      return next(err);
    }
    res.render('admin/BuMen/_BuMenManage', {
      bumenList: rows
    }, function(err, html) {
      res.json({
        'success': true,
        'view': html
      });
    });
  });
});

// 添加部门
router.post('/addbumen', function(req, res, next) {
  var name = req.body.name;
  adminmodel.addbumen(name, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next();
    }
    res.json({
      'success': '添加部门成功'
    });
  });
});

// 修改部门名称
router.post('/updatebumen', function(req, res, next) {
  var bumenid = req.body.bumenid;
  var name = req.body.name;
  adminmodel.updateBuMenName(name, bumenid, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next();
    }
    res.json({
      'success': '修改部门名称成功'
    });
  });
});

// 添加员工
router.post('/adduser', function(req, res, next) {
  var hash = crypto.createHash('md5');
  var account = req.body.account;
  var reqpassword = req.body.password;
  hash.update(reqpassword);
  var password = hash.digest('hex');
  var gonghao = req.body.gonghao;
  var name = req.body.name;
  var bumen = req.body.bumen;
  var zhiwei = req.body.zhiwei;
  var sex = req.body.sex;
  var age = req.body.age;
  var ruzhitime = req.body.ruzhitime;
  var shangban = req.body.shangban;
  var xiaban = req.body.xiaban;
  adminmodel.adduser(account, password, gonghao, name, bumen, zhiwei, sex, age, ruzhitime, shangban, xiaban, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next();
    }
    res.json({
      'success': '添加员工成功'
    });
  });
});

// 删除员工
router.post('/deleteuser', function(req, res, next) {
  var userId = req.body.userId;
  adminmodel.deleteuser(userId, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    res.json({
      'success': '删除成功'
    });
  });
});

// 获取修改员工信息页面
router.post('/getEditUserInfoFrame', function(req, res, next) {
  var userId = req.body.userId;
  adminmodel.getbumen(function(err, bumenList) {
    if (err) {
      return next(err);
    }
    adminmodel.getZhiWei(function(err, zhiweiList) {
      if (err) {
        return next(err);
      }
      adminmodel.getThisUser(userId, function(err, userItem) {
        if (err) {
          return next(err);
        }
        res.render('admin/UserInfo/_EditUserInfo', {
          bumenList: bumenList,
          zhiweiList: zhiweiList,
          userItem: userItem[0]
        }, function(err, html) {
          res.json({
            'success': true,
            'view': html
          });
        });
      });
    });
  });
});

// 修改员工信息
router.post('/EditUserInfo', function(req, res, next) {
  var userid = req.body.userid;
  var account = req.body.account;
  var gonghao = req.body.gonghao;
  var name = req.body.name;
  var bumen = req.body.bumen;
  var zhiwei = req.body.zhiwei;
  var sex = req.body.sex;
  var age = req.body.age;
  adminmodel.editUserInfo(account, gonghao, name, bumen, zhiwei, sex, age, userid, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    res.json({
      'success': '修改员工信息成功'
    });
  })
});

// 重置密码为123
router.post('/reUserPassword', function(req, res, next) {
  var hash = crypto.createHash('md5');
  var userid = req.body.userid;
  var reqpassword = '123';
  hash.update(reqpassword);
  var password = hash.digest('hex');
  adminmodel.reUserPassword(password, userid, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    res.json({
      'success': '重置密码成功'
    });
  })
});

// 职位管理界面
router.post('/getZhiWei', function(req, res, next) {
  adminmodel.getZhiWei(function(err, zhiweiList) {
    if (err) {
      return next(err);
    }
    res.render('admin/ZhiWei/_ZhiWei', {
      zhiweiList: zhiweiList
    }, function(err, html) {
      res.json({
        'success': true,
        'view': html
      });
    });
  });
});

// 添加职位
router.post('/addzhiwei', function(req, res, next) {
  var name = req.body.name;
  adminmodel.addzhiwei(name, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next();
    }
    res.json({
      'success': '添加职位成功'
    });
  });
});

// 修改部门名称
router.post('/updatezhiwei', function(req, res, next) {
  var zhiweiid = req.body.zhiweiid;
  var name = req.body.name;
  adminmodel.updateZhiWeiName(name, zhiweiid, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next();
    }
    res.json({
      'success': '修改职位名称成功'
    });
  });
});

// 管理员查看员工待办事项页面
router.post('/daiBan', function(req, res, next) {
  var page = 0;
  adminmodel.getDaiBanPage(function(err, pagenum) {
    if (err) {
      return next(err);
    }
    adminmodel.getDaiBan(page, function(err, daibanList) {
      if (err) {
        return next(err);
      }
      for (var i = 0; i < daibanList.length; i++) {
        var rztime = daibanList[i].endtime * 1000;
        var d = new Date(rztime);
        daibanList[i].endtime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      }
      res.render('admin/DaiBan/_DaiBan', {
        pagenum: pagenum[0],
        daibanList: daibanList
      }, function(err, html) {
        res.json({
          'success': true,
          'view': html
        });
      });
    });
  });
});

// 获取某一页员工待办事项页面
router.post('/pageDaiBan', function(req, res, next) {
  var page = (req.body.page - 1) * 10;
  adminmodel.getDaiBan(page, function(err, daibanList) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    for (var i = 0; i < daibanList.length; i++) {
      var rztime = daibanList[i].endtime * 1000;
      var d = new Date(rztime);
      daibanList[i].endtime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    }
    res.json({
      'success': true,
      'result': daibanList
    });
  });
});

// 管理员查看员工考勤情况页面
router.post('/kaoQin', function(req, res, next) {
  res.render('admin/KaoQin/_KaoQin', {}, function(err, html) {
    res.json({
      'success': true,
      'view': html
    });
  });
});
router.post('/kaoQinCon', function(req, res, next) {
  var page = (req.body.page - 1) * 10 || 0;
  var reqnowdate;
  if (req.body.date) {
    reqnowdate = new Date(req.body.date);
  } else {
    reqnowdate = new Date();
  }
  var nowdate = reqnowdate.getFullYear() + '-' + (reqnowdate.getMonth() + 1) + '-' + reqnowdate.getDate();
  adminmodel.getDayQianDaoPage(nowdate, function(err, pagenum) {
    if (err) {
      return next(err);
    }
    adminmodel.getDayQianDaoInfo(nowdate, page, function(err, kaoqinList) {
      if (err) {
        return next(err);
      }
      for (var i = 0; i < kaoqinList.length; i++) {
        var rztime = kaoqinList[i].qiandaotime;
        var rztime1 = kaoqinList[i].qiantuitime;
        var d = new Date(rztime);
        var d1 = new Date(rztime1);
        kaoqinList[i].qiandaotime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        kaoqinList[i].qiantuitime = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate() + ' ' + d1.getHours() + ':' + d1.getMinutes() + ':' + d1.getSeconds();
      }
      res.render('admin/KaoQin/_KaoQinCon', {
        pagenum: pagenum[0],
        kaoqinList: kaoqinList
      }, function(err, html) {
        res.json({
          'success': true,
          'view': html
        });
      });
    });
  });
});

// 审核考勤
router.post('/examineQianDao', function(req, res, next) {
  var kaoqinid = req.body.kaoqinid;
  adminmodel.examineQianDao(kaoqinid, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    res.json({
      'success': '该条考勤已通过审核~'
    });
  });
});

// 获取迟到界面
router.post('/ChiDao', function(req, res, next) {
  adminmodel.getAllUser(function(err, userList) {
    if (err) {
      return next(err);
    }
    res.render('admin/KaoQin/_ChiDao', {
      userList: userList
    }, function(err, html) {
      res.json({
        'success': true,
        'view': html
      });
    });
  });
});
router.post('/ChiDaoCon', function(req, res, next) {
  var page = (req.body.page - 1) * 10 || 0;
  var userid = req.body.userid;
  adminmodel.getUserChiDaoPage(userid, function(err, pagenum) {
    if (err) {
      return next(err);
    }
    adminmodel.getUserChiDao(userid, page, function(err, chidaoList) {
      if (err) {
        return next(err);
      }
      for (var i = 0; i < chidaoList.length; i++) {
        var rztime = chidaoList[i].qiandaotime;
        var d = new Date(rztime);
        chidaoList[i].qiandaotime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      }
      res.render('admin/KaoQin/_ChiDaoCon', {
        pagenum: pagenum[0],
        chidaoList: chidaoList
      }, function(err, html) {
        res.json({
          'success': true,
          'view': html
        });
      });
    });
  });
});

// 生成考勤报表
router.post('/xlsx', function(req, res, next) {
  var reqnowdate = new Date(req.body.datetime);
  var datetime = reqnowdate.getFullYear() + '-' + (reqnowdate.getMonth() + 1) + '-' + reqnowdate.getDate();
  adminmodel.getAllQianDao(datetime, function(err, rows) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    if (rows.length == 0) {
      res.json({
        'error': '您选择的日期没有考勤记录，不能生成考勤报表！'
      });
      return next(err);
    }
    var data = [
      ['员工', '签到时间', '签到地点', '是否迟到', '签退时间', '签退地点', '早退情况']
    ];
    for (var i = 0; i < rows.length; i++) {
      var qiandaotime = rows[i].qiandaotime;
      var d = new Date(qiandaotime);
      rows[i].qiandaotime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      var qiantuitime = rows[i].qiantuitime;
      var d1 = new Date(qiantuitime);
      rows[i].qiantuitime = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate() + ' ' + d1.getHours() + ':' + d1.getMinutes() + ':' + d1.getSeconds();
      if (rows[i].chidao == 1) {
        rows[i].chidao = '未迟到';
      } else {
        rows[i].chidao = '迟到'+(d.getHours()-9)+'时'+d.getMinutes()+'分';
      }
    }
    for (var i in rows) {
      var arr = [];
      var value = rows[i];
      arr.push(value.username);
      arr.push(value.qiandaotime);
      arr.push(value.qiandaodidian);
      arr.push(value.chidao);
      if (value.qiantuididian == null) {
        arr.push('未签退');
        arr.push('未签退');
        arr.push('未签退');
      } else {
        arr.push(value.qiantuitime);
        arr.push(value.qiantuididian);
        arr.push(value.zaotui);
      }
      data.push(arr);
    }
    var buffer = xlsx.build([{
      name: 'sheel1',
      data: data
    }]);
    var dirList = fs.readdirSync('./public/xlsx');
    dirList.forEach(function(fileName) {
      fs.unlinkSync('./public/xlsx/' + fileName);
    });
    fs.writeFileSync('./public/xlsx/' + datetime + '考勤报表.xlsx', buffer, {
      'flag': 'w'
    });
    res.json({
      'success': '生成考勤报表成功！',
      'result': '/xlsx/' + datetime + '考勤报表.xlsx'
    });
  });
});

// 管理员查看员工请假记录页面
router.post('/qingJia', function(req, res, next) {
  var page = 0;
  adminmodel.getQingJiaPage(function(err, pagenum) {
    if (err) {
      return next(err);
    }
    adminmodel.getQingJia(page, function(err, qingjiaList) {
      if (err) {
        return next(err);
      }
      for (var i = 0; i < qingjiaList.length; i++) {
        var rztime = qingjiaList[i].start_time * 1000;
        var rztime2 = qingjiaList[i].end_time * 1000;
        var d = new Date(rztime);
        var d2 = new Date(rztime2);
        qingjiaList[i].start_time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        qingjiaList[i].end_time = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate() + ' ' + d2.getHours() + ':' + d2.getMinutes() + ':' + d2.getSeconds();
      }
      res.render('admin/QingJia/_QingJia', {
        pagenum: pagenum[0],
        qingjiaList: qingjiaList
      }, function(err, html) {
        res.json({
          'success': true,
          'view': html
        });
      });
    });
  });
});

// 审核请假
router.post('/examineQingJia', function(req, res, next) {
  var qingjiaid = req.body.qingjiaid;
  adminmodel.examineQingJia(qingjiaid, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    res.json({
      'success': '该条请假已通过审核~'
    });
  });
});

// 修改密码
router.post('/updatePassword', function(req, res, next) {
  var hash = crypto.createHash('md5');
  var hash1 = crypto.createHash('md5');
  var userid = req.session.uid;
  var reqpassword = req.body.password;
  var reqoldPassword = req.body.oldpassword;
  hash.update(reqpassword);
  hash1.update(reqoldPassword);
  var password = hash.digest('hex');
  var oldpassword = hash1.digest('hex');
  adminmodel.getOldPassword(userid, function(err, rows) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    if (oldpassword != rows[0].password) {
      res.json({
        'error': '请输入正确的原密码!'
      });
      return next(err);
    }
    adminmodel.updatePassword(password, userid, function(err) {
      if (err) {
        res.json({
          'error': err
        });
        return next(err);
      }
      res.json({
        'success': '修改密码成功'
      });
    });
  });
});

// 管理员列表界面
router.post('/adminList', function(req, res, next) {
  adminmodel.getAdmin(function(err, rows) {
    res.render('admin/Admin/_AdminList', {
      adminList: rows
    }, function(err, html) {
      res.json({
        'success': true,
        'view': html
      });
    });
  });
});

// 添加管理员modal
router.post('/addAdminModal', function(req, res, next) {
  res.render('admin/Admin/_AddAdmin', {}, function(err, html) {
    res.json({
      'success': true,
      'view': html
    });
  });
});

// 添加管理员
router.post('/addAdmin', function(req, res, next) {
  var hash = crypto.createHash('md5');
  var account = req.body.account;
  var reqpassword = req.body.password;
  hash.update(reqpassword);
  var password = hash.digest('hex');
  var name = req.body.name;
  var sex = req.body.sex;
  var quanxian = req.body.quanxian;
  adminmodel.addAdmin(account, password, name, sex, quanxian, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    res.json({
      'success': '添加管理员成功'
    });
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();

var crypto = require('crypto');

var usermodel = require('../models/user/usermodel');

router.get('/', function(req, res, next) {
  res.render('user/userlogin', {
    title: '员工登录'
  });
});

// 登录
router.post('/login', function(req, res, next) {
  var hash = crypto.createHash('md5');
  var account = req.body.username;
  var reqpassword = req.body.password;
  hash.update(reqpassword);
  var password = hash.digest('hex');
  usermodel.selectUser(account, function(err, rows) {
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
    res.json({
      'success': '登录成功'
    });
  });
});

// 员工首页
router.get('/home', function(req, res, next) {
  res.render('user/home', {
    title: '员工首页',
    xiugaiClass: 'userUpdatePassword'
  });
});

// 员工签到页面
router.post('/userSignView', function(req, res, next) {
  var page = (req.body.page - 1) * 10 || 0;
  var userid = req.session.uid;
  usermodel.getSignPage(userid, function(err, pagenum) {
    if (err) {
      return next(err);
    }
    usermodel.getSignRecord(userid, page, function(err, signList) {
      if (err) {
        return next(err);
      }
      for (var i = 0; i < signList.length; i++) {
        var rztime = signList[i].qiandaotime;
        var rztime1 = signList[i].qiantuitime;
        var d = new Date(rztime);
        var month = d.getMonth()+1;
        if(month<9){
          month = '0'+month
        }
        var currentday = d.getDate();
        if(currentday<10){
          currentday = '0'+currentday
        }
        var d1 = new Date(rztime1);
        var month1 = d1.getMonth()+1;
        if(month1<9){
          month1 = '0'+month1
        }
        var currentday1 = d1.getDate();
        if(currentday1<10){
          currentday1 = '0'+currentday1
        }
        signList[i].qiandaotime = d.getFullYear() + '-' + month + '-' + currentday + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        signList[i].qiantuitime = d1.getFullYear() + '-' + month1 + '-' + currentday1 + ' ' + d1.getHours() + ':' + d1.getMinutes() + ':' + d1.getSeconds();
      }
      res.render('user/UserSign/_UserSign', {
        pagenum: pagenum[0],
        signList: signList
      }, function(err, html) {
        res.json({
          'success': true,
          'view': html
        });
      });
    });
  });
});

// 员工签到
router.post('/userSign', function(req, res, next) {
  var userid = req.session.uid;
  var qiandaodidian = req.body.qiandaodidian;
  qiandaodidian = '福建工程学院软件学院';
  var waiqin = req.body.waiqin;
  var reqnowdate = new Date();
  var nowdate1 = reqnowdate.getMonth() + 1;
  if(nowdate1<10){
    nowdate1 = '0'+nowdate1
  }
  var nowday1 = reqnowdate.getDate();
  if(nowday1<10){
    nowday1 = '0'+nowday1
  }
  var nowdate = reqnowdate.getFullYear() + '-' + (nowdate1) + '-' + nowday1;
  usermodel.isTodaySign(nowdate, userid, function(err, rows) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    if (rows.length > 0) {
      res.json({
        'error': '您今天已经签过到了，请不要重复签到！'
      });
      return next(err);
    }
    usermodel.getUpOrDownTime(userid, function(err, upOrDownTime) {
      if (err) {
        res.json({
          'error': err
        });
        return next(err);
      }
      var suctime = Date.parse(new Date(nowdate + ' ' + upOrDownTime[0].shangban + ':00')) / 1000;
      console.log(suctime);
      var nowtime = Date.parse(new Date()) / 1000;
      alert(nowtime)
      var rescon;
      var chidao;
      if (waiqin == 1) {
        rescon = '，您迟到了'+(suctime-nowtime)+'!';
        chidao = 0;
      } else {
        if (nowtime < suctime) {
          rescon = '，未迟到!';
          chidao = 1;
        } else {
          rescon = '您迟到了'+(nowtime-9)+'!';
          chidao = 0;
        }
      }
      usermodel.userSign(userid, qiandaodidian, chidao, function(err) {
        if (err) {
          res.json({
            'error': err
          });
          return next(err);
        }
        res.json({
          'success': '签到成功' + rescon
        });
      });
    });
  });
});

// 员工签退
router.post('/userSignOut', function(req, res, next) {
  var userid = req.session.uid;
  var qiantuididian = req.body.qiantuididian;
  qiantuididian='福建工程学院软件学院'
  var weigui = req.body.weigui;
  var reqnowdate = new Date();
  var nowdate = reqnowdate.getFullYear() + '-' + (reqnowdate.getMonth() + 1) + '-' + reqnowdate.getDate();
  usermodel.isTodaySign(nowdate, userid, function(err, rows) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    if (rows.length == 0) {
      res.json({
        'error': '您今天还没有签到，请先签到！'
      });
      return next(err);
    }
    if (rows.length > 0 && rows[0].qiantuididian != null) {
      res.json({
        'error': '您今天已经签退过了，请不要重复签退！'
      });
      return next(err);
    }
    var itemid = rows[0].id;
    usermodel.getUpOrDownTime(userid, function(err, upOrDownTime) {
      if (err) {
        res.json({
          'error': err
        });
        return next(err);
      }
      var suctime = Date.parse(new Date(nowdate + ' ' + upOrDownTime[0].xiaban + ':00')) / 1000;
      var nowtime = Date.parse(new Date()) / 1000;
      var rescon;
      var zaotui;
      if (weigui == 1) {
        if (nowtime > suctime) {
          rescon = '，未早退!';
          zaotui = '成功签退';
        } else {
          rescon = '，您早退了'+(17-nowtime)+'!';
          zaotui = '早退';
        }
      } else {
        if (nowtime > suctime) {
          rescon = '，未早退!';
          zaotui = '成功签退';
        } else {
          rescon = '，您早退了'+(17-nowtime)+'!';
          zaotui = '早退';
        }
      }
      usermodel.userSignOut(qiantuididian, zaotui, itemid, function(err) {
        if (err) {
          res.json({
            'error': err
          });
          return next(err);
        }
        res.json({
          'success': '签退成功' + rescon
        });
      });
    });
  });
});

// 获取某一页签到记录
router.post('/pagesigninfo', function(req, res, next) {
  var userid = req.session.uid;
  var page = (req.body.page - 1) * 10;
  usermodel.getSignRecord(userid, page, function(err, signList) {
    if (err) {
      return next(err);
    }
    for (var i = 0; i < signList.length; i++) {
      var rztime = signList[i].qiandaotime;
      var d = new Date(rztime);
      signList[i].qiandaotime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    }
    res.json({
      'success': true,
      'result': signList
    });
  });
});

// 员工待办事项页面
router.post('/userDaiBan', function(req, res, next) {
  var page = 0;
  var userid = req.session.uid;
  usermodel.getDaiBanPage(userid, function(err, pagenum) {
    if (err) {
      return next(err);
    }
    usermodel.getDaiban(userid, page, function(err, daibanList) {
      if (err) {
        return next(err);
      }
      for (var i = 0; i < daibanList.length; i++) {
        var rztime = daibanList[i].endtime * 1000;
        var d = new Date(rztime);
        daibanList[i].endtime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      }
      res.render('user/DaiBan/_DaiBan', {
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

// 添加待办事项
router.post('/addDaiBan', function(req, res, next) {
  var userid = req.session.uid;
  var shixiang = req.body.shixiang;
  var endtime = req.body.endtime;
  usermodel.userDaiBan(userid, shixiang, endtime, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    res.json({
      'success': '添加代办事项成功'
    });
  });
});

// 获取某一页签到记录
router.post('/pagedaibaninfo', function(req, res, next) {
  var userid = req.session.uid;
  var page = (req.body.page - 1) * 10;
  usermodel.getDaiban(userid, page, function(err, daibanList) {
    if (err) {
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

// 员工请假页面
router.post('/userQingJia', function(req, res, next) {
  var page = 0;
  var userid = req.session.uid;
  usermodel.getQingJiaPage(userid, function(err, pagenum) {
    if (err) {
      return next(err);
    }
    usermodel.getQingJia(userid, page, function(err, qingjiaList) {
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
      res.render('user/QingJia/_QingJia', {
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

// 员工请假弹出层
router.post('/userQingJiaModal', function(req, res, next) {
  res.render('user/QingJia/_AddQingJia', {}, function(err, html) {
    res.json({
      'success': true,
      'view': html
    });
  });
});

// 请假
router.post('/addQingJia', function(req, res, next) {
  var userid = req.session.uid;
  var reason = req.body.reason;
  var starttime = req.body.starttime;
  var endtime = req.body.endtime;
  usermodel.userQingJia(reason, userid, starttime, endtime, function(err) {
    if (err) {
      res.json({
        'error': err
      });
      return next(err);
    }
    usermodel.getNianJiaDay(userid, function(err, userInfo) {
      if (err) {
        res.json({
          'error': err
        });
        return next(err);
      }
      var ruzhitime = userInfo[0].ruzhitime;
      var nowtime = Date.parse(new Date()) / 1000;
      var ruzhiday = Math.floor((nowtime - ruzhitime) / 86400);
      var nianjia;
      if (ruzhiday < 365) {
        nianjia = 7;
      } else {
        nianjia = 14;
      }
      var qingjiaday = Math.ceil((endtime - starttime) / 86400);
      usermodel.updateNianJia(nianjia, qingjiaday, userid, function(err) {
        if (err) {
          res.json({
            'error': err
          });
          return next(err);
        }
        var qingjia = userInfo[0].qingjia + qingjiaday;
        var resSyNianJia = nianjia - qingjia;
        if (resSyNianJia < 0) {
          resSyNianJia = 0;
        }
        res.json({
          'success': '请假成功，请等待管理员审核！您的剩余年假时间还有' + resSyNianJia + '天!'
        });
      });
    });
  });
});

// 获取某一页请假记录
router.post('/pageqingjiainfo', function(req, res, next) {
  var userid = req.session.uid;
  var page = (req.body.page - 1) * 10;
  usermodel.getQingJia(userid, page, function(err, qingjiaList) {
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
    res.json({
      'success': true,
      'result': qingjiaList
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
  usermodel.getOldPassword(userid, function(err, rows) {
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
    usermodel.updatePassword(password, userid, function(err) {
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

// 退出登录
router.get('/logout', function(req, res) {
  req.session.name = '';
  req.session.uid = '';
  req.session.quanxian = '';
  res.redirect('/');
});

module.exports = router;

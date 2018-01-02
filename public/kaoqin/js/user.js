$(function() {
  $('.leftli-usersign').click();
});

$(document).on('click', '#sidebar .sidebar-menu > li', function() {
  $('#sidebar .sidebar-menu > li').removeClass('active');
  $(this).addClass('active');
});

// 登录
$(document).on('click', '.btn-tologin', function() {
  var username = $('input[name="username"]').val();
  var password = $('input[name="password"]').val();
  var data = {
    'username': username,
    'password': password
  }
  if (username.length == 0 || password.length == 0) {
    showTips('warning', 'Warning!', '请检查填写信息！');
  } else {
    ajaxPost('/login', data, function(result) {
      if (result.success) {
        showTips('success', result.success, '两秒钟之后跳转到首页');
        setTimeout(function() {
          location.href = '/home';
        }, 2000);
      }
    });
  }
});

// 获取员工签到界面
$(document).on('click', '.leftli-usersign', function() {
  ajaxPost('/userSignView', {}, function(result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});

// 员工签到
$(document).on('click', '.btn-sign', function() {
  getPostion(function(x, y) {
    x = x.toFixed(6);
    y = y.toFixed(6);
    getPlace(x, y, function(place) {
      var data;
      if ((x > 121.579800 && x < 121.579900) && (y > 29.885400 && y < 29.885500)) {
        data = {
          'qiandaodidian': place,
          'waiqin': 0
        }
        ajaxPost('/userSign', data, function(result) {
          if (result.success) {
            showTips('success', 'Success!', result.success );
            setTimeout(function() {
              $('.leftli-usersign').click();
            }, 1000);
          }
        });
      } else {
        data = {
          'qiandaodidian': place,
          'waiqin': 1
        }
        ajaxPost('/userSign', data, function(result) {
          if (result.success) {
            showTips('success', 'Success!', result.success );
            setTimeout(function() {
              $('.leftli-usersign').click();
            }, 1000);
          }
        });
      }
    });
  });
});

// 员工签退
$(document).on('click', '.btn-signout', function() {
  getPostion(function(x, y) {
    x = x.toFixed(6);
    y = y.toFixed(6);
    getPlace(x, y, function(place) {
      var data;
      if ((x > 121.579800 && x < 121.579900) && (y > 29.885400 && y < 29.885500)) {
        data = {
          'qiantuididian': place,
          'weigui': 0
        }
        ajaxPost('/userSignOut', data, function(result) {
          if (result.success) {
            showTips('success', 'Success!', result.success);
            setTimeout(function() {
              $('.leftli-usersign').click();
            }, 1000);
          }
        });
      } else {
        data = {
          'qiantuididian': '福建工程学院软件学院',
          'weigui': 1
        }
        ajaxPost('/userSignOut', data, function(result) {
          if (result.success) {
            showTips('success', 'Success!', result.success);
            setTimeout(function() {
              $('.leftli-usersign').click();
            }, 1000);
          }
        });
      }
    });
  });
});

// 获取某一页的签到记录
$(document).on('click', '.sign-pageli', function() {
  $('.sign-pageli').removeClass('active');
  $(this).addClass('active');
  var page = $(this).data('pagenum');
  var data = {
    'page': page
  }
  ajaxPost('/pagesigninfo', data, function(result) {
    if (result.success) {
      $('.tbody-signinfo').html('');
      var list = result.result;
      for (var i = 0; i < list.length; i++) {
        var tr;
        if (list[i].shenhe == 0) {
          tr = '<tr><td>' + list[i].qiandaotime + '</td><td>未审核</td></tr>';
        } else {
          tr = '<tr><td>' + list[i].qiandaotime + '</td><td>已审核</td></tr>';
        }
        $('.tbody-signinfo').append(tr);
      }
    }
  });
});

// 获取待办事项界面
$(document).on('click', '.leftli-daiban', function() {
  ajaxPost('/userDaiBan', {}, function(result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});
$(document).on('click', '.btn-daiban', function() {
  layer.open({
    type: 1,
    title: '添加事项',
    area: ['800px', '400px'],
    skin: 'layui-layer-lan',
    content: '<div class="panel-body">\
    <div class="form col-md-12"><formcmxform class="form-horizontal tasi-form">\
    <div class="form-group"><label class="control-label col-lg-3">待办事项内容</label>\
    <div class="col-lg-9"><input type="text" name="shixiang" class="form-control"></div></div>\
    <div class="form-group"><label class="control-label col-lg-3">结束时间</label>\
    <div class="col-lg-9"><div id="datetimepicker-daiban" class="input-group date">\
    <input type="text" name="endtime" class="form-control"><span class="input-group-addon">\
    <span class="glyphicon glyphicon-calendar"></span></span></div></div></div></div></div>',
    btn: ['添加'],
    shadeClose: true,
    yes: function(index, layero) {
      var shixiang = $('input[name="shixiang"]').val();
      var endtime = $('input[name="endtime"]').val();
      endtime = Date.parse(new Date(endtime)) / 1000;
      var data = {
        'shixiang': shixiang,
        'endtime': endtime
      }
      if (shixiang.length == 0 || endtime.length == 0) {
        showTips('warning', 'Warning!', '请检查填写信息！');
      } else {
        ajaxPost('/addDaiBan', data, function(result) {
          if (result.success) {
            showTips('success', 'Success!', result.success);
            setTimeout(function() {
              $('.leftli-daiban').click();
            }, 1000);
          }
        });
      }
      layer.close(index);
    },
    success: function() {
      $('#datetimepicker-daiban').datetimepicker();
    }
  });
});

// 获取某一页的待办事项
$(document).on('click', '.daiban-pageli', function() {
  $('.daiban-pageli').removeClass('active');
  $(this).addClass('active');
  var page = $(this).data('pagenum');
  var data = {
    'page': page
  }
  ajaxPost('/pagedaibaninfo', data, function(result) {
    if (result.success) {
      $('.tbody-daibaninfo').html('');
      var list = result.result;
      for (var i = 0; i < list.length; i++) {
        var tr = '<tr><td>' + list[i].shixiang + '</td><td>' + list[i].endtime + '</td></tr>';
        $('.tbody-daibaninfo').append(tr);
      }
    }
  });
});

// 获取员工请假界面
$(document).on('click', '.leftli-userqingjia', function() {
  ajaxPost('/userQingJia', {}, function(result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});

// 请假弹出层
$(document).on('click', '.btn-qingjia', function() {
  ajaxPost('/userQingJiaModal', {}, function(result) {
    if (result.success) {
      layer.open({
        type: 1,
        title: '请假',
        area: ['800px', '500px'],
        skin: 'layui-layer-lan',
        content: result.view,
        btn: ['请假'],
        shadeClose: true,
        yes: function(index, layero) {
          var reason = $('input[name="reason"]').val();
          var starttime = $('input[name="starttime"]').val();
          var endtime = $('input[name="endtime"]').val();
          starttime = Date.parse(new Date(starttime)) / 1000;
          endtime = Date.parse(new Date(endtime)) / 1000;
          var data = {
            'reason': reason,
            'starttime': starttime,
            'endtime': endtime
          }
          console.log(endtime - starttime);
          if ((endtime - starttime) < 0 || (endtime - starttime) == 0) {
            showTips('warning', 'Warning!', '您的请假时间有问题，请检查!');
          } else {
            if (reason.length == 0 || starttime.length == 0 || endtime.length == 0) {
              showTips('warning', 'Warning!', '请检查填写信息！');
            } else {
              ajaxPost('/addQingJia', data, function(result) {
                if (result.success) {
                  showTips('success', 'Success!', result.success, 4000);
                  $('.leftli-userqingjia').click();
                }
              });
            }
          }
          layer.close(index);
        },
        success: function() {
          $('#datetimepicker-starttime').datetimepicker();
          $('#datetimepicker-endtime').datetimepicker();
        }
      });
    }
  });
});

// 获取某一页的请假信息
$(document).on('click', '.qingjia-pageli', function() {
  $('.qingjia-pageli').removeClass('active');
  $(this).addClass('active');
  var page = $(this).data('pagenum');
  var data = {
    'page': page
  }
  ajaxPost('/pageqingjiainfo', data, function(result) {
    if (result.success) {
      $('.tbody-qingjiainfo').html('');
      var list = result.result;
      for (var i = 0; i < list.length; i++) {
        var tr;
        if (list[i].shenhe == 0) {
          tr = '<tr><td>' + list[i].reason + '</td><td>' + list[i].start_time + '</td><td>' + list[i].end_time + '</td><td>未审核</td></tr>';
        } else {
          tr = '<tr><td>' + list[i].reason + '</td><td>' + list[i].start_time + '</td><td>' + list[i].end_time + '</td><td>已审核</td></tr>';
        }
        $('.tbody-qingjiainfo').append(tr);
      }
    }
  });
});

// 修改密码
$(document).on('click', '.userUpdatePassword', function() {
  layer.open({
    type: 1,
    title: '修改密码',
    area: ['800px'],
    skin: 'layui-layer-lan',
    content: '<div class="panel-body">\
    <div class="form col-md-12"><form class="form-horizontal tasi-form">\
    <div class="form-group"><label class="control-label col-lg-3">原密码</label>\
    <div class="col-lg-9"><input type="password" name="oldpassword" class="form-control"></div></div>\
    <div class="form-group"><label class="control-label col-lg-3">新密码</label>\
    <div class="col-lg-9"><input type="password" name="password" class="form-control"></div></div></div></div>',
    btn: ['修改'],
    shadeClose: true,
    yes: function(index, layero) {
      var oldpassword = $('input[name="oldpassword"]').val();
      var password = $('input[name="password"]').val();
      var data = {
        'oldpassword': oldpassword,
        'password': password
      }
      if (oldpassword.length == 0 || password.length == 0) {
        showTips('warning', 'Warning!', '请检查填写信息！');
      } else {
        ajaxPost('/updatePassword', data, function(result) {
          if (result.success) {
            showTips('success', 'Success!', result.success);
          }
        });
      }
      layer.close(index);
    }
  });
});

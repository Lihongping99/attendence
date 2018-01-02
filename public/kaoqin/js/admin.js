$(function () {
  $('.leftli-userinfo').click();
});

$(document).on('click', '#sidebar .sidebar-menu > li', function () {
  $('#sidebar .sidebar-menu > li').removeClass('active');
  $(this).addClass('active');
});

// 登录
$(document).on('click', '.btn-tologin', function () {
  var username = $('input[name="username"]').val();
  var password = $('input[name="password"]').val();
  var data = {
    'username': username,
    'password': password
  }
  if (username.length == 0 || password.length == 0) {
    showTips('warning', 'Warning!', '请检查填写信息！');
  } else {
    ajaxPost('/admin/login', data, function (result) {
      if (result.success) {
        showTips('success', result.success, '两秒钟之后跳转到首页');
        setTimeout(function () {
          location.href = '/admin/home';
        }, 2000);
      }
    });
  }
});

// 员工信息
$(document).on('click', '.leftli-userinfo', function () {
  var data = {
    'page': 1
  }
  ajaxPost('/admin/userinfo', data, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
      $('#datetimepicker1').datetimepicker();
      $('#datetimepicker-shangban').datetimepicker({
        format: 'LT'
      });
      $('#datetimepicker-xiaban').datetimepicker({
        format: 'LT'
      });
    }
  });
});

// 部门管理
$(document).on('click', '.leftli-bumenmanage', function () {
  ajaxPost('/admin/bumenmanage', {}, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});

// 添加部门
$(document).on('click', '.btn-addbumenmodel', function () {
  $('.addbumen-model').slideToggle();
});
$(document).on('click', '.btn-cancelbumen', function () {
  $('.addbumen-model').slideUp();
});
$(document).on('click', '.btn-addbumen', function () {
  var name = $('input[name="bumenname"]').val();
  var data = {
    'name': name
  }
  if (name.length == 0) {
    showTips('warning', 'Warning!', '请检查填写信息！');
  } else {
    ajaxPost('/admin/addbumen', data, function (result) {
      if (result.success) {
        showTips('success', 'Success!', result.success);
        setTimeout(function () {
          $('.leftli-bumenmanage').click();
        }, 1000);
      }
    });
  }
});

// 修改部门名称
$(document).on('click', '.btn-xgbumenname', function () {
  var bumenid = $(this).data('bumenid');
  layer.open({
    type: 1,
    title: '修改部门名称',
    area: ['800px'],
    skin: 'layui-layer-lan',
    content: '<div class="panel-body">\
    <div class="form col-md-12"><form class="form-horizontal tasi-form">\
    <div class="form-group"><label class="control-label col-lg-3">名称</label>\
    <div class="col-lg-9"><input type="text" name="xg-bumenname" class="form-control"></div></div>\
    </div></div>',
    btn: ['修改'],
    shadeClose: true,
    yes: function (index, layero) {
      var name = $('input[name="xg-bumenname"]').val();
      var data = {
        'bumenid': bumenid,
        'name': name
      }
      layer.close(index);
      if (name.length == 0) {
        showTips('warning', 'Warning!', '请填写部门名称！');
      } else {
        ajaxPost('/admin/updatebumen', data, function (result) {
          if (result.success) {
            showTips('success', 'Success!', result.success);
            setTimeout(function () {
              $('.leftli-bumenmanage').click();
            }, 1000);
          }
        });
      }
    },
    success: function () {
      $('#datetimepicker2').datetimepicker();
    }
  });
});

// 添加员工
$(document).on('click', '.btn-adduser', function () {
  var account = $('input[name="account"]').val();
  var password = $('input[name="password"]').val();
  var gonghao = $('input[name="gonghao"]').val();
  var name = $('input[name="name"]').val();
  var bumen = $('select[name="bumen"]').val();
  var zhiwei = $('select[name="zhiwu"]').val();
  var sex = $('select[name="sex"]').val();
  var age = $('input[name="age"]').val();
  var ruzhitime = $('input[name="ruzhitime"]').val();
  ruzhitime = Date.parse(new Date(ruzhitime)) / 1000;
  var shangban = getBanTime($('input[name="shangban"]').val());
  var xiaban = getBanTime($('input[name="xiaban"]').val());
  var data = {
    'account': account,
    'password': password,
    'gonghao': gonghao,
    'name': name,
    'bumen': bumen,
    'zhiwei': zhiwei,
    'sex': sex,
    'age': age,
    'ruzhitime': ruzhitime,
    'shangban': shangban,
    'xiaban': xiaban
  }
  if (account.length == 0 || password.length == 0 || gonghao.length == 0 || name.length == 0 ||
    age.length == 0) {
    showTips('warning', 'Warning!', '请检查填写信息！');
  } else {
    ajaxPost('/admin/adduser', data, function(result) {
      if (result.success) {
        showTips('success', 'Success!', result.success);
        setTimeout(function() {
          $('.leftli-userinfo').click();
        }, 1000);
      }
    });
  }

  // 批量添加数据功能
  /* console.log('>>>批量添加数据>>>>>>>>>>');
  $.get('https://www.easy-mock.com/mock/5a629c8068c0d85c3789878f/attendance/employee', function (data) {
    var datas = data.data.employee;
    console.log(datas);
    datas.forEach(item => {
      ajaxPost('/admin/adduser', item);
    });
  }) */

});

// 员工信息界面获取其他页信息
$(document).on('click', '.user-pageli', function () {
  $('.user-pageli').removeClass('active');
  $(this).addClass('active');
  var page = $(this).data('pagenum');
  var data = {
    'page': page
  }
  ajaxPost('/admin/pageuserinfo', data, function (result) {
    if (result.success) {
      $('.tbody-userinfo').html('');
      var list = result.result;
      for (var i = 0; i < list.length; i++) {
        var rztime = list[i].ruzhitime * 1000;
        var d = new Date(rztime);
        var month = d.getMonth()+1;
        if(month<9){
          month = '0'+month
        }
        var currentday = d.getDate();
        if(currentday<10){
          currentday = '0'+currentday
        }
        list[i].ruzhitime = d.getFullYear() + '-' + month + '-' +currentday;
      }
      for (var i = 0; i < list.length; i++) {
        var synianjia = list[i].nianjia - list[i].qingjia;
        if (synianjia < 0) {
          synianjia = 0;
        }
        var tr = '<tr>\
								<td>' + list[i].account + '</td>\
								<td>' + list[i].name + '</td>\
								<td>' + list[i].age + '</td>\
								<td>' + list[i].sex + '</td>\
								<td>' + list[i].ruzhitime + '</td>\
								<td>' + synianjia + '</td>\
								<td>' + list[i].bumenname + '</td>\
								<td data-userid=' + list[i].id + '><button class="btn btn-success btn-xs btn-reuserpassword"><i class="icon-ok">重置密码</i></button>\
								<button class="btn btn-primary btn-xs btn-edituserinfo"><i class="icon-pencil"></i></button>\
								<button class="btn btn-danger btn-xs btn-deleteuserinfo"><i class="icon-trash"></i></button></td></tr>'
        $('.tbody-userinfo').append(tr);
      }
    }
  });
});

// 删除员工
$(document).on('click', '.btn-deleteuserinfo', function () {
  var userId = $(this).parents('td').data('userid');
  var data = {
    'userId': userId
  }
  showBtnTips('warning', '删除员工！', '确定要删除该员工吗？', '取消', '确定', function () {
    ajaxPost('/admin/deleteuser', data, function (result) {
      if (result.success) {
        showTips('success', 'Success', result.success);
        setTimeout(function () {
          $('.leftli-userinfo').click();
        }, 1000);
      }
    });
  });
});

// 修改员工信息
$(document).on('click', '.btn-edituserinfo', function () {
  var userId = $(this).parents('td').data('userid');
  var data = {
    'userId': userId
  }
  ajaxPost('/admin/getEditUserInfoFrame', data, function (result) {
    if (result.success) {
      layer.open({
        type: 1,
        title: '修改员工信息',
        area: ['800px'],
        skin: 'layui-layer-lan',
        content: result.view,
        btn: ['修改'],
        shadeClose: true,
        yes: function (index, layero) {
          var account = $('input[name="edit-account"]').val();
          var gonghao = $('input[name="edit-gonghao"]').val();
          var name = $('input[name="edit-name"]').val();
          var bumen = $('select[name="edit-bumen"]').val();
          var zhiwei = $('select[name="edit-zhiwu"]').val();
          var sex = $('select[name="edit-sex"]').val();
          var age = $('input[name="edit-age"]').val();
          var data = {
            'userid': userId,
            'account': account,
            'gonghao': gonghao,
            'name': name,
            'bumen': bumen,
            'zhiwei': zhiwei,
            'sex': sex,
            'age': age
          }
          layer.close(index);
          ajaxPost('/admin/EditUserInfo', data, function (result) {
            if (result.success) {
              showTips('success', 'Success!', result.success);
              setTimeout(function () {
                $('.user-pageli.active').click();
              }, 1000);
            }
          });
        },
        success: function () {
          $('#datetimepicker2').datetimepicker();
        }
      });
    }
  });
});

// 重置密码
$(document).on('click', '.btn-reuserpassword', function () {
  var userId = $(this).parents('td').data('userid');
  var data = {
    'userid': userId
  }
  showBtnTips('warning', '重置密码员工！', '确定要重置该员工密码吗？', '取消', '确定', function () {
    ajaxPost('/admin/reUserPassword', data, function (result) {
      if (result.success) {
        showTips('success', 'Success!', result.success);
        setTimeout(function () {
          $('.user-pageli.active').click();
        }, 1000);
      }
    });
  });
});

// 职位界面
$(document).on('click', '.leftli-zhiwei', function () {
  ajaxPost('/admin/getZhiWei', {}, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});

// 添加职位
$(document).on('click', '.btn-addzhiweimodel', function () {
  $('.addzhiwei-model').slideToggle();
});
$(document).on('click', '.btn-cancelzhiwei', function () {
  $('.addzhiwei-model').slideUp();
});
$(document).on('click', '.btn-addzhiwei', function () {
  var name = $('input[name="zhiweiname"]').val();
  var data = {
    'name': name
  }
  if (name.length == 0) {
    showTips('warning', 'Warning!', '请检查填写信息！');
  } else {
    ajaxPost('/admin/addzhiwei', data, function (result) {
      if (result.success) {
        showTips('success', 'Success!', result.success);
        setTimeout(function () {
          $('.leftli-zhiwei').click();
        }, 1000);
      }
    });
  }
});

// 修改职位名称
$(document).on('click', '.btn-xgzhiweiname', function () {
  var zhiweiid = $(this).data('zhiweiid');
  layer.open({
    type: 1,
    title: '修改职位名称',
    area: ['800px'],
    skin: 'layui-layer-lan',
    content: '<div class="panel-body">\
    <div class="form col-md-12"><form class="form-horizontal tasi-form">\
    <div class="form-group"><label class="control-label col-lg-3">名称</label>\
    <div class="col-lg-9"><input type="text" name="xg-zhiweiname" class="form-control"></div></div>\
    </div></div>',
    btn: ['修改'],
    shadeClose: true,
    yes: function (index, layero) {
      var name = $('input[name="xg-zhiweiname"]').val();
      var data = {
        'zhiweiid': zhiweiid,
        'name': name
      }
      layer.close(index);
      if (name.length == 0) {
        showTips('warning', 'Warning!', '请填写职位名称！');
      } else {
        ajaxPost('/admin/updatezhiwei', data, function (result) {
          if (result.success) {
            showTips('success', 'Success!', result.success);
            setTimeout(function () {
              $('.leftli-zhiwei').click();
            }, 1000);
          }
        });
      }
    },
    success: function () {
      $('#datetimepicker2').datetimepicker();
    }
  });
});

// 获取待办事项
$(document).on('click', '.leftli-daiban', function () {
  ajaxPost('/admin/daiBan', {}, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});

// 获取某一页待办事项
$(document).on('click', '.daiban-pageli', function () {
  $('.daiban-pageli').removeClass('active');
  $(this).addClass('active');
  var page = $(this).data('pagenum');
  var data = {
    'page': page
  }
  ajaxPost('/admin/pageDaiBan', data, function (result) {
    if (result.success) {
      $('.tbody-daibaninfo').html('');
      var list = result.result;
      for (var i = 0; i < list.length; i++) {
        var tr = '<tr><td>' + list[i].shixiang + '</td><td>' + list[i].username + '</td><td>' + list[i].endtime + '</td></tr>';
        $('.tbody-daibaninfo').append(tr);
      }
    }
  });
});

// 获取考勤
$(document).on('click', '.leftli-kaoqin', function () {
  ajaxPost('/admin/kaoQin', {}, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
      $('#datetimepicker-select').datetimepicker();
      ajaxPost('/admin/kaoQinCon', {}, function (result) {
        if (result.success) {
          $('#kaoqinSection').html('');
          $('#kaoqinSection').append(result.view);
          localStorage.clear();
        }
      });
    }
  });
});

// 查询某一天的考勤
$(document).on('click', '.btn-select-daykaoqin', function () {
  var date = $('input[name="selecttime"]').val();
  var data = {
    'date': date
  }
  ajaxPost('/admin/kaoQinCon', data, function (result) {
    if (result.success) {
      locSetItem('selectDate', date);
      $('#kaoqinSection').html('');
      $('#kaoqinSection').append(result.view);
    }
  });
});

// 获取该日考勤报表
$(document).on('click', '.btn-getxlsx', function () {
  var datetime = $('input[name="selecttime"]').val();
  var data = {
    'datetime': datetime
  }
  ajaxPost('/admin/xlsx', data, function (result) {
    if (result.success) {
      showTips('success', 'Success!', result.success);
      window.location.href = result.result;
    }
  });
});

// 获取某一页考勤
$(document).on('click', '.kaoqin-pageli', function () {
  var page = $(this).data('pagenum');
  var date = locGetItem('selectDate') || '';
  var index = $(this).index();
  var data = {
    'page': page,
    'date': date
  }
  ajaxPost('/admin/kaoQinCon', data, function (result) {
    if (result.success) {
      $('#kaoqinSection').html('');
      $('#kaoqinSection').append(result.view);
      $('.kaoqin-pageli').removeClass('active');
      $('.kaoqin-pageli').eq(index).addClass('active');
    }
  });
});

// 审核考勤
$(document).on('click', '.btn-shenhekaoqin', function () {
  var kaoqinid = $(this).data('kaoqinid');
  var data = {
    'kaoqinid': kaoqinid
  }
  showBtnTips('', '审核通过！', '确认审核该条考勤吗？', '取消', '确认', function () {
    ajaxPost('/admin/examineQianDao', data, function (result) {
      if (result.success) {
        showTips('success', 'Success!', result.success);
        setTimeout(function () {
          $('.kaoqin-pageli.active').click();
          $('.chidao-pageli.active').click();
        }, 500);
      }
    });
  });
});

// 获取迟到界面
$(document).on('click', '.btn-tochidao', function () {
  ajaxPost('/admin/ChiDao', {}, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});

// 获取某员工迟到情况
$(document).on('click', '.btn-select-chidao', function () {
  var userid = $('select[name="chidaouserid"]').val();
  var data = {
    'userid': userid
  }
  if (userid == '请选择员工') {
    showTips('warning', 'Warning!', '请选择员工！');
  } else {
    ajaxPost('/admin/ChiDaoCon', data, function (result) {
      if (result.success) {
        locSetItem('selectUserid', userid);
        $('#chidaoSection').html('');
        $('#chidaoSection').append(result.view);
      }
    });
  }
});

// 获取某一页该员工迟到情况
$(document).on('click', '.chidao-pageli', function () {
  var page = $(this).data('pagenum');
  var userid = locGetItem('selectUserid') || '';
  var index = $(this).index();
  var data = {
    'page': page,
    'userid': userid
  }
  ajaxPost('/admin/ChiDaoCon', data, function (result) {
    if (result.success) {
      $('#chidaoSection').html('');
      $('#chidaoSection').append(result.view);
      $('.chidao-pageli').removeClass('active');
      $('.chidao-pageli').eq(index).addClass('active');
    }
  });
});

// 返回员工考勤
$(document).on('click', '.btn-backto-kaoqin', function () {
  $('.leftli-kaoqin').click();
});

// 获取请假
$(document).on('click', '.leftli-qingjia', function () {
  ajaxPost('/admin/qingJia', {}, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});

// 获取某一页员工请假记录
$(document).on('click', '.qingjia-pageli', function () {
  var page = $(this).data('pagenum');
  var index = $(this).index();
  var data = {
    'page': page
  }
  ajaxPost('/admin/qingJia', data, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
      $('.qingjia-pageli').removeClass('active');
      $('.qingjia-pageli').eq(index).addClass('active');
    }
  });
});

// 审核通过请假记录
$(document).on('click', '.btn-shenheqingjia', function () {
  var qingjiaid = $(this).data('qingjiaid');
  var data = {
    'qingjiaid': qingjiaid
  }
  showBtnTips('', '审核通过！', '确认通过该条请假记录吗？', '取消', '确认', function () {
    ajaxPost('/admin/examineQingJia', data, function (result) {
      if (result.success) {
        showTips('success', 'Success!', result.success);
        setTimeout(function () {
          $('.qingjia-pageli.active').click();
        }, 500);
      }
    });
  });
});

// 修改密码
$(document).on('click', '.adminUpdatePassword', function () {
  layer.open({
    type: 1,
    title: '修改密码',
    area: ['800px'],
    skin: 'layui-layer-lan',
    content: '<div class="panel-body">\
    <div class="form col-md-12"><form class="form-horizontal tasi-form">\
    <div class="form-group"><label class="control-label col-lg-3">原密码</label>\
    <div class="col-lg-9"><input type="password" name="adminoldpassword" class="form-control"></div></div>\
    <div class="form-group"><label class="control-label col-lg-3">新密码</label>\
    <div class="col-lg-9"><input type="password" name="adminpassword" class="form-control"></div></div></div></div>',
    btn: ['修改'],
    shadeClose: true,
    yes: function (index, layero) {
      var oldpassword = $('input[name="adminoldpassword"]').val();
      var password = $('input[name="adminpassword"]').val();
      var data = {
        'oldpassword': oldpassword,
        'password': password
      }
      if (oldpassword.length == 0 || password.length == 0) {
        showTips('warning', 'Warning!', '请检查填写信息！');
      } else {
        ajaxPost('/admin/updatePassword', data, function (result) {
          if (result.success) {
            showTips('success', 'Success!', result.success);
          }
        });
      }
      layer.close(index);
    }
  });
});

// 管理员列表
$(document).on('click', '.leftli-admin', function () {
  ajaxPost('/admin/adminList', {}, function (result) {
    if (result.success) {
      $('#main-content').html('');
      $('#main-content').append(result.view);
    }
  });
});

// 添加管理员modal
$(document).on('click', '.btn-addadmin', function () {
  ajaxPost('/admin/addAdminModal', {}, function (result) {
    if (result.success) {
      layer.open({
        type: 1,
        title: '添加管理员',
        area: ['800px'],
        skin: 'layui-layer-lan',
        content: result.view,
        btn: ['添加'],
        shadeClose: true,
        yes: function (index, layero) {
          var account = $('input[name="admin-account"]').val();
          var password = $('input[name="admin-password"]').val();
          var name = $('input[name="admin-name"]').val();
          var sex = $('select[name="admin-sex"]').val();
          var quanxian = $('select[name="admin-quanxian"]').val();
          var data = {
            'account': account,
            'password': password,
            'name': name,
            'sex': sex,
            'quanxian': quanxian
          }
          if (account.length == 0 || password.length == 0 || name.length == 0) {
            showTips('warning', 'Warning!', '请检查填写信息！');
          } else {
            ajaxPost('/admin/addAdmin', data, function (result) {
              if (result.success) {
                showTips('success', 'Success!', result.success);
                $('.leftli-admin').click();
              }
            });
          }
          layer.close(index);
        }
      });
    }
  });
});

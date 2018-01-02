// ajax封装方法
function ajaxPost(url, data, successfn, isLoadingShow) {
  var oDiv;
  $.ajax({
    url: url,
    contentType: "application/json; charset=utf-8",
    type: 'POST',
    data: JSON.stringify(data),
    success: function(result) {
      if (result.success) {
        successfn && successfn(result);
      } else {
        showTips('error', '出错了！', result.error);
      }
    },
    error: function(jqXHR, status, error) {
      if (error.length > 0) {
        showTips('error', '出错了！', error);
      } else {
        showTips('error', '出错了！', '请刷新页面试试~');
      }
    },
    beforeSend: function(jqXHR, settings) {
      if (isLoadingShow == undefined || isLoadingShow == true) {
        oDiv = alertLoading();
      }
    },
    complete: function(jqXHR, status) {
      if (oDiv) oDiv.remove();
    }
  })
};

// sweetalert自动消失提示封装
function showTips(type, msgtit, msgcon, newTimeOut = 2000) {
  // type取值 "warning"、"error"、"success"、"info"
  swal({
    title: msgtit,
    text: msgcon,
    timer: newTimeOut,
    showConfirmButton: false,
    type: type,
    html: true
  });
}

function showBtnTips(type, msgtit, msgcon, btncancel, btnconfirm, callback, newTimeOut = 2000) {
  swal({
    title: msgtit,
    text: msgcon,
    type: type,
    showCancelButton: true,
    confirmButtonClass: 'btn-info',
    cancelButtonClass: 'btn-secondary',
    confirmButtonText: btnconfirm,
    cancelButtonText: btncancel,
    closeOnConfirm: false
  }, function() {
    callback();
  });
}

// 加载动画封装
function alertLoading() {
  var oDiv = $('<div class="loadingTip"><img src="/public/img/loading.gif" /></div>');
  $('body').append(oDiv);
  return oDiv;
}

// 获取路径参数封装
function getFromUrl(key) {
  var urlInfo = location.search.substring(1).split('&');
  for (var i = 0; i < urlInfo.length; i++) {
    var name = urlInfo[i].split('=')[0];
    var value = urlInfo[i].split('=')[1];
    if (key.toLowerCase() === name.toLowerCase()) {
      return value;
      break;
    }
  }
  return '';
}

// function GetPostion(callback) {
//   var address = "具体的地理位置 ";
// 	var longtitude = 0;
// 	var latitude = 0;
//   var url = "http://api.map.baidu.com/geocoder/v2/?address=" + address + "&output=json&ak=FG7wxr1VUj0k2NwoO3yXzymd&callback=?";
//   $.getJSON(url, function(data) {
// 		// 经度
//     longtitude = data.result.location.lng;
// 		// 纬度
//     latitude = data.result.location.lat;
// 		callback(longtitude, latitude);
//   });
// }

// 获取经纬度
function getPostion(callback) {
  var point = new BMap.Point(116.331398, 39.897445);
  var geolocation = new BMap.Geolocation();
	var oDiv = alertLoading();
  geolocation.getCurrentPosition(function(r) {
    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      var mk = new BMap.Marker(r.point);
      callback(r.point.lng, r.point.lat);
			if (oDiv) oDiv.remove();
    } else {
      showTips('error', 'Error!', this.getStatus());
    }
  }, {
    enableHighAccuracy: true
  });
}

// 根据经纬度转换为地点
function getPlace(lng, lat, callback) {
  var point = new BMap.Point(lng, lat);
  var geoc = new BMap.Geocoder();
	var oDiv = alertLoading();
  geoc.getLocation(point, function(rs) {
    var addComp = rs.addressComponents;
    callback(addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber);
		if (oDiv) oDiv.remove();
  });
}

// 转换时间
function getBanTime(str) {
  var sjd = str.substr(str.length - 2);
  var restime;
  if (sjd == 'AM') {
    restime = str.substr(0, str.indexOf(' '));
  } else {
    restime = (parseInt(str.substr(0, str.indexOf(':'))) + 12) + str.substr(str.indexOf(':'), str.indexOf(' ') - 1);
  }
  return restime;
}

function locSetItem(key, value) {
  localStorage.setItem(key, value);
}

function locGetItem(key) {
  return localStorage.getItem(key);
}

$(function () {
  var clock = new Vue({
      el: '#currentTime',
      data: {
          time: '',
          date: ''
      }
  });

  var week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  var timerID = setInterval(updateTime, 1000);
  updateTime();
  function updateTime() {
      var cd = new Date();
      clock.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
      clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
  };
  function zeroPadding(num, digit) {
      var zero = '';
      for (var i = 0; i < digit; i++) {
          zero += '0';
      }
      return (zero + num).slice(-digit);
  }
})	



var video = document.getElementById('video'),
  canvas = document.getElementById('canvas'),
  canvas1 = document.getElementById('canvas-res'),
  canvas2 = document.getElementById('res-img'),
  snap = document.getElementById('tack'),
  resDiv = document.getElementById('res'),
  vendorUrl = window.URL || window.webkitURL;

//媒体对象
// 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia 
// 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constraints) {
    // 首先，如果有getUserMedia的话，就获得它
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    // 否则，为老的navigator.getUserMedia方法包裹一个Promise
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: {exact :"environment"} } })
  .then(function (stream) {
    var video = document.querySelector('video');
    // 旧的浏览器可能没有srcObject
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      // 防止再新的浏览器里使用它，应为它已经不再支持了
      video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = function (e) {
      video.play();
    };
  })
  .catch(function (err) {
    console.log(err.name + ": " + err.message);
  });
snap.addEventListener('click', function () {
  resDiv.innerHTML = ''
  //绘制canvas图形
  canvas.getContext('2d').drawImage(video, 0, 0, 400, 300);
  canvas1.getContext('2d').drawImage(video, 0, 0, 300, 350);
  canvas2.getContext('2d').drawImage(video, 0, 0, 60, 60);
  //把canvas图像转为img图片
  // var res = await fetch('https://aip.baidubce.com/rest/2.0/image-classify/v2/logo?access_token=24.2bf06b03c105f88cc1151ff40c0d5862.2592000.1534612954.282335-11549074',{
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: {
  //     'image': encodeURI(img.src)
  //   }
  // }).then(res => res.json());
  $.ajax({
    type: 'post',
    url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/logo?access_token=24.2c63dabd7ef159feb98019b1110645aa.2592000.1543565421.282335-14629208',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    },
    data: {
      image: encodeURI(canvas.toDataURL("image/png").split(',')[1])
    },
    success: function (res) {
      // if (!res.result.length || res.result[0].probability < 0.6 ) return resDiv.innerHTML = '未匹配到品牌！'
      $('.res-page').attr('style', 'display: block');
      $('#res-title').html(res.result[0].name);
      $('#res-desc-desc').html(res.result[0].name);
      resDiv.innerHTML = '品牌名称：' + res.result[0].name + ', 置信度：' + res.result[0].probability
    }
  })
})


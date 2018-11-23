var video = document.getElementById('video'),
  canvas = document.getElementById('canvas'),
  snap = document.getElementById('tack'),
  resDiv = document.getElementById('res'),
  vendorUrl = window.URL || window.webkitURL;

//媒体对象
navigator.getMedia = navigator.getUserMedia ||
  navagator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
navigator.getMedia({
  video: true, //使用摄像头对象
  audio: false //不适用音频
}, function (strem) {
  console.log(strem);
  video.srcObject = strem;
  var promise = video.play();
  if (promise !== undefined) {

  }
}, function (error) {
  //error.code
  console.log(error);
});


snap.addEventListener('click', function () {

  //绘制canvas图形
  canvas.getContext('2d').drawImage(video, 0, 0, 400, 300);
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
      if (!res.result.length) resDiv.innerHTML = '没搜到！'
      resDiv.innerHTML = '品牌名称：' + res.result[0].name + ', 置信度：' + res.result[0].probability
    }
  })
})

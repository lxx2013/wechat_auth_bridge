var express = require('express');
var router = express.Router();
var jsSHA = require('jssha');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/wechatLogin', function(req, res, next) {
  let path= (req.query.state + req.query.code)
  console.log('redirect to ' + path);
  res.redirect(path);
});

var token="6d05aedab138be6bbbf40b41d65a45ec";

router.post('/weiChart', function(req, res, next) {
  var rawBody = '';
  req.setEncoding('utf8');

  req.on('data', function(chunk) { rawBody += chunk; });
  req.on('end', function() {
   try {
    console.log(rawBody)
    var fromUser = rawBody.match(/FromUserName.+?CDATA\[(.+?)\]/)[1]
    var ghId = rawBody.match(/ToUserName.+?CDATA\[(.+?)\]/)[1]
    var event = (rawBody.match(/Event.+?CDATA\[(.+?)\]/)||['','unknown'])[1]
    if (event == 'subscribe')
      res.end(`<xml>
<ToUserName><![CDATA[${fromUser}]]></ToUserName>
<FromUserName><![CDATA[${ghId}]]></FromUserName>
<CreateTime>${parseInt(+new Date/1000)}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[你好，请点击 https://k-on.live 进入微信墙和百元冲顶活动界面]]></Content>
</xml>`);
    else
      res.end(`<xml>
<ToUserName><![CDATA[${fromUser}]]></ToUserName>
<FromUserName><![CDATA[${ghId}]]></FromUserName>
<CreateTime>${parseInt(+new Date/1000)}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[你好，要参与游戏，要上墙发言，请点击 https://k-on.live 。
如果有任何问题，请联系工作人员]]></Content>
</xml>`);
   } catch (err) {
      res.end()
   }
  });
})

router.get('/weiChart', function(req, res, next) {
    //自定移动token，要与微信公众号里设置的一致
	//1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
	    var signature = req.query.signature,//微信加密签名
	        timestamp = req.query.timestamp,//时间戳
	            nonce = req.query.nonce,//随机数
	          echostr = req.query.echostr;//随机字符串

	    //2.将token、timestamp、nonce三个参数进行字典序排序
	    var array = [token,timestamp,nonce];
	    array.sort();

	    //3.将三个参数字符串拼接成一个字符串进行sha1加密
	    var tempStr = array.join('');
	    var shaObj = new jsSHA('SHA-1', 'TEXT');
	    shaObj.update(tempStr);
	    var scyptoString=shaObj.getHash('HEX'); 

	    //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
	    if(signature === scyptoString){
	    	console.log('验证成功')
	        res.send(echostr);
	    }else{
	    	console.log('验证失败')
	        res.send('验证失败');
	    }

});

module.exports = router;

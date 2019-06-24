var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('./sslforfree/private.key', 'utf8');
var certificate = fs.readFileSync('./sslforfree/certificate.crt', 'utf8');
var cafile = fs.readFileSync('./sslforfree/ca_bundle.crt', 'utf-8');
var score=require('./routes/score');
var bodyParser = require('body-parser');
var credentials = {
  ca: cafile,
  key: privateKey,
  cert: certificate
};
var express = require('express');
var app = express();
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var linebot = require('linebot');

httpServer.listen(80);
httpsServer.listen(443);
console.log('listen to http/https')

app.use(express.static('public'));
app.use(express.static('2048'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/score', score);
app.get('/', function (req, res) {
	res.sendFile('./public/login.html', {root: __dirname});
});

app.get('/2048',(req,res)=>{
	res.sendFile('./2048/index.html', {root: __dirname});
});

var bot = linebot({
  channelId: '1649588998',
  channelSecret: '4882787b7b9e6b1f17f9953a5290972d',
  channelAccessToken: 'dZfc7vcQXrmUCcc3NgQnKdP52sErHTbuRTolLpMxsBV1FoUaJkbJe/WkOzOFhaAhh9aOri9Jr8LyBV+yBU+Lt0dp5F3EjEk6omiUvL0/ro5z7Pf2R3qD7OUFQz6DxDcd35iGLAoDMapX9thlOM6eYQdB04t89/1O/w1cDnyilFU='
});

const linebotParser = bot.parser();
app.post('/linewebhook', linebotParser);
app.listen(3000);

bot.on('message', function (event) {
  event.reply(event.message.text).then(function (data) {
    // success
    console.log(event);
    console.log('data : ', data)
  }).catch(function (error) {
    // error
    console.log(error);
  });
});

bot.push('U7e8f0fd4f222a4fdcf7b51e4cf5c59f6',{type:'text',text:'I am alive~~'});
//var exec = require('child_process').exec;
//var filename = 'test.py'
//exec('python3' + ' ' + filename, function (err, stdout, stderr) {
//  if (stdout) {
//    console.log("python success , result : >>>", stdout + "<<<");
//
//    if (stdout == '1') {
//      console.log('NOT EMPTY!!!!!!!')
//      bot.push('U7e8f0fd4f222a4fdcf7b51e4cf5c59f6',{type:'text',text:'快搶課!!!!'});
//      console.log('NOT EMPTY!!!!!!!')
//    }
//  } else {
//    console.log("py fail 1", err);
//  }
//
//  if (err) {
//    console.log("py fail", err);
//  }
//})

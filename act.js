//express_demo.js 文件
var express = require('express');
var app = express();
var fs = require('fs');
var mysql = require('mysql');

var bodyParser = require('body-parser');
var multer  = require('multer');

var user = require('./zsgc.js');
var settings = require('./setting.js');

var md5 = function(data) {
    var Buffer = require("buffer").Buffer;
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    var crypto = require("crypto");
    return crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
}
var tokenid_md5 = md5('qq2443611475');//与前端交互的钥匙

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

app.get('/', function (req, res){
   res.send('Hello World');
})

app.get('/index', function (req, res) {
   res.sendFile(__dirname + "/public/html/" + "index.html");//将html传递给前端
})

var shu = '1'
function ad(){//查询所有的数据
	 var connection = mysql.createConnection(settings.db);
     connection.connect();
     var seleactive = `select * from x003;` 
	 connection.query(seleactive, function(err, rows) {
    	   if (err) throw err;
    	   shu = rows
     })
     connection.end();
}

 //=============================================================================================================================================================================
//登录功能//var selectSQL_login = 'select * from x003 where name='+req.body.name
var login_token = '';
app.post('/login',function(req,res){
	/*处理浏览器同源策略(跨域)问题*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
   if(tokenid_md5==req.body.tokenid){
   	 var connection = mysql.createConnection(settings.db);
     connection.connect();
     var seleactive = `select * from x003;` 
	 connection.query(seleactive, function(err, rows) {
    	   if (err) throw err;
    	   var act = '1'
    	   var a = false;
    	   console.log(rows);
   	   for(var i=0;i<rows.length;i++){
   	   	   if(req.body.name==rows[i].name){
   	   	   	   act = rows[i];
   	   	   	   a = true;
   	   	   	   break;
   	   	   }else{
   	   	   	   act = '1'
   	   	   }
   	     }
     if(a){
   	   if(act=='1'){
   	   	   response={
    		   message:'301',
    		   filename:'用户不存在'
    	    }
           res.end(JSON.stringify(response))
   	   }else{
   	   	 
   	   	  if(md5(req.body.password) == act.password){
   	   	  	   login_token = md5(req.body.name + req.body.password + new Date())
    		   response={
    		      message:'200',
    		      filename:'ok',
    		      data:login_token
    	        }
               res.end(JSON.stringify(response))
   	   	  }else{
   	   	  	  response={
    		   message:'302',
    		   filename:'密码不正确'
    	      }
             res.end(JSON.stringify(response))
   	   	   }
   	     }
       }
     })
     connection.end();
   }else{
   	   response={
    		   message:'300',
    		   filename:'no',
    	    }
       res.end(JSON.stringify(response))
   }
})

//=============================================================================================================================================================================
app.post('/process_get', function (req, res) {
	/*处理浏览器同源策略(跨域)问题*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
   // 输出 JSON 格式
   var response = {
       "first_name":req.body.first_name,//post请求通过  req.body 获取前端请求发送的数据，get请求通过 req.query 获取前端请求发送的数据
       "last_name":req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

//=============================================================================================================================================================================
//app.post('/file_upload', function (req, res) {
//  /*处理浏览器同源策略(跨域)问题*/
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  res.header('Access-Control-Allow-Headers', 'Content-Type');
//  
// console.log(req.files[0].path+'----'+req.files[0].originalname); // 上传的文件信息
// 
// var des_file = __dirname + "/public/img/" + req.files[0].originalname;
// fs.readFile( req.files[0].path, function (err, data) {
//      fs.writeFile(des_file, data, function (err){
//       if( err ){
//            console.log(err);
//       }else{
//             response = {
//                 message:'File uploaded successfully', 
//                 filename:des_file
//            };
//        }
//        console.log( response );
//        res.end(JSON.stringify(response));
//     });
// });
//})
//=============================================================================================================================================================================
app.post('/create_name', function(req,res){//新增
	/*处理浏览器同源策略(跨域)问题*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
   if(login_token==req.body.login_token){
   	  
// 	 var connection = mysql.createConnection(settings.db);
//   connection.connect();
     
     var users = {
      	    id:'0',
      	    name:req.body.name,
      	    password:md5(req.body.password),
      	    date:new Date()
      }
     
//   var seleactive = 'insert into x003 values(0,'+req.body.name+','+md5(req.body.password)+','+new Date()+');' 
//	 connection.query(seleactive, function(err,rows) {
//  	   if (err) throw err;
   	       
// 	       console.log(rows);
   	       
// 	 })
      
     user.saver(users,'x003'); 
     response={
    		 message:'200',
    		 filename:'ok！',
    		 ader:users
    	};
      
      res.end(JSON.stringify(response));
      
    }else{
    	response={
    		 message:'300',
    		 filename:'access denied！'
    	}
    	res.end(JSON.stringify(response))
    }
})

 //=============================================================================================================================================================================
//查询功能   
app.post('/select_id',function(req,res){
	/*处理浏览器同源策略(跨域)问题*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
     ad()
    if(login_token == req.body.login_token){
//  	console.log(req.body);
    	//连接数据库
   var connection = mysql.createConnection(settings.db);
   connection.connect();
//分页查询
//var selectSQL = `select * from x003 where id > (`+(req.body.pageNo-1)+`)*`+req.body.pageSize+` limit `+req.body.pageSize+`;`

var hou = req.body.pageNo*req.body.pageSize;
var qian = hou-req.body.pageSize;
var selectSQL = `select * from x003 limit `+qian+`,`+hou+`;`

   connection.query(selectSQL, function(err, rows){
        if (err) throw err;
           response={
    		 message:'200',
    		 filename:'ok',
    		 data:rows,
    		 act:shu.length
    	   }
          res.end(JSON.stringify(response))
    });
    //关闭连接
    connection.end();
    }else{
    	response={
    		 message:'300',
    		 filename:'no',
    	}
       res.end(JSON.stringify(response))
    }
})
 //=============================================================================================================================================================================
//删除功能   
 app.post('/delect',function(req,res){
	/*处理浏览器同源策略(跨域)问题*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
     
    if(login_token == req.body.login_token){
    	console.log(req.body.id)
    	user.shan({id:req.body.id},'x003');
    	response={
    		 message:'200',
    		 filename:'ok',
    		 mu:req.body.id
    	}
       res.end(JSON.stringify(response))
    }else{
    	response={
    		 message:'300',
    		 filename:'no',
    	}
       res.end(JSON.stringify(response))
    }
})

 //=============================================================================================================================================================================
//修改功能   
 app.post('/update',function(req,res){
	/*处理浏览器同源策略(跨域)问题*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
     
    if(login_token == req.body.login_token){
        
    	user.xiu({id:req.body.id,name:req.body.name},'x003');
    	response={
    		 message:'200',
    		 filename:'修改成功',
    		 mu:{id:req.body.id,name:req.body.name}
    	}
       res.end(JSON.stringify(response))
    }else{
    	response={
    		 message:'300',
    		 filename:'no',
    	}
       res.end(JSON.stringify(response))
    }
})






var server = app.listen(8081, function(){
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})

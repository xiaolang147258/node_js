//express_demo.js 文件
var express = require('express');
var app = express();
var fs = require('fs');
var mysql = require('mysql');

var bodyParser = require('body-parser');
var multer  = require('multer');

var user = require('./zsgc.js');
// var settings = require('./setting.js');

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

app.get('/onilse_tv', function (req, res) {
   res.sendFile(__dirname + "/public/tv/onilse_tv/dist/index.html");//将html传递给前端
})

var shu = '1'
function ad(){//查询所有的数据
	 // var connection = mysql.createConnection(settings.db);
     // connection.connect();
     var seleactive = `select * from x003;`;
	 // connection.query(seleactive, function(err, rows) {
  //   	   if (err) throw err;
  //   	   shu = rows
  //    })
	 user.pool.getConnection((err,connection)=>{//connection链接
	    if(err){console.log('---:'+err);return}
	 	 connection.query(seleactive,(err,data)=>{//data是执行完操作之后mysql给予的响应结果
	 	  	if(err) throw err;
	 		shu = data;
	 	  	connection.release()//释放链接
	 	  })
	   })
     // connection.end();
}

 //=============================================================================================================================================================================
//登录功能//
var login_token = '';
app.post('/login',(req,res)=>{
	/*处理浏览器同源策略(跨域)问题*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
   if(tokenid_md5==req.body.tokenid){
		   user.pool.getConnection((err,connection)=>{//connection链接
		      if(err){
		        console.log('---:'+err);
		        return;
		      }
		   	  if(err) throw err;
		   	  connection.query('select * from x003 where name=?',req.body.name,(err,data)=>{//data是执行完操作之后mysql给予的响应结果
		   	  	if(err) throw err;
		   		console.log(data);
				if(data.length==0){
							   	 response={
							   	 		   message:'301',
							   	 		   filename:'用户不存在'
							   	 	    }
							   	 res.end(JSON.stringify(response))
				                
				}else{
							     // console.log(md5(req.body.password),data[0].password);
							   	 if(md5(req.body.password) == data[0].password){
							   	  	       login_token = data[0].id;
							       		   response={
							       		      message:'200',
							       		      filename:'ok',
							       		      data:login_token
							       	        }
							           res.end(JSON.stringify(response))
							   	  }else{
							   	  	  response={
							       		   message:'302',
							       		   filename:'密码不正确',
										   req_body:req.body
							       	      }
							         res.end(JSON.stringify(response))
							   	   }   
				}
		   	  	connection.release()//释放链接
		   	  })
		     })
   }else{
   	   response={
    		   message:'300',
    		   filename:'no',
    	    }
	   res.end(JSON.stringify(response))
   }
})

//=============================================================================================================================================================================
app.post('/create_name', function(req,res){//新增
	/*处理浏览器同源策略(跨域)问题*/
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
   if(login_token==req.body.login_token){
	  let login_token = md5(req.body.name+req.body.password+new Date());
     var users = {
      	    id:login_token,
      	    name:req.body.name,
      	    password:md5(req.body.password),
      	    date:new Date()
      }
     user.saver(users,'x003');
	 if(user.data){
		 response={
    		 message:'200',
    		 filename:'ok！',
    		 ader:users
    	 };
	 }else{
		 response={
		     		 message:'300',
		     		 filename:'no！',
		     		 ader:users
		 };
	 }
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
		
//分页查询
//var selectSQL = `select * from x003 where id > (`+(req.body.pageNo-1)+`)*`+req.body.pageSize+` limit `+req.body.pageSize+`;`

var hou = req.body.pageNo*req.body.pageSize;
var qian = hou-req.body.pageSize;
// var selectSQL = `select * from x003 limit `+qian+`,`+hou+`;`
var selectSQL = `select * from x003 limit ?,?;`;
let val = [qian,hou];
 
	user.pool.getConnection((err,connection)=>{//connection链接
	   if(err){
	     console.log('---:'+err);
	     return;
	   }
		  if(err) throw err;
		  connection.query(selectSQL,val,(err,data)=>{//data是执行完操作之后mysql给予的响应结果
		  	if(err) throw err;
			   response={
			    		 message:'200',
			    		 filename:'ok',
			    		 data:data,
			    		 act:shu.length
			    	   }
			    res.end(JSON.stringify(response))   
		  	connection.release()//释放链接
		  })
	  })
	
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
    	user.xiu({name:req.body.name,id:req.body.id},'x003');
		console.log(user.data,'修改结果');
    	response={
    		 message:'200',
    		 filename:'修改成功',
    		 name:req.body.name
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
var poor = 8081;
// var poor = 0.0.0.0
var server = app.listen(poor, function(){
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})

//express_demo.js 文件
var express = require('express');
var app = express();
var fs = require('fs');
var mysql = require('mysql');

var bodyParse = require('body-parser');
var multer  = require('multer');
// var upload = multer({dest:'public/img'})

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


//**重要***************************************************************************************************************************
//加载body-parser,用来处理post提交过来的数据
var bodyParser = require('body-parser')
//bodyParser配置
app.use(bodyParser.json());
app.use( bodyParser.urlencoded({
    extended: false
}) )
//********************************************************************************************************************************


// 设置图片存储路径
var storage = multer.diskStorage({
  destination: function(req, file, cb) {cb(null, './public/img');},
  filename: function(req, file, cb) {cb(null, `${Date.now()}-${file.originalname}`)}
})

// 添加配置文件到muler对象。
var upload = multer({ storage: storage });var imgBaseUrl = '../'

// bodyParse 用来解析post数据
app.use(bodyParse.urlencoded({extended:false}));
app.use(express.static('public'));

// 解决跨域问题
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {res.send(200); }else {next();}
})

//上传图片接口===============================================================================================================================================================
app.post('/imgage',upload.single('myfile'),function(req,res){
	// 读取上传的图片信息
	  var files = req;
	  console.log(req.body)
	  console.log(req.file)
	  // 设置返回结果
	  var result = {};
	  if(!files) {
	    result.code = 300;
	    result.errMsg = '上传失败';
	  } else {
	    result.code = 200;
	    result.data = {
	      url:files.file.path,
		  data:files.body
	    }
	    result.errMsg = '上传成功';
	  }
	  res.end(JSON.stringify(result));
})
//==========================================================================================================================================================================

app.use(express.static(__dirname+'/public/html/3dyun'));//配置3dyun里面的静态资源到服务器
app.get('/index', function (req, res) {
   res.sendFile(__dirname + "/public/html/3dyun/index.html");//将html传递给前端
})

//==========================================================================================================================================================================
var shu = '1'
function ad(){//查询所有的数据
     var seleactive = `select * from x003;`;
	 user.pool.getConnection((err,connection)=>{//connection链接
	    if(err){console.log('---:'+err);return}
	 	 connection.query(seleactive,(err,data)=>{//data是执行完操作之后mysql给予的响应结果
	 	  	if(err) throw err;
	 		shu = data;
	 	  })
		 connection.release()//释放链接
	   })
}

 //=============================================================================================================================================================================
//登录功能//
var login_token = '';
app.post('/login',(req,res)=>{
		   user.pool.getConnection((err,connection)=>{//connection链接
		      if(err){
		        console.log('数据库报错：'+err);return;
		      }
		   	  if(err) throw err;
		   	  connection.query('select * from x003 where name=?',req.body.name,(err,data)=>{//data是执行完操作之后mysql给予的响应结果
			    console.log(data);
		   	  	if(err) throw err;
				if(data.length==0){
						response={
							code:'301',
							filename:'用户不存在'
						}
				}else{
							     console.log(md5(req.body.password),data[0].password);
							   	 if(md5(req.body.password) == data[0].password){
							   	  	       login_token = data[0].id;
							       		   response={
							       		      code:'200',
							       		      filename:'ok',
							       		      data:login_token
							       	        }
										   // user.select_05({id:data[0].id},'x005');
								   connection.query('select * from x005 where id=?;',data[0].id,(errs,datas)=>{//data是执行完操作之后mysql给予的响应结果   
										   if(errs) throw errs;
										   console.log(datas,datas.length,'查询登录的结果');
										   if(datas.length==0){
											   console.log('添加登录状态')
											   let users={id:data[0].id,date:new Date()};
									           user.saver_05(users,'x005');
										   }
							        })
									res.end(JSON.stringify(response))
							   	  }else{
							   	  	  response={
							       		   code:'302',
							       		   filename:'密码不正确',
										   req_body:req.body
							       	      }
									  res.end(JSON.stringify(response))
							   	   }   
				}
		   	  	connection.release()//释放链接
		   	  })
		     })
})

//=============================================================================================================================================================================
app.post('/create_name', function(req,res){//新增
	 let login_token = md5(req.body.name+req.body.password+new Date());
     var users = {
      	    id:login_token,
      	    name:req.body.name,
      	    password:md5(req.body.password),
      	    date:new Date(),//创建时间
			numbder:0,//会员等级==默认普通用户
			fs_date:new Date(),//封号时间==默认当天解封
			vip_date:new Date(),//会员时间==默认当天到期
			fs_number:0,//账户状态==默认正常
      }
     user.saver(users,'x003');
	 if(user.data){
		 response={
    		 code:'200',
    		 filename:'ok！',
    		 ader:users
    	 };
	 }else{
		 response={
		     		 code:'300',
		     		 filename:'no！',
		     		 ader:users
		 };
	 }
     res.end(JSON.stringify(response));
})


 //=============================================================================================================================================================================
//查询功能   

app.post('/select_id',function(req,res){
  
 if(req.body.login_token){
  user.select_05({id:req.body.login_token},'x005');
	 console.log(user.data.length,'======',req.body);
	if(user.data.length!=0){
	 ad()
//分页查询
//var selectSQL = `select * from x003 where id > (`+(req.body.pageNo-1)+`)*`+req.body.pageSize+` limit `+req.body.pageSize+`;`
var hou = req.body.pageNo*req.body.pageSize;
var qian = hou-req.body.pageSize;
// var selectSQL = `select * from x003 limit `+qian+`,`+hou+`;`

var selectSQL = `select * from x003 limit ?,?;`;
let val = [qian,hou];

let number = req.body.number?true:false;
let vip_date = req.body.vip_date?true:false;
let fs_number = req.body.fs_number?true:false;
let fs_date = req.body.fs_date?true:false;

if(number==true&&vip_date==true&&fs_number==false&&fs_date==false){
	selectSQL = `select * from x003 where number=? && vip_date=? limit ?,?;`;
	val = [req.body.number,req.body.vip_date,qian,hou];
}else if(number==true&&vip_date==false&&fs_number==true&&fs_date==false){
	selectSQL = `select * from x003 where number=? && fs_number=? limit ?,?;`;
	val = [req.body.number,req.body.fs_number,qian,hou];
}else if(number==true&&vip_date==false&&fs_number==false&&fs_date==true){
	selectSQL = `select * from x003 where number=? && fs_date=? limit ?,?;`;
	val = [req.body.number,req.body.fs_date,qian,hou];
}else if(number==true&&vip_date==true&&fs_number==true&&fs_date==false){
	selectSQL = `select * from x003 where number=? && vip_date=? && fs_number=? limit ?,?;`;
	val = [req.body.number,req.body.vip_date,req.body.fs_number,qian,hou];
}else if(number&&vip_date&&fs_numbe&&fs_date){
	selectSQL = `select * from x003 where number=? && vip_date=? && fs_number=? &&fs_date=? limit ?,?;`;
	val = [req.body.number,req.body.vip_date,req.body.fs_number,req.body.fs_date,qian,hou];
}else if(number==false&&vip_date==true&&fs_number==true&&fs_date==false){
	selectSQL = `select * from x003 where vip_date=? && fs_number=? limit ?,?;`;
	val = [req.body.vip_date,req.body.fs_number,qian,hou];
}else if(number==false&&vip_date==true&&fs_number==false&&fs_date==true){
	selectSQL = `select * from x003 where vip_date=? && fs_date=? limit ?,?;`;
	val = [req.body.vip_date,req.body.fs_date,qian,hou];
}else if(number==false&&vip_date==true&&fs_number==true&&fs_date==true){
	selectSQL = `select * from x003 where vip_date=? && fs_date=? && fs_number=? limit ?,?;`;
	val = [req.body.vip_date,req.body.fs_date,req.body.fs_number,qian,hou];
}else if(number==false&&vip_date==false&&fs_number==true&&fs_date==true){
	selectSQL = `select * from x003 where fs_date=? && fs_number=? limit ?,?;`;
	val = [req.body.fs_date,req.body.fs_number,qian,hou];
}

	user.pool.getConnection((err,connection)=>{//connection链接
	   if(err){console.log('---:'+err);return;}
		  if(err) throw err;
		  connection.query(selectSQL,val,(err,datas)=>{//data是执行完操作之后mysql给予的响应结果
		  	if(err) throw err;
			   console.log(datas)
			   response={
			    		 code:'200',
			    		 filename:'ok',
			    		 data:datas,
			    		 act:shu.length
			    	   }
					   res.end(JSON.stringify(response));//获取数据==需要先把从数据库获取到的数据传递出去，再释放数据库连接
		  })
		  connection.release()//释放链接 
		 
	  })
    }else{
    	response={
    		 code:'300',
    		 filename:'no',
    	}
       res.end(JSON.stringify(response))
    }
	
	}else{
		response={
		    		 code:'301',
		    		 filename:'id不合法',
		    	}
		res.end(JSON.stringify(response))
	}
	
})
 //=============================================================================================================================================================================
//删除功能   
 app.post('/delect',function(req,res){
    	console.log(req.body.id)
		user.shan({id:req.body.id},'x003');
		  response={
    		 code:'200',
    		 filename:'ok',
    		 mu:req.body.id
    	  }
	res.end(JSON.stringify(response))
})

//退出登录
app.post('/delect_login',function(req,res){
    	console.log(req.body.id)
		user.shan({id:req.body.id},'x005');
		  response={
    		 code:'200',
    		 filename:'ok',
    		 mu:req.body.id
    	  }
	res.end(JSON.stringify(response))
})

 //=============================================================================================================================================================================
//修改功能  

 function date_fx_vip(date,index){// 时间戳 + 天数 = 时间戳
	    var time_diff = new Date(date).getTime() + (((index*24)*3600)*1000);return new Date(time_diff);
 };

//封号接口
app.post('/update_fs',function(req,res){
	    let dates = date_fx_vip(new Date(),req.body.fs_date);
    	user.xiu({min:dates,id:req.body.id},{b:'x003',m:'fs_date'});
		user.xiu({min:1,id:req.body.id},{b:'x003',m:'fs_number'});
    	response={
    		 code:'200',
    		 filename:'成功',
    		 name:'封禁'+new Date(req.body.fs_date).getDate()+'天'
    	}
	res.end(JSON.stringify(response))
})
//解封接口
app.post('/update_fs_off',function(req,res){
	     let datess = new Date( new Date().getTime() - (((1*24)*3600)*1000));
    	user.xiu({min:datess,id:req.body.id},{b:'x003',m:'fs_date'});
		user.xiu({min:0,id:req.body.id},{b:'x003',m:'fs_number'});
    	response={
    		 code:'200',
    		 filename:'成功',
    	}
	res.end(JSON.stringify(response))
}) 


//升级账户 
 app.post('/update_top',function(req,res){
	 if(req.body.number&&req.body.vip_date&&req.body.id){
	   user.pool.getConnection((err,connection)=>{//connection链接
		connection.query('select * from x003 where id=?;',req.body.id,(errs,datas)=>{//data是执行完操作之后mysql给予的响应结果
			if(errs) throw errs;
			let date_ss = date_fx_vip(datas[0].vip_date,req.body.vip_date);
			user.xiu({min:date_ss,id:req.body.id},{b:'x003',m:'vip_date'});
			user.xiu({min:req.body.number,id:req.body.id},{b:'x003',m:'number'});
			response={
				 code:'200',
				 filename:'修改成功',
				 name:req.body
			}
			res.end(JSON.stringify(response))
		 })
		  connection.release()//释放链接
	    })
	 }else{
		 response={
		 	 code:'300',
		 	 filename:'缺少字段',
		 	 name:req.body
		 }
		 res.end(JSON.stringify(response))
	 }
});

//修改密码
app.post('/update_xiu',function(req,res){
	 if(req.body.password&&req.body.id){
    	user.xiu({min:md5(req.body.password),id:req.body.id},{b:'x003',m:'password'});
    	response={
    		 code:'200',
    		 filename:'成功',
    		  name:req.body
    	}
	    res.end(JSON.stringify(response))
	 }else{
	 		 response={
	 		 	 code:'300',
	 		 	 filename:'缺少字段',
	 		 	 name:req.body
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

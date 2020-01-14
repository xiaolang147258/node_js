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
  destination: function(req, file, cb) {
	  // cb(null,path.join(__dirname,'/public/img'));
	  cb(null,'./public/img');
	  },
  filename: function(req, file, cb) {
	  cb(null, `${Date.now()}-${file.originalname}`)
	  // cb(null,Date.now() + path.extname(file.originalname))
   }
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


const os = require('os');
///////////////////获取本机ip///////////////////////
function getIPAdress() {
        const osType = os.type(); //系统类型
        const netInfo = os.networkInterfaces(); //网络信息
        let ip = '';
        if (osType === 'Windows_NT') { 
            for (let dev in netInfo) {
            	//win7的网络信息中显示为本地连接，win10显示为以太网
                if (dev === '本地连接' || dev === '以太网') {
                    for (let j = 0; j < netInfo[dev].length; j++) {
                        if (netInfo[dev][j].family === 'IPv4') {
                            ip = netInfo[dev][j].address;
                            break;
                        }
                    }
                }
            }
        } else if (osType === 'Linux') {
            ip = netInfo.eth0[0].address;
        }
        return ip;
}
const myHost = getIPAdress();

// let localtion = 'http://net69.fun:8999';
let localtion = 'http://'+myHost+':8999';
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
		// let localtion = 'http://'+myHost+':8081'
	    result = {
	      url: localtion+'/img/'+files.file.filename,
		  datas:files.body,
		  data:[(localtion+'/img/'+files.file.filename)],
		  errno:0,
		  code:200
	    }
	    result.errMsg = '上传成功';
	  }
	  res.end(JSON.stringify(result));
})
//==========================================================================================================================================================================

// app.use(express.static(__dirname+'/public'));//配置3dyun里面的静态资源到服务器
app.use(express.static(__dirname+'/public/html/3dyun'));//配置3dyun里面的静态资源到服务器
app.get('/index', function (req, res) {//跳转至登录界面
   res.sendFile(__dirname + "/public/html/3dyun/index.html");//将html传递给前端
})

app.use(express.static(__dirname+'/public/dist'));//配置3dyun里面的静态资源到服务器
app.get('/put', function (req, res) {//跳转至管理页面
   res.sendFile(__dirname + "/public/dist/index.html");//将html传递给前端
})

app.use(express.static(__dirname+'/public/tv/onilse_tv/dist'));//配置3dyun里面的静态资源到服务器
app.get('/tv', function (req, res) {
   res.sendFile(__dirname + "/public/tv/onilse_tv/dist/index.html");//将html传递给前端
})

//==========================================================================================================================================================================
var shu = '';
function ad(biao){//查询所有的数据
     var seleactive = `SELECT count(*) FROM `+biao+`;`;
	 user.pool.getConnection((err,connection)=>{//connection链接
	    if(err){console.log('---:'+err);return}
	 	 connection.query(seleactive,(err,data)=>{//data是执行完操作之后mysql给予的响应结果
	 	  	if(err) throw err;
	 		shu = data;
			console.log(shu,'数据长度')
	 	  })
		 connection.release()//释放链接
	   })
}

 //=============================================================================================================================================================================
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
						res.end(JSON.stringify(response))
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
		   	  	
		   	  })
			  connection.release()//释放链接
		     })
			 
})

 //=============================================================================================================================================================================
//=============================================================================================================================================================================
//新增用户  003表
app.post('/create_name', function(req,res){
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
		 response={code:'200',filename:'ok！',ader:users};
	 }else{response={code:'300',filename:'no！',ader:users}}
         res.end(JSON.stringify(response));
})



function shu_s(){//生成随机数
	 var result = [];
	 for(var i=0;i<10;i++){var ranNum = Math.ceil(Math.random() * 25);result.push(String.fromCharCode(65+ranNum))}return result.join('');
};

//新建商品   004表
app.post('/create_shang', function(req,res){
	 let _token = md5(shu_s()+new Date());
     var users = {
      	    // img_title:JSON.stringify(req.body.img_title),//标题图
			img_title:req.body.img_title,//标题图
      	    title:req.body.title,//标题
      	    id:_token,
			value:req.body.value,//内容
			// img_box:JSON.stringify(req.body.img_box),//内容介绍图片
			img_box:req.body.img_box.join(','),//内容介绍图片
			type:2,//状态  2=上架  1=下架
			jin_num:req.body.jin_num,//  2=精选   1=普通
			size:req.body.size,
			type_lei:req.body.type_lei,// 1=软件  2=游戏
      }
     user.saver_004(users,'x004');
	 if(user.data){
		 let box = {
		 		 id:_token,
		 		 url:req.body.url
		 }
		 user.saver_004_2(box,'x004_2');
		 response={code:'200',filename:'ok！',ader:users};
	 }else{response={code:'300',filename:'no！',ader:users}}
         res.end(JSON.stringify(response));
})



 //=============================================================================================================================================================================
 //=============================================================================================================================================================================

//查询功能   会员列表
app.post('/select_id',function(req,res){
if(req.headers.authorization){
	// ad('x003');
  // user.select_05({id:req.headers.authorization.replace("Bater ","")},'x005');
// if(user.data.length!=0){
//分页查询
var hou = req.body.pageNo*req.body.pageSize;
var qian = hou-req.body.pageSize;
var selectSQL = `select * from x003 limit ?,?;`;
let val = [qian,hou];
let number = req.body.number?true:false;
  if(req.body.number===0){number = true}
let fs_number = req.body.fs_number?true:false;
  if(req.body.fs_number===0){fs_number = true}

if(req.body.name){
	selectSQL = `select * from x003 where name=?;`;
	val = [req.body.name];
}
if(number==true&&fs_number==false){ 
	selectSQL = `select * from x003 where number=? limit ?,?;`;
	val = [req.body.number,qian,hou];
}else if(number==false&&fs_number==true){
	selectSQL = `select * from x003 where fs_number=? limit ?,?;`;
	val = [req.body.fs_number,qian,hou];
}else if(number==true&&fs_number==true){
	selectSQL = `select * from x003 where number=? && fs_number=? limit ?,?;`;
	val = [req.body.number,req.body.fs_number,qian,hou];
}
    
	user.pool.getConnection((err,connection)=>{//connection链接
	   if(err){console.log('---:'+err);return;}
		  if(err) throw err;
		  connection.query(selectSQL,val,(err,datas)=>{//data是执行完操作之后mysql给予的响应结果
		  	if(err) throw err;
			var seleactive = `SELECT count(*) FROM x003;`;
			user.pool.getConnection((err,connectionss)=>{//connection链接
				 connectionss.query(seleactive,(err,data_length)=>{//data是执行完操作之后mysql给予的响应结果
				  if(err) throw err;
					 response={
					  		 code:'200',
					  		 filename:'ok',
					  		 data:datas,
					  		 act:JSON.stringify(data_length[0])
					  	   }
					  res.end(JSON.stringify(response));//获取数据==需要先把从数据库获取到的数据传递出去，再释放数据库连接  
				  })
				  connectionss.release()//释放链接
			  })
		  })
		  connection.release()//释放链接 
	  })
    // }else{
    // 	response={code:'300',filename:'no'}
    //     res.end(JSON.stringify(response))
    // }
	}else{
		response={code:'301',filename:'id不合法'}
		res.end(JSON.stringify(response))
	}
})

//==========================================================================================================================
//==========================================================================================================================
//查询功能   商品列表
app.post('/select_shang',function(req,res){
if(req.headers.authorization){
  
//分页查询
var hou = req.body.pageNo*req.body.pageSize;
var qian = hou-req.body.pageSize;
var selectSQL = `select * from x004 limit ?,?;`;
let val = [qian,hou];

let jin_num = req.body.jin_num?true:false;
let type_lei = req.body.type_lei?true:false;
  
if(req.body.title){
	selectSQL = `select * from x004 where title like ? limit ?,?;`;//模糊查询
	val = [req.body.title+'%',qian,hou];
}
if(jin_num==true&&type_lei==false){ 
	selectSQL = `select * from x004 where jin_num=? limit ?,?;`;
	val = [req.body.jin_num,qian,hou];
}else if(jin_num==false&&type_lei==true){
	selectSQL = `select * from x004 where type_lei=? limit ?,?;`;
	val = [req.body.type_lei,qian,hou];
}else if(jin_num==true&&type_lei==true){
	selectSQL = `select * from x004 where jin_num=? && type_lei=? limit ?,?;`;
	val = [req.body.jin_num,req.body.type_lei,qian,hou];
}
	user.pool.getConnection((err,connection)=>{//connection链接
	   if(err){console.log('---:'+err);return;}
		  if(err) throw err;
		  connection.query(selectSQL,val,(err,datas)=>{//data是执行完操作之后mysql给予的响应结果
		  	if(err) throw err;
			var seleactive = `SELECT count(*) FROM x004;`;
			user.pool.getConnection((err,connectionss)=>{//connection链接
				 connectionss.query(seleactive,(err,data_length)=>{//data是执行完操作之后mysql给予的响应结果
				  if(err) throw err;
					 response={
			    		 code:'200',
			    		 filename:'ok',
			    		 data:datas,
						 act:JSON.stringify(data_length[0])
			    	   }
				     res.end(JSON.stringify(response));//获取数据==需要先把从数据库获取到的数据传递出去，再释放数据库连接
				  })
				  connectionss.release()//释放链接
			  })
		  })
		  connection.release()//释放链接 
	  })
    
	}else{
		response={code:'301',filename:'id不合法'}
		res.end(JSON.stringify(response))
	}
})


//=============================================================================================================================================================================
//=============================================================================================================================================================================
//删除功能   
 app.post('/delect',(req,res)=>{
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
app.post('/delect_login',(req,res)=>{
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
 //=============================================================================================================================================================================
//修改功能  

 function date_fx_vip(date,index){// 时间戳 + 天数 = 时间戳
	    var time_diff = new Date(date).getTime() + (((index*24)*3600)*1000);return new Date(time_diff);
 };

//封号接口
app.post('/update_fs',(req,res)=>{
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
app.post('/update_fs_off',(req,res)=>{
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
 app.post('/update_top',(req,res)=>{
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
app.post('/update_xiu',(req,res)=>{
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


//=============================================================================================================================================================================
//=============================================================================================================================================================================
//获取商品下载地址接口  会先判断商品是否为精选   是的话对用户身份验证判断，判断不为普通用户，即可请求
app.post('/select_url',(req,res)=>{
	if(req.headers.authorization){}else{
		response={
		    		 code:'400',
		    		 filename:'no',
		    		 data:'缺少用户id'
		    	  }
		res.end(JSON.stringify(response));
		return false;
	}
	user.pool.getConnection((err,connection)=>{//connection链接
	connection.query('select * from x004 where id=?',req.body.shang_id,(err,data_box)=>{//data是执行完操作之后mysql给予的响应结果
		if(err) throw err;
	    if(data_box[0].jin_num==2){
		    user.pool.getConnection((err,connections)=>{//connection链接
			 connections.query('select * from x003 where id=?',req.headers.authorization.replace("Bater ",""),(err,datas)=>{//data是执行完操作之后mysql给予的响应结果
			    console.log(datas);
				if(err) throw err;
			    if(datas[0].number!=0){
				  user.pool.getConnection((err,connections2)=>{//connection链接
				   connections2.query('select * from x004_2 where id=?',req.body.shang_id,(err,datas2)=>{//data是执行完操作之后mysql给予的响应结果
				  	if(err) throw err;     
				  		  response={
				      		 code:'200',
				      		 filename:'ok',
				      		 data:datas2[0].url
				      	  }
				         res.end(JSON.stringify(response));
					})
					 connections2.release()//释放链接
				  })
				}
			})
			connections.release()//释放链接
		  })
		}else{
			user.pool.getConnection((err,connections2)=>{//connection链接
			 connections2.query('select * from x004_2 where id=?',req.body.shang_id,(err,datas2)=>{//data是执行完操作之后mysql给予的响应结果
				if(err) throw err;     
					  response={
			    		 code:'200',
			    		 filename:'ok',
			    		 data:datas2[0].url
			    	  }
			       res.end(JSON.stringify(response));
			})
			connections2.release()//释放链接
			})
		}
	})	
	connection.release()//释放链接
  })
})

//上架、下架修改、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
app.post('/shang_sx',(req,res)=>{
	 if(req.headers.authorization){}else{response={code:'400',filename:'no',data:'缺少用户id'};res.end(JSON.stringify(response));return false}
	 if(req.body.type&&req.body.id){
    	user.xiu({min:req.body.type,id:req.body.id},{b:'x004',m:'type'});
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
//普通，精选修改、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
app.post('/shang_pj',(req,res)=>{
	 if(req.headers.authorization){}else{response={code:'400',filename:'no',data:'缺少用户id'};res.end(JSON.stringify(response));return false}
	 if(req.body.jin_num&&req.body.id){
    	user.xiu({min:req.body.jin_num,id:req.body.id},{b:'x004',m:'jin_num'});
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

//删除商品、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、。。。。。，。
app.post('/shang_delete',(req,res)=>{
	 if(req.headers.authorization){}else{response={code:'400',filename:'no',data:'缺少用户id'};res.end(JSON.stringify(response));return false}
	 if(req.body.id){
    	user.shan({id:req.body.id},'x004');
		user.shan({id:req.body.id},'x004_2');
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
//编辑修改商品、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、。。。。。，。
app.post('/delect_shang',(req,res)=>{
	 if(req.headers.authorization){}else{response={code:'400',filename:'no',data:'缺少用户id'};res.end(JSON.stringify(response));return false}
		var users = {
					img_title:req.body.img_title,//标题图
		 	        title:req.body.title,//标题
		 	        id:req.body.id,
					value:req.body.value,//内容
					img_box:req.body.img_box.join(','),//内容介绍图片
					jin_num:req.body.jin_num,//  2=精选   1=普通
					size:req.body.size,//软件大小
					type_lei:req.body.type_lei,// 1=软件  2=游戏
					min:req.body.url,//软件下载地址
		 }
		user.xiu_shang(users,'x004');
		user.xiu(users,{b:'x004_2',m:'url'});
    	response={
    		 code:'200',
    		 filename:'成功',
    		 name:req.body
    	}
	    res.end(JSON.stringify(response))
})

var poor = 8999;
// var poor = 0.0.0.0
var server = app.listen(poor, ()=>{
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为"+localtion);
 
})

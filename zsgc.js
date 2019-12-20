
var mysql = require('mysql');

var user = {
	data:[],
	
}
// 本地数据库//链接池
user.pool=mysql.createPool({host:'localhost',user:'root', password:'admin', database:'boss',port:'3306' })
	
//线上数据库
// user.pool=mysql.createPool({//链接池
// 	host:'129.204.194.147',
// 	user:'root',  //用户名
// 	password:'Joker#163.com',   //密码
// 	database:'boss',
// 	port:'3306',     //端口号
// 	dialect: 'mysql',
// })

function happy(a,b){//a:mysql的语句b：操作的具体数据 c:回调函数
user.pool.getConnection(function(err,connection){//connection链接
	  if(err) throw err;
	  connection.query(a,b,function(err,data){//data是执行完操作之后mysql给予的响应结果
	    if(err){console.log(err)}else{console.log(data)};
	  	if(err) throw err;
		user.data = data;
	  })
	  connection.release()//释放链接
   })
   
}

//登录
user.login = function(user,ad){
	var saversql='select * from '+ad+' where name=?'
	happy(saversql,user)
}

//003表新建
user.saver = function(user,ad){
	var saversql='insert into '+ad+' values(?,?,?,?,?,?,?,?);'
	happy(saversql,[user.id,user.name,user.password,user.date,user.numbder,user.fs_date,user.vip_date,user.fs_number])
}
//user.saver({id:0,name:"把阿布",age:"99",birth:"1997/03/05"},"mm")
//删除
user.shan = function(user,ad){
	var saversql='delete from '+ad+' where id=?';
	happy(saversql,[user.id])
}
//user.shan({id:7},"mm")
//查看


//user.cha({id:2})
//修改
user.xiu = function(user,ad){
	var saversql='update '+ad.b+' set '+ad.m+'=? where id=?';
	happy(saversql,[user.min,user.id])
}

//=======================================================================================================
//005b表新增
user.saver_05 = function(user,ad){
	var saversql='insert into '+ad+' values(?,?);'
	happy(saversql,[user.id,user.date])
}

//查询在线id
user.select_05 = function(user,ad){
	var saversql='select * from '+ad+' where id=?;'
	happy(saversql,user.id)
}

//user.xiu({age:"66",id:8},"mm")
module.exports = user;














































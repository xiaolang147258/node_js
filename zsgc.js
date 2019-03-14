
var mysql = require('mysql');

var pool=mysql.createPool({//链接池
	host:'localhost',
	user:'root',
	password:'admin',
	database:'boss'//链接的数据库
})

var user = {
	data:[],
}
	 
 

function happy(a,b){//a:mysql的语句b：操作的具体数据 c:回调函数
pool.getConnection(function(err,connection){//connection链接
	  if(err) throw err;
	  connection.query(a,b,function(err,data){//data是执行完操作之后mysql给予的响应结果
	  	if(err) throw err;
	  	console.log(data)
	  	connection.release()//释放链接
	  	
	  })
   })
   
}



//新建
user.saver = function(user,ad){
	var saversql='insert into '+ad+' values(?,?,?,?);'
	happy(saversql,[user.id,user.name,user.password,user.date])
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
	var saversql='update '+ad+' set name=? where id=?';
	happy(saversql,[user.name,user.id])
}
//user.xiu({age:"66",id:8},"mm")
module.exports = user;














































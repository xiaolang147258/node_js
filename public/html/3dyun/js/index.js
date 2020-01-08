localStorage.url = 'http://localhost';
	
	
	let heights = ($(window).height()-400)*0.5;
	$('#login').css('top',heights);
	
	if(localStorage.name){
		$("#checkbox1").attr("checked",'true');
		$('#inputEmail3').val(localStorage.name);$('#inputPassword3').val(localStorage.password);
	}else{
		$("#checkbox1").attr("checked",'false');
	}
	
	$('.btn').on('click',function(){
		if($('#inputEmail3').val()&&$('#inputPassword3').val()){
			
			$.ajax({
			 url:"http://39.108.231.124/:8081/login",  //ajax请求地址
			 cache: false,//(默认: true,dataType为script和jsonp时默认为false)设置为 false 将不缓存此页面，建议使用默认
			 type:"post",//请求方式 "POST" 或 "GET"， 默认为 "GET"。注意：其它 HTTP 请求方法，如 PUT 和 DELETE 也可以使用，但仅部分浏览器支持。
			 dataType:"json",//根据返回数据类型可以有这些类型可选：xml html script json jsonp text
			 data:{
			 	name:$('#inputEmail3').val(),
			 	password:$('#inputPassword3').val(),
			   },
			  success: function(data,textStatus){//请求成功
			     //this 调用本次AJAX请求时传递的options参数 ,如果设置context来改变了this，那这里的this就是改变过的
			     console.log(data);
			     if(data.code==200){
					localStorage.login_token = data.data;
					if ($("#checkbox1").get(0).checked) {//判断checkbox是否选中
					  localStorage.name = $('#inputEmail3').val();localStorage.password = $('#inputPassword3').val();
					  console.log(localStorage.name,localStorage.password)
					}
			     	localStorage.names = $('#inputEmail3').val();
			      swal({
					title: '登录成功!',
					text: "将会跳转至会员列表页面!",
					type: 'success',
					// showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'OK!',
					// cancelButtonText: 'No, cancel!',
					confirmButtonClass: 'btn btn-success',
					// cancelButtonClass: 'btn btn-danger',
					buttonsStyling: false
					}).then(function(isConfirm) {
					  if (isConfirm === true) {
					      window.location = 'http://39.108.231.124:8081/put#/dashboard';
					  } else if (isConfirm === false) {}
				   })
			     }else{
			     	sweetAlert('失败！','账号或者密码有误，请重新输入!','error')
			     }
			  },
			  error:function(XMLHttpRequest, textStatus, errorThrown){//请求失败
			        console.log(XMLHttpRequest,textStatus,errorThrown)
			     }
			   });
		}else{
			return false;
		}
	})
	
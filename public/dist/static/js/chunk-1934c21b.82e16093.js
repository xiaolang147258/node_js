(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1934c21b"],{"4f75":function(t,i,e){"use strict";var a=e("b6fc"),s=e.n(a);s.a},6559:function(t,i,e){"use strict";e.r(i);var a=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticStyle:{width:"100%"}},[e("el-card",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"box-card",staticStyle:{padding:"0",margin:"20px","padding-bottom":"10px"}},[e("div",{staticClass:"box_tall"},[e("el-input",{staticClass:"tab_c",attrs:{placeholder:"请输入内容",clearable:""},model:{value:t.shang.title,callback:function(i){t.$set(t.shang,"title",i)},expression:"shang.title"}}),t._v(" "),e("p",[t._v("*商品名称:")])],1),t._v(" "),e("div",{staticClass:"box_tall"},[e("el-input",{staticClass:"tab_c",attrs:{placeholder:"请输入内容",clearable:""},model:{value:t.shang.url,callback:function(i){t.$set(t.shang,"url",i)},expression:"shang.url"}}),t._v(" "),e("p",[t._v("*下载地址:")])],1),t._v(" "),e("div",{staticClass:"box_tall"},[e("a",{staticStyle:{float:"right","line-height":"38px","margin-left":"10px","font-weight":"600","margin-right":"177px"}},[t._v("M")]),t._v(" "),e("el-input",{staticClass:"tab_c",staticStyle:{width:"150px"},attrs:{type:"number",placeholder:"请输入",clearable:""},model:{value:t.shang.size,callback:function(i){t.$set(t.shang,"size",i)},expression:"shang.size"}}),t._v(" "),e("p",[t._v("*商品大小:")])],1),t._v(" "),e("div",{staticClass:"box_tall"},[e("el-select",{staticClass:"tab_c",staticStyle:{width:"150px","margin-right":"200px"},attrs:{placeholder:"请选择类型"},on:{change:t.lei},model:{value:t.lei_val,callback:function(i){t.lei_val=i},expression:"lei_val"}},t._l(t.lei_box,function(t,i){return e("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})}),1),t._v(" "),e("p",[t._v("*商品类型:")])],1),t._v(" "),e("div",{staticClass:"box_tall",staticStyle:{height:"160px",width:"700px","margin-left":"50px"}},[e("div",{staticClass:"img-box",staticStyle:{height:"160px"}},[e("el-upload",{staticClass:"avatar-uploader",attrs:{action:t.url_img,"show-file-list":!1,"on-success":t.handleAvatarSuccess,"on-error":t.handle_img_no2,name:"myfile"}},[t.shang.img_title?e("img",{staticClass:"avatar",attrs:{src:t.shang.img_title}}):e("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1),t._v(" "),e("p",[t._v("*商品头像:")])]),t._v(" "),e("div",{staticClass:"box_tall",staticStyle:{height:"150px",width:"900px","margin-left":"50px"}},[e("div",{staticClass:"img-box",staticStyle:{width:"700px"}},[e("el-upload",{attrs:{action:t.url_img,"list-type":"picture-card","on-preview":t.handlePictureCardPreview,"on-success":t.handle_img_ok,"on-error":t.handle_img_no,limit:4,name:"myfile","on-remove":t.handleRemove,"file-list":t.img_files1}},[e("el-tooltip",{staticClass:"item",attrs:{effect:"dark",content:"建议上传4x8比例且清晰的图片",placement:"right-start"}},[e("i",{staticClass:"el-icon-plus",staticStyle:{width:"100%",height:"100%",outline:"none"}})])],1)],1),t._v(" "),e("p",[t._v("*封面图:")])]),t._v(" "),e("div",{staticClass:"box_tall"},[e("el-switch",{staticClass:"tab_c",attrs:{"active-color":"#E6A23C","inactive-color":"#909399"},model:{value:t.shang.jin_num,callback:function(i){t.$set(t.shang,"jin_num",i)},expression:"shang.jin_num"}}),t._v(" "),e("p",[t._v("普通 / 精选:")])],1),t._v(" "),e("div",{staticClass:"box_tall",staticStyle:{float:"left",width:"100%",height:"auto"}},[e("p",{staticStyle:{float:"left","margin-left":"100px",width:"70%","margin-top":"20px"}},[t._v("*商品简介:")]),t._v(" "),e("div",{staticStyle:{border:"1px solid #ccc",float:"left",width:"80%","margin-left":"110px","border-bottom":"none","margin-top":"10px"},attrs:{id:"editor2"}}),t._v(" "),e("div",{staticClass:"text",staticStyle:{float:"left","margin-left":"110px",height:"600px"},attrs:{id:"editor3"}}),t._v(" "),e("div",{staticStyle:{width:"100%",height:"40px",float:"left","margin-top":"30px"}},[e("div",{staticStyle:{width:"210px",height:"100%",margin:"0 auto"}},[e("el-button",{staticStyle:{float:"left"},attrs:{type:"info"},on:{click:t.quxioa}},[t._v("返回列表")]),t._v(" "),e("el-button",{staticStyle:{float:"right"},attrs:{type:"primary"},on:{click:t.git_active}},[t._v("确认提交")])],1)])])]),t._v(" "),e("el-dialog",{attrs:{visible:t.dialogVisible},on:{"update:visible":function(i){t.dialogVisible=i}}},[e("img",{attrs:{width:"100%",src:t.dialogImageUrl,alt:""}})])],1)},s=[],l=(e("c5f6"),e("7f7f"),e("28a5"),e("653a")),n={computed:{url_img:function(){return l["a"].state.url_data+"/imgage"},headers_s:function(){return{Authorization:"Bearer "+localStorage.token}},img_file:function(){return this.shang.img_box},img_files1:function(){return this.file_list},img_box:function(){return function(t){return t.split(",")}}},data:function(){return{lei_box:[{name:"软件",id:1},{name:"游戏",id:2}],lei_val:1,shang:{img_title:"",title:"",img_box:[],size:"",type:"",jin_num:!1,value:"",url:"",id:""},inputse:"",radios:"0",file_name:"",isIndeterminate:!1,dialogImageUrl:"",dialogVisible:!1,img_url_box:[],editor:"",top_show:!1,lx_name:"",file_list:[],show_unm:!0,imageUrl:"",loading:!1}},methods:{lei:function(){console.log(this.lei_val)},handleAvatarSuccess:function(t,i,e){this.shang.img_title=t.url,console.log(this.shang.img_title),this.$message({message:"上传成功",type:"success"})},handle_img_no2:function(t,i,e){this.$message.error("上传失败"),console.log(t)},handleRemove:function(t,i){this.shang.img_box=[];for(var e=0;e<i.length;e++)this.shang.img_box.push(i[e].name);console.log(this.shang.img_box)},handle_img_ok:function(t,i,e){this.$message({message:"上传成功",type:"success"}),this.shang.img_box.push(t.url),console.log(this.shang.img_box)},handle_img_no:function(t,i,e){this.$message.error("上传失败"),console.log(t)},handlePictureCardPreview:function(t){this.dialogImageUrl=t.url,this.dialogVisible=!0},git_active:function(){var t=this;if(""==this.shang.title)return this.$message.error("商品名称不能为空"),!1;if(""==this.shang.url)return this.$message.error("下载地址不能为空"),!1;if(!this.shang.size)return this.$message.error("商品大小不能为空"),!1;if(""==this.shang.img_title)return this.$message.error("商品头像必须上传"),!1;if(0==this.shang.img_box.length)return this.$message.error("介绍图至少上传一张"),!1;var i=/img/;if(!i.test(this.editor.txt.html())&&!this.editor.txt.text())return this.$message.error("请填写简介！"),!1;var e={img_title:this.shang.img_title,title:this.shang.title,img_box:this.shang.img_box,jin_num:this.shang.jin_num?"2":"1",value:this.editor.txt.html(),size:this.shang.size,url:this.shang.url,type_lei:this.lei_val,id:this.shang.id};console.log(e,"传递过去的数据");var a=l["a"].state.shang_put_box?"/delect_shang":"/create_shang";console.log(l["a"].state.shang_put_box?"编辑":"添加",a),this.$axios({method:"post",url:l["a"].state.url_data+a,data:e,headers:{Authorization:"Bearer "+localStorage.token}}).then(function(i){console.log(i.data,"添加商品结果"),200==i.data.code?(l["a"].state.shang_put_box="",t.$message({message:"成功",type:"success"}),t.$router.push({path:"/node_js_user02"})):i.data.code}).catch(function(t){})},git_put_act:function(){var t=this;if(l["a"].state.shang_put_box){var i=l["a"].state.shang_put_box;this.shang.title=i.title,this.shang.size=i.size,this.shang.id=i.id,this.$axios({method:"post",url:l["a"].state.url_data+"/select_url",data:{shang_id:i.id},headers:{Authorization:"Bater "+localStorage.login_token}}).then(function(i){console.log(i.data,"数据"),200==i.data.code&&(t.shang.url=i.data.data)}).catch(function(t){t.response}),this.lei_val=Number(i.type_lei),this.shang.img_title=i.img_title;for(var e=this.img_box(i.img_box),a=0;a<e.length;a++)e[a]&&this.file_list.push({name:e[a],url:e[a]});this.shang.img_box=e,this.shang.jin_num=1!=i.jin_num,this.editor.txt.html(i.value)}},quxioa:function(){this.$router.go(-1),l["a"].state.shang_put_box=""}},mounted:function(){var t=window.wangEditor,i=document.getElementById("editor2"),e=document.getElementById("editor3"),a=new t(i,e);a.customConfig.uploadImgShowBase64=!1,a.customConfig.uploadImgServer=l["a"].state.url_data+"/imgage",a.customConfig.uploadImgMaxSize=2097152,a.customConfig.uploadFileName="myfile",a.customConfig.menus=["head","bold","italic","underline","strikeThrough","foreColor","backColor","link","list","justify","quote","image","table","code","undo","redo"],a.create(),this.editor=a,this.git_put_act()}},o=n,r=(e("4f75"),e("c423"),e("2877")),c=Object(r["a"])(o,a,s,!1,null,"0c7586ca",null);i["default"]=c.exports},"84c8":function(t,i,e){},b6fc:function(t,i,e){},c423:function(t,i,e){"use strict";var a=e("84c8"),s=e.n(a);s.a}}]);
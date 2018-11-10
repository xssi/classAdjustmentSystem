<!-- 课调管理页面 -->
<template>
  <div class="sManage">
    <!-- {{surManages}} -->
    <!-- {{surveyList}} -->
    <!-- {{choice}} -->
    <div class="optionDiv">
    	<el-select size='mini' clearable v-model="choice.type" placeholder="请选择" @change='typeChange'>
        <el-option
          v-for="(item,index) in typeArr"
          :key="index"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
	    <el-input :disabled='Boolean(choice.type?0:1)' v-model="choice.search" placeholder="请输入关键字搜索" size='mini'></el-input> 
	    <el-button type="success" size="mini" @click='batch'>批量删除</el-button>
	    <el-button type="success" size="mini" @click="add">新增</el-button>
    </div>
		<div class="tableDiv">
	    	<el-table  :height='tableHeight'
		        ref="multipleTable"
		        :data="surveyList"
		        style="width: 100%"
		        @selection-change="handleSelectionChange">
		        <el-table-column
		          type="selection"
		          width="55">
		        </el-table-column>
		        <el-table-column
		          label="年级" prop='clazzVM.grade.name'  align='center'>
		        </el-table-column>
		        <el-table-column
		          prop="clazzVM.name"
		          label="班级"  align='center'>
		        </el-table-column>
		        <el-table-column
		          prop="course.name"
		          label="课程"  align='center'>
		        </el-table-column>
		        <el-table-column
		          prop="qnVM.name"
		          label="问卷"  align='center'>
		        </el-table-column>
		        <el-table-column
		          prop="user.name"
		          label="讲师"  align='center'>
		        </el-table-column>
		        <el-table-column
		          prop="surveydate"
		          label="课调时间"  align='center'>
		          <template slot-scope="scope">
		          	<span>{{scope.row.surveydate?scope.row.surveydate.split(' ')[0]:'---'}}</span>
		          </template>
		        </el-table-column>
		        <el-table-column label="操作" align='center'>
		          <template slot-scope="scope">
		          	<i class="fa fa-eye" title='预览' @click="handleWatch(scope.$index, scope.row)"></i>
		          	<i class="fa fa-pencil-square-o" title='修改' @click="handleEdit(scope.$index, scope.row)"></i>
		          	<i class="fa fa-trash" title='删除' @click="handleDelete(scope.$index, scope.row)"></i>
		          </template>
		        </el-table-column>
		      </el-table>
	  </div>
   	<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
   	 <el-form :model="form">
   	 	<el-form-item label="年级" :label-width="formLabelWidth">
			 <el-select clearable v-model="gradeId" placeholder="请选择年级年级" @change='gradeChane'>
		      <el-option v-for='(item,index) in grades' :key='index' :label="item.name" :value="item.id"></el-option>
	   	 </el-select>
	  	</el-form-item>
      <el-form-item label="班级" :label-width="formLabelWidth">
        <el-select :disabled='Boolean(gradeId?0:1)' clearable v-model="form.clazzId" placeholder="请选择班级班级">
         <el-option v-for='(item,index) in clazzesList' :key='index' :label="item.name" :value="item.id"></el-option>
	   	 	</el-select>
      </el-form-item>
      <el-form-item label="课程" :label-width="formLabelWidth">
		 		<el-select clearable v-model="form.courseId" placeholder="请选择课程">
         <el-option v-for='(item,index) in courses' :key='index' :label="item.name" :value="item.id"></el-option>
	   	 </el-select>
		  </el-form-item>
		   <el-form-item label="讲师" :label-width="formLabelWidth">
			  <el-select clearable v-model="form.userId" placeholder="请选择讲师">
	        <el-option v-for='(item,index) in teachers' :key='index' :label="item.name" :value="item.id"></el-option>
	   	 	</el-select>   
		  </el-form-item>
	    <el-form-item label="问卷" :label-width="formLabelWidth">
			  <el-select clearable v-model="form.questionnaireId" placeholder="请选择问卷">
	        <el-option v-for='(item,index) in questionnaires' :key='index' :label="item.name" :value="item.id"></el-option>
	   	 	</el-select>   
		  </el-form-item>
    	</el-form>
    	<div slot="footer" class="dialog-footer">
	      <el-button @click="dialogFormVisible = false">取 消</el-button>
	      <el-button type="primary" @click="save">保 存</el-button>
	    </div>
		</el-dialog>
	 <!-- 预览 -->
	 <el-dialog :title="currentSurvey.qnVM.name?currentSurvey.qnVM.name:' '" :visible.sync="dialogEyeVisible">
	 		<table class="eyeTable">
	 			<tr>
	 				<td>
	 					<span>班级：{{currentSurvey.clazzVM.name}}</span>
	 				</td>
	 				<td>
	 					<span>讲师：{{currentSurvey.user.name}}</span>
	 				</td>
	 				<td>
	 					<span>时间：{{currentSurvey.surveydate}}</span>
	 				</td>
	 				<td>
	 					<span>课程：{{currentSurvey.course.name}}</span>
	 				</td>
	 			</tr>
	 		</table>
	 		<div class="contentDiv">
					<div class="itemDiv" v-for='(item,index) in currentSurvey.qnVM.questionVMs' :key='index'>
					    <ul>
					    	<li>
					    		序号{{index+1}}: {{item.name}}
					    	</li>
					    	<li style="margin-left:30px" v-for='(obj,index) in item.options'>
					    	{{obj.label}}.&nbsp;{{obj.name}}
					    	</li>
					    </ul>
			  	</div>
		    </div>
		    <div slot="footer" class="dialog-footer">
		      <el-button @click="dialogFormEyeVisible = false">确定</el-button>
		    </div>
	 	</el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
export default {
  data(){
    return {
     choice:{
     	type:'',
     	search:'',
     },
     typeArr:[{
     	name:'年级',
     	value:'grade',
     },{
     	name:'班级',
     	value:'clazz',
     },{
     	name:'课程',
     	value:'course',
     },{
     	name:'讲师',
     	value:'user',
     },{
     	name:'问卷',
     	value:'qn',
     }],
     form:{
     	questionnaireId:'',
     	userId:'',
     	courseId:'',
     	clazzId:'',
     },
     gradeId:'',
     //当前要预览的课调对象的信息
     currentSurvey:{
     	qnVM:{},
     	clazzVM:{},
     	user:{},
     	course:{},
     	qnVM:{
     		questionVMs:[],
     	},
     },
     formLabelWidth:'80px',
     dialogFormVisible:false,
     dialogEyeVisible:false,
     dialogTitle:'添加课调信息',
     surveyMan:[],
     tableHeight:'500px',
     multipleSelection:[],
    }
  },
  computed:{
  	clazzesList(){
  		let vm=this;
  		return this.clazzes.filter((item)=>{
  			if(item.grade){
  				return item.grade.id==vm.gradeId;
  			}
  		});
  	},
  	surveyList(){
  		//过滤条件是this.choice.type this.choice.search
  		let vm=this;
  		return this.surManages.filter((item)=>{
  			if(vm.choice.type){
  				if(vm.choice.type=='grade' && item.clazzVM&&item.clazzVM.grade){
  					//如果用户选择年级的话，对年级数据进行过滤
  	     		return item.clazzVM.grade.name.indexOf(vm.choice.search)!=-1;
  				}else if(vm.choice.type=='clazz' && item.clazzVM){
  	     		return item.clazzVM.name.indexOf(vm.choice.search)!=-1;
  				}else if(vm.choice.type=='course' && item.course){
  	     		return item.course.name.indexOf(vm.choice.search)!=-1;
  				}else if(vm.choice.type=='user' && item.user){
  	     		return item.user.name.indexOf(vm.choice.search)!=-1;
  				}else if(vm.choice.type=='qn' && item.qnVM){
  	     		return item.qnVM.name.indexOf(vm.choice.search)!=-1;
  				}else{
  					return false;
  				}
  			}else{
  				return true;
  			}
  		});
  	},
  	...mapGetters(['surManages','questionnaires','grades','courses','clazzes','teachers']),
  },
  created(){
  	let vm=this;
  	this.findAllVM();
  	this.findAllCourse();
  	this.findAllTeacher();
  	this.findAllGrades();
  	this.findAllQuestionnaires();
  	this.findAllSurManages();
  	this.tableHeight=($(window).height()-190)+'px';
  },
  methods:{
  	gradeChane(){
  		//在年级发生更改的时候，重置班级选中的值
  		this.form.clazzId='';
  	},
  	typeChange(){
  		this.choice.search='';
  	},
  	save(){
  		this.form.status='未开启';
   		this.saveOneSurManages(this.form).then((data)=>{
          console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
            this.dialogFormVisible=false;
            this.findAllSurManages();
          }else{
            this.dialogFormVisible=false;
            this.$notify.error({
              title: '失败',
              message: '保存失败1'
            });
          }
        }).catch((error)=>{
          this.dialogFormVisible=false;
          this.$notify.error({
            title: '失败',
            message: '保存失败2'
          });
        });
  	},
  	handleDelete(index,row){
  		this.deleteSurManageById({id:row.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllSurManages();
        }else{
          this.$notify.error({
            title: '失败',
            message: '删除失败1'
          });
        }
      }).catch((error)=>{
        this.$notify.error({
          title: '失败',
          message: '删除失败2'
        });
      });
  	},
  	handleEdit(index,row){
  		this.form={
  			id:row.id,
  			questionnaireId:row.qnVM?row.qnVM.id:'',
     		userId:row.user?row.user.id:'',
     		courseId:row.course?row.course.id:'',
     		clazzId:row.clazzVM?row.clazzVM.id:'',
     		surveydate:this.getCurrentDate(),
  		}
  		this.gradeId=(row.clazzVM&&row.clazzVM.grade)?row.clazzVM.grade.id:'';
  		this.dialogFormVisible=true;
  		this.dialogTitle='修改课调信息';
  	},
  	handleWatch(index,row){
  		this.currentSurvey=row;
  		this.dialogEyeVisible=true;
  	},
  	add(){
  		this.dialogFormVisible=true;
  		this.gradeId='';
  		this.form={
	     	questionnaireId:'',
	     	userId:'',
	     	courseId:'',
	     	clazzId:'',
     }
  	},
  	batch(){
  		let vm=this;
  		let ids=this.multipleSelection.map((item)=>{
  			return item.id;
  		});
  		console.log(ids);
  		this.batchDeleteSurManages({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllSurManages();
        }else{
          this.$notify.error({
            title: '失败',
            message: '删除失败1'
          });
        }
      }).catch((error)=>{
      	console.log(error);
        this.$notify.error({
          title: '失败',
          message: '删除失败2'
        });
      });
  	},
  	//获取当前时间，返回字符串
  	getCurrentDate(){
  		// 非IE
  		// new Date('2018-11-07 08:06:03')
  		// IE
  		// new Date('2018/11/07 08:06:03')
  		// 获取时间戳 
  		let date=new Date();
  		let year=date.getFullYear();
  		let month=date.getMonth()+1;
  		month=month<10?('0'+month):month;
  		let day=date.getDate();
  		day=day<10?('0'+day):day;
  		let hour=date.getHours();
  		hour=hour<10?('0'+hour):hour;
  		let minutes=date.getMinutes();
  		minutes=minutes<10?('0'+minutes):minutes;
  		let seconds=date.getSeconds();
  		seconds=seconds<10?('0'+seconds):seconds;
  		return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
  	},
  	handleSelectionChange(val){
  		this.multipleSelection = val;
  	},
  	...mapActions(['findAllSurManages','saveOneSurManages','deleteSurManageById','batchDeleteSurManages','findAllSurManagesVM','findAllCourse','findAllTeacher','findAllGrades','findAllQuestionnaires','findAllVM']),
  },
}
</script>
<style scoped lang='scss'>
 .sManage{
	.optionDiv{
		.el-input{
			width: 200px;
		}
		.el-button{
			float: right;
			margin-left: 10px;
		}
	}
	.tableDiv{
		i{
			font-size: 20px;
			margin:5px;
		}
	}
.contentDiv{
overflow: auto;
	.itemDiv{
		position: relative;
		width: 99.9%;
		height: 160px;
		border:1px solid #000;
		padding: 3px 3px;
		border-top:none;
		.el-checkbox{
			margin:10px 0 0 10px;
		}
		ul{
			padding-left: 10px;
			list-style: none;
			font-size: 14px;
			color: #606266;
			li{
				margin-top: 5px;
			}
		}
	}
}
.eyeTable{
	width: 100%;
	line-height: 40px;
	text-align: center;
	border-collapse: collapse;
	border:1px solid #000;
	td{
		border:1px solid #000;
	}
}
}   
</style>
<!-- 课程管理页面 -->
<template>
  <div class="courseManage">
	  <div class="optionDiv">
	      <el-input v-model="search" placeholder="请输入关键字搜索" size='mini'></el-input> 
	      <el-button type="success" size="mini" @click='batchCourses'>批量删除</el-button>
	      <el-button type="success" size="mini" @click="addCourse">新增</el-button>
	  </div>
		<div class="tableDiv">
	      <el-table height='500px'
	        ref="multipleTable"
	        :data="courseLists"
	        tooltip-effect="dark"
	        style="width: 100%"
	        @selection-change="handleSelectionChange">
	        <el-table-column
	          type="selection"
	          width="55">
	        </el-table-column>
	        <el-table-column
	          label="课程名称" prop='name'  align='center'>
	        </el-table-column>
	        <el-table-column
	          prop="period"
	          label="课程周期"  align='center'>
	        </el-table-column>
	         <el-table-column
	          prop="description"
	          label="课程简介"  align='center'>
	        </el-table-column>
	        <el-table-column label="操作" align='center'>
	          <template slot-scope="scope">
	          	<i class="fa fa-pencil-square-o" @click="handleEdit(scope.$index, scope.row)"></i>
	          	<i class="fa fa-trash" @click="handleDelete(scope.$index, scope.row)"></i>
	            <!-- <el-button
	              size="mini"
	              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
	            <el-button
	              size="mini"
	              type="danger"
	              @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
	          </template>
	        </el-table-column>
	      </el-table>
	  </div>
	 <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
	   	 <el-form :model="form" :rules='rules' ref='ruleForm'>
	      <el-form-item label="课程名称" prop='name'  :label-width="formLabelWidth">
	        <el-input v-model="form.name" autocomplete="off"></el-input>
	      </el-form-item>
	      <el-form-item label="课程周期" prop='period' :label-width="formLabelWidth">
          <el-input v-model.number="form.period" autocomplete="off"></el-input>
			 <!-- <el-select v-model="form.period" placeholder="请选择活动区域">
		      <el-option v-for='(item,index) in courses' :key='index' :label="item.period" :value="item.period"></el-option>
		   	 </el-select> -->
		  </el-form-item>
	      <el-form-item label="课程介绍" prop='description' :label-width="formLabelWidth">
			  <el-input type='textarea' v-model="form.description" autocomplete="off"></el-input>   
		  </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogFormVisible = false">取 消</el-button>
	      <el-button type="primary" @click="saveCourses('ruleForm')">保 存</el-button>
	    </div>
	 </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
      rules:{
        name:[
          { required: true, message: '请输入课程名称', trigger: 'blur' },
        ],
        description:[
          { required: true, message: '请输入课程简介', trigger: 'blur' },
        ],
        period:[
           { required: true, message: '请输入课程周期', trigger: 'blur' },
           { type: 'number', required: true, message: '课程周期必须是数字', trigger: 'blur' }
        ]
      },
    	form:{},
	  	multipleSelection:[],
	  	formLabelWidth:'100px',
	  	dialogFormVisible:false,
	  	dialogTitle:'添加课程信息',
     	search:'',
     	courseList:[],
    }
  },
  computed:{
  	courseLists(){
  		let vm=this;
  		return this.courses.filter((item)=>{
  			if(item.name){
  				return item.name.indexOf(vm.search)!=-1;
  			}else{
  				return true;
  			}
  		});
  	},
  	...mapGetters(['courses']),
  },
  created(){
  	let vm=this;
  	this.findAllCourse().then(function(data){
  		vm.courseList=data;
  	}).catch();
  },
  methods:{
  	saveCourses(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let vm=this;
          this.saveOneCourse(this.form).then((data)=>{
              // console.log(data);
              if(data.stauts==200){
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success'
                });
                this.dialogFormVisible=false;
                this.findAllCourse();
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
        } else {
          return false;
        }
      });
  	},
  	handleDelete(index,row){
  		this.deleteCourseById({id:row.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllCourse();
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
  			type:null,
	        name:row.name,
	        period:row.period,
	        description:row.description,
	        id:row.id
      };
      this.dialogFormVisible=true;
  	},
  	addCourse(){
  		this.form={
	        
	    };
      this.dialogFormVisible=true;
  	},
  	batchCourses(){
  		let vm=this;
  		let ids=this.multipleSelection.map((item)=>{
  			return item.id;
  		});
  		console.log(ids);
  		this.batchDeleteCourses({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllCourse();
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
  	handleSelectionChange(val){
  		this.multipleSelection = val;
  	},
  	...mapActions(['findAllCourse','saveOneCourse','deleteCourseById',
  		'batchDeleteCourses']),
  },
}
</script>
<style scoped>
.el-input{
  width: 200px;
  float: left;
  margin-left: 10px;
}
.optionDiv>button{
  float: right;
  margin-left: 10px;
}
.optionDiv .searchBtn{
	float: left;
}  
i{
	font-size: 20px;
	margin:0 5px;
}
</style>
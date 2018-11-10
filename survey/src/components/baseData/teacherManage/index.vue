<!-- 教师管理页面 -->
<template>
  <div class="teacherManage">
  <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入关键字搜索" size='mini'></el-input> 
      <el-button type="success" size="mini" @click='batchDeleteGrade'>批量删除</el-button>
      <el-button type="success" size="mini" @click="addGrade">新增</el-button>
  </div>
	<div class="tableDiv">
      <el-table height='500px'
        ref="multipleTable"
        :data="teacherLists"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="教师姓名" prop='name'  align='center'>
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别"  align='center'>
        </el-table-column>
         <el-table-column
          prop="birth"
          label="出生日期"  align='center'>
        </el-table-column>
         <el-table-column
          prop="hiredate"
          label="入职时间"  align='center'>
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
    <el-form :model="form">
      <el-form-item label="教师姓名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="教师性别" :label-width="formLabelWidth">
		    <el-radio-group v-model="form.gender">
		      <el-radio label="男"></el-radio>
		      <el-radio label="女"></el-radio>
		    </el-radio-group>
		  </el-form-item>
      <el-form-item label="出生日期" :label-width="formLabelWidth">
		    <el-date-picker
		      v-model="form.birth"
		      type="date"
		      placeholder="选择日期"
		      format="yyyy 年 MM 月 dd 日"
		      value-format="yyyy-MM-dd">
		    </el-date-picker>
		  </el-form-item>
			<el-form-item label="入职时间" :label-width="formLabelWidth">
		    <el-date-picker
		      v-model="form.hiredate"
		      type="date"
		      placeholder="选择日期"
		      format="yyyy 年 MM 月 dd 日"
		      value-format="yyyy-MM-dd">
		    </el-date-picker>
		  </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveTeacher">保 存</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
    	form:{},
	  	multipleSelection:[],
	  	formLabelWidth:'100px',
	  	dialogFormVisible:false,
	  	dialogTitle:'添加教师信息',
     	search:'',
     	teacherList:[],
    }
  },
  computed:{
  	teacherLists(){
  		let vm=this;
  		return this.teachers.filter((item)=>{
  			if(item.name){
  				return item.name.indexOf(vm.search)!=-1;
  			}else{
  				return true;
  			}
  		});
  	},
  	...mapGetters(['teachers']),
  },
  created(){
  	let vm=this;
  	this.findAllTeacher().then(function(data){
  		vm.teacherList=data;
  	}).catch();
  },
  methods:{
  	saveTeacher(){
  		let vm=this;
  		this.saveOneTeacher(this.form).then((data)=>{
          // console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
            this.dialogFormVisible=false;
            this.findAllTeacher().then((data)=>{
             	this.teacherList=data;
            });
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
  		this.deleteTeacherById({id:row.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllTeacher().then((data)=>{
           	this.gradeList=data;
          });
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
        gender:row.gender,
        birth:row.birth,
        hiredate:row.hiredate,
        id:row.id
      };
      this.dialogFormVisible=true;
  	},
  	addGrade(){
  		this.form={
	        
	    };
      this.dialogFormVisible=true;
  	},
  	batchDeleteGrade(){
  		let vm=this;
  		let ids=this.multipleSelection.map((item)=>{
  			return item.id;
  		});
  		console.log(ids);
  		this.batchTeachers({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllTeacher().then((data)=>{
           	vm.gradeList=data;
          });
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
  	...mapActions(['findAllTeacher','saveOneTeacher','deleteTeacherById',
  		'batchTeachers']),
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
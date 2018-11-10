<!-- 年级管理页面 -->
<template>
  <div class="gradeManage">
   <!-- {{gradeList}} -->
  <div class="optionDiv">
      <el-input v-model="search" placeholder="请输入内容" size='mini'></el-input>
      
      <el-button type="success" size="mini" @click='batchDeleteGrade'>批量删除</el-button>
      <el-button type="success" size="mini" @click="addGrade">新增</el-button>
      <el-button class='searchBtn' @click='toSearch' type="success" size="mini">搜索</el-button>
  </div>
	<div class="tableDiv">
      <el-table height='500px'
        ref="multipleTable"
        :data="gradeList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="名称" prop='name'  align='center'>
        </el-table-column>
        <el-table-column
          prop="descriptioin"
          label="简介"  align='center'>
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
      <el-form-item label="年级名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="年级介绍" :label-width="formLabelWidth">
        <el-input type='textarea' v-model="form.descriptioin" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveGrade">保 存</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
    	form:{
    		schoolId:'3',
    	},
    	multipleSelection:[],
    	formLabelWidth:'80px',
    	dialogFormVisible:false,
    	dialogTitle:'修改年级信息',
     	gradeList:[],
     	search:'',
    }
  },
  computed:{
  	...mapGetters(['grades']),
  },
  created(){
  	let vm=this;
  	this.findAllGrades().then(function(data){
  		console.log(data);
  		vm.gradeList=data;
  	}).catch();
  },
  methods:{
  	toSearch(){
  		let vm=this;
      //给categoryList赋值
      this.gradeList=this.grades.filter(function(item){
        if(item.schoolId==3){
        	if(item.name){
	          return item.name.indexOf(vm.search)!=-1;
	        }else{
	          return true;
	        }
        }
      });
  	},
  	saveGrade(){
  		this.saveOneGrade(this.form).then((data)=>{
          // console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
            this.dialogFormVisible=false;
            this.findAllGrades().then((data)=>{
             	this.gradeList=data;
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
  		this.deleteGradeById({id:row.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllGrades().then((data)=>{
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
        schoolId:3,
        name:row.name,
        descriptioin:row.descriptioin,
        id:row.id
      };
      this.dialogFormVisible=true;
  	},
  	handleSelectionChange(val){
  		this.multipleSelection = val;  
  	},
  	batchDeleteGrade(){
  		let vm=this;
  		let ids=this.multipleSelection.map((item)=>{
  			return item.id;
  		});
  		console.log(ids);
  		this.batchGrades({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllGrades().then((data)=>{
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
  	addGrade(){
  		this.form={
	        schoolId:3
	    };
      	this.dialogFormVisible=true;
  	},
  	...mapActions(['findAllGrades','saveOneGrade','deleteGradeById',
  		'batchGrades']),
  },
}
</script>
<style type="text/css" scoped>
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
<style scoped lang='scss'>
#gradeManage{
	.optionDiv{

	}
}
</style>
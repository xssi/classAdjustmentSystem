<!-- 班级管理页面 -->
<template>
  <div class="courseManage">
	  <div class="optionDiv">
        <el-select size='mini' clearable v-model="choice.gradeId" placeholder="请选择">
          <el-option
            v-for="(item,index) in grades"
            :key="index"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
	      <el-input v-model="choice.search" placeholder="请输入关键字搜索" size='mini'></el-input> 
	      <el-button type="success" size="mini" @click='batchClazzes'>批量删除</el-button>
	      <el-button type="success" size="mini" @click="addClazz">新增</el-button>
	  </div>
		<div class="tableDiv">
	      <el-table height='500px'
	        ref="multipleTable"
	        :data="clazzLists"
	        tooltip-effect="dark"
	        style="width: 100%"
	        @selection-change="handleSelectionChange">
	        <el-table-column
	          type="selection"
	          width="55">
	        </el-table-column>
	        <el-table-column
	          label="班级名称" prop='name'  align='center'>
	        </el-table-column>
	        <el-table-column
	          prop="description"
	          label="班级简介"  align='center'>
	        </el-table-column>
          <el-table-column
            prop="grade.name"
            label="所属年级"  align='center'>
          </el-table-column>
	         <el-table-column 
	          prop="charge.name"
	          label="班主任"  align='center'>
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
	   	 	<el-form-item label="所属年级" :label-width="formLabelWidth">
			 <el-select v-model="form.gradeId" placeholder="请选择">
		      <el-option v-for='(item,index) in grades' :key='index' :label="item.name" :value="item.id"></el-option>
		   	 </el-select>
		  	</el-form-item>
	      <el-form-item label="班级名称" :label-width="formLabelWidth">
	        <el-input v-model="form.name" autocomplete="off"></el-input>
	      </el-form-item>
	      <el-form-item label="班主任" :label-width="formLabelWidth">
			 <el-select v-model="form.chargeId" placeholder="请选择">
           <el-option v-for='(item,index) in teachers' :key='index' :label="item.name" :value="item.id"></el-option>
		   	 </el-select>
		  </el-form-item>
	      <el-form-item label="班级介绍" :label-width="formLabelWidth">
			  <el-input type='textarea' v-model="form.description" autocomplete="off"></el-input>   
		  </el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogFormVisible = false">取 消</el-button>
	      <el-button type="primary" @click="saveClazzes">保 存</el-button>
	    </div>
	 </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
      choice:{
        gradeId:'',
        search:'',
      },
      form:[],
	  	multipleSelection:[],
	  	formLabelWidth:'100px',
	  	dialogFormVisible:false,
	  	dialogTitle:'添加班级信息',
     	clazzList:[],
    }
  },
  computed:{
  	clazzLists(){
  		let vm=this;
  		return this.clazzes.filter((item)=>{
  			if(item.name){
          if(item.grade&&vm.choice.gradeId){
            return (item.name.indexOf(vm.choice.search)!=-1)&&(item.grade.id==vm.choice.gradeId);
          }
  	       return item.name.indexOf(vm.choice.search)!=-1;
  			}else{
  				return true;
  			}
  		});
  	},
  	...mapGetters(['clazzes','teachers','grades']),
  },
  created(){
  	let vm=this;
    this.findAllGrades();
    this.findAllTeacher();
  	this.findAllVM().then(function(data){
  		vm.clazzList=data;
  	}).catch();
  },
  methods:{
  	saveClazzes(){
  		let vm=this;
  		this.saveOneClazz(this.form).then((data)=>{
          // console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
            this.dialogFormVisible=false;
            this.findAllVM();
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
  		this.deleteClazzById({id:row.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllVM();
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
	        name:row.name,
	        gradeId:row.grade?row.grade.id:'',
	        chargeId:row.charge?row.charge.id:'',
	        description:row.description,
	        id:row.id
      };
      this.dialogFormVisible=true;
  	},
  	addClazz(){
  		this.form={
	        
	    };
      this.dialogFormVisible=true;
  	},
  	batchClazzes(){
  		let vm=this;
  		let ids=this.multipleSelection.map((item)=>{
  			return item.id;
  		});
  		console.log(ids);
  		this.batchDeleteClazzes({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllVM();
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
  	...mapActions(['findAllTeacher','findAllVM','saveOneClazz','deleteClazzById','batchDeleteClazzes','findAllGrades']),
  },
}
</script>
<style scoped>
.el-select{
  float: left;
}
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
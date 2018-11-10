<!-- 问卷管理页面 -->
<template>
  <div class="naireManage">
  <!-- {{nairesWithQues}} -->
    <!-- {{questionnaireList}} -->
    <div class="optionDiv">
		    <el-input v-model="search" placeholder="请输入关键字搜索" size='mini'></el-input> 
		    <el-button type="success" size="mini" @click='batchQuestionnaires'>批量删除</el-button>
		    <el-button type="success" size="mini" @click="addQuestionnaires">新增</el-button>
    </div>
    <div class="tableDiv">
    	<el-table  :height='tableHeight'
	        ref="multipleTable"
	        :data="questionnaireLists"
	        style="width: 100%"
	        @selection-change="handleSelectionChange">
	        <el-table-column
	          type="selection"
	          width="55">
	        </el-table-column>
	        <el-table-column
	          label="问卷名称" prop='name'  align='center'>
	        </el-table-column>
	        <el-table-column
	          prop="description"
	          label="问卷简介"  align='center'>
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
	   	 	<el-form-item label="问卷名称" :label-width="formLabelWidth">
	        <el-input v-model="form.name" autocomplete="off"></el-input>
	      </el-form-item>
	   	 	<el-form-item label="问卷描述" :label-width="formLabelWidth">
	        <el-input type="textarea" v-model="form.description" autocomplete="off"></el-input>
		  	</el-form-item>
		  	<el-form-item label="题目列表" :label-width="formLabelWidth">
				  <el-button size='mini' @click="showTrans">点击选择</el-button>
				  <!-- {{quesIds}} -->
				</el-form-item>
	    	</el-form>
	    	<!-- 展示用户选择的题目的详细信息 -->
	    	<!-- {{questions}} -->
				<div class="contentDiv">
	        <div class="itemDiv" v-for="(item,index) in quesShowList">
	          <ul>
	            <li>
	              序号{{index+1}}:&nbsp;&nbsp;{{item.name}}
	            </li>
	            <li style="padding-left:30px;" v-for="(option,num) in item.options">
	              {{option.label}}.&nbsp;{{option.name}}
	            </li>
	          </ul>
	        </div>
      </div>
		    <div slot="footer" class="dialog-footer">
		      <el-button @click="dialogFormVisible = false">取 消</el-button>
		      <el-button type="primary" @click="saveQuestionnaire">保 存</el-button>
		    </div>
	 	</el-dialog>
	 	<el-dialog :title="dialogTranTitle" :visible.sync="dialogFormTranVisible">
	 		<el-transfer v-model="quesIds" :data="quesList"></el-transfer>
		    <div slot="footer" class="dialog-footer">
		      <el-button @click="dialogFormTranVisible = false">确定</el-button>
		    </div>
	 	</el-dialog>
	 	<!-- 问卷预览 -->
	 	<el-dialog :title="nairesWithQues.name" :visible.sync="dialogFormEyeVisible">
			<!--  	{{nairesWithQues}} -->
	 		<div class="contentDiv">	
					<div class="itemDiv" v-for='(item,index) in nairesWithQues.questionVMs' :key='index'>
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
    	dialogFormEyeVisible:false,
    	form:{
    		name:'',
    		description:'',
    	},
    	//用户选择key值组成的数组
    	quesIds:[],
    	// 穿梭框左侧的列表数据
    	// quesList:[{
    	// 	key:1,
    	// 	label:'hello',
    	// }],
    	dialogTranTitle:'题目列表',
    	dialogFormTranVisible:false,
    	formLabelWidth:'80px',
    	dialogFormVisible:false,
    	dialogTitle:'新增',
    	tableHeight:'500px',
     	search:'',
     	questionnaireList:[],
     	multipleSelection:[],
    }
  },
  computed:{
  	...mapGetters(['questionnaires','quesNoOption','questions','nairesWithQues']),
  	// 用户选择的所有的题目列表，有选项，需要展示在模态框中,需要对所有的题目进行过滤，如果当前题目是用户选中的，那么过滤出来
  	quesShowList(){
  		//questions 所有的题目，包含选项
  		//quesIds 用户选择的题目id组成的数组
  		return this.questions.filter((item,index)=>{
  			return this.quesIds.indexOf(item.id)!=-1;
  		})
  	},
  	quesList(){
  		//将questionnooption转换成穿梭框所识别的数据
  		let arr=[];
  		this.quesNoOption.forEach((item)=>{
  			let obj={
  				key:item.id,
  				label:item.name,
  			};
  			arr.push(obj);
  		});
  		return arr;
  	},
  	questionnaireLists(){
  		let vm=this;
  		return this.questionnaires.filter((item)=>{
  			if(item.name){
  	     return item.name.indexOf(vm.search)!=-1;
  			}else{
  				return false;
  			}
  		});
  	},
  },
  created(){
  	let vm=this;
  	this.findAllQuestionnaires();
  	this.findAllQuesNoOption();
  	this.tableHeight=($(window).height()-190)+'px';
  	//vue实例和属性和方法创建完毕
  	//查找所有题目
  	this.findAllQuestions();
  	// this.findNaireWithQues();
  },
  mounted(){
  	//vue实例与dom绑定并且渲染完毕
  	//设置元素的高度，在这里设置，选中元素
  },
  methods:{
  	showTrans(){
  		this.dialogFormTranVisible=true;
  	},
   	saveQuestionnaire(){
   		this.form.questionIds=this.quesIds.join(',');
   		this.saveOneQuestionnaires(this.form).then((data)=>{
          console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
            this.dialogFormVisible=false;
            this.findAllQuestionnaires();
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
  	handleWatch(index,row){
  		this.findNaireWithQues({id:row.id}).then((data)=>{
  			this.dialogFormEyeVisible=true;
  		});
  	},
  	handleEdit(index,row){
  		//通过row.id是问卷的id，去查找问卷的详细数据，包含题目的信息
  		//可以修改问卷的名字，描述，修改内部的题目
      this.dialogTitle = "编辑";
  		this.findNaireWithQues({id:row.id}).then((data)=>{
  			this.form={
  				id:data.id,
  				name:data.name,
  				description:data.description,
  			};
  			this.quesIds=data.questionVMs.map((item)=>{
  				return item.id;
  			});
  			this.dialogFormVisible=true;
  		});
  	},
  	handleDelete(index,row){
  		this.deleteQuestionnaireById({id:row.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestionnaires();
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
  	addQuestionnaires(){
      this.dialogTitle = "新增";
  		this.form={
  			name:'',
    		description:'',
  		};
  		this.dialogFormVisible=true;
  		this.quesIds=[];
  	},
  	batchQuestionnaires(){
  		let ids=this.multipleSelection.map((item)=>{
  			return item.id;
  		});
  		console.log(ids);
  		this.batchDeleteQuestionnaires({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestionnaires();
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
  	...mapActions(['findAllQuestionnaires','batchDeleteQuestionnaires','deleteQuestionnaireById','saveOneQuestionnaires','findAllQuesNoOption','findAllQuestions','findNaireWithQues']),
  },
}
</script>
<style scoped lang='scss'>
.naireManage{
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
}  
.contentDiv{
	overflow: auto;
	.itemDiv{
		position: relative;
		width: 98%;
		height: 120px;
		border:1px solid #000;
		margin:10px auto;
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
</style>
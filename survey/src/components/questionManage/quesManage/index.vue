<!-- 题目管理页面 -->
<template>
  <div class="quesManage">
    <!-- {{questionList}} -->
    <!-- {{selected}} -->
    <div class="optionDiv">
    	<el-select size='mini' clearable clearable v-model="choice.type" placeholder="请选择">
        <el-option
          v-for="(item,index) in types"
          :key="index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-input v-model="choice.search" placeholder="请输入关键字搜索" size='mini'></el-input> 
      <el-button type="success" size="mini" @click='batchQuestions'>批量删除</el-button>
      <el-button type="success" size="mini" @click="addQuestion">新增</el-button>
    </div>
    <div class="contentDiv">	
			<div class="questionDiv" :data="questionLists" v-for='(item,index) in questionLists' :key='index'>
			    <ul>
			    	<li>
			    		<input type="checkbox" v-model='selected' :value='item.id' size='medium' name="type">序号{{index+1}}: {{item.name}}
			    	</li>
			    	<li style="margin-left:30px" v-for='(obj,index) in item.options'>
			    	{{obj.label}}.&nbsp;{{obj.name}}
			    	</li>
			    </ul>
			    <div class="btnDiv">
			    	<i class="fa fa-pencil-square-o" style='color:#85CE61;' @click="handleEdit(item)"></i>
	          <i class="fa fa-trash" @click="handleDelete(item)"></i>
			    </div>
	  	</div>
    </div>
 
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
		{{form}}
	   	 <el-form :model="form">
	   	 	<el-form-item label="题目名称" :label-width="formLabelWidth">
	        <el-input v-model="form.name" autocomplete="off"></el-input>
	      </el-form-item>
	   	 	<el-form-item label="题目类型" :label-width="formLabelWidth">
			 		<el-select v-model="form.questionType" placeholder="请选择" @change='selectChange'>
		      	<el-option  v-for='(item,index) in types' :key='index' :label="item" :value="item"></el-option>
		   	 	</el-select>
		  	</el-form-item>
		  	<el-form-item label="题目选项" v-if='showTab' :label-width="formLabelWidth">
		    <!--   <table>
				    <tr>
				    	<th>序号</th>
				    	<th>label</th>
				    	<th>选项</th>
				    	<th>分值</th>
				    	<th>操作</th>
				    </tr>
				  	<tr v-model="form.options">
				  		<td>
				  			<el-input v-model="form.options.id" placeholder="请输入" size='mini'></el-input> 
				  		</td>
				  		<td>
				  			<el-input v-model="form.options.label" placeholder="请输入" size='mini'></el-input> 
				  		</td>
				  		<td>
				  			<el-input v-model="form.options.name" placeholder="请输入" size='mini'></el-input> 
				  		</td>
				  		<td>
				  			<el-input v-model="form.options.score" placeholder="请输入" size='mini'></el-input> 
				  		</td>
				  		<td>
				  			<i class="fa fa-trash" @click="deleteTr"></i>
				  		</td>
				  	</tr>
				  </table> -->
				  <el-table @row-click='showSpan=false' height='200px'
		        ref="multipleTable"
		        :data="form.options" 
		        tooltip-effect="dark"
		        style="width: 100%">
		        <el-table-column
		          type="index" label="序号"
		          width="55">
		        </el-table-column>
		        <el-table-column
		          label="label" prop='label'  align='center'>
		          <template slot-scope="scope">
		          	<span v-if='showSpan'>{{scope.row.label}}</span>
	       				<el-input size='mini' v-else v-model="scope.row.label"></el-input>
		          </template>
		        </el-table-column>
		        <el-table-column
		          prop="name"
		          label="选项"  align='center'>
		          <template slot-scope="scope">
		          	<span v-if='showSpan'>{{scope.row.name}}</span>
	       				<el-input size='mini' v-else v-model="scope.row.name"></el-input>
		          </template>
		        </el-table-column><el-table-column
		          prop="score"
		          label="分值"  align='center'>
		          <template slot-scope="scope">
		          	<span v-if='showSpan'>{{scope.row.score}}</span>
	       				<el-input size='mini' v-else v-model="scope.row.score"></el-input>
		          </template>
		        </el-table-column>
		        <el-table-column label="操作" align='center'>
		          <template slot-scope="scope">
		          	<i class="fa fa-trash" @click="handleDeleteOption(scope.$index, scope.row)"></i>
		          </template>
		        </el-table-column>
		      </el-table>
					<!-- 添加按钮 -->
					<div class="addIcon">
						<i class='fa fa-plus' title='添加选项' @click='addOption'></i>

					</div>
				</el-form-item>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
	      <el-button @click="dialogFormVisible = false">取 消</el-button>
	      <el-button type="primary" @click="saveQuestion">保 存</el-button>
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
    	showSpan:true,
    	showTab:true,
    	selected:[],
     	choice:{
     		type:'',
        search:'',
      },
      multipleSelection:[],
      form:{
      	name:'',
      	options:[],
      	questionType:'单选题',
      },
	  	formLabelWidth:'100px',
	  	dialogFormVisible:false,
	  	dialogTitle:'添加题目信息',
      types:['单选题','多选题','简答题'],
     	questionList:[],

    }
  },
  computed:{
  	questionLists(){
  		let vm=this;
  		return this.questionList.filter((item)=>{
  			if(item.name){
  				if(item.questionType&&vm.choice.type){
  					return item.name.indexOf(vm.choice.search)!=-1&&item.questionType==vm.choice.type;
  				}
  				return item.name.indexOf(vm.choice.search)!=-1;
  			}else{
  				return false;
  			}
  		})
  	},
  	...mapGetters(['questions']),
  },
  created(){
  	let vm=this;
  	this.findAllQuestions().then((data)=>{
  		vm.questionList=data;
  	}).catch();
  },
  methods:{
  	//添加选项
  	addOption(){
  		//给表格添加一行
  		this.form.options.push({
  			name:'',
  			label:'',
  			score:'',
  		});
  	},
  	//删除选项
  	handleDeleteOption(index,row){
  		//this.form.options
  		//row:{name:'',label:'',score:}
  		//通过index来删除数组中的对应位置上的对象
  	  this.form.options.splice(index,1);
  	},
  	handleDelete(item){
  		this.deleteQuestionById({id:item.id}).then((data)=>{
        console.log(data);
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestions();
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
  	handleEdit(item){
  		this.dialogFormVisible=true;
  		this.form={
  			id:item.id,
  			name:item.name,
  			questionType:item.questionType,
  			//当前给的是引用地址，修改的同时页面数据修改
      	// options:item.options,
      	options:JSON.parse(JSON.stringify(item.options)),
  		};
  		if(item.questionType=='简答题'){
  			this.showTab=false;
  		}else{
  			this.showTab=true;
  		}
  	},
  	saveQuestion(){
  		this.saveOneQuestion(this.form).then((data)=>{
          console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
            this.dialogFormVisible=false;
            this.findAllQuestions().then((data)=>{
             	this.questionList=data;
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
  	//模态框的下拉列表发生更改
  	selectChange(val){
  		// val最新的值，form.questiontype
  		if(val=='简答题'){
  			this.showTab=false;
  		}else{
  			this.showTab=true;
  		}
  	},
  	addQuestion(){
  		this.dialogFormVisible=true;
  		this.form={
  			name:'',
      	options:[],
      	questionType:'单选题',
  		};
  		this.showTab=true;
  		this.showSpan=true;
  	},
  	batchQuestions(){
  		let ids=this.selected;
  		this.batchDeleteQuestions({ids:ids.join(',')}).then((data)=>{
        if(data.stauts==200){
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.findAllQuestions();
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
  	...mapActions(['findAllQuestions','batchDeleteQuestions','deleteQuestionById','saveOneQuestion']),
  },
  mounted(){
  	$('.contentDiv').height($(window).height()-190)
  }
}
</script>
<style scoped lang='scss'>
.optionDiv{
	.el-input{
		width: 200px;
	}
	.el-button{
		float: right;
		margin-left: 10px;
	}
}
.contentDiv{
	overflow: auto;
	.questionDiv{
		position: relative;
		width: 98%;
		height: 200px;
		border:1px solid #000;
		margin:20px auto;
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
		.btnDiv{
			position: absolute;
			bottom: 10px;
			right: 30px;
			i{
				font-size: 24px;
				color: red;
				margin:5px;
			}
		}
		
	}

}
.el-form-item{
	
}
.addIcon{
	font-size: 20px;
	text-align: right;
	i{
		cursor: pointer;
	}
}

</style>
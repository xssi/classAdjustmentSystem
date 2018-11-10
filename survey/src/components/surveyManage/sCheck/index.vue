<!-- 课调审核页面 -->
<template>
  <div class="sCheck">
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
    </div>
		<div class="tableDiv">
			<el-table  :height='tableHeight'
	        ref="multipleTable"
	        :data="surveyList"
	        style="width: 100%">
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
	      <el-table-column
	          prop="status"
	          label="状态"  align='center'>
	        </el-table-column>
	      <el-table-column width='300' label="操作" align='center'>
	        <template slot-scope="scope">
						<el-button v-if="scope.row.status=='未审核'" size='mini' type="success" @click="handleCheck(scope.$index, scope.row)">审核通过</el-button>
						<el-button v-if="scope.row.status=='审核通过'" size='mini' @click="handleCheckNo(scope.$index, scope.row)">审核不通过</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
		</div>
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
     tableHeight:'500px',
     search:'',
     multipleSelection:[],
    }
  },
  computed:{
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
  	...mapGetters(['surManages']),
  },
  created(){
  	this.tableHeight=($(window).height()-190)+'px';
  	this.findAllSurManages();
  },
  methods:{
  	handleCheckNo(index,row){},
  	handleCheck(index,row){
  		let form={
  			id:row.id,
  			status:row.status=='审核通过'?1:0,
  		};
  		this.checkSurvey({id:row.id,
  			status:row.status=='审核通过'?1:0}).then((data)=>{
          console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '审核成功',
              type: 'success'
            });
            this.findAllSurManages();
          }else{
            this.$notify.error({
              title: '失败',
              message: '审核失败1'
            });
          }
        }).catch((error)=>{
          this.$notify.error({
            title: '失败',
            message: '审核失败2'
          });
        });
  	},
  	typeChange(){
  		this.choice.search='';
  	},
  	...mapActions(['findAllSurManages','checkSurvey']),
  },
}
</script>
<style scoped>
.el-input{
	width: 200px;
}  

</style>
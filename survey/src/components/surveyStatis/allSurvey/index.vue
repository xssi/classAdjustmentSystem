<!-- 全部课调统计页面 -->
<template>
  <div class="allSurvey">
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
		        <el-table-column align="center"
			        prop="average"
			        label="平均分">
			        <template slot-scope="scope">
			        	<span>{{scope.row.average?scope.row.average:'---'}}</span>
			        </template>
			      </el-table-column>
		        <el-table-column label="操作" align='center'>
		          <template slot-scope="scope">
		          	<i class="fa fa-eye" style='color:green' title='预览' @click="handleEye(scope.$index, scope.row)"></i>
		          	<i class="fa fa-download" title='下载' @click="downLoad(scope.$index, scope.row)"></i>
		          	<i class="fa fa-bar-chart"  style='color:red' title='问卷分析' @click="handleAlaisy(scope.$index, scope.row)"></i>	
		          </template>
		        </el-table-column>
		      </el-table>
	</div>
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
	 				<td>
	 					<span>平均分：{{currentSurvey.course.name}}</span>
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
	<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
   	 	<div id="container" style="min-width:400px;height:400px"></div>
	</el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
import $ from 'jquery';
import Highcharts from 'highcharts';
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
     dialogEyeVisible:false,
     tableHeight:'500px',
     dialogFormVisible:false,
     dialogTitle:'课调分析',
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
  	handleAlaisy(index,row){
  		this.dialogFormVisible=true;
  		setTimeout(()=>{
  			this.toDraw();
  		}, 200);
  	},
  	downLoad(index,row){
  		window.open('http://120.78.164.247:9999/result/downLoadSurveyResultById?id='+row.id);
  	},
  	handleEye(index,row){
  		this.currentSurvey=row;
  		this.dialogEyeVisible=true;
  	},
  	typeChange(){
  		this.choice.search='';
  	},
  	toDraw(){
  		var chart = Highcharts.chart('container',{
  		credits:{
  			enabled:false
  		},
			chart: {
				type: 'column'
			},
			title: {
				text: '课调分析'
			},
			subtitle: {
				text: '数据来源: 课调问卷统计'
			},
			xAxis: {
				categories: [
					'授课质量','备课情况','拓展能力','技术能力','解答疑难'
				],
				crosshair: true
			},
			yAxis: {
				min: 0,
				title: {
					text: '评分情况'
				}
			},
			tooltip: {
				// head + 每个 point + footer 拼接成完整的 table
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
				footerFormat: '</table>',
				shared: true,
				useHTML: true
			},
			plotOptions: {
				column: {
					borderWidth: 0
				}
			},
			series: [{
				name: '优秀',
				data: [22, 21, 32, 26, 25]
			}, {
				name: '良好',
				data: [13, 12, 15, 11, 11]
			}, {
				name: '中等',
				data: [6, 5, 8, 3, 5]
			}]
		});
  	},
  	...mapActions(['findAllSurManages']),
  },
}
</script>
<style scoped>
.el-input{
	width: 200px;
}  
i{
	margin:3px;
}
.contentDiv{
overflow: auto;
border:1px solid #000;
border-top:none;
	.itemDiv{
		position: relative;
		width: 99.9%;
		height: 160px;
		border:1px solid #000;
		padding: 3px 3px;
		border-top:none;
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
</style>
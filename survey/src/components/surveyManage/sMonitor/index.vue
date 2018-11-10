<!-- 课调监控页面 -->
<template>
  <div class="sMonitor">
  <!-- {{surManages}} -->
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
			          prop="code"
			          label="课调编号"  align='center'>
			        </el-table-column>
			        <el-table-column label="操作" align='center'>
			          <template slot-scope="scope">
			          	<i v-if="scope.row.status=='未开启'" class="fa fa-play-circle" style='color:green' title='开启' @click="handleOpen(scope.$index, scope.row)"></i>
			          	<i v-if="scope.row.status=='开启'" class="fa fa-hourglass-start" title='查看进度' @click="handleWatch(scope.$index, scope.row)"></i>
			          	<i v-if="scope.row.status=='开启'" class="fa fa-stop-circle"  style='color:red' title='结束' @click="handleClose(scope.$index, scope.row)"></i>	
			          </template>
			        </el-table-column>
			      </el-table>
		</div>
		<el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
   	 	<div id="Monitorcontainer" style="min-width:400px;height:400px"></div>
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
     tableHeight:'500px',
     multipleSelection:[],
     dialogTitle:'课调进度',
     dialogFormVisible:false,
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
  	handleOpen(index,row){
  		this.beginSurvey({id:row.id}).then((data)=>{
          console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '开启成功',
              type: 'success'
            });
            this.findAllSurManages();
          }else{
            this.$notify.error({
              title: '失败',
              message: '开启失败'
            });
          }
        }).catch((error)=>{
          this.$notify.error({
            title: '失败',
            message: '开启失败'
          });
        });
  	},
  	handleClose(index,row){
  		this.stopSurvey({id:row.id}).then((data)=>{
          console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '结束成功',
              type: 'success'
            });
            this.findAllSurManages();
          }else{
            this.$notify.error({
              title: '失败',
              message: '结束失败1'
            });
          }
        }).catch((error)=>{
          this.$notify.error({
            title: '失败',
            message: '结束失败2'
          });
        });
  	},
  	handleWatch(index,row){
  		this.dialogFormVisible=true;
  		setTimeout(()=>{
  			this.toDraw();
  		}, 200);
  	},
  	typeChange(){
  		this.choice.search='';
  	},
  	toDraw(){
  		var chart = Highcharts.chart('Monitorcontainer', {
  		credits:{
  			enabled:false
  		},
			chart: {
				spacing : [0, 0 , 0, 0]
			},
			title: {
				floating:true,
				text: '课调进度'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}% </b>{point.y}份'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
						style: {
							color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					},
					point: {
						events: {
							mouseOver: function(e) {  // 鼠标滑过时动态更新标题
								// 标题更新函数，API 地址：https://api.hcharts.cn/highcharts#Chart.setTitle
								chart.setTitle({
									text: e.target.name+ '\t'+ e.target.y + '份'
								});
							}
							//, 
							// click: function(e) { // 同样的可以在点击事件里处理
							//     chart.setTitle({
							//         text: e.point.name+ '\t'+ e.point.y + ' %'
							//     });
							// }
						}
					},
				}
			},
			series: [{
				type: 'pie',
				innerSize: '80%',
				name: '进度',
				data: [
					['已完成',30],
					['未完成', 10]
				]
			}]
		}, function(c) { // 图表初始化完毕后的会掉函数
			// 环形图圆心
			var centerY = c.series[0].center[1],
				titleHeight = parseInt(c.title.styles.fontSize);
			// 动态设置标题位置
			c.setTitle({
				y:centerY + titleHeight/2
			});
		});
  	},
  	...mapActions(['findAllSurManages','beginSurvey','stopSurvey']),
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
</style>
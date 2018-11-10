<!-- 学校信息页面 -->
<template>
  <div class="schoolInfo">
    <!-- {{schools}} -->
    <!-- <table :data='schools'>
    	<tr>
    		<td>校园名称</td>
    		<td>
    			<input v-model="schools.name"></input>
    		</td>
    	</tr>
    	<tr>
    		<td>校园介绍</td>
    		<td>
				<input v-model="schools.description"></input>
    		</td>
    	</tr>
    	<tr>
    		<td>校园地址</td>
    		<td>
				<input v-model="schools.address"></input>
    		</td>
    	</tr>
    	<tr>
    		<td>校园电话</td>
    		<td>
				<input v-model="schools.telephone"></input>
    		</td>
    	</tr>
    	<tr>
    		<td>版权信息</td>
    		<td>
				<input v-model="schools.copyright"></input>
    		</td>
    	</tr>
    </table> -->
    <table :data='schools'>
    	<tr @click='show=false' v-for='(item,index) in tableArr' :key='index'>
    		<td>{{item.name}}</td>
    		<td>
    			<span v-if='show'>
    				{{schools[item.prop]}}
    			</span>
    			<el-input v-else v-model='form[item.prop]' placeholder='请输入'></el-input>
    		</td>
    	</tr>
    </table>
    <el-button type="primary" @click='saveBtn'>保存</el-button>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex';
export default {
  data(){
    return {
    	show:true,
    	form:{},
    	tableArr:[{
    		name:'校园名称',
    		prop:'name'
    	},{
    		name:'校园介绍',
    		prop:'description'
    	},{
    		name:'校园地址',
    		prop:'address'
    	},{
    		name:'校园电话',
    		prop:'telephone'
    	},{
    		name:'版权信息',
    		prop:'copyright'
    	}]
    }
  },
  computed:{
  	...mapGetters(['schools']),
  },
  created(){
  	let vm=this;
  	this.findSchool({id:3}).then((data)=>{
  		this.form={
  			id:data.id,
  			name:data.name,
  			description:data.description,
  			address:data.address,
  			telephone:data.telephone,
  			copyright:data.copyright,

  		};
  	});
  },
  methods:{
  	saveBtn(){
  		this.saveSchool(this.form).then((data)=>{
          // console.log(data);
          if(data.stauts==200){
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success'
            });
            this.show=true;
            this.findSchool({id:3});
          }else{
            this.$notify.error({
              title: '失败',
              message: '保存失败1'
            });
          }
        }).catch((error)=>{
          this.$notify.error({
            title: '失败',
            message: '保存失败2'
          });
        })
  	},
  	...mapActions(['findSchool','saveSchool']),
  },
}
</script>
<style type="text/css" scoped>
.el-button{
	width: 100px;
	float: right;
	margin-right: 20px;
	margin-top: 40px;
}
</style>
<style scoped lang='scss'>
table{
	margin-left: 10px;
	border:1px solid #000;
	border-collapse: collapse;
	tr{
		height: 40px;
		border:1px solid #000;
		border-collapse: collapse;
		td{
			width: 300px;
			border:1px solid #000;
			border-collapse: collapse;
			font-size: 16px;
			color: #000;
			input{
				border: none;
				font-size: 16px;
			}
		}
		td:nth-child(1){
			text-align: center;
		}
		td:nth-child(2){
			width: 80%;
		}
	}
}
</style>
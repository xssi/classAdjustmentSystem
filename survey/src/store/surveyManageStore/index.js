// 课调管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		surManages:[],
	},
	getters:{
		surManages:state=>state.surManages,
	},
	mutations:{
		changeSurManages(state,data){
			state.surManages=data;
		},
	},
	actions:{
		//课调检查开始
		checkSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/checkSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//课调检查结束
		//课调监控开始
		beginSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/beginSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		stopSurvey(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/stopSurvey',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//课调监控结束
		// 课调管理结束
		batchDeleteSurManages(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/survey/batchDeleteSurveyById',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		deleteSurManageById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/deleteSurveyById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneSurManages(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/survey/saveOrUpdateSurvey',qs.stringify(obj)).then(({data})=>{
					// console.log({data});
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		findAllSurManages(context){
			return new Promise((resolve,reject)=>{
				axios.get('/survey/findAllSurveyVM').then(({data})=>{
					// console.log({data});
					context.commit('changeSurManages',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		// 课调管理开始
	}
}
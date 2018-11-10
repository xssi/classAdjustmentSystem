// 课调统计仓库
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
	}
}
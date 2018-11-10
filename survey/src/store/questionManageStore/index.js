// 问卷管理仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		questions:[],
		questionnaires:[],
		quesNoOption:[],
		nairesWithQues:{},
	},
	getters:{
		questions:state=>state.questions,
		questionnaires:state=>state.questionnaires,
		quesNoOption:state=>state.quesNoOption,
		nairesWithQues:state=>state.nairesWithQues,
	},
	mutations:{
		changeQuestions(state,data){
			state.questions=data;
		},
		changeQuesNoOption(state,data){
			state.quesNoOption=data;
		},
		changeQuestionnaire(state,data){
			state.questionnaires=data;
		},
		changeNaireWithQues(state,data){
			state.nairesWithQues=data;
		}
	},
	actions:{
		//问卷开始
		findNaireWithQues(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/questionnaire/findQuestionnaireVMById',{params:obj}).then(({data})=>{
					// console.log({data});
					context.commit('changeNaireWithQues',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		batchDeleteQuestionnaires(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		deleteQuestionnaireById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/questionnaire/deleteQuestionnaireById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneQuestionnaires(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/questionnaire/saveOrUpdateQuestionnaire',qs.stringify(obj)).then(({data})=>{
					// console.log({data});
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		findAllQuestionnaires(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/questionnaire/findAllQuestionnaire',{params:obj}).then(({data})=>{
					// console.log({data});
					context.commit('changeQuestionnaire',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//问卷结束
		// 题库开始
		findAllQuesNoOption(context){
			//返回题目id name questiontype
			return new Promise((resolve,reject)=>{
				axios.get('/question/findAllQuestion').then(({data})=>{
					// console.log({data});
					context.commit('changeQuesNoOption',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		batchDeleteQuestions(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/question/batchDeleteQuestion',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		deleteQuestionById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/question/deleteQuestionById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneQuestion(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/question/saveOrUpdateQuestion',qs.stringify(obj)).then(({data})=>{
					// console.log({data});
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		findAllQuestions(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/question/findAllQuestionVM',{params:obj}).then(({data})=>{
					// console.log({data});
					context.commit('changeQuestions',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		// 题库结束
	}
}
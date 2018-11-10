// 基础数据仓库
import axios from '../axios';
import qs from 'qs';
export default {
	state:{
		grades:[],
		teachers:[],
		courses:[],
		clazzes:[],
		schools:[],
	},
	getters:{
		grades:state=>{
			return state.grades.filter((item)=>{
				return item.schoolId==3;
			});
		},
		teachers:state=>state.teachers,
		courses:state=>state.courses,
		clazzes:state=>{
			return state.clazzes.filter((item)=>{
				if(item.grade){
					return item.grade.schoolId==3;
				}else{
					return false;
				}
			});
		},
		schools:state=>state.schools,
	},
	mutations:{

		changeGrades(state,data){
			state.grades=data;
		},
		changeTeachers(state,data){
			state.teachers=data;
		},
		changeCourses(state,data){
			state.courses=data;
		},
		changeClazzes(state,data){
			state.clazzes=data;
		},
		changeSchools(state,data){
			state.schools=data;
		},
	},
	actions:{
		//五个模块
		//校园开始
		saveSchool(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/school/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					// console.log({data});
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		findSchool(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/school/findById',{params:obj}).then(({data})=>{
					console.log({data});
					context.commit('changeSchools',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//校园结束
		//班级开始
		batchDeleteClazzes(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/batchDeleteClazz',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		deleteClazzById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/deleteClazzById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneClazz(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/clazz/saveOrUpdateClazz',qs.stringify(obj)).then(({data})=>{
					// console.log({data});
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		findAllVM(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/clazz/findAllVM',{params:obj}).then(({data})=>{
					// console.log({data});
					context.commit('changeClazzes',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//班级结束
		//课程开始
		batchDeleteCourses(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/course/batchDelete',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		deleteCourseById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/course/deleteById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneCourse(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/course/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					// console.log({data});
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		findAllCourse(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/course/findAllCourse',{params:obj}).then(({data})=>{
					// console.log({data});
					context.commit('changeCourses',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//课程结束
		//教师开始
		batchTeachers(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/user/batchDelete',qs.stringify(obj)).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		deleteTeacherById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/user/deleteById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/user/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					// console.log({data});
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		findAllTeacher(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/user/findAll',{params:obj}).then(({data})=>{
					// console.log({data});
					context.commit('changeTeachers',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//教师结束
		//年级开始
		batchGrades(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/grade/batchDelete',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		deleteGradeById(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/grade/deleteById',{params:obj}).then(({data})=>{
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		saveOneGrade(context,obj){
			return new Promise((resolve,reject)=>{
				axios.post('/grade/saveOrUpdate',qs.stringify(obj)).then(({data})=>{
					// console.log({data});
					resolve(data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		findAllGrades(context,obj){
			return new Promise((resolve,reject)=>{
				axios.get('/grade/findAll',{params:obj}).then(({data})=>{
					// console.log({data});
					context.commit('changeGrades',data.data);
					resolve(data.data);
				}).catch((error)=>{
					reject(error);
				});
			})
		},
		//年级结束
	}
}
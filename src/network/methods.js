
import {requestMysql} from './index.js'

export function updateUserInformations(data){
  requestMysql({
    url:'/api/user/userInformations',
    data:{
      username:this.userMessage.username
    },
    method:'post',
  }).then(res=>{
    console.log(res.data[0]);
    this.userMessage.sex = res.data[0].sex
    this.userMessage.age = res.data[0].age
    this.userMessage.address = res.data[0].address
    this.userMessage.message = res.data[0].user_message
    }
  )
};
export function selectUserInformations(){

};
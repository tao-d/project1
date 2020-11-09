<template>
<div id="appointmentsListDiv">
  <ul id="appointmentsList" v-loading="loading" @click="clickItem">
    <appointments-list-item v-for="(item,index) in appointmentsList" :key="index" :appointment="item">
      <!-- <el-button slot="deleteBtn" class="deleteBtn" type="primary">取消预约</el-button> -->
    </appointments-list-item>
    <!-- <appointments-dialog :dialogVisible.sync="dialogVisible" v-if="dialogVisible"></appointments-dialog> -->  
    
  </ul>
  <el-dialog
      title="预约详情"
      :visible.sync="dialogVisible"
      id="dialogDoctor"
      v-if="dialogVisible"
      top="10vh"
    >
    <p>医生姓名:{{selectListItem.doctor_name}}</p>
    <p>科室:  {{selectListItem.doctor_department}}</p>
    <p>预约时间:{{selectListItem.time}}</p>
    <p>医生简介:{{selectListItem.doctor_informations}}</p>
    <p>预约状态: <el-tag :type="tagType" size="mini">{{selectListItem.status}}</el-tag></p>
    </el-dialog>
  </div>
</template>

<script>
import appointmentsListItem from './appointmentsListItem.vue'
// import appointmentsDialog from 'components/appointmentsDialog.vue'
import { requestMysql } from "network/index.js";
export default {
  name:'appointmentsList',
  components:{
    appointmentsListItem,
    // appointmentsDialog,
  },
  data () {
    return {
      appointmentsList:[],
      loading:true,
      dialogVisible: false,

      //用于存放具体点击的li数据信息
      selectListItem:null,
    }
  },
  props:{
    status:{
      type:String,
      default:'已预约'
    },
    tagType:{
      type:String,
      default:'primary',
      
    }
  },
  created () {
    this.getAppointmentsList()
  },
  watch:{

  },
  methods:{
    
    getAppointmentsList(){
      this.loading = true
      requestMysql({
        url:'/api/user/selectAppointments',
        method:'post',
        data:{
          username:this.$store.state.User.username,
          status:this.status
        }
      }).then(res=>{
        //console.log(res.data)
        this.appointmentsList = res.data
        this.loading = false
      })
    },

    clickItem(){
      /**
       *  事件代理
       */
       let selectIndex = null
       let liList = null
       liList = event.currentTarget.querySelectorAll('li')
       //通过遍历获取当前点击target的下标
       for(let i = 0;i<liList.length;i++)
       {
         //点击到li里的子元素也可以触发点击事件
         if(liList[i]==event.target||this.isParent(event.target,liList[i])){
              selectIndex = i;
          }
       }
       this.updateSelectItem(selectIndex)
       //打开具体对话框(全部加载完后再打开)
       this.dialogVisible = true
    },

    //根据当前的具体选择更新数据
    updateSelectItem(selectIndex){
      this.selectListItem = this.appointmentsList[selectIndex]

    },
    
    /**
     * 判断某个元素是否为另一个元素的子节点
     * 具体用于解决事件代理后，点击到li中的子元素的问题
     */
    isParent (obj,parentObj){
      while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY'){
        if (obj == parentObj){
          return true;
        }
          obj = obj.parentNode;
        }
        return false;
      }
    }
}
</script>

<style scoped> 
  ul{
    padding-left: 20px;
    margin: 0;
    overflow: auto;
    height: 100%;
    max-height: 60vh;
    width: 100%;
    box-sizing: border-box;
  }
  .deleteBtn{
    /* justify-self: start; */
    margin-right: auto;
  }
</style>
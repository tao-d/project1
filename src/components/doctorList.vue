<template>
  <div id="doctorList">
    <ul
      id="doctorListUl"
      v-loading="loading"
      @scroll="scrollEvent"
      ref="doctorListUl"
    >
      <p v-if="!showFlag" style="">该查询不存在</p>
      <doctor-list-item
        v-else
        v-for="(item, index) in doctorListLazy"
        :key="index"
        :doctor="item"
        @click.native="clickItem(index)"
      ></doctor-list-item>
    </ul>
    <el-dialog
      title="预约详情"
      :visible.sync="dialogVisible"
      id="dialogDoctor"
      v-if="dialogVisible"
      top="10vh"
      @close="dialogClose"
    >
      <div>
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择日期"
          class="datePicker"
          size="small"
          label="预约日期选择"
          value-format="yyyy/MM/d"
          :picker-options="pickerOptions"
          :clearable="false"
        >
        </el-date-picker>

        <el-tag class="selectTags" v-if="!!tableActiveData"
          >已选择{{ tableActiveData }} 时间段</el-tag
        >
        <el-button
          type="primary"
          size="small"
          class="btnAppointment"
          :disabled="!!!tableActiveData"
          @click="btnAppointment"
          >预约</el-button
        >
        <table id="timeTable" @click="clickTable" v-loading="!!!date">
          <tbody>
            <tr>
              <th style="background-color: white"></th>
              <th colspan="4" style="background-color: white">时间</th>
            </tr>
            <tr>
              <th style="background-color: white">上午</th>
              <th data-index="t1" ref="count1" :class="{'escapeTh':(!!!timeCount.count1)||escapeTh[0]}">
                8:00-9:00 <br />剩余:{{ timeCount.count1 }}
              </th>
              <th data-index="t2" ref="count2" :class="{'escapeTh':(!!!timeCount.count2)||escapeTh[1]}">
                9:00-10:00 <br />剩余:{{ timeCount.count2 }}
              </th>
              <th data-index="t3" ref="count3" :class="{'escapeTh':(!!!timeCount.count3)||escapeTh[2]}">
                10:00-11:00 <br />剩余:{{ timeCount.count3 }}
              </th>
              <th data-index="t4" ref="count4" :class="{'escapeTh':(!!!timeCount.count4)||escapeTh[3]}">
                11:00-12:00 <br />剩余:{{ timeCount.count4 }}
              </th>
            </tr>
            <tr>
              <th style="background-color: white"></th>
              <th colspan="4" style="background-color: white">休息时间</th>
            </tr>
            <tr>
              <th style="background-color: white">下午</th>
              <th data-index="t5" ref="count5" :class="{'escapeTh':(!!!timeCount.count5)||escapeTh[4]}">
                14:00-15:00<br />剩余:{{ timeCount.count5 }}
              </th>
              <th data-index="t6" ref="count6" :class="{'escapeTh':(!!!timeCount.count6)||escapeTh[5]}">
                15:00-16:00<br />剩余:{{ timeCount.count6 }}
              </th>
              <th data-index="t7" ref="count7" :class="{'escapeTh':(!!!timeCount.count7)||escapeTh[6]}">
                16:00-17:00<br />剩余:{{ timeCount.count7 }}
              </th>
              <th data-index="t8" ref="count8" :class="{'escapeTh':(!!!timeCount.count8)||escapeTh[7]}">
                17:00-18:00<br />剩余:{{ timeCount.count8 }}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div id="dialogDoctorContent">
        <el-row>
          <el-col :span="4">
            <div id="dialogDoctorAvatar" class="doctorInlineBlock">
              <el-avatar
                :src="url"
                id="doctorAvatar"
                :size="72"
                shape="square"
              ></el-avatar>
            </div>
          </el-col>
          <el-col :span="20">
            <div id="dialogDoctorInformations" class="doctorInlineBlock">
              <p>姓名：{{ doctorListLazy[selectDoctorIndex].doctor_name }}</p>
              <p>
                科室：{{ doctorListLazy[selectDoctorIndex].doctor_department }}
              </p>
              <p>
                简介：{{
                  doctorListLazy[selectDoctorIndex].doctor_informations
                }}
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import doctorListItem from "../components/doctorListItem.vue";
import { requestMysql } from "../network/index";
export default {
  name: "doctorlist",
  data() {
    return {
      url: require("../assets/doctor.svg"),
      doctorListLazy: [],
      doctorList: [],
      doctorTime: [],
      doctorListLazyNumber: 10,
      //保存table当前点击的活动th标签

      /**
       * tableIsActiveTh:记录当前活动的th-target
       * tableActiveData:存储当前的活动数据
       */
      tableIsActiveTh: "",
      tableActiveData: "",

      //控制doctorlist的显示
      showFlag: true,

      /**
       * doctorlist数据请求时的loading界面
       * true:显示loading界面
       * false:不显示loading界面
       */
      loading: false,
      url: require("../assets/doctor.svg"),

      escapeTh:[1,1,1,1,1,1,1,1],

      //控制弹窗的显示和关闭
      dialogVisible: false,

      //获取当前被选中点击的医生列表的具体index
      selectDoctorIndex: 0,

      //初始化date的格式为 yyyy/mm/d
      date:new Date().getFullYear() +"/"+(new Date().getMonth() + 1) + "/" + new Date().getDate(),

      //存储每个时间段的所剩人数
      timeCount: {
        count1: 5, //8:00-9:00
        count2: 5, //9:00-10:00
        count3: 5, //10:00-11:00
        count4: 5, //11:00-12:00
        count5: 5, //14:00-15:00
        count6: 5, //15:00-16:00
        count7: 5, //16:00-17:00
        count8: 5, //17:00-18:00
      },

      tableData: [
        {
          top: "上午",
          topTime1: "8:00-9:00",
          topTime2: "9:00-10:00",
          topTime3: "10:00-11:00",
          topTime4: "11:00-12:00",
        },
        {
          rest: "休息时间",
        },
        {
          top: "下午",
          bottomTime1: "14:00-15:00",
          bottomTime2: "15:00-16:00",
          bottomTime3: "16:00-17:00",
          bottomTime4: "17:00-18:00",
        },
      ],
    
      pickerOptions: {
         disabledDate(time) {
            //const curDate1 = (new Date()).getTime()
            const day = 13 * 24 * 3600 * 1000
            //const dateRegion = curDate1 + day
            return time.getTime() < Date.now() - 8.64e7  ||  time.getTime() > Date.now()+day
          },
        }      
    };
  },
  components: {
    doctorListItem,
  },
  computed: {
    //
  },
  created() {
    this.getDoctorList("");
  },
  watch:{
    date(){
      /**
       *  当日期改变的时候，要更新table里的数据
       * 1.更新可点击的th 类disabled状态
       * 2.更新每个时间段医生的可剩余预约位置
       */
      this.checkThIsTrue()
      this.getSelectItemData()
    }
  },
  methods: {
    //获取搜索医生的列表
    getDoctorList(key) {
      this.loading = !this.loading;
      requestMysql({
        url: "/api/doctor/selectdoctor",
        method: "post",
        data: {
          doctor_name: key,
        },
      }).then((res) => {
        //当返回的数据数组长度大于0（证明有结果返回）
        if (res.data.length > 0) {
          this.doctorList = res.data;
          this.doctorListLazyNumber = 10;
          if (this.doctorList.length > 10) {
            this.doctorListLazy = this.doctorList.slice(0, 10);
          } else {
            this.doctorListLazy = this.doctorList;
          }
          this.showFlag = true;
        } else {
          this.showFlag = false;
        }
        this.loading = !this.loading;
        this.$refs.doctorListUl.scrollTop = 0;
      });
    },

    openDialog() {
      this.dialogVisible = true;
    },

    //点击医生具体列表里的事件
    clickItem(index) {
      this.selectDoctorIndex = index;
      this.getSelectItemData();
      this.checkThIsTrue();
      this.dialogVisible = true;
    },
    //通过dataset转化为真正的时间段
    getTableTime(time) {
      switch (time) {
        case "t1":
          return "8:00-9:00";
        case "t2":
          return "9:00-10:00";
        case "t3":
          return "10:00-11:00";
        case "t4":
          return "11:00-12:00";
        case "t5":
          return "14:00-15:00";
        case "t6":
          return "15:00-16:00";
        case "t7":
          return "16:00-17:00";
        case "t8":
          return "17:00-18:00";
      }
    },
    //点击table中的th触发事件
    clickTable() {
      //限制不可点击的th
      if (
        event.target.innerHTML === "休息时间" ||
        event.target.innerHTML === "时间" ||
        event.target.innerHTML === "上午" ||
        event.target.innerHTML === "下午" ||
        event.target.innerHTML === "" ||
        event.target.className =='el-loading-mask'
      ) {
        return 0;
      }

      //阻止当前不符合条件的th进入触发事件
      //console.log(this.escapeTh[event.target.dataset.index[1]-1],this.timeCount[`count${event.target.dataset.index[1]}`])
      if(this.escapeTh[event.target.dataset.index[1]-1]||!this.timeCount[`count${event.target.dataset.index[1]}`])
      {
        return 0;
      }

      if(event.target.style.backgroundColor == "rgb(140, 197, 255)") {
        event.target.style.backgroundColor = "";
      } else {
        event.target.style.backgroundColor = "rgb(140, 197, 255)";
      }
      //当存在活动的th时触发
      if (this.tableIsActiveTh != "") {
        let oldActiveTh = document.querySelector(
          `th[data-index='${this.tableIsActiveTh}']`
        );
        this.tableIsActiveTh = event.target.dataset.index;
        let newActiveTh = document.querySelector(
          `th[data-index='${this.tableIsActiveTh}']`
        );
        oldActiveTh.style.backgroundColor = "";
        //当点击的th是当前的活动th时
        if(oldActiveTh === newActiveTh) {
          this.tableActiveData = "";
          this.tableIsActiveTh = "";
          return;
        }
        this.tableIsActiveTh = event.target.dataset.index;
        this.tableActiveData = this.getTableTime(newActiveTh.dataset.index);
      } 
      //当不存在活动的th的时候触发
      else {
        this.tableIsActiveTh = event.target.dataset.index;
        let newActiveTh = document.querySelector(
          `th[data-index='${this.tableIsActiveTh}']`
        );
        this.tableActiveData = this.getTableTime(newActiveTh.dataset.index);
        
      }
    },

    //添加关于懒加载的滚轮事件
    scrollEvent(event) {
      this.doctorListLazyLoading(event);
    },

    //医生列表的懒加载实现
    doctorListLazyLoading(event) {
      let lazyLoadingTarget = event.target;
      if (
        lazyLoadingTarget.clientHeight + lazyLoadingTarget.scrollTop >=
        lazyLoadingTarget.scrollHeight - 100 //100为缓冲长度，加载更加顺滑
      ) {
        let listStartNumber = this.doctorListLazyNumber;
        //设置每次懒加载的个数
        let listAdd = 5;
        while (this.doctorList.length > this.doctorListLazyNumber) {
          this.doctorListLazy.push(this.doctorList[this.doctorListLazyNumber]);
          this.doctorListLazyNumber++;
          // console.log(this.doctorListLazyNumber);
          //当加载完每次懒加载的个数后退出懒加载循环
          if (this.doctorListLazyNumber - listStartNumber === listAdd) {
            break;
          }
        }
      }
    },

    //获取更新table中的数据，更新每个时间段的预约人数
    getSelectItemData() {
      requestMysql({
        method: "post",
        url: "/api/doctor/getSelectItemData",
        data: {
          doctor_name: this.doctorListLazy[this.selectDoctorIndex].doctor_name,
          date:this.date,
        },
      })
        .then((res) => {
          /**
           * 更新所有预约时间段的剩余人数
           */
          //console.log(res.data[0]);
          //初始化已存在的数据 = 0
          this.tableInit()
          this.timeCount.count1 = res.data[0].count1;
          this.timeCount.count2 = res.data[0].count2;
          this.timeCount.count3 = res.data[0].count3;
          this.timeCount.count4 = res.data[0].count4;
          this.timeCount.count5 = res.data[0].count5;
          this.timeCount.count6 = res.data[0].count6;
          this.timeCount.count7 = res.data[0].count7;
          this.timeCount.count8 = res.data[0].count8;
        })
        .catch((err) => {
          console.log();
        });
    },
    dialogClose() {
      this.dataInit();
      
    },
    btnAppointment(){
      //${(typeof (this.date)=='object'?this.date.toLocaleDateString():this.date)}
      if(this.$store.state.User.username==""&&this.$store.state.User.username=="")
      {
        this.$alert('您还未登录，请先登录!','请先登录').then(()=>{
          setTimeout(()=>{
            this.$router.push('/login');
          },100)
           
        });
        return 0 
      }
      this.$confirm(`您选择了${(this.date)} ${this.tableActiveData}时间段
      是否进行预约？`,'提示', {
          confirmButtonText: '预约',
          cancelButtonText: '取消',
          type: 'warning'}).then(()=>{
            this.selectAppointment().then(res=>{
              if(res){
                this.addAppointment();
                this.$message({
                  message:'已预约',
                  type:'success'
                })
                this.dialogVisible = false
                this.dataInit();
              }
              else{
                this.$message({
                  message:'已存在该次预约',
                  type:'error'
                })
              }
            })
            // this.addAppointment();
            // this.$message({
            //   message:'已预约',
            //   type:'success'
            // })
            // this.dialogVisible = false
            // this.dataInit();
          }).catch(()=>{
              this.$message({
              message:"已取消",
              type:'info'
            })
          })
    },
    addAppointment(){
      requestMysql({
        url:'/api/doctor/addAppointment',
        method:'post',
        data:{
          doctor_name:this.doctorListLazy[this.selectDoctorIndex].doctor_name,
          username:this.$store.state.User.username,
          time:this.date + " "+this.tableActiveData,
          status:'已预约'
        }
      }).then(res=>{
        //console.log(res.data)
        
      })
    },
    selectAppointment(){
      return requestMysql({
        url:'/api/doctor/checkAppointment',
        method:'post',
        data:{
          doctor_name:this.doctorListLazy[this.selectDoctorIndex].doctor_name,
          username:this.$store.state.User.username,
          time:this.date + " "+this.tableActiveData,
        }
      }).then(res=>{
        if(res.data.length==0)
        {
          console.log('无该记录');
          return true
        }
        else{
          console.log('有该记录');
          return false
        }
      })
    },
    //通过日期判断th是否可以点击 *在日期更改后触发
    checkThIsTrue(){
      //将当前时间存入数组（按年,月,日）
      let dateArray = this.date.split('/')
      for(let i = 0;i<8;i++)
      {
        let getFrontTime = this.getTableTime('t'+(i+1)).split('-')[0];
        dateArray.push(getFrontTime);
        let clickTime = new Date(dateArray);
        //当前时间与选择时间相差半小时后th禁止 1h=3600000
        if(clickTime-new Date()<(60*60*1000)/2){
          this.$set(this.escapeTh,i,1)
        }
        else {
          this.$set(this.escapeTh,i,0)
        }
        dateArray.pop()
      }
    },
    //初始化表格的所有数据变量
    tableInit(){
      this.timeCount.count1 = "";
      this.timeCount.count2 = "";
      this.timeCount.count3 = "";
      this.timeCount.count4 = "";
      this.timeCount.count5 = "";
      this.timeCount.count6 = "";
      this.timeCount.count7 = "";
      this.timeCount.count8 = "";
    },
    dataInit(){
      this.tableActiveData = "";
      this.tableIsActiveTh = "";
      this.date=new Date().getFullYear() +"/"+(new Date().getMonth() + 1) + "/" + new Date().getDate()
    }

  },
};
</script>

<style scoped>
/* #doctorlist{
    
  } */
#doctorListUl {
  /* border-top: 1px solid rgb(211, 211, 211); */
  padding: 10px 0;
  overflow: auto;
  height: 100%;
  max-height: 60vh;
}
li {
  text-decoration: none;
  list-style: none;
}
#dialogDoctor {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
#doctorAvatar {
  background-color: white;
}
/* #dialogDoctorAvatar{
    float: left;
  } */
#dialogDoctorContent {
  margin-bottom: 10px;
}
#dialogDoctorInformations {
  margin-left: 5px;
  padding-right: 50px;
}
#dialogDoctorInformations p {
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.doctorInlineBlock {
  display: inline-block;
  vertical-align: top;
}

.datePicker {
  margin: 0 5px;
  width: 178px;
}
#timeTable {
  border-collapse: collapse;
  margin: 20px auto;
}
#timeTable th {
  border: 1px solid rgb(220, 223, 230);
  padding: 10px;
  transition: background-color 0.5s;
  cursor: pointer;
  text-align: center;
}
#timeTable th:hover {
  background-color: rgb(179, 216, 255);
}
#timeTable .escapeTh{
  background-color: rgba(0, 0, 0,0.2)!important;
  color: grey;
}
.selectTags {
  margin-left: 10px;
}
/* .btnappointment{
  position: relative;
  
} */
</style>
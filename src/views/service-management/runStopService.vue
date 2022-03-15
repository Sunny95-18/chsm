<template>
  <Card>
    <List v-if="isStop" border>
      <ListItem><h3>停止服务</h3></ListItem>
      <ListItem>
        <span class="response">{{content}}</span>
      </ListItem>
      <ListItem>当前服务运行正常，请选择要进行的操作。</ListItem>
      <ListItem>
        强制停止所有服务
        <Button style="margin-left:170px;" type="warning" @click="stop">立即停止服务</Button>
      </ListItem>
      <ListItem>
        强制停止服务，然后重新启动
        <Button style="margin-left:100px;" type="warning" @click="reStart">重新启动服务</Button>
      </ListItem>
    </List>
    <List v-else  border>
       <ListItem><h3>启动服务</h3></ListItem>
      <ListItem>  <span class="response">服务已停止.</span></ListItem>
      <ListItem>请将操作员USBKey正确的方向插入设备，然后点击[启动密码服务]按钮启动服务。</ListItem>
      <ListItem> <Button style="margin-left:300px;" type="success" @click="start">启动服务</Button></ListItem>
    </List>
  </Card>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
         content:"密码服务正在运行.",
        isStop:false
    };
  },

  created() {
    // this.loadData();
  },
  methods: {
    ...common.methods,
    loadData() {
      this.$store.commit("serviceShow", this.queryParams);
    },
    start(){
       this.isStop=true
   
      
    },
    stop(){
        this.isStop=false
      //    this.$store.dispatch("changeServiceStatus",0).then((res) => {
      //   var resData = res.data;
      //   if (resData && resData.code == "200") {
       
      //    this.$Message.success("关闭成功!");
      //   }else{
      //     this.$Message.error("关闭失败")
      //   }
      // });
        
    },
    reStart(){
       this.content="重启成功，密码服务正在运行."
      //    this.$store.dispatch("changeServiceStatus",2).then((res) => {
      //   var resData = res.data;
      //   if (resData && resData.code == "200") {
         
      //     this.stop=true;
      //    this.$Message.success("重启成功!");
      //   }else{
      //     this.$Message.error("重启失败")
      //   }
      // });
       
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.serviceStatus;
    }
  },
  watch: {
    $route() {}
  }
};
</script>
<style scoped>
.response {
  margin-left: 300px;
  color: red;
}
</style>
  <template>
  <Card :bordered="false" dis-hover>
    <List border size="large">
      <ListItem>
        <h3 style="margin:0 auto">设备状态</h3>
      </ListItem>
      <ListItem style="height:100px">
        <div style="margin:0 auto;text-algin:center">
          <p v-if="status==0" style="color:red;font-size:16px">签验验签服务正在运行中!</p>
          <p v-else style="color:red;font-size:16px">签验验签服务已停止运行!</p>
        </div>
      </ListItem>
      <ListItem>
        <Button v-if="status==0" style="margin:0 auto" type="error" @click="sureCloseService=true">关闭服务</Button>
        <Button v-else style="margin:0 auto" type="success" @click="sureRestartService=true">启动服务</Button>
      </ListItem>
    </List>
    <Modal v-model="sureCloseService" title="确定要关闭签名验签服务器吗？" @on-ok="closeService"></Modal>
    <Modal v-model="sureRestartService" title="确定要启动签名验签服务器吗？" @on-ok="restartService"></Modal>
  </Card>
</template>

<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      status: 0,
      sureCloseService: false,
      sureRestartService:false,
    };
  },
   created() {
    this.loadData();
  },
  methods: {
    ...common.methods,
    loadData(){
         this.$store.dispatch("getServiceStatus").then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.status = resData.data==true?0:1;;
         
        }else{
          this.$Message.error("获取服务状态失败")
        }
      });
    },
    closeService() {
          this.$store.dispatch("changeServiceStatus",0).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200"&& resData.data==true) {
          this.status = 1;
         this.$Message.success("关闭成功!");
        }else{
          this.$Message.error("关闭失败")
        }
      });
     
    },
    restartService() {
           this.$store.dispatch("changeServiceStatus",1).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200" && resData.data==true) {
           this.status = 0;
         this.$Message.success("启动服务成功!");
        }else{
          this.$Message.error("启动服务失败！")
        }
      });
    
    },  
  },
    computed: {
    ...common.computed,
    state() {
      return this.$store.state.serviceStatus;
    }
  },
};
</script>

<style>
</style>
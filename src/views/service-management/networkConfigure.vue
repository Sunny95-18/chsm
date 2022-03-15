<template>
  <Tabs value="network">
    <TabPane label="网卡配置" name="network">
      <div class="div">
        <Card :bordered="false" dis-hover>
          <p slot="title">系统网卡</p>
          <Form ref="networkForm" :model="networkForm" :label-width="150">
            <FormItem
              label="网络接口1："
              prop="mamagementLogType"
              style="height: 20px"
            >
              <Input v-model="networkForm.name1" style="width: 200px" />
            </FormItem>
            <FormItem label="MAC地址:" prop="mac1" style="height: 20px">{{
              networkForm.mac1
            }}</FormItem>
            <FormItem label="IP地址：" prop="ip1">
              <Input v-model="networkForm.ip1" style="width: 200px" />
            </FormItem>
            <FormItem label="子网掩码：" prop="mask1">
              <Input v-model="networkForm.mask1" style="width: 200px" />
            </FormItem>
            <FormItem label="网关：" prop="gateWay1">
              <Input v-model="networkForm.gateWay1" style="width: 200px" />
            </FormItem>
            <Divider />
            <FormItem
              label="网络接口2："
              prop="mamagementLogType"
              style="height: 20px"
            >
              <Input v-model="networkForm.name2" style="width: 200px" />
            </FormItem>
            <FormItem label="MAC地址:" prop="mac2" style="height: 20px">{{
              networkForm.mac2
            }}</FormItem>
            <FormItem label="IP地址：" prop="ip2">
              <Input v-model="networkForm.ip2" style="width: 200px" />
            </FormItem>
            <FormItem label="子网掩码：" prop="mask2">
              <Input v-model="networkForm.mask2" style="width: 200px" />
            </FormItem>
            <FormItem label="网关：" prop="gateWay2">
              <Input v-model="networkForm.gateWay2" style="width: 200px" />
            </FormItem>
            <Checkbox v-model="networkForm.bond">单网卡设置</Checkbox>
              <!-- <p style="margin-top:5px;color:blue">注：多网卡设备也只能配置一个网关地址，同网段访问可将网关配置为“0.0.0.0”。</p> -->
            <FormItem style="margin-top:10px">
              <Button type="primary" @click="save">保存</Button>
              <Button style="margin-left: 20px;" type="info" @click="restart"
                >重启服务器</Button
              >
            </FormItem>
          </Form>
        </Card>
      </div>
    </TabPane>
    <!-- <TabPane label="DNS配置" name="dns">
      <div class="div">
        <Card :bordered="false" dis-hover>
          <p slot="title">DNS服务器</p>
          <Form :label-width="150">
            <FormItem label="DNS地址：" prop="mamagementLogType">
              <Input v-model="dnsIp" type="textarea" style="width:200px" />
            </FormItem>
             <FormItem >
              <Button type="primary" @click="saveDNS">提交</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </TabPane> -->
    <!-- <TabPane label="网关配置" name="gateway">
       <div class="div">
        <Card :bordered="false" dis-hover>
          <p slot="title">网关配置</p>
          <Form :label-width="150">
            <FormItem label="网关地址：" prop="mamagementLogType">
              <Input v-model="gateway" style="width:200px" />
            </FormItem>
             <FormItem >
              <Button type="primary" @click="saveGatewary">提交</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </TabPane> -->
  </Tabs>
</template>
<script>
import { removeToken } from "@/utils/token";
export default {
  data() {
    return {
      networkForm: {
        name1: "",
        mac1: "",
        ip1: "",
        mask1: "",
        gateWay1: "",
        name2: "",
        mac2: "",
        ip1: "",
        mask1: "",
        gateWay2: "",
        bond: false,
      },
      bond:true
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$store.dispatch("getNetWork").then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          const data = resData.data;
          this.networkForm.name1 = data.name1;
          this.networkForm.mac1 = data.mac1;
          this.networkForm.ip1 = data.ip1;
          this.networkForm.mask1 = data.mask1;
          this.networkForm.gateWay1 = data.gateWay1;

          this.networkForm.name2 = data.name2;
          this.networkForm.mac2 = data.mac2;
          this.networkForm.ip2 = data.ip2;
          this.networkForm.mask2 = data.mask2;
          this.networkForm.gateWay2 = data.gateWay2;
          this.networkForm.bond = data.bond;
        }
      });
    },
    save() {
      this.$store.dispatch("editNetwork", this.networkForm).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.$Message.success("修改网络配置成功!");
        } else {
          this.$Message.error("修改网络配置失败,原因：" + resData.message);
        }
      });
    },
    restart() {
      this.$store.dispatch("restartNetWork").then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          removeToken();
          this.$Message.success("重启成功!即将自动跳转登录页面");

          setTimeout(() => {
            this.goLogin();
          }, 4000);
        } else {
          this.$Message.error("重启失败," + resData.message);
        }
      });
    },
    goLogin() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>
<style>
.div {
  margin: 0 auto;
  width: 550px;
  height: 800px;
}
</style>
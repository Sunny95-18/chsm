<template>
  <Tabs value="time1">
    <TabPane label="时间配置" name="time1">
      <Card :bordered="false" style="height:450px" dis-hover>
        <p slot="title">系统时间设置</p>
        <Form :label-width="150">
          <FormItem label="当前系统时间：">
            <!-- <DatePicker type="datetime" v-model="time" format="yyyy-MM-dd HH:mm:ss"  style="width: 200px"></DatePicker> -->
            <Input v-model="time" style="width: 200px" />
          </FormItem>
          <FormItem label="设置系统时间：">
            <DatePicker type="datetime" v-model="newTime" format="yyyy-MM-dd HH:mm:ss"  style="width: 200px"></DatePicker>
            <!-- <Input v-model="time" style="width: 200px" /> -->
          </FormItem>
          <FormItem>
            <Button type="primary" @click="setDate()">设置</Button>
          </FormItem>
        </Form>
      </Card>
    </TabPane>
    <TabPane label="时间源配置" name="time2">
      <Card>
        <p slot="title">NTP设置</p>
        <Form :label-width="150">
          <FormItem label="NTP服务器IP：">
            <Input v-model="ntpForm.ip" style="width: 200px" />
          </FormItem>
          <FormItem label="NTP端口号：">
            <Input v-model="ntpForm.port" disabled  style="width: 200px" />
          </FormItem>
            <FormItem label="同步周期(分钟)：">
            <Input v-model="ntpForm.interval" style="width: 200px" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="save()">保存</Button>
          </FormItem>
        </Form>
      </Card>
    </TabPane>
  </Tabs>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      time: "",
      newTime:"",
      ntpForm:{
        ip:"",
        port:123,
        interval:0
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.$store.dispatch("getNTPdate").then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200) {
          this.time = resData.data.systimeDate;
          this.ntpTime = resData.data.ntpDate;
          this.ntpForm.ip=resData.data.ip;
          this.ntpForm.port=resData.data.port;
          this.ntpForm.interval=resData.data.interval;
        } else {
          this.$Message.error("时间获取失败!原因：" + resData.message);
        }
      });
    },
    setDate() {
      const dateStr=moment(this.newTime).format("YYYY-MM-DD HH:mm:ss")
 
      this.$store.dispatch("setDate",dateStr).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200 && resData.data) {
          this.loadData();
          this.$Message.success("NTP时间源设置成功！");
        } else {
          this.$Message.error("NTP时间源设置失败!");
        }
      });
    },
    save(){
 this.$store.dispatch("setNtp",this.ntpForm).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200 && resData.data) {
          this.loadData();
          this.$Message.success("时间设置成功！");
        } else {
          this.$Message.error("时间设置失败!原因："+resData.message);
        }
      });
    }
  },
  computed: {
    state() {
      return this.$store.state.system;
    },
  },
};
</script>

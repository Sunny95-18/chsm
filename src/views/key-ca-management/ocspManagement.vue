<template>
  <div class="div">
    <Card :bordered="false" dis-hover>
         <Form  :label-width="100">
        <FormItem label="OCSP地址：">
          <Input style="width:200px" v-model="url"/>
        </FormItem>
          <FormItem label="端口号：">
          <Input style="width:200px"  v-model="port"/>
        </FormItem>
           <Button class="ops-btn" style="margin-left:150px" type="info" @click="setOCSP()">确定</Button>
      </Form>
    </Card>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data(){
    return {
      url:"",
      port:"",
    }
  },
    created() {
    this.loadData();
  },
    methods: {
      loadData(){
            this.$store.dispatch("getOCSP").then((res) => {
            var resData = res.data;
            if (resData && resData.code == "200") {
              this.url=resData.data.url;
              this.port=resData.data.port;
            } else {
              this.$Message.error("OCSP设置获取失败! "+resData.message);
            }
      });
      },
      setOCSP(){
        
        const from={
          url:this.url,
          port:this.port
        }
          this.$store.dispatch("setOCSP",from).then((res) => {
            var resData = res.data;
            if (resData && resData.code == "200") {
             this.loadData();
              this.$Message.success("OCSP设置成功 !");
            } else {
              this.$Message.error("OCSP设置获取失败! "+resData.message);
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

<style>
.div {
  margin: 0 auto;
  width: 400px;
  height: 650px;
}
</style>
<template>
  <div class="div">
    <Card>
         <p slot="title">设备自检</p>
         <Button  style="margin-left:150px" type="primary" @click="startDeviceRunInfo">设备自检</Button>
    </Card>
    </div>
</template>
<script>
export default {
      methods: {
    startDeviceRunInfo(){
        this.$store.dispatch("deviceRunInfo").then((res) => {
            var resData = res.data;
            if (resData && resData.code == 200&&resData.data) {
              this.$Message.success("自检成功！")
            }else {
                this.$Message.error("自检失败,"+resData.message)
            }
          });
    }
 },
   computed: {
    state() {
      return this.$store.state.system;
    },
  },
}
</script>
<style>
.div {
  margin: 0 auto;
  width: 500px;
  height: 500px;
}
</style>
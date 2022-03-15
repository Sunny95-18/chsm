<template>
  <div class="div">
      
    <Card :bordered="false" dis-hover>
          <p slot="title">日志配置</p>
      <Form ref="logConfigureForm" :model="logConfigureForm" :rules="ruleValidate" :label-width="190">
        <FormItem label="管理日志级别：" prop="mamagementLogType">
          <Select v-model="logConfigureForm.mamagementLogType">
            <Option :value="1">DEBUG</Option>
            <Option :value="2">INFO</Option>
            <Option :value="3">WARN</Option>
            <Option :value="4">ERROR</Option>
          </Select>
        </FormItem>
  
        <FormItem>
          <Button type="primary" @click="handleSubmit('logConfigureForm')">保存</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
export default {
  data() {
         const validateIP = (rule, value, callback) => {
             if(!this.logConfigureForm.isBack)   callback();
                //  var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                 var reg=/^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/
                 if(reg.test(value)){
                     callback();
                 }else{
                      callback(new Error('请输入正确的IP地址!'));
                 }

            };
             const validatePort = (rule, value, callback) => {
                 if(!this.logConfigureForm.isBack)   callback();
                 if(value>=1&&value<=65535){
                     callback();
                 }else{
                      callback(new Error('请输入正确的端口!'));
                 }

            };
    return {
      logConfigureForm: {
        mamagementLogType: 1,
        isBack:false,
        IP:"",
        port:""
      },
      ruleValidate:{
          IP:[
              { validator: validateIP, trigger: 'blur' }
        
          ],
          port:[
              { validator: validatePort, trigger: 'blur' }
           
          ]
      }
    };
  },
   methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
            this.$store.dispatch("setLogLevel",this.logConfigureForm.mamagementLogType
            ).then((res) => {
               var resData = res.data;
            if(resData && resData.code == "200") {
               this.$Message.success("设置成功!");
            }else{
               this.$Message.error("设置失败!");
            }
            });
        } else {
          this.$Message.error("操作失败!");
        }
      });
    },
  },
};
</script>
<style>
.div {
  margin: 0 auto;
  width: 500px;
  height: 400px;
}
</style>
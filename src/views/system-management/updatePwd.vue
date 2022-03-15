<template>
  <div class="div">
    <Card>
      <p slot="title">修改系统登录口令</p>
      <p style="color: red">
        注：修改本管理程序的系统登录口令，也是串口管理终端的用户登录口令。
      </p>
      <Form
        style="margin-top: 10px"
        ref="formCustom"
        :model="formCustom"
        :rules="ruleCustom"
        :label-width="100"
      >
        <FormItem label="原口令：" prop="oldPwd">
          <Input
            v-model="formCustom.oldPwd"
            type="password"
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="新口令：" prop="newPwd">
          <Input
            v-model="formCustom.newPwd"
            type="password"
            style="width: 200px"
          />
        </FormItem>
        <FormItem label="确认口令：" prop="confirmPwd">
          <Input
            v-model="formCustom.confirmPwd"
            type="password"
            style="width: 200px"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formCustom')"
            >修改</Button
          >
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新口令！"));
      } else {
        if (this.formCustom.confirmPwd !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("confirmPwd");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认再次输入新口令！"));
      } else if (value !== this.formCustom.newPwd) {
        callback(new Error("两次口令不正确!"));
      } else {
        callback();
      }
    };
    return {
      formCustom: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
        id:"",
      },
      ruleCustom: {
        newPwd: [{ validator: validatePass, trigger: "blur" }],
        confirmPwd: [{ validator: validatePassCheck, trigger: "blur" }],
      },
    };
  },
created() {
       this.$store.dispatch("getUserInfo").then((res) => {
            var resData = res.data;
            if (resData && resData.code == "200") {
             this.formCustom.id=resData.data.id;
            } 
          });
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
         this.$store.dispatch("updatePassword",this.formCustom).then((res) => {
            var resData = res.data;
            if (resData && resData.code == "200") {
                 this.$refs[name].resetFields();
              this.$Message.success("修改成功！")
            }else {
                this.$Message.error("修改失败，原因："+resData.message)
            }
          });
    
        } else {
          this.$Message.error("参数错误!");
        }
      });
    },
  },
    computed: {
    state() {
      return this.$store.state.adminUserManagement;
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
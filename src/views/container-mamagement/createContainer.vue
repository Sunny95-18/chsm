<template>
  <div class="div">
    <Card :bordered="false" dis-hover>
      <p slot="title">应用实体信息</p>
      <Form
        ref="containerForm"
        :model="containerForm"
        :rules="ruleValidate"
        :label-width="150"
      >
        <FormItem label="密钥类型：">
          <Select v-model="containerForm.algType" style="width: 200px">
            <Option :value="3">SM2</Option>
            <!-- <Option :value="4">RSA</Option> -->
          </Select>
        </FormItem>
        <FormItem v-if="containerForm.algType == 2" label="密钥长度：">
          <Select v-model="containerForm.keyLength" style="width: 200px">
            <Option :value="1024">1024</Option>
            <Option :value="2048">2048</Option>
          </Select>
        </FormItem>
        <FormItem label="应用名称：" prop="name">
          <Input v-model="containerForm.name" style="width: 200px" />
        </FormItem>
        <FormItem label="密钥索引:" prop="keyIndex">
          <Input v-model="containerForm.keyIndex" style="width: 200px" />
        </FormItem>
        <FormItem label="私钥授权码:" prop="authCode">
          <Input v-model="containerForm.authCode" type="password" style="width: 200px" />
        </FormItem>
        <FormItem label="确认私钥授权码:" prop="confirmAuthCode">
          <Input v-model="containerForm.confirmAuthCode" type="password" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button class="ops-btn" type="info" @click="createContainer('containerForm')"
            >确定</Button
          >
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入你的私钥授权码"));
      } else {
        if (this.containerForm.confirmAuthCode !== "") {
          // 对第二个密码框单独验证
          this.$refs.containerForm.validateField("confirmAuthCode");
        }
        callback();
      }
    };
    const validateCodeCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入你的私钥授权码"));
      } else if (value !== this.containerForm.authCode) {
        callback(new Error("两次私钥授权码不正确!"));
      } else {
        callback();
      }
    };
    return {
      containerForm: {
        algType: 3,
        name: "",
        keyIndex: "",
        keyLength: 256,
        authCode: "",
        confirmAuthCode: "",
      },
      ruleValidate: {
        name:[ { required: true, message: '请输入名称', trigger: 'blur' }],
          keyIndex:[ { required: true, message: '请输入密钥索引', trigger: 'blur' }],
        authCode: [{ required: true,validator: validateCode, trigger: "blur" }],
        confirmAuthCode: [{ required: true,validator: validateCodeCheck, trigger: "blur" }],
      },
    };
  },
  methods: {
    createContainer(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$store.dispatch("createContainer", this.containerForm).then((res) => {
              var resData = res.data;
              if (resData && resData.code == "200") {
                this.$Message.success("创建成功!");
               this.$refs[name].resetFields();
                
              } else {
                this.$Message.error("创建失败，" + resData.message);
              }
            });
        } else {
          this.$Message.error("创建失败!");
        }
      });
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.container;
    },
  },
};
</script>
<style>
.div {
  margin: 0 auto;
  width: 500px;
  height: 650px;
}
</style>
<template>
  <div class="div">
    <Card :bordered="false">
      <p slot="title">新建管理员</p>
      <p style="color: red">
        注：操作员和管理员需要关联UKey，并输入UKey的口令作为密码
      </p>
      <Form
        style="margin-top: 10px"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="110"
      >
        <FormItem label="UKey序列号">
          <Select v-model="firstSerianNumber" style="width: 200px">
            <Option
              v-for="item in formValidate.serialNumber"
              :value="item"
              :key="item"
              >{{ item }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="密码：" prop="pin">
          <Input
            v-model="formValidate.pin"
            type="password"
            placeholder="请输入密码"
            style="width: 200px"
          />
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')"
            >添加</Button
          >
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
import common from "@/utils/common";
import SZLXKEY from "@/utils/SZLXKey";
export default {
  data() {

    return {
       firstSerianNumber: "",
      formValidate: {
        serialNumber: [],
        pin: "",
        role: 1,
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "名称不可为空",
            trigger: "blur",
          },
        ],
   
      },
    };
  },
  created() {
    this.loadserialNumber();
  },
  methods: {
    loadserialNumber() {
      var result = SZLXKEY.EnumBySerial();
     this.formValidate.serialNumber=result.split("|");
      this.firstSerianNumber = this.formValidate.serialNumber[0];
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          var hDevice = this.firstSerianNumber;
         SZLXKEY.OpenDevice(hDevice);
         SZLXKEY.OperatorLogin(hDevice, this.formValidate.pin);
         var createUserForm={
            serialNumber: this.firstSerianNumber,
              pin:createUserForm.pin,
            roleType: createUserForm.role
         }

          this.$store.dispatch("createUser", createUserForm).then((res) => {
            var resData = res.data;
            if (resData && resData.code == "200") {
              this.$Message.success("添加成功！");
              this.formValidate.pin=""
            } else {
              this.$Message.error("添加失败，错误码：" + resData.message);
            }
          });
        } else {
          this.$Message.error("口令验证失败!");
        }
      });
    },
  },
  computed: {
    ...common.computed,
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
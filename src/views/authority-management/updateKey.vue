<template>
  <Card style="height:600px">
    <div style="marginTop:100px;marginLeft:300px">插入USBKey。</div>
    <div style="marginTop:20px;marginLeft:200px">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
        <FormItem label="请输入原口令:" prop="oldPwd">
          <Input type="password" v-model="formValidate.oldPwd" style="width:200px" password />
        </FormItem>
        <FormItem label="请输入8位新口令:" prop="newPwd">
          <Input type="password" v-model="formValidate.newPwd" style="width:200px"  password/>
        </FormItem>
        <FormItem label="请再次输入新口令:" prop="newPwdConfirm">
          <Input type="password" v-model="formValidate.newPwdConfirm" style="width:200px" password />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">修改口令</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 20px">重置</Button>
        </FormItem>
      </Form>
    </div>
  </Card>
</template>
<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length !== 8) {
        callback(new Error("口令长度为8位"));
      }
      if (value === "") {
        callback(new Error("请输入新口令"));
      } else {
        if (this.formValidate.newPwdConfirm !== "") {
          // 对第三个密码框单独验证
          this.$refs.formValidate.validateField("newPwdConfirm");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value.length !== 8) {
        callback(new Error("口令长度为8位"));
      }
      if (value === "") {
        callback(new Error("请在此输入确认口令"));
      } else if (value !== this.formValidate.newPwd) {
        callback(new Error("两次口令不匹配！"));
      } else {
        callback();
      }
    };
    return {
      formValidate: {
        oldPwd: "",
        newPwd: "",
        newPwdConfirm: ""
      },
      ruleValidate: {
        oldPwd: [
          {
            required: true,
            message: "原口令不可为空",
            trigger: "blur"
          }
        ],
        newPwd: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur"
          }
        ],
        newPwdConfirm: [
          {
            required: true,
            validator: validatePassCheck,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
            const data={
                oldPwd:this.formValidate.oldPwd,
                newPwd:this.formValidate.newPwd,
                newPwdConfirm:this.formValidate.newPwdConfirm,
            }
    
          this.$Message.success("修改成功!");
        } else {
          this.$Message.error("参数错误!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  }
};
</script>
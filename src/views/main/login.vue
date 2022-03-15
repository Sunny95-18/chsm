<style lang="less">
@import "./login.less";
</style>

<template>
  <div
    style="padding: 100px 5px; width: 100%; height: 100%; background: #f0f0f0"
  >
    <div class="login" @keydown.enter="handleSubmit">
      <div class="login-con">
        <Card :bordered="false">
          <p
            slot="title"
            style="text-align: center; font-size: 20px; font-weight: 800"
          >
            <Icon type="md-key11"></Icon>
            <span>云服务器管理系统登录</span>
          </p>
          <div class="form-con">
            <Form id="loginForm" ref="loginForm" :model="form" :rules="rules">
              <FormItem v-if="isKey" prop="serialNumber  ">
                <Select v-model="firstSerialNumber">
                  <Option
                    v-for="item in form.serialNumber"
                    :value="item"
                    :key="item"
                    >{{ item }}</Option
                  >
                </Select>
              </FormItem>
              <FormItem v-else prop="username">
                <Input
                  v-model="form.username"
                  placeholder="请输入用户名"
                  clearable
                >
                  <span slot="prepend">
                    <Icon :size="16" type="md-person"></Icon>
                  </span>
                </Input>
              </FormItem>
              <FormItem v-if="isKey" prop="password">
                <Input
                  type="password"
                  v-model="form.password"
                  placeholder="请输入PIN码"
                  clearable
                >
                  <span slot="prepend">
                    <Icon :size="16" type="md-lock"></Icon>
                  </span>
                </Input>
              </FormItem>
              <FormItem v-else prop="password">
                <Input
                  type="password"
                  v-model="form.password"
                  placeholder="请输入密码"
                  clearable
                >
                  <span slot="prepend">
                    <Icon :size="16" type="md-lock"></Icon>
                  </span>
                </Input>
              </FormItem>

              <FormItem>
                <Button @click="handleSubmit" type="primary" long>登录</Button>
              </FormItem>
            </Form>
          </div>

          <Spin size="large" fix v-if="logining">登陆中...</Spin>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import SZLXKEY from "@/utils/SZLXKey";
export default {
  data() {
    return {
      isKey: false,
      logining: false,
      form: {
        username: "super_admin",
        serialNumber: [],
        password: "12345678",
      },
      firstSerialNumber: "",
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // this.$store
    //   .dispatch("checkInit")
    //   .then((res) => {
    //     var resData = res.data;
    //     if (resData.data == true) {
    //       this.isInit = true;
    //     }
    //   })
    //   .catch((err) => {})
    //   .then(() => {
    //     this.logining = false;
    //   });
    this.loadserialNumber();
  },
  mounted() {},
  methods: {
    loadserialNumber() {
      var result = SZLXKEY.EnumBySerial();
      if(result==""){
        return ;
      }
      var serialList=result.split('|');
      console.log("serialList:",serialList)
      if(serialList!=null){
           this.isKey=true;
      }
      this.form.serialNumber=serialList;
      this.firstSerialNumber = this.form.serialNumber[0];
   
    },
    handleSubmit() {
      console.log("serialnumber:",this.firstSerialNumber)
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
            this.logining = true;
          if(this.isKey){
            var hDevice = this.firstSerialNumber;
                console.log("hDevice:",hDevice)
            SZLXKEY.OpenDeviceBySerial(hDevice);
            SZLXKEY.OperatorLogin(hDevice, this.form.password);
            //  SZLXKEY.CloseDevice(hDevice);
            this.auth();
          }else{
            console.log("super_admin login")
             this.login(null);
          }
    
        
        }
      });
    },
    auth() {
        this.form.username = this.firstSerialNumber;
        this.$store
          .dispatch("handleAuth", {
            serialNumber: this.form.username,
            pin: this.form.password,
          })
          .then((res) => {
            var resData = res.data;
            if (resData && resData.code == "200") {
              //认证成功
              var random = resData.data;
              console.log("random:", random);
              this.login(random);
            } else {
              if (resData && resData.code) {
                this.$Message.error("认证失败:" + resData.message);
              } else {
                this.$Message.error("登录失败，请联系管理员！");
              }
            }
          })
          .catch((err) => {
            if (err.response) {
              var errData = err.response.data;
              this.$Message.error("登录失败," + errData.message);
            }
          })
          .then(() => {
            this.logining = false;
          });
      
    },
    login(random) {
      let loginInfo=null;
      if (random == null) {
        loginInfo = {
          serialNumber: this.form.username,
          pin: this.form.password,
        };
      } else {
        var hashMessage = this.$md5(this.form.username + random);
        loginInfo = {
          serialNumber: this.form.username,
          pin: this.form.password,
          hashMessage: hashMessage,
        };
      }

      this.$store
        .dispatch("handleLogin", loginInfo)
        .then((res) => {
          var resData = res.data;
          if (resData && resData.code == "200") {
            // 登陆成功
            let userInfo = resData.data;
            console.log("userInfo:", userInfo);
            let token = "Bearer " + userInfo.token;
            Cookies.remove("access");
            let access = userInfo.role;
            //0 超级管理员，1操作员，2管理员

            this.$store.commit("setUserName", userInfo.serialNumber);
            // 登陆成功获取用户信息，token等
            this.$store.commit("setToken", token);
            Cookies.set("access", access);
            this.$store.commit("setAccess", access);

            // 登陆后初始化
            this.$store.commit("init");
            // 首页
            this.$router.replace({
              name: "home_index",
            });
          } else {
            if (resData && resData.code) {
              this.$Message.error("登录失败，" + resData.message);
            } else {
              this.$Message.error("登录失败，请联系管理员！");
            }
          }
        })
        .catch((err) => {
          if (err.response) {
            var errData = err.response.data;
            this.$Message.error("登录失败," + errData.message);
          }
        })
        .then(() => {
          this.logining = false;
        });
    },
  },
};
</script>


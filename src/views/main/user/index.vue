<template>
  <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
    <Dropdown transfer @on-click="handleClick">
      <a href="javascript:void(0)">
        <!-- <Avatar size="small" :src="avatarSrc" style="background: #619fe7;"></Avatar> -->
        <span id="type" class="main-user-name">{{ loginName }}</span>
      </a>
      <DropdownMenu style="width:160px;" slot="list">
        <!-- <DropdownItem v-show="type===1" name="updatePwd">
          <Icon type="md-body" />
          <span style="padding-left:10px;">修改密码</span>
        </DropdownItem>
        <DropdownItem v-show="type===2" name="govmList">
          <Icon type="md-arrow-back" />
          <span style="padding-left:10px;">返回虚拟机列表</span>
        </DropdownItem> -->
        <DropdownItem name="loginout">
          <Icon type="md-log-out" />
          <span style="padding-left:10px;">退出登录</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal v-model="isShow" title="修改系统登录口令"  :closable="false"  :mask-closable="false">
      <p>修改本管理程序的系统登录口令，也是串口管理终端的用户登录口令。</p>
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="150"
        style="marginTop:20px"
      >
        <FormItem label="请输入原口令:" prop="oldPwd">
          <Input type="password" v-model="formValidate.oldPwd" style="width:200px" />
        </FormItem>
        <FormItem label="请输入新口令:" prop="newPwd">
          <Input type="password" v-model="formValidate.newPwd" style="width:200px" />
        </FormItem>
        <FormItem label="请再次输入新口令:" prop="confirmPwd">
          <Input type="password" v-model="formValidate.confirmPwd" style="width:200px" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
          <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px">取消</Button> -->
        </FormItem>
      </Form>

      <div slot="footer"></div>
    </Modal>
  </Row>
</template>

<script>
import common from "@/utils/common";
import { removeToken } from '@/utils/token'
export default {
  name: "user",
  props: ["type", "username"],

  data() {
    const validateOldPass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("口令至少要6位！"));
      }
      callback();
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("口令至少要6位！"));
      } else {
        if (this.formValidate.confirmPwd !== "") {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField("confirmPwd");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("口令至少要6位！"));
      } else if (value !== this.formValidate.newPwd) {
        callback(new Error("两次密码不正确!"));
      } else {
        callback();
      }
    };
    return {
      isShow: false,
      formValidate: {
        id:0,
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      },
      ruleValidate: {
        oldPwd: [{ validator: validateOldPass, trigger: "blur" }],
        newPwd: [{ validator: validatePass, trigger: "blur" }],
        confirmPwd: [{ validator: validatePassCheck, trigger: "blur" }]
      },
      avatarSrc:
        "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
    };
  },
  created() {
    this.loadData();

  },
  mounted() {},
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.user;
    },
     loginName() {
        const name=this.$store.state.user.loginName
      return name==''?"admin":name;
    }
  },
  methods: {
      loadData() {
      this.$store.dispatch("getUserInfo").then((res) =>{
        const resData=res.data;
           console.log("resData:",resData)
          if(resData.code==402){
            this.$Message.error("token已失效，请重新登录")
            removeToken();
             this.$router.push({name: "login"});
          }
          this.formValidate.id=resData.data.id;
          if(resData.data.id!=1&&resData.data.firstLogin==0){
            this.isShow=true;
          }
             let access=resData.data.role;
              // access=2;
           this.$store.commit("setAccess", access);
        this.$store.commit("setUserName",res.data.data.serialNumber);
      }).catch(err=>{
        if(err.response) {
              var errData = err.response.data;
              this.$Message.error("获取用户信息失败," + errData.message);
            } 
      });
      },
    handleClick(name) {
      if (name == "loginout") {
       removeToken();
        this.$router.push({
          name: "login"
        });
      } else {
        this.isShow = true;
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const fromData={
                id:this.formValidate.id,
                oldPwd:this.formValidate.oldPwd,
                newPwd:this.formValidate.newPwd,
                confirmPwd:this.formValidate.confirmPwd,
                firstLogin:1,
          }
          this.$store.commit("userChangePasswd", fromData);
          this.$Message.success("修改成功!");
      
        } else {
          this.$Message.error("修改失败!");
        }
      });
      this.handleReset(name);
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.isShow = false;
    }
  }
};
</script>
<style scoped>
.main-header .header-avator-con .user-dropdown-menu-con .main-user-name{
  width: 130px;
  text-align: center;
}
</style>

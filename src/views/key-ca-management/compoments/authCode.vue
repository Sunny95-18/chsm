<template>
  <Card :bordered="false" dis-hover>
    <div style="margin-top: 20px">
      <Table
        ref="tab"
        :disabled-hover="true"
        :loading="state.loading"
        :columns="columns"
        :data="state.authCoderows"
        class="table"
      >
        <template slot-scope="{ row, index }" slot="action">
          <Button class="ops-btn" type="info" @click="showModal(row.id)"
            >修改</Button
          >
        </template>

        <Page
          ref="page"
          slot="footer"
          :current="queryParams.current"
          :total="state.totalCount"
          :page-size="queryParams.size"
          show-total
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          :page-size-opts="[10, 20, 30]"
          placement="top"
          show-elevator
          show-sizer
        ></Page>
      </Table>
    </div>
    <Modal v-model="isShow" :footer-hide="true" title="修改私钥授权码">
      <Form
        ref="formCustom"
        :model="formCustom"
        :rules="ruleValidate"
        :label-width="150"
      >
        <FormItem label="新的私钥授权码:" prop="newAuthCode">
          <Input v-model="formCustom.newAuthCode" type="password" style="width: 200px" />
        </FormItem>
        <FormItem label="确认私钥授权码:" prop="confirmAuthCode">
          <Input v-model="formCustom.confirmAuthCode" type="password" style="width: 200px" />
        </FormItem>
        <FormItem>
          <Button type="info" @click="updateAuthCode('formCustom')"
            >修改</Button
          >
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>
<script>
export default {
  data() {
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入你的私钥授权码"));
      } else {
        if (this.formCustom.confirmAuthCode !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("confirmAuthCode");
        }
        callback();
      }
    };
    const validateCodeCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入你的私钥授权码"));
      } else if (value !== this.formCustom.newAuthCode) {
        callback(new Error("两次私钥授权码不正确!"));
      } else {
        callback();
      }
    };
    return {
      isShow: false,
      formCustom: {
        id: "",
        newAuthCode: "",
        confirmAuthCode: "",
      },
      ruleValidate: {
        newAuthCode: [
          { required: true, validator: validateCode, trigger: "blur" },
        ],
        confirmAuthCode: [
          { required: true, validator: validateCodeCheck, trigger: "blur" },
        ],
      },
      queryParams: {
        current: 1,
        size: 10,
      },
      columns: [
        {
          title: "序号",
          width: 100,
          key: "id",
        },
        {
          title: "密钥类型",
          key: "keyType",
          render: (h, { row, index }) => {
            if (row.keyType == 3) {
              return h("span", "SM2");
            } else if (row.keyType == 4) {
              return h("span", "RSA");
            }
          },
        },
        {
          title: "密钥索引",
          key: "keyIndex",
        },
        {
          title: "授权码",
          key: "authCode",
        },
        {
          title: "操作",
          slot: "action",
        },
      ],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    changePage(p) {
      this.queryParams.current = p;
      this.loadData();
    },
    changePageSize(size) {
      this.queryParams.size = size;
      this.loadData();
    },
    loadData() {
      this.$store.commit("queryAuthCodeList", this.queryParams);
    },
    showModal(id) {
      (this.isShow = true), (this.formCustom.id = id);
    },
    updateAuthCode(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("updateAuthCode", this.formCustom)
            .then((res) => {
              var resData = res.data;
              if (resData && resData.code == "200") {
                this.$Message.success("私钥授权码修改成功!");
                this.$refs[name].resetFields();
                this.isShow=false;
                this.loadData();
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
    state() {
      return this.$store.state.authCode;
    },
  },
};
</script>
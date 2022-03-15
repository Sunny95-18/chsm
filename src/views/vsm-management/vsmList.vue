<template>
  <Card :bordered="false" dis-hover>
    <div>
      <!--分页表格-->
      <div style="margintop: 2px">
        <Table
          ref="tab"
          stripe
          :loading="state.loading"
          :columns="columns"
          :data="rows"
          class="table"
          :height="tableHeight"
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button
              v-if="row.status === 0"
              class="ops-btn"
              type="success"
              @click="changeVSMStatus(row.ip, 1)"
              >启用</Button
            >
            <Button
              v-else
              class="ops-btn"
              type="warning"
              @click="changeVSMStatus(row.ip, 0)"
              >停用</Button
            >
            <Button class="ops-btn" type="info" @click="getVsmInfoShow(row.ip)"
              >修改</Button
            >
          </template>
          <Page
            ref="page"
            slot="footer"
            :current="queryParams.current"
            :total="totalCount"
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
      <Modal v-model="isShow" title="虚拟机修改">
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="100"
        >
          <Form-item label="名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
          </Form-item>
          <Form-item label="IP地址" prop="ip">
            <Input v-model="formValidate.ip" placeholder="请输入IP地址"></Input>
          </Form-item>
          <Form-item label="网关" prop="gateWay">
            <Input
              v-model="formValidate.gateWay"
              placeholder="请输入网关"
            ></Input>
          </Form-item>
          <Form-item label="子网掩码" prop="mask">
            <Input
              v-model="formValidate.mask"
              placeholder="请输入子网掩码"
            ></Input>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="handleSubmit('formValidate')"
            >提交</Button
          >
          <Button
            type="primary"
            @click="handleReset('formValidate')"
            style="margin-left: 8px"
            >重置</Button
          >
        </div>
      </Modal>
    </div>
  </Card>
</template>

<script>
import common from "@/utils/common";
export default {
  name: "vsmList",
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("IP不能为空"));
      }
      var reg =
        /^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的IP地址!"));
      }
    };
    return {
      isShow: false,
      ip: null,
      queryParams: {
        current: 1,
        size: 10,
      },
      formValidate: {
        name: null,
        ip: null,
        gateWay: null,
        mask: null,
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "密码不可为空",
            trigger: "blur",
          },
        ],
        ip: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur",
          },
        ],
        gateWay: [
          {
            required: true,
            message: "网关不可为空",
            trigger: "blur",
          },
        ],
        mask: [
          {
            required: true,
            message: "子网掩码不可为空",
            trigger: "blur",
          },
        ],
      },
      columns: [
        {
          title: "#",
          width: 100,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index +
                (this.queryParams.current - 1) * this.queryParams.size +
                1
            );
          },
        },
        {
          title: "虚拟机名称",
          width: 150,
          key: "name",
        },
        {
          title: "IP地址",
          width: 150,
          key: "ip",
        },
        {
          title: "状态",
          width: 200,
          key: "status",
          render: (h, { row, index }) => {
            if (row.status == 0) {
              return h(
                "span",
                {
                  style: {
                    color: "#FF0000",
                  },
                },
                "已停止"
              );
            } else if (row.status == 1) {
              return h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                  },
                },
                "已启动"
              );
            }
          },
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
    ...common.methods,
    loadData() {
      this.$store.commit("queryVsmList");
    },
    changePage(p) {
      this.queryParams.current = p;
      this.loadData();
    },
    changePageSize(size) {
      this.queryParams.size = size;
      this.loadData();
    },
    changeVSMStatus(ip, status) {
      var changeInfo = {
        ip: ip,
        status: status,
      };
      this.$store.dispatch("changeVSMStatus", changeInfo).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200 && resData.data) {
          this.$Message.success("修改成功!");
          this.loadData();
        } else {
          this.$Message.error("修改失败! " + resData.message);
        }
      });
    },
    getVsmInfoShow(ip) {

         this.$store.dispatch("getVsmIp", ip).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200 && resData.data) {
         const vsmInfo=resData.data;
         this.formValidate.ip=vsmInfo.ip;
         this.formValidate.name=vsmInfo.name;
         this.formValidate.gateWay=vsmInfo.gateWay;
         this.formValidate.mask=vsmInfo.mask;
              this.isShow = true;
        } else {
          this.$Message.error("获取虚拟机信息失败! " + resData.message);
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success("提交成功!");
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.vsm;
    },
  },
  mounted() {},
  watch: {
    $route() {},
  },
};
</script>
<template>
  <div>
    <Card>
      <List border size="large">
        <ListItem><h3>用户登录</h3></ListItem>
        <ListItem>在此登录管理员。</ListItem>
        <ListItem>
          <Form :model="formItem" :label-width="200" inline>
            <FormItem label="请输入USBKey的PIN的口令:">
              <Input type="password" v-model="formItem.key" />
            </FormItem>
            <FormItem :label-width="0">
              <Button type="info" @click="adminLogin">用户登录</Button>
            </FormItem>
          </Form>
        </ListItem>
      </List>
    </Card>
    <Card style="margin-top: 20px">
      <List border size="large">
        <ListItem><h3>用户状态</h3></ListItem>
        <Table
          ref="tab"
          border
          :loading="state.loading"
          :columns="columns"
          :data="rows"
          class="table"
          :height="tableHeight"
          :disabled-hover="true"
        >
          <template slot="action">
            <div>
              <Button class="ops-btn" type="error" @click="deleteUser(1)"
                >注销全部管理员</Button
              >
              <Button class="ops-btn" type="error" @click="deleteUser(0)"
                >注销全部操作员</Button
              >
            </div>
          </template>
        </Table>
      </List>
    </Card>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      formItem: {
        key: "",
      },
      columns: [
        {
          title: "当前权限状态",
          key: "status",
          width: 200,
          key:"permission"
          // render: (h, params) => {
          //   if (
          //     (params.row.managerLoginInfo == "未登录" &&
          //       (params.row.operatorLoginInfo == "未登录") ||
          //     params.row.operatorLoginInfo == "未添加")
          //   ) {
          //     return h("span", "无权限");
          //   } else if (
          //     params.row.managerLoginInfo == "未登录" &&
          //     params.row.operatorLoginInfo == "已登录"
          //   ) {
          //     return h("span", "操作员权限");
          //   }else if(params.row.managerLoginInfo!="未登录"&&(params.row.operatorLoginInfo=="未登录"|| params.row.operatorLoginInfo=="未添加")){
          //     return h("span", "管理员权限");
          //   } else if (
          //     params.row.managerLoginInfo != "未登录" &&
          //     params.row.operatorLoginInfo == "已登录"
          //   ) {
          //     return h("span", "超级管理员权限");
          //   }
          // },
        },
        {
          title: "管理员数目",
          width: 200,
          key: "managerCount",
        },
        {
          title: "已登录管理员",
          width: 300,
          key: "managerLoginInfo",
        },
        {
          title: "操作员状态",
          width: 300,
          key: "operatorLoginInfo",
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
      this.$store.commit("queryManager", this.queryParams);
    },
    adminLogin() {
      this.$store.dispatch("managerLogin", this.formItem.key).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.loadData();
          const userId = resData.data;
          this.$Message.success(
            userId == 0 ? "操作员登录成功！" : userId + "号管理员登录成功"
          );
        } else {
          this.$Message.error("登录失败，错误码：" + resData.message);
        }
      });
    },
    deleteUser(id) {
      this.$store.dispatch("managerLogout", id).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.loadData();
          this.$Message.success(
            id == 1 ? "注销管理员成功！" : "注销操作员成功！"
          );
        } else {
          this.$Message.error(id == 1 ? "注销管理员失败！" : "注销操作员失败!");
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
  watch: {
    $route() {},
  },
};
</script>
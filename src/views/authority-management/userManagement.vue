<template>
  <div>
    <Card :bordered="false" dis-hover>
      <List border>
        <ListItem>
          <h3>管理员管理</h3>
        </ListItem>
        <ListItem>
          <Table
            ref="tab"
            border
            :loading="state.loading"
            :columns="columns"
            :data="rows"
            class="table"
            :height="tableHeight"
          >
            <template slot-scope="{ row,index }" slot="action">
              <div>
                <Button class="ops-btn" type="error">删除</Button>
              </div>
            </template>
          </Table>
        </ListItem>
        <ListItem>
          <h3>操作员管理</h3>
        </ListItem>
        <ListItem>
          <h4>增加操作员</h4>
        </ListItem>
        <ListItem>
          <Form :model="formItem" :label-width="200" inline>
            <FormItem label="请输入USBKey的PIN的口令:">
              <Input type="password" v-model="formItem.key" />
            </FormItem>
            <FormItem :label-width="0">
              <Button type="info" @click="addOpt">确定</Button>
            </FormItem>
          </Form>
        </ListItem>
        <ListItem>
          <h4>删除操作员</h4>
        </ListItem>
        <ListItem style="color:red">该操作将会使当前所有操作员删除，必须重新添加操作员。</ListItem>
        <ListItem>
          <Button  style="marginLeft:40%" type="info" @click="adminLogin">删除操作员</Button>
        </ListItem>
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
        key: ""
      },
      columns: [
        {
          title: "序号",
          key: "id",
          width: 300,
          render: (h, params) => {
            return h("span", params.row.id + "号管理员");
          }
        },
        {
          title: "状态",
          key: "status",
          width: 300,
          render: (h, params) => {
            if (params.row.status === 1) {
              return h("span", "有效");
            } else if (params.row.status == 0) {
              return h("span", "无效");
            } else {
              return h("span", "--");
            }
          }
        },
        {
          title: "操作",
          slot: "action"
        }
      ]
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    ...common.methods,
    loadData() {
      this.$store.commit("loadLoginData", this.queryParams);
    },
    addOpt() {}
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.adminUserManagement;
    }
  },
  watch: {
    $route() {}
  }
};
</script>
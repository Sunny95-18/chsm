<template>
  <Card :bordered="false" dis-hover>
    <List border size="large">
      <ListItem>
        <h3>设备维护信息</h3>
      </ListItem>
      <ListItem>
        <Form :model="formItem" :label-width="120">
          <FormItem label="应用系统的名称">
            <Input v-model="formItem.sysName" />
          </FormItem>
          <FormItem label="公司名称">
            <Input v-model="formItem.corporateName" />
          </FormItem>
          <FormItem label="所属部门">
            <Input v-model="formItem.department" />
          </FormItem>
          <FormItem label="设备维护联系人">
            <Input v-model="formItem.username" />
          </FormItem>
          <FormItem label="电话">
            <Input v-model="formItem.tel" />
          </FormItem>
          <FormItem label="手机">
            <Input v-model="formItem.phone" />
          </FormItem>
          <FormItem label="电子邮件">
            <Input v-model="formItem.email" />
          </FormItem>
          <FormItem>
            <Button type="primary" @click="handleSubmit()">修改</Button>
        </FormItem>
        </Form>
      </ListItem>
    </List>
  </Card>
</template>

<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      formItem: {
        sysName: "密码管理平台",
        corporateName:"神州龙芯",
        department:"研发部",
        username:"张三",
        tel:"0513-12345678",
        phone:"12345678",
        email:"123@163.com"
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    ...common.methods,
    loadData() {
      this.$store.commit("loadDeviceData", this.queryParams);
    },
    handleSubmit() {}
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.device;
    }
  },
  watch: {
    $route() {}
  }
};
</script>

<style>
</style>
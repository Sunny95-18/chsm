<template>
  <Card>
    <List header="设备运行信息" border>
      <Table
        ref="tab"
        border
        :loading="state.loading"
        :columns="columns"
        :data="rows"
        class="table"
        :height="tableHeight"
        :show-header="false"
      ></Table>
    </List>
  </Card>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
        queryParams:{},
      columns: [
        {
          title: "类型",
          key: "type"
        },
        {
          title: "值",
          key: "value"
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
      this.$store.commit("serviceShow", this.queryParams);
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.serviceStatus;
    }
  },
  watch: {
    $route() {}
  }
};
</script>
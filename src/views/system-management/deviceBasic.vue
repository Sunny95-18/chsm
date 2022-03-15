<template>
  <Card :bordered="false" dis-hover>
   <List border size="large">
            <ListItem><h3>设备基本信息</h3></ListItem>
            <ListItem>
               <Table
            ref="tab"
            border
            :loading="state.loading"
            :columns="columns"
            :data="rows"
            class="table"
            :height="tableHeight"
            :show-header="false"
          >
               </Table>
            </ListItem>
        </List>
  </Card>
</template>

<script>
import common from "@/utils/common";
export default {
        data(){
          return {
            columns:[
               {
                  title: "类型",
                  width:"400",
                  key: "key"
                },
                {
                  title: "值",
                      width:"400",
                  key: "value"
                }
            ]
          }
        },
  created() {
    this.loadData();
  },
  methods: {
    ...common.methods,
    loadData() {
      this.$store.commit("loadDeviceData");
    },
    addOpt() {}
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.system;
    }
  },
  watch: {
    $route() {}
  }
}
</script>

<style>

</style>
<template>
  <Card>
    <div>
      <Table
        ref="tab"
        border
        :loading="state.loading"
        :columns="columns"
        :data="rows"
        class="table"
        :height="550"
        :span-method="handleSpan"
        disabled-hover='true'
      ></Table>
    </div>
  </Card>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      queryParams: {
        pageNumber: 1,
        pageSize: 10
      },
      columns: [
        {
          title: "管理类别",
          key: "type"
        },
        {
          title: "操作内容",
          key: "content"
        },
        {
          title: "所需权限",
          key: "role"
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
      this.$store.commit("permissionList", this.queryParams);
    },
    handleSpan({ row, column, rowIndex, columnIndex }) {
      //设备管理合并
      if (rowIndex === 0 && columnIndex === 0) {
        return {
          rowspan: 4,
          colspan: 1
        };
      } else if (
        (rowIndex === 1 || rowIndex === 2 || rowIndex == 3) &&
        columnIndex === 0
      ) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      //服务管理合并
      if (rowIndex === 4 && columnIndex === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
      } else if (rowIndex === 5 && columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      //权限管理合并
      if (rowIndex === 7 && columnIndex === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
      } else if (rowIndex === 8 && columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      //管理员合并
      if (rowIndex === 9 && columnIndex === 0) {
        return {
          rowspan: 3,
          colspan: 1
        };
      } else if ((rowIndex === 10 || rowIndex === 11) && columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      //操作员合并
      if (rowIndex === 12 && columnIndex === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
      } else if (rowIndex === 13 && columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      //非对称密钥合并
      if (rowIndex === 14 && columnIndex === 0) {
        return {
          rowspan: 4,
          colspan: 1
        };
      } else if (
        (rowIndex === 15 || rowIndex === 16 || rowIndex === 17) &&
        columnIndex === 0
      ) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
      //备份/恢复合并
      if (rowIndex === 18 && columnIndex === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
      } else if (rowIndex === 19 && columnIndex === 0) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.userPermissionList;
    }
  },
  watch: {
    $route() {}
  }
};
</script>
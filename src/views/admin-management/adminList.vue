<template>
  <Card :bordered="false" dis-hover>
    <div>
      <!--分页表格-->
      <div style="marginTop:2px;">
        <Table
          ref="tab"
          stripe
          :loading="state.loading"
          :columns="columns"
          :data="rows"
          class="table"
          :height="tableHeight"
        >
          <template slot-scope="{ row,index }" slot="action">
            <!-- <Button v-if="row.status===1" class="ops-btn" type="success" @click="changeAdminStatus(row.id,0)">启用</Button>
            <Button v-else class="ops-btn" type="warning"  @click="changeAdminStatus(row.id,1)">停用</Button> -->
            <Button class="ops-btn" type="error"  @click="deleteAdmin(row.serialNumber)">删除</Button>
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
            :page-size-opts="[10,20,30]"
            placement="top"
            show-elevator
            show-sizer
          ></Page>
        </Table>
      </div>
    </div>
  </Card>
</template>

<script>
import common from "@/utils/common";
export default {
  name: "adminManagement",
  data() {
    return {
      queryParams: {
        current: 1,
        size: 10,
      },
      columns: [
           {
          title: "#",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index +
                (this.queryParams.current - 1) * this.queryParams.size +
                1
            );
          }
        },
        {
          title: "Ukey序列号",
          width: 250,
          key: "serialNumber",
        },
        // {
        //   title: "管理员类型",
        //   width: 250,
        //   key: "role",
        //   render: (h, { row, index }) => {
        //     if (row.role == 1) {
        //       return h("span", "操作员");
        //     } else if (row.role == 2) {
        //       return h("span", "管理员");
        //     }else if(row.role==3){
        //       return h("span","审计员");
        //     }else {
        //       return h("span","超级管理员")
        //     }
        //   },
        // },
        {
          title: "管理员状态",
          width: 250,
          key: "status",
          render: (h, { row, index }) => {
            if (row.status == 0) {
              return h(
                "span",
                {
                  style: {
                    color: "#2d8cf0",
                  },
                },
                "正常"
              );
            } else if (row.status == 1) {
              return h(
                "span",
                {
                  style: {
                    color: "#FF0000",
                  },
                },
                "停止"
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
      this.$store.commit("querAdminList", this.queryParams);
    },
      changePage(p){
      this.queryParams.current=p;
      this.loadData();
    },
     changePageSize(size) {
      this.queryParams.size = size;
      this.loadData();
    },
    // changeAdminStatus(id,status){
    //   //  this.$Message.success("你点击了修改管理员状态");
    //      const changAdmin = {
    //     id: id,
    //     status: status
    //   };
    // this.$store.commit("updateAdminStatus", changAdmin);
    // },
    deleteAdmin(id){
          this.$store.dispatch("deleteSystemUser",id).then((res) => {
              var resData=res.data;
              if(resData.data==true){
                this.loadData();
                this.$Message.success("删除成功！");
              }else{
                this.$Message.error("删除失败，原因："+resData.message);
              }
        }) .catch((err) => {
            })
            .then(() => {
              this.logining = false;
            });
        
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.adminUserManagement;
    },
  },
  mounted() {},
  watch: {
    $route() {},
  },
};
</script>
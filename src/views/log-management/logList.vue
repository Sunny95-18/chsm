<template>
  <Card :bordered="false" dis-hover>
    <div>
      <Form class="edit-model-form" show-message :label-width="200">
        <Row>
          <div class="ivu-col ivu-col-span-8">
            <FormItem label="选择日期范围：">
              <DatePicker
                type="datetimerange"
                split-panels
                placeholder="日期范围"
                style="width: 300px"
              ></DatePicker>
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-8">
            <FormItem label="日志类型：">
              <Select v-model="queryParams.logType" style="width: 200px">
                <Option :value=0>所有日志</Option>
                <Option :value=1>管理日志</Option>
                <Option :value=2>错误日志</Option>
                <Option :value=3>服务日志</Option>
              </Select>
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-8">
            <FormItem :label-width="20">
              <Button @click="doQuery" type="primary" icon="md-search"
                >查询</Button
              >&nbsp;
              <Button @click="verifyLog" type="primary" icon="md-book"
                >审计</Button
              >&nbsp;
              <!-- <Poptip
                confirm
                title="是否删除选中的日志记录?"
                @on-ok="deleteLogs"
                placement="bottom"
              >
                <Button type="error" icon="md-close">删除</Button>
              </Poptip>
              &nbsp; -->
              <Button @click="exportTable" type="success" icon="md-add"
                >导出</Button
              >
            </FormItem>
          </div>
        </Row>
      </Form>

      <!--分页表格-->
      <div style="margin-top: 20px">
        <Table
          ref="tab"
          stripe
          :loading="state.loading"
          :columns="columns"
          :data="rows"
          class="table"
          :height="tableHeight"
          @on-select="selectLogs"
          @on-select-cancel="cancelSelectedLogs"
          @on-select-all="selectAllLogs"
          @on-select-all-cancel="cancelSelectedAllLogs"
        >
          <Page
            ref="page"
            slot="footer"
            :current="queryParams.pageNumber"
            :total="totalCount"
            :page-size="queryParams.pageSize"
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
    </div>
  </Card>
</template>

<script>
import common from "@/utils/common";
export default {
  name: "viewLog",
  data() {
    return {
      isShow: false,
      auditForm: {
        logType: "1",
        scope: "1",
        endDate: "",
      },
      selectedLogs: [],
      offsetTop: 196,
      queryParams: {
        current: 1,
        size: 10,
        logType:0
      },
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        // {
        //   title: "序号",
        //   width: 80,
        //   key: "id",
        // },
        {
          title: "操作人",
          key: "name",
        },
        {
          title: "消息",
          key: "content",
        },
         {
          title: "日志类型",
          key: "type",
           render: (h, params) => {
            if (params.row.type == 1) {
              return h("span", "管理日志");
            } else if (params.row.type == 2) {
              return h("span", "错误日志");
            } else if (params.row.type == 3) {
              return h("span", "服务日志");
            }
          },
        },
        {
          title: "日期",
          key: "date",
        },
        {
          title: "审计状态",
          key: "verify",
          render: (h, params) => {
            if (params.row.verify == 0) {
              return h("span", "未审计");
            } else if (params.row.verify == 1) {
              return h("span", "已审计");
            } else if (params.row.verify == 2) {
              return h("span", "审计未通过");
            }
          },
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
      this.$store.commit("queryAllLogPage", this.queryParams);
    },
    exportTable() {
      // this.$refs.tab.exportCsv({ filename: "日志" });
          this.$store.dispatch("exportExcel").then((response) => {
        let blob = new Blob([response.data], {type: "application/vnd.ms-excel" });

        //  let objectUrl = URL.createObjectURL(blob);          
        //       const elink = document.createElement("a");
        //       elink.download = "log.xls"; //下载文件名称,
        //       elink.style.display = "none";
        //       elink.href = objectUrl;
        //       document.body.appendChild(elink);
        //       elink.click();
        //       URL.revokeObjectURL(elink.href); // 释放URL 对象
        //       document.body.removeChild(elink);
            const fileName="logBackup.xlsx"
             if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, fileName);
            } else {
              var link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = fileName;
              link.click();
              //释放内存
              window.URL.revokeObjectURL(link.href);
            }
      });
    },
    changeLogType(value) {
      this.queryParams.type = value;
    },
    // doQuery() {
    //    this.$store.commit("queryAllLogPage", this.queryParams);
    // },
    changePage(p) {
      this.queryParams.current = p;
      this.loadData();
    },
    changePageSize(size) {
      this.queryParams.size = size;
      this.loadData();
    },
    verifyLog() {
      if (this.selectedLogs.length == 0) {
        this.$Message.warning("请选择至少一个日志!");
        return;
      }
      this.$store.dispatch("verifyLog", this.selectedLogs).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          if (resData.data == true) {
            this.loadData();
            this.$Message.success("日志审计成功!");
          }
        } else if (resData && resData.code != "200") {
          this.$Message.error("日志审计失败!" + resData.message);
        }
      });
      this.selectedLogs = [];
    },
    selectLogs(selection, row) {
      this.selectedLogs.push(row.id);
    },
    cancelSelectedLogs(selection, row) {
      let newList = [];
      this.selectedLogs.filter((item) => {
        if (item != row.id) {
          newList.push(item);
        }
      });
      this.selectedLogs = newList;
    },
    selectAllLogs(selection) {
      const list = this.$refs.tab.getSelection();
      this.selectedLogs = [];
      list.filter((item) => {
        this.selectedLogs.push(item.id);
      });
    },

    cancelSelectedAllLogs() {
      this.selectedLogs = [];
    },
    deleteLogs() {
      if (this.selectedLogs.length == 0) {
        this.$Message.warning("请选择至少一个日志记录!");
        return;
      }
      this.$store.dispatch("deleteLogs", this.selectedLogs).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          if (resData.data == true) {
            this.$store.commit("queryAllLog", this.queryParams);
             this.loadData();
              this.selectedLogs = [];
            this.$Message.success("日志删除成功!");
           
          } else {
            this.$Message.warning("日志删除失败,可能不符合删除条件!");
          }
        } else if (resData && resData.code != "200") {
          this.$Message.error("日志删除失败!" + resData.message);
        }
      });
      this.selectedLogs = [];
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.logList;
    },
  },
  mounted() {
    // this.offsetTop = this.$refs.tab.$el.getBoundingClientRect().top;
  },
  watch: {
    $route() {},
  },
};
</script>

<style>
</style>
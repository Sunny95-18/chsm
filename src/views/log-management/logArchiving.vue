<template>
  <Card :bordered="false" dis-hover>
    <List border size="large">
      <ListItem>
        <h3 style="margin: 0 auto">日志归档</h3>
      </ListItem>
      <ListItem style="height: 100px">
        <div style="margin: 0 auto; text-algin: center">
          <p style="color: red; font-size: 16px">
            点击下方归档按钮，系统将对日志进行归档!
          </p>
        </div>
      </ListItem>
      <ListItem>
        <Button style="margin: 0 auto" type="success" @click="logBack"
          >归档</Button
        >
      </ListItem>
    </List>
  </Card>
</template>
<script>
import common from "@/utils/common";
// import Export2Excel from "@/conf/Export2Excel";
export default {
  data() {
    return {
      list: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {},
    logBack() {
      this.$store.dispatch("exportExcel").then((res) => {
         const data=res.data;
           if (!data) {
             this.$Message.warning("文件下载失败!");
          return
        }
        const fileName="日志备份"
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      });

      // return new Promise((resolve, reject) => {
      //   axios({
      //     url: conf.apiServer+"log/logArchiving",
      //     method: "post",
      //     data: null,
      //     responseType: "blob",
      //   })
      //     .then((res) => {
      //       resolve(res);
      //     })
      //     .catch((err) => {
      //       reject(err);
      //     });
      // });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/conf/Export2Excel").then((excel) => {
        const tHeader = ["id", "name", "content", "date", "verify"];
        const filterVal = ["id", "name", "content", "date", "verify"];
        this.$store.commit("queryAllLog");
        const list = this.$store.state.logList.row;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.logList;
    },
  },
};
</script>
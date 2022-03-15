<template>
  <div>
    <Card :bordered="false" dis-hover>
      <!-- 第一步-->
      <List v-if="first" header="密钥备份向导" border split>
        <ListItem>1、准备备份。</ListItem>
        <ListItem>请登录半数以上管理员,以满足备份所需超级管理员权限,并准备好3个管理员USBKey口令。</ListItem>
        <ListItem>
          <a @click="showLoginStatus">查看登录状态</a>
        </ListItem>
        <ListItem>
          <Button style="margin-left:300px;" type="success" @click="start">开始备份</Button>
        </ListItem>
      </List>
      <!-- 第二步-->
      <List v-if="second" header="备份密钥向导" border split>
        <ListItem>2、输出备份密钥分量[{{part}}]。</ListItem>
        <ListItem>请选择第1个管理员USBKey根据正确的方向插入设备中，并输入保护口令。</ListItem>
        <ListItem>管理员USBKey可以任意顺序，但不能重复。。</ListItem>

        <ListItem>
          <Form :model="formItem" :label-width="140" inline>
            <FormItem label="请输入PIN口令:">
              <Input type="password" v-model="pin" />
            </FormItem>
            <FormItem>
              <Button type="info" @click="secondOk">确定</Button>
            </FormItem>
          </Form>
        </ListItem>
      </List>
      <!-- 第三步-->

      <List v-if="third" header="备份密钥向导" border split>
        <ListItem>3、导出备份文件。</ListItem>
        <ListItem>密码机内的密钥信息已经备份到密钥备份文件中。</ListItem>

        <ListItem>
          <Form :label-width="140" inline>
            <FormItem>
              <Button type="info" @click="thirdOk">下载文件</Button>
            </FormItem>
          </Form>
        </ListItem>
      </List>
      <!-- 第四步-->
      <List v-if="four" header="备份密钥向导" border split>
        <ListItem>4. 完成密钥备份。</ListItem>
        <ListItem>已经完成密钥备份，请妥善保管好密钥备份文件。</ListItem>
        <ListItem>备份过程中在密码机内生成的临时备份文件已删除。</ListItem>
        <ListItem>
          <Button type="info" @click="end">返回</Button>
        </ListItem>
      </List>
    </Card>

    <Modal v-model="modal1" title="用户状态">
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
    </Modal>
  </div>
</template>

<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      first: false,
      second: false,
      third: true,
      four: false,
      modal1: false,
      part: 1,
      pin:"",
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
  created() {},
  methods: {
    ...common.methods,
    loadData() {
      this.$store.commit("showLoginStatus", this.queryParams);
    },
    showLoginStatus() {
      this.loadData();
      this.modal1 = true;
    },
    start() {
      (this.first = false), (this.second = true);
    },
    secondOk() {
      const exportKey={
          part:this.part,
          pin:this.pin
      }
        this.$store.dispatch("exportKey", exportKey).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200) {
             this.pin="";
             this.part=resData.data;
        } else {
          this.$Message.error("秘钥备份失败!"+resData.message);
        }
      });

      if(this.part>=3){
        (this.second = false), (this.third = true);
      }
     
    },
      //base64 转换 blob
    dataURLtoBlob(dataurl) {
      var bstr = atob(dataurl);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: "pdf" });
    },
    thirdOk() {
       this.$store.dispatch("exportFile").then((res) => {
          let blob = new Blob([res.data], {
              type: "application/octet-stream"
            });
            const fileName="szlxsmbak.dat"
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
      this.third = false;
      this.four = true;
    },
    end() {
      this.four = false;
      this.first = true;
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.backupKey;
    }
  },
  watch: {
    $route() {}
  }
};
</script>

<style>
</style>
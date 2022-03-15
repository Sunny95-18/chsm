<template>
     <Card :bordered="false" dis-hover style="margin:0 auto;width:600px">
          <List border size="large">
            <ListItem>
              <h3 style="margin:0 auto">升级系统</h3>
            </ListItem>
            <ListItem style="height:100px">
              <div style="margin:0 auto;text-algin:center">
                <p style="color:red;font-size:16px">点击下方按钮进行文件上传,只可上传后缀格式为 .so , .war</p>
                <br>
               <Upload
                v-if="isShowUpload"
                :action="uploadUrl"
                :before-upload="handleUpload"
                accept=".txt"
                :format="['so', 'war']"
                :on-format-error="uploadFormatError"
              >
                <Button icon="ios-cloud-upload-outline">选择文件</Button>
              </Upload>
              <span v-else>{{this.file.name }}<Icon type="md-backspace" @click="deleteFile"/></span>
              </div>
            </ListItem>
            <ListItem>
              <Button style="margin:0 auto" type="success" @click="startUpgrade">开始升级</Button>
            </ListItem>
          </List>
        </Card>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      isShowUpload:true,
        file:"",
      
  
    };
  },
  methods: {
    ...common.methods,
     uploadFormatError(file, fileList) {
      this.$Message.error("文件格式错误!");
    },
    handleUpload(file) {
      this.file = file;
      this.isShowUpload = false;
      return false;
    },
    deleteFile() {
      this.isShowUpload = true;
      this.file = "";
    },
    startUpgrade(){
      this.$Spin.show({
                    render: (h) => {
                        return h('div', [
                            h('Icon', {
                                'class': 'demo-spin-icon-load',
                                props: {
                                    type: 'ios-loading',
                                    size: 48
                                }
                            }),
                            h('div', '正在升级中，请稍等。。。')
                        ])
                    }
                });
        this.$store.dispatch("systemUpgrade", this.file).then((res) => {
            var resData = res.data;
            if (resData && resData.code == "200"&&resData.data) {
               this.$Spin.hide();
              this.$Message.success("升级成功!");
      
            } else {
              this.$Message.error("升级失败!");
            }
      });
    },
  },
    computed: {
    ...common.computed,
    state() {
      return this.$store.state.system;
    },
    uploadUrl() {
      return "";
    },
  },
};
</script>
<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
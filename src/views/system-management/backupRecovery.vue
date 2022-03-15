<template>
  <Card :bordered="false" dis-hover>
    <Tabs value="backup">
      <TabPane label="系统备份" name="backup">
        <!-- <Card :bordered="false" dis-hover style="margin:0 auto;width:600px">
          <List border size="large">
            <ListItem>
              <h3 style="margin:0 auto">系统备份</h3>
            </ListItem>
            <ListItem style="height:100px">
              <span style="margin:0 auto;color:red;font-size:20px">将签名验签服务器中密钥，证书备份</span>
            </ListItem>
            <ListItem>
              <Button style="margin:0 auto" type="success" @click="startBackup">开始备份</Button>
            </ListItem>
          </List>
        </Card> -->
          <backup></backup>
      </TabPane>
      <TabPane label="系统恢复" name="recovery">
        <!-- <Card :bordered="false" dis-hover style="margin:0 auto;width:600px">
          <List border size="large">
            <ListItem>
              <h3 style="margin:0 auto">系统恢复</h3>
            </ListItem>
            <ListItem style="height:100px">
              <div style="margin:0 auto;text-algin:center">
                <p style="color:red;font-size:16px">点击下方按钮进行备份文件上传</p>
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button icon="ios-cloud-upload-outline">上传文件</Button>
                </Upload>
              </div>
            </ListItem>
            <ListItem>
              <Button style="margin:0 auto" type="success" @click="startRecovery">开始恢复</Button>
            </ListItem>
          </List>
        </Card> -->
         <recovery></recovery>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import common from "@/utils/common";
import backup from "../key-ca-management/compoments/backup";
import recovery from "../key-ca-management/compoments/recovery";
export default {
    components: { backup, recovery },
  data() {
    return {};
  },
  methods: {
    ...common.methods,
    startBackup(){
       this.$Message.success("备份成功!");
    },
    startRecovery() {
      this.$Message.success("恢复成功!");
    },
  },
};
</script>

<style>
</style>
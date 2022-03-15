<template>
  <Tabs value="dualBackup">
    <!-- <TabPane label="负载均衡" name="equilibrium">
      <div class="div">
        <Card :bordered="false" dis-hover>
          <p slot="title">均衡负载设置</p>
          <Form ref="equilibriumForm" :model="equilibriumForm" :label-width="150">
            <FormItem label="类型：" prop="type">
              <Select v-model="equilibriumForm.type" style="width:200px">
                <Option :value="0">无负载均衡</Option>
                <Option :value="1">均衡器</Option>
                <Option :value="2">负载设备</Option>
              </Select>
            </FormItem>
            <FormItem v-if="equilibriumForm.type>=1" label="均衡器虚拟地址：" prop="evIP">
              <Input v-model="equilibriumForm.evIP" style="width:200px" />
            </FormItem>
            <FormItem v-if="equilibriumForm.type==1" label="负载设备地址：" prop="ldIPs">
              <Input
                v-model="equilibriumForm.ldIPs"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 10}"
                style="width:200px"
              />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="save">保存</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </TabPane> -->
    <TabPane label="双机互备" name="dualBackup">
      <div class="div">
        <Card :bordered="false" dis-hover>
          <p slot="title">双机热备设置</p>
          <Form ref="dualBackupForm" :model="dualBackupForm" :label-width="150">
            <FormItem label="类型：" prop="type">
              <Select v-model="dualBackupForm.type" style="width:200px">
                <Option :value="0">无</Option>
                <Option :value="1">主设备</Option>
                <Option :value="2">备设备</Option>
              </Select>
            </FormItem>
            <FormItem v-if="dualBackupForm.type>=1" label="虚拟地址：" prop="dbIP">
              <Input v-model="dualBackupForm.dbIP" style="width:200px" />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="dualBackupSave">保存</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    </TabPane>
  </Tabs>
</template>
<script>
export default {
  data() {
    return {
      equilibriumForm: {
        type: 0,
        evIP: "192.168.3.29",
        ldIPs: "192.168.3.30\n192.168.3.31",
      },
      dualBackupForm:{
          type:0,
          dbIP:""
      }
    };
  },
  methods: {
    save() {},
    dualBackupSave(){},
  },
};
</script>
<style>
.div {
  margin: 0 auto;
  width: 500px;
  height: 650px;
}
</style>
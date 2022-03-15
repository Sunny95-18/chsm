<template>
  <Card :bordered="false" dis-hover>
    <Button
      style="margin-left: 30px"
      @click="isShowInput = true"
      type="primary"
      icon="md-arrow-up"
      >导入</Button
    >
    <div style="margin-top: 20px">
      <Table
        ref="tab"
        stripe
        :loading="state.loading"
        :columns="columns"
        :data="rows"
        class="table"
        :height="tableHeight"
      >
        <template slot-scope="{ row, index }" slot="action">
          <Button class="ops-btn" type="primary" @click="showMechanism(row.id)"
            >查看</Button
          >
          <!-- <Button class="ops-btn" type="primary" @click="updateMechanism">配置</Button> -->
          <Poptip
            confirm
            title="确认删除该受信机构吗?"
            @on-ok="deleteMechanism(row.id)"
            placement="right"
          >
            <Button class="ops-btn" type="error">删除</Button>
          </Poptip>
          <Button class="ops-btn" type="info" @click="downloadMechanism(row.id)"
            >下载</Button
          >
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
          :page-size-opts="[10, 20, 30]"
          placement="top"
          show-elevator
          show-sizer
        ></Page>
      </Table>
      <Modal v-model="isShowInput" title="导入证书" @on-ok="input">
        <Form ref="mechanismForm" :model="mechanismForm" :label-width="100">
          <FormItem label="证书类型：" prop="certType" style="height: 15px">
            <Select v-model="inportFile.type" size="small" style="width: 100px">
              <Option :value="1">证书</Option>
              <Option :value="2">证书链</Option>
            </Select>
          </FormItem>
          <FormItem label="选择文件：">
           <Upload
                v-if="isShowUpload"
                :action="uploadUrl"
                :before-upload="handleUpload"
                accept=".txt"
                :format="['cer', 'crt', 'pem', 'p7b']"
                :on-format-error="uploadFormatError"
              >
                <Button icon="ios-cloud-upload-outline">选择文件</Button>
              </Upload>
              <span v-else>{{ this.inportFile.file.name }}<Icon type="md-backspace" @click="deleteFile"/></span>
            </FormItem>
        </Form>
      </Modal>
      <Modal v-model="isShowMechanism" title="证书详细" :footer-hide="true">
        <Form ref="mechanismForm" :model="mechanismForm" :label-width="100">
          <FormItem label="证书类型：" prop="certType" style="height: 15px">{{
            mechanismForm.certType
          }}</FormItem>
          <FormItem label="序列号：" prop="serialNumber" style="height: 15px">{{
            mechanismForm.serialNumber
          }}</FormItem>
          <FormItem label="版本号：" prop="version" style="height: 15px">{{
            mechanismForm.version
          }}</FormItem>
          <FormItem label="主题：" prop="theme">{{
            mechanismForm.theme
          }}</FormItem>
          <FormItem label="颁发者：" prop="issuer">{{
            mechanismForm.issuer
          }}</FormItem>
          <FormItem label="开始时间：" prop="startDate" style="height: 15px">{{
            mechanismForm.startDate
          }}</FormItem>
          <FormItem label="失效时间：" prop="endDate" style="height: 15px">{{
            mechanismForm.endDate
          }}</FormItem>
          <FormItem label="签名算法：" prop="alg" style="height: 15px">{{
            mechanismForm.alg
          }}</FormItem>
          <FormItem label="密钥长度：" prop="keyLength" style="height: 15px">{{
            mechanismForm.keyLength
          }}</FormItem>
          <FormItem label="密钥用途：" prop="keyType" style="height: 15px">{{
            mechanismForm.keyType
          }}</FormItem>
          <!-- <FormItem label="基本约束：" prop="constraint" style="height: 15px">{{
            mechanismForm.constraint
          }}</FormItem> -->
        </Form>
      </Modal>
      <Modal v-model="isUpdateMechanism" title="配置证书" :footer-hide="true">
        <Form
          ref="updateMechanismForm"
          :model="updateMechanismForm"
          :label-width="140"
        >
          <FormItem label="证书DN：" prop="certDN">
            <Input v-model="updateMechanismForm.certDN" style="width: 300px" />
          </FormItem>
          <FormItem label="CRL更新日期：" prop="crlUpdateDate">
            <DatePicker
              type="datetime"
              v-model="updateMechanismForm.crlUpdateDate"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="CRL下次更新日期：" prop="crlNextUpdateDate">
            <DatePicker
              type="datetime"
              v-model="updateMechanismForm.crlNextUpdateDate"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 200px"
            ></DatePicker>
          </FormItem>
          <FormItem label="CRL：" prop="crl">
            <Input
              v-model="updateMechanismForm.crl"
              type="textarea"
              style="width: 300px"
            />
          </FormItem>
          <FormItem label="手动导入CRL：" prop="publisher">
            <Upload action="//jsonplaceholder.typicode.com/posts/">
              <Button icon="ios-cloud-upload-outline">导入</Button>
            </Upload>
          </FormItem>
          <FormItem label="OCSP：" prop="ocsp">
            <Input v-model="updateMechanismForm.ocsp" style="width: 300px" />
          </FormItem>
          <Button
            class="ops-btn"
            style="marginleft: 200px"
            type="info"
            @click="saveUpdateMechanism"
            >保存</Button
          >
        </Form>
      </Modal>
    </div>
  </Card>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      isShowInput: false,
      isShowMechanism: false,
      isUpdateMechanism: false,
      isShowUpload:true,
      inportFile:{
        type:1,
        file:""
      },
      mechanismForm: {
        certType: "",
        serialNumber: "",
        version: "",
        theme: "",
        issuer: "",
        startDate: "",
        endDate: "",
        alg: "",
        keyLength: "",
        keyType: "",
        constraint: "",
      },
      updateMechanismForm: {
        certDN: "",
        crlUpdateDate: "",
        crlNextUpdateDate: "",
        crl: "",
        ocsp: "",
      },
      queryParams: {
        current: 1,
        size: 10,
      },
      columns: [
        {
          title: "序号",
          width: 80,
          key: "id",
        },
        {
          title: "颁发者",
          key: "issuer",
        },
        {
          title: "主题",
          key: "theme",
        },
          {
          title: "序列号",
          key: "serialNumber",
        },
         {
          title: "密钥",
          width: 150,
          key: "keyType",
        },
        {
          title: "有效期至",
          width: 200,
          key: "endDate",
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
      this.$store.commit("queryCert", this.queryParams);
    },
     uploadFormatError(file, fileList) {
      this.$Message.error("文件格式错误!");
    },
    handleUpload(file) {
      this.inportFile.file = file;
      this.isShowUpload = false;
      return false;
    },
    deleteFile() {
      this.isShowUpload = true;
      this.inportFile.file = "";
    },
    input() {
        this.$store.dispatch("import",this.inportFile).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200) {
              this.loadData();
              this.$Message.success("导入成功！")
        } else {
          this.$Message.error("时间设置失败!原因："+resData.message);
        }
      });
    },
    
    showMechanism(id) {
       this.$store.dispatch("detail",id).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200) {
          const data=resData.data;
          this.mechanismForm.certType=data.certType;
          this.mechanismForm.serialNumber=data.serialNumber;
          this.mechanismForm.startDate=data.startDate;
           this.mechanismForm.endDate=data.endDate;
           this.mechanismForm.version=data.version;
            this.mechanismForm.theme=data.theme;
            this.mechanismForm.issuer=data.issuer;
            this.mechanismForm.constraint=data.constraint;
            this.mechanismForm.alg=data.alg;
            this.mechanismForm.keyLength=data.keyLength;
            this.mechanismForm.keyType=data.keyType;
    
        } else {
          this.$Message.error("时间设置失败!原因："+resData.message);
        }
      });
      this.isShowMechanism = true;
    },
    updateMechanism() {
      this.isUpdateMechanism = true;
    },
    saveUpdateMechanism() {
      this.isUpdateMechanism = false;
      this.$Message.success("修改证书配置成功!");
    },
    deleteMechanism(id) {
       this.$store.dispatch("deleteCA",id).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200&&resData.data) {
          this.loadData();
            this.$Message.success("删除证书成功!");
        } else {
          this.$Message.error("删除证书失败!原因："+resData.message);
        }
      });
   
    },
    downloadMechanism(id) {
         this.$store.dispatch("download",id).then((response) => {
       let blob = new Blob([response.data], {
              type: "application/octet-stream"
            });
            const fileName="ca证书.crt"
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
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.trustMechanism;
    },
      uploadUrl() {
      return "http://";
    },
  },
};
</script>
<template>
  <Card :bordered="false" dis-hover>
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
        <template slot-scope="{ row }" slot="action">
          <div>
            <Button
              class="ops-btn"
              icon="md-card"
              type="warning"
              @click="showEditPlane(row)"
              >修改</Button
            >
            <Button
              class="ops-btn"
              icon="md-cloud-upload"
              type="info"
              @click="showCertPlane(row.id)"
              >生成p10请求</Button
            >
            <Button
              class="ops-btn"
              icon="md-cloud-upload"
              type="info"
              @click="importCert(row.id)"
              >导入证书</Button
            >
            <Poptip
              confirm
              title="确定要删除该实体应用吗?"
              @on-ok="deleteContainer(row.id)"
              placement="left"
            >
              <Button class="ops-btn" icon="md-trash" type="error">删除</Button>
            </Poptip>
          </div>
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
    </div>

    <Modal v-model="editModel" title="修改应用实体信息" @on-ok="edit">
      <Form ref="editContainer" :model="editContainer" :label-width="100">
        <FormItem label="密钥类型：">
          <Select v-model="editContainer.algType" style="width: 200px">
            <Option :value="3">SM2</Option>
            <!-- <Option :value="2">RSA</Option> -->
          </Select>
        </FormItem>
         <FormItem v-if="editContainer.algType==2" label="密钥长度：">
          <Select v-model="editContainer.length" style="width: 200px">
            <Option :value="1024">1024</Option>
            <Option :value="2048">2048</Option>
          </Select>
        </FormItem>
        <FormItem label="应用名称：">
          <Input v-model="editContainer.name" style="width: 200px" />
        </FormItem>
        <FormItem label="密钥索引:">
          <Input v-model="editContainer.keyIndex" style="width: 200px" />
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="certModel" title="生成P10证书请求">
      <Form ref="createCert" :model="createCert" :label-width="100">
        <FormItem label="姓名：">
          <Input v-model="createCert.username" style="width: 200px" />
        </FormItem>
        <FormItem label="部门：">
          <Input v-model="createCert.dept" style="width: 200px" />
        </FormItem>
        <FormItem label="单位：">
          <Input v-model="createCert.org" style="width: 200px" />
        </FormItem>
        <FormItem label="城市：">
          <Input v-model="createCert.city" style="width: 200px" />
        </FormItem>
        <FormItem label="省份：">
          <Input v-model="createCert.province" style="width: 200px" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="createSignCert">签名证书P10生成</Button>
        <Button type="primary" @click="createEncryptCert"
          >加密证书P10生成</Button
        >
        <Button type="text" size="large" @click="certModel = false"
          >取消</Button
        >
      </div>
    </Modal>

    <Modal v-model="importModel" title="导入证书">
      <Form ref="createCert" :model="createCert" :label-width="100">
        <FormItem label="签名证书：">
          <Upload
            v-if="isShowSignCert"
            :action="uploadUrl"
            :before-upload="handleSignUpload"
            accept=".txt"
            :format="['cer', 'crt', 'pem', 'txt']"
            :on-format-error="uploadFormatError"
          >
            <Button icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <span v-else
            >{{ this.signCertForm.file.name
            }}<Icon type="md-backspace" @click="deleteSignFile"
          /></span>
          <Button style="margin-left: 10px" @click="importSignCert"
            >导入</Button
          >
        </FormItem>
        <FormItem label="加密证书：">
          <Upload
            v-if="isShowEncryptCert"
            :action="uploadUrl"
            :before-upload="handleEncryptUpload"
            accept=".txt"
            :format="['cer', 'crt', 'pem', 'txt']"
            :on-format-error="uploadFormatError"
          >
            <Button icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <span v-else
            >{{ this.encryptCertForm.file.name
            }}<Icon type="md-backspace" @click="deleteEncryptFile"
          /></span>
          <Button style="margin-left: 10px" @click="importEncryptCert"
            >导入</Button
          >
        </FormItem>
        <FormItem label="加密密钥对：">
          <Upload
            v-if="isShowKeyPairCert"
            :action="uploadUrl"
            :before-upload="handleKeyPairUpload"
            accept=".txt"
            :format="['cer', 'crt', 'pem', 'txt']"
            :on-format-error="uploadFormatError"
          >
            <Button icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
          <span v-else
            >{{ this.keyPairCertForm.file.name
            }}<Icon type="md-backspace" @click="deleteKeyPairFile"
          /></span>
          <Button style="margin-left: 10px" @click="importKeyPairCert"
            >导入</Button
          >
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="closeImportModel">取消</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      queryParams: {
        current: 1,
        size: 10,
      },
      editContainer: {
        id: 0,
        algType: 3,
        name: "",
        keyIndex: "",
        keyLength:256
      },
      createCert: {
        username: "",
        dept: "",
        org: "",
        city: "",
        province: "",
      },
      editModel: false,
      certModel: false,
      importModel: false,
      isShowSignCert: true,
      isShowEncryptCert: true,
      isShowKeyPairCert: true,
      id: 0,
      signCertForm: {
        file: "",
      },
      encryptCertForm: {
        file: "",
      },
      keyPairCertForm: {
        file: "",
      },
      columns: [
        {
          title: "序号",
          width: 80,
          key: "id",
        },
        {
          title: "应用实体名称",
          key: "name",
        },
        {
          title: "密钥类型",
          key: "keyType",
          render: (h, params) => {
            if (params.row.keyType == 3) {
              return h("span", "SM2");
            } else {
              return h("span", "RSA");
            }
          },
        },
        {
          title: "密钥索引",
          key: "keyIndex",
        },
        {
          title: "密钥长度",
          key: "keyLength",
        },
        {
          title: "签名证书",
          key: "signCert",
          render: (h, params) => {
            if (params.row.signCert != null&&params.row.signCert!='') {
              return h("span", "已导入");
            } else {
              return h("span", "未导入");
            }
          },
        },
        {
          title: "加密证书",
          key: "encryptCert",
          render: (h, params) => {
            if (params.row.encryptCert != null&&params.row.encryptCert!='') {
              return h("span", "已导入");
            } else {
              return h("span", "未导入");
            }
          },
        },
        {
          title: "加密密钥对",
          key: "keyPair",
          render: (h, params) => {
            if (params.row.keyPair != null&&params.row.keyPair!='') {
              return h("span", "已导入");
            } else {
              return h("span", "未导入");
            }
          },
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            if (
              params.row.signCert != null &&
              params.row.encryptCert != null &&
              params.row.keyPair != null
            ) {
              return h("span", "可使用");
            } else {
              return h("span", "不可使用");
            }
          },
        },
        {
          title: "操作",
          slot: "action",
          width: 480,
        },
      ],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    changePage(p) {
      this.queryParams.current = p;
      this.loadData();
    },
    changePageSize(size) {
      this.queryParams.size = size;
      this.loadData();
    },
    loadData() {
      this.$store.commit("containerList", this.queryParams);
    },
    //签名证书
    deleteSignFile() {
      this.isShowSignCert = true;
      this.signCertForm.file = "";
    },
    handleSignUpload(file) {
      this.signCertForm.file = file;
      this.isShowSignCert = false;
      return false;
    },

    //加密证书
    deleteEncryptFile() {
      this.isShowEncryptCert = true;
      this.encryptCertForm.file = "";
    },
    handleEncryptUpload(file) {
      this.encryptCertForm.file = file;
      this.isShowEncryptCert = false;
      return false;
    },

    //加密密钥对
    deleteKeyPairFile() {
      this.isShowKeyPairCert = true;
      this.keyPairCertForm.file = "";
    },
    handleKeyPairUpload(file) {
      this.keyPairCertForm.file = file;
      this.isShowKeyPairCert = false;
      return false;
    },
    uploadFormatError(file, fileList) {
      this.$Message.error("文件格式错误!");
    },
    showEditPlane(row) {
      this.editContainer = row;
      this.editContainer.algType = row.keyType;
      this.editModel = true;
    },
    showCertPlane(id) {
      this.certModel = true;
      this.id=id
    },
    //删除
    deleteContainer(id) {
      this.$store.dispatch("deleteContainer", id).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.loadData();
          this.$Message.success("删除成功!");
        } else {
          this.$Message.error("删除失败，" + resData.message);
        }
      });
    },
    //修改
    edit() {
      this.$store.dispatch("editContainer", this.editContainer).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.loadData();
          this.$Message.success("修改成功!");
        } else {
          this.loadData();
          this.$Message.error("修改失败，" + resData.message);
        }
      });
    },
    createSignCert() {
      const p10Cert = {
        id:this.id,
        type: 1,
        username: this.createCert.username,
        dept: this.createCert.dept,
        org: this.createCert.org,
        city: this.createCert.city,
        province: this.createCert.province,
      };
      this.$store.dispatch("applyP10Cert", p10Cert).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        // 获取文件名
        // download 属性定义了下载链接的地址而不是跳转路径
        link.setAttribute("download", "signP10.csr");
        document.body.appendChild(link);
        link.click();
      });

      this.certModel = false;
    },
    createEncryptCert() {
      const p10Cert = {
        type: 2,
        username: this.createCert.username,
        dept: this.createCert.dept,
        org: this.createCert.org,
        city: this.createCert.city,
        province: this.createCert.province,
      };
      this.$store.dispatch("applyP10Cert", p10Cert).then((res) => {
        let url = window.URL.createObjectURL(new Blob([res.data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        // 获取文件名
        // download 属性定义了下载链接的地址而不是跳转路径
        link.setAttribute("download", "加密证书.crt");
        document.body.appendChild(link);
        link.click();
      });
      this.certModel = false;
    },
    importCert(id) {
      this.id = id;
      this.importModel = true;
    },
    //关闭导入面板
    closeImportModel() {
      this.isShowSignCert = true;
      this.isShowEncryptCert = true;
      this.isShowKeyPairCert = true;
      this.signCertForm.file = "";
      this.encryptCertForm.file = "";
      this.keyPairCertForm.file = "";
      this.importModel = false;
    },
    //导入签名证书
    importSignCert() {
      const importForm = {
        id: this.id,
        type: 1,
        file: this.signCertForm.file,
      };
      this.$store.dispatch("importCert", importForm).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.loadData();
          this.$Message.success("导入签名证书成功!");
        } else {
          this.$Message.error("导入签名证书失败，" + resData.message);
        }
      });
    },
    //导入加密证书
    importEncryptCert() {
       const importForm = {
        id: this.id,
        type: 2,
        file: this.encryptCertForm.file,
      };
      this.$store.dispatch("importCert", importForm).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.loadData();
          this.$Message.success("导入加密证书成功!");
        } else {
          this.$Message.error("导入加密证书失败，" + resData.message);
        }
      });
    },
    //导入加密密钥对
    importKeyPairCert() {
       const importForm = {
        id: this.id,
        type: 3,
        file: this.keyPairCertForm.file,
      };
      this.$store.dispatch("importCert", importForm).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.loadData();
          this.$Message.success("导入加密密钥对成功!");
        } else {
          this.$Message.error("导入加密密钥对失败，" + resData.message);
        }
      });
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.container;
    },
    uploadUrl() {
      return "http://";
    },
  },
};
</script>
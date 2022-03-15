<template>
  <Tabs value="tab1">
    <TabPane label="加密解密证书列表" name="tab1">
      <Card :bordered="false" dis-hover>
        <div>
          <Button @click="isInputShow = true" type="success">导入证书</Button>
          <!-- <Button style="marginLeft:30px;" @click="isShowBatchImport=true" type="success">批量导入</Button> -->

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
            >
              <template slot-scope="{ row, index }" slot="action">
                <div>
                  <Button class="ops-btn" type="success" @click="isShow = true"
                    >查看</Button
                  >
                  <!-- <Button
                    class="ops-btn"
                    type="warning"
                    @click="isUpdateCert = true"
                    >配置</Button
                  > -->
                  <Poptip
                    confirm
                    title="确定删除该CRL吗?"
                    @on-ok="deleteCert(row.id)"
                    placement="left"
                  >
                    <Button class="ops-btn" type="error">删除</Button>
                  </Poptip>
                  <!-- <Button class="ops-btn" type="primary" @click="downLoadCert(row.id)">下载</Button> -->
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
        </div>
        <Modal v-model="isInputShow" title="证书导入" @on-ok="inputCert">
          <Form ref="inputCertForm" :model="inputCertForm" :label-width="100">
            <FormItem label="证书标识：" prop="certType">
              <Input v-model="inputCertForm.certId" style="width: 200px" />
            </FormItem>
            <!-- <FormItem label="证书类型：" prop="serialNumber">
              <Select v-model="inputCertForm.certType" style="width: 200px">
                <Option :value="1">PKCS10应答X509证书</Option>
                <Option :value="2">PKCS12证书</Option>
              </Select>
            </FormItem> -->
            <FormItem label="对应证书：" prop="version">
              <Upload
                v-if="isShowUpload"
                :action="uploadUrl"
                :before-upload="handleUpload"
                accept=".txt"
                :format="['cer', 'crt', 'pem', 'txt']"
                :on-format-error="uploadFormatError"
              >
                <Button icon="ios-cloud-upload-outline">选择文件</Button>
              </Upload>
              <span v-else
                >{{ this.inputCertForm.file.name
                }}<Icon type="md-backspace" @click="deleteFile"
              /></span>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          v-model="isShowBatchImport"
          title="批量导入"
          @on-ok="batchImport"
        >
          <Form ref="inputCertForm" :model="inputCertForm" :label-width="100">
            <FormItem label="证书类型：" prop="serialNumber">
              <Select v-model="inputCertForm.certType" style="width: 200px">
                <Option :value="1">PKCS10应答X509证书(带私钥)</Option>
                <Option :value="2">PKCS12证书</Option>
              </Select>
            </FormItem>
            <FormItem label="证书文件：" prop="version">
              <Upload action="//jsonplaceholder.typicode.com/posts/">
                <Button icon="ios-cloud-upload-outline">选择文件</Button>
              </Upload>
            </FormItem>
          </Form>
          <div style="margin: 0 auto">
            <p style="color: red">提示：</p>
            <p>1. 批量导入证书时，导入的是多个证书的zip格式的压缩包;</p>
            <p>2. 压缩包中证书名称格式为“证书ID.p12”或“证书ID_密钥号ID.cer”</p>
          </div>
        </Modal>
        <Modal v-model="isShow" title="证书详细" :footer-hide="true">
          <Form ref="certForm" :model="certForm" :label-width="100">
            <FormItem label="证书类型：" prop="certType" style="height: 15px">{{
              certForm.certType
            }}</FormItem>
            <FormItem
              label="序列号："
              prop="serialNumber"
              style="height: 15px"
              >{{ certForm.serialNumber }}</FormItem
            >
            <FormItem label="版本号：" prop="version" style="height: 15px">{{
              certForm.version
            }}</FormItem>
            <FormItem label="主题：" prop="theme" style="height: 15px">{{
              certForm.theme
            }}</FormItem>
            <FormItem label="颁发者：" prop="publisher" style="height: 15px">{{
              certForm.publisher
            }}</FormItem>
            <FormItem
              label="开始时间："
              prop="startDate"
              style="height: 15px"
              >{{ certForm.startDate }}</FormItem
            >
            <FormItem label="失效时间：" prop="endDate" style="height: 15px">{{
              certForm.endDate
            }}</FormItem>
            <FormItem label="签名算法：" prop="alg" style="height: 15px">{{
              certForm.alg
            }}</FormItem>
            <FormItem
              label="密钥长度："
              prop="keyLength"
              style="height: 15px"
              >{{ certForm.keyLength }}</FormItem
            >
            <FormItem label="密钥用途：" prop="keyType" style="height: 15px">{{
              certForm.keyType
            }}</FormItem>
            <FormItem
              label="基本约束："
              prop="constraint"
              style="height: 15px"
              >{{ certForm.constraint }}</FormItem
            >
          </Form>
        </Modal>
        <Modal v-model="isUpdateCert" title="配置证书" :footer-hide="true">
          <Form ref="updateCertForm" :model="updateCertForm" :label-width="140">
            <FormItem label="证书DN：" prop="certDN">
              <Input v-model="updateCertForm.certDN" style="width: 300px" />
            </FormItem>
            <FormItem label="CRL更新日期：" prop="crlUpdateDate">
              <DatePicker
                type="datetime"
                v-model="updateCertForm.crlUpdateDate"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 200px"
              ></DatePicker>
            </FormItem>
            <FormItem label="CRL下次更新日期：" prop="crlNextUpdateDate">
              <DatePicker
                type="datetime"
                v-model="updateCertForm.crlNextUpdateDate"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 200px"
              ></DatePicker>
            </FormItem>
            <FormItem label="CRL：" prop="crl">
              <Input
                v-model="updateCertForm.crl"
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
              <Input v-model="updateCertForm.ocsp" style="width: 300px" />
            </FormItem>
            <Button
              class="ops-btn"
              style="marginleft: 200px"
              type="info"
              @click="saveUpdateCert"
              >保存</Button
            >
          </Form>
        </Modal>
      </Card>
    </TabPane>
    <!-- <TabPane label="加密解密证书请求" name="tab2">
      <div class="div">
        <Card :bordered="false" dis-hover>
          <Form
            ref="certRequestForm"
            :model="certRequestForm"
            :label-width="140"
          >
            <FormItem label="申请方式：" prop="certDN" style="height: 15px">
              <Select v-model="certRequestForm.method" style="width: 200px">
                <Option :value="1">离线申请</Option>
                <Option :value="2">在线申请</Option>
              </Select>
            </FormItem>
            <FormItem label="名称(CN)：" prop="name" style="height: 15px">
              <Input v-model="certRequestForm.name" style="width: 200px" />
            </FormItem>
            <FormItem label="邮箱(E)：" prop="email" style="height: 15px">
              <Input v-model="certRequestForm.email" style="width: 200px" />
            </FormItem>
            <FormItem
              label="组织机构代码(T)："
              prop="orgCode"
              style="height: 15px"
            >
              <Input v-model="certRequestForm.orgCode" style="width: 200px" />
            </FormItem>
            <FormItem label="部门(OU)：" prop="dept" style="height: 15px">
              <Input v-model="certRequestForm.dept" style="width: 200px" />
            </FormItem>
            <FormItem label="县(L)：" prop="area" style="height: 15px">
              <Input v-model="certRequestForm.area" style="width: 200px" />
            </FormItem>
            <FormItem label="市(L)：" prop="city" style="height: 15px">
              <Input v-model="certRequestForm.city" style="width: 200px" />
            </FormItem>
            <FormItem label="省(ST)：" prop="province" style="height: 15px">
              <Input v-model="certRequestForm.province" style="width: 200px" />
            </FormItem>
            <FormItem label="组织(O)：" prop="org" style="height: 15px">
              <Input v-model="certRequestForm.org" style="width: 200px" />
            </FormItem>
            <FormItem label="国家(CN)：" prop="country" style="height: 15px">
              <Input v-model="certRequestForm.country" style="width: 200px" />
            </FormItem>
            <FormItem label="密钥：" prop="keyType" style="height: 15px">
              <Select v-model="certRequestForm.keyType" style="width: 200px">
                <Option :value="1">11001:RSA[1024]</Option>
                <Option :value="2">11002:RSA[2048]</Option>
                <Option :value="3">20001:SM2</Option>
              </Select>
            </FormItem>
            <FormItem label="PKCS10：" prop="ocsp">
              <Input
                v-model="certRequestForm.pkcs10"
                type="textarea"
                style="width: 200px"
              />
              <Button class="ops-btn" type="info" @click="downLoadNewCert"
                >下载</Button
              >
            </FormItem>
            <Button
              class="ops-btn"
              style="marginleft: 200px"
              type="info"
              @click="createCert"
              >保存</Button
            >
          </Form>
        </Card>
      </div>
    </TabPane> -->
  </Tabs>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      isShow: false,
      isInputShow: false,
      isShowBatchImport: false,
      isUpdateCert: false,
      isShowUpload: true,
      inputCertForm: {
        certId: "",
        certType: 1,
        file: "",
      },
      certForm: {
        certType: "X.509",
        serialNumber: "1233333",
        version: "v3",
        theme: "C=CN,O=MOF",
        publisher: "C=CN,O=MOF",
        startDate: "2020-09-22 15:30:30",
        endDate: "2021-09-22 15:30:30",
        alg: "SHA1WithRSAEncryption",
        keyLength: "1024",
        keyType: "digitalSignature",
        constraint: "Subject Type=CA",
      },
      updateCertForm: {
        certDN: "",
        crlUpdateDate: "",
        crlNextUpdateDate: "",
        crl: "",
        ocsp: "",
      },
      certRequestForm: {
        method: 1,
        name: "",
        email: "",
        orgCode: "",
        org: "",
        dept: "",
        area: "",
        city: "",
        province: "",
        country: "CN",
        keyType: 1,
        pkcs10: "",
      },
      queryParams: {
        current: 1,
        size: 10,
        type: 1,
      },
      columns: [
        {
          title: "序号",
          width: 80,
          key: "id",
        },
        {
          title: "证书别名",
          width: 200,
          key: "certName",
        },
        // {
        //   title: "对应密钥",
        //   width: 100,
        //   key: "keyId",
        // },
        {
          title: "颁发者",
          key: "issuer",
        },
        {
          title: "主题",
          key: "theme",
        },
        {
          title: "有效期",
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
      this.$store.commit("querCrlList", this.queryParams);
    },
    changePage(p) {
      this.queryParams.current = p;
      this.loadData();
    },
    changePageSize(size) {
      this.queryParams.size = size;
      this.loadData();
    },
    uploadFormatError(file, fileList) {
      this.$Message.error("文件格式错误!");
    },
    deleteFile() {
      this.isShowUpload = true;
      this.inputCertForm.file = "";
    },
    handleUpload(file) {
      this.inputCertForm.file = file;
      this.isShowUpload = false;
      return false;
    },
    inputCert() {
      const uploadData = {
        certName: this.inputCertForm.certId,
        certType: this.inputCertForm.certType,
        file: this.inputCertForm.file,
        type: 1, //1表示加密,2表示签名
      };
      this.$store.dispatch("upload", uploadData).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.$Message.success("导入成功!");
          this.loadData();
        } else {
          this.$Message.error("导入失败!");
        }
      });
    },
    batchImport() {
      this.$Message.success("批量导入成功!");
    },
    saveUpdateCert() {
      this.isUpdateCert = false;
      this.$Message.success("修改成功!");
    },
    setDefault(id) {
      this.$Message.success("设置默认成功!");
    },
    deleteCert(id) {
      this.$store.dispatch("delete", id).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.$Message.success("删除成功!");
          this.loadData();
        } else {
          this.$Message.error("删除失败!");
        }
      });
    },
    // downLoadCert(id) {
    //   this.$Message.success("下载成功!");
    // },
    createCert() {
      this.$Message.success("申请成功!");
    },
    downLoadNewCert() {
      this.$Message.success("证书下载成功!");
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.sginAdnEncryCert;
    },
    uploadUrl() {
      return this.state.uploadUrl;
    },
    headers() {
      return this.state.headers;
    },
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
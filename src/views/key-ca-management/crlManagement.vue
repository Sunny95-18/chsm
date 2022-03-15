<template>
  <Card :bordered="false" dis-hover>
    <div>
      <Button type="success" icon="md-add" @click="isAddShow = true">添加</Button
      >

      <!--分页表格-->
      <div style="margin-top: 10px">
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
               <!-- <Button class="ops-btn" type="primary" @click="showEdit(row.id)">配置</Button> -->
              <Poptip
                confirm
                title="确定删除该CRL吗?"
                @on-ok="deleteCrl(row.id)"
                placement="right"
              >
              
                <Button class="ops-btn" type="error">删除</Button>
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
    </div>
    <Modal v-model="isAddShow" title="添加" @on-ok="createCrl">
      <Form :model="addCrlForm" :label-width="100">
        <FormItem label="类型：">
          <Select v-model="addCrlForm.type">
            <Option :value="0">文件</Option>
            <Option :value="1">地址</Option>
          </Select>
        </FormItem>
        <FormItem v-if="addCrlForm.type == 0" label="CRL文件：">
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
              <span v-else>{{ this.addCrlForm.file.name }}<Icon type="md-backspace" @click="deleteFile"/></span>
        </FormItem>
        <FormItem v-if="addCrlForm.type == 1" label="CRL地址">
          <Input v-model="addCrlForm.url">
            <Select
              v-model="addCrlForm.urlType"
              slot="prepend"
              style="width: 80px"
            >
              <Option :value="1">http://</Option>
              <Option :value="2">ladp://</Option>
            </Select>
          </Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="isEditShow" title="配置" @on-ok="editCrl">
      <Form :model="addCrlForm" :label-width="100">
        <FormItem label="CRL更新地址">
          <Input v-model="addCrlForm.url"></Input>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      isAddShow: false,
      isEditShow: false,
      isShowUpload: true,
      id:0,
      addCrlForm: {
        type: 0,
        url: "",
        urlType: 1,
        file:""
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
          width: 600,
          key: "issuer",
        },
         {
          title: "算法",
          width: 150,
          key: "algName",
        },
        {
          title: "本次更新时间",
          width: 250,
          key: "updateDate",
        },
        {
          title: "下次更新时间",
          width: 250,
          key: "nextUpdateDate",
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
      this.$store.commit("quercrlList", this.queryParams);
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
    handleUpload(file) {
      this.addCrlForm.file = file;
      this.isShowUpload = false;
      return false;
    },
    deleteFile() {
      this.isShowUpload = true;
      this.addCrlForm.file = "";
    },
    showEdit(id){
      this.isEditShow=true;
      this.id=id;
    },
    editCrl() {
      const editCrlFrom={
        id:this.id,
        url:this.addCrlForm.url
      }
         this.$store.dispatch("editCrl", editCrlFrom).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200) {
          this.$Message.success("CRL地址更新成功!");
          this.loadData();
        } else {
          this.$Message.error("CRL地址更新失败! "+resData.message);
        }
      });
    },
    createCrl() {
        this.$store.dispatch("addCrl", this.addCrlForm).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200&&resData.data) {
          this.$Message.success("CRL添加成功!");
          this.loadData();
        } else {
          this.$Message.error("CRL添加失败! "+resData.message);
        }
      });
    },
    deleteCrl(id) {
      this.$store.dispatch("deleteCrl", id).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200) {
          this.$Message.success("CRL删除成功!");
          this.loadData();
        } else {
          this.$Message.error("CRL删除失败! "+resData.message);
        }
      });
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.crlManagement;
    },
      uploadUrl() {
      return "";
    },
  },
};
</script>
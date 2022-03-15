<template>
  <div>
    <Card :bordered="false" dis-hover>
      <Button
        style="margin-left: 30px"
        @click="isShow = true"
        type="primary"
        icon="md-key"
        >生成密钥</Button
      >
      <div style="margin-top: 20px">
        <Table
          ref="tab"
          :disabled-hover="true"
          :loading="state.loading"
          :columns="columns"
          :data="rows"
          class="table"
          :height="650"
  
        >
          <template slot-scope="{ row, index }" slot="action">
            <Poptip
              confirm
              title="确认删除该密钥吗?"
              @on-ok="deleteSM2Key(row.keyIndex,row.keyType)"
              placement="right"
            >
              <Button class="ops-btn" type="error">删除</Button>
            </Poptip>
          </template>
        </Table>
        <Modal v-model="isShow" title="生成SM2密钥对" @on-ok="createSM2Key">
          <Form :label-width="150">
            <FormItem label="密钥索引：">
             <Input v-model="keyIndex" style="width: 200px" />
            </FormItem>
             <FormItem label="秘钥用途：">
               <Select v-model="usage" style="width:200px">
                  <Option :value="1">签名秘钥</Option>
                  <Option :value="2">加密秘钥</Option>
                  <Option :value="3">签名和加密</Option>
               </Select>
            </FormItem>
          </Form>
        </Modal>
      </div>
    </Card>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      isShow: false,
      keyIndex:"",
      usage:1,
      columns: [
        {
          title: "索引",
          width: 100,
          key: "keyIndex",
        },
          {
          title: "用途",
          width: 300,
          key: "keyType",
            render: (h, { row, index }) => {
            if (row.keyType == 1) {
              return h("span", "签名秘钥");
            } else if (row.keyType == 2) {
              return h("span", "加密秘钥");
            }
          },
        },
        {
          title: "模长",
          width: 300,
          key: "keyLength",
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
      this.$store.commit("querySM2KeyList");
    },
    createSM2Key() {
      const createKey={
        type:3,
        index:this.keyIndex,
        usage:this.usage,
        length:256
      }
      this.$store.dispatch("SM2KeyGeneration", createKey).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200&&resData.data) {
          this.$Message.success("生成SM2密钥成功!");
          this.loadData();
        } else {
          this.$Message.error("生成SM2密钥失败, "+resData.message);
        }
      });
    },
    deleteSM2Key(id,usage) {
      const deleteKey={
        id:id,
        usage:usage
      }
      this.$store.dispatch("deleteSM2Key", deleteKey).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200&&resData.data) {
          this.$Message.success("密钥删除成功!");
          this.loadData();
        } else {
          this.$Message.error("密钥删除失败!");
        }
      });
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.sm2Key;
    },
  },
  mounted() {},
  watch: {
    $route() {},
  },
};
</script>
          

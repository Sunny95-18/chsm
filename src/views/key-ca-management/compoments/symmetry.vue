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
              @on-ok="deleteSymmetryKey(row.keyIndex)"
              placement="right"
            >
              <Button class="ops-btn" type="error">删除</Button>
            </Poptip>
          </template>
        </Table>
        <Modal v-model="isShow" title="生成对称秘钥" @on-ok="createSymmetryKey">
          <Form :label-width="150">
            <FormItem label="密钥索引(1-500)：">
              <Input v-model="keyIndex" style="width: 200px" />
            </FormItem>
            <FormItem label="秘钥长度：">
              <Select v-model="keyLength" style="width: 200px">
                <Option :value="128">128</Option>
                <Option :value="192">192</Option>
                <Option :value="256">256</Option>
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
     keyIndex:"",
      keyLength: 128,
      isShow: false,
      columns: [
        {
          title: "索引",
          width: 100,
          key: "keyIndex",
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
    loadData() {
      this.$store.commit("querySymmetryKeyList");
    },
    createSymmetryKey(){
        const createKey={
        type:1,
        index:this.keyIndex,
        usage:0,
        length:this.keyLength
      }
     this.$store.dispatch("SymmetryKeyGeneration", createKey).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200&&resData.data) {
             this.loadData();
          this.$Message.success("生成对称密钥成功!");
         
        } else {
          this.$Message.error("生成对称密钥失败, "+resData.message);
        }
      });
    },
    deleteSymmetryKey(id){
        const deleteKey={
        id:id,
        usage:0
      }
  this.$store.dispatch("deleteSymmetryKey", deleteKey).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200&&resData.data) {
             this.loadData();
          this.$Message.success("生成对称密钥成功!");
         
        } else {
          this.$Message.error("生成对称密钥失败, "+resData.message);
        }
      });
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.symmetryKey;
    },
  },
  mounted() {},
  watch: {
    $route() {},
  },
};
</script>
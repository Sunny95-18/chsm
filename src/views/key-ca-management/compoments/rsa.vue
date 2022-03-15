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
              @on-ok="deleteRSAKey(row.keyIndex,row.keyType)"
              placement="right"
            >
              <Button class="ops-btn" type="error">删除</Button>
            </Poptip>
          </template>
        </Table>
        <Modal v-model="isShow" title="生成RSA密钥对" @on-ok="ok">
          <Form :label-width="150">
            <FormItem label="密钥索引：" prop="type">
              <Input v-model="keyIndex" style="width: 200px" />
            </FormItem>
             <FormItem label="秘钥用途：">
               <Select v-model="usage" style="width:200px">
                  <Option :value="1">签名秘钥</Option>
                  <Option :value="2">加密秘钥</Option>
                  <Option :value="3">签名和加密</Option>
               </Select>
            </FormItem>
            <FormItem label="密钥长度：" prop="length">
              <Select v-model="keyLength" style="width: 200px">
                <Option :value="1024">1024</Option>
                <Option :value="2048">2048</Option>
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
      keyIndex: "",
      keyLength: 1024,
      usage:1,
      queryParams: {
        current: 1,
        size: 10,
      },
      columns: [
        {
          title: "索引",
          width:100,
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
          width:300,
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
      this.$store.commit("queryRSAKeyList");
    },
    changePage(p) {
      this.queryParams.current = p;
      this.loadData();
    },
    changePageSize(size) {
      this.queryParams.size = size;
      this.loadData();
    },
    ok() {
        const createKey={
        type:4,
        index:this.keyIndex,
        length:this.keyLength,
        usage:this.usage
      }
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
                            h('div', '正在生成中，请稍等')
                        ])
                    }
                });
      this.$store.dispatch("RSAKeyGeneration", createKey).then((res) => {
        var resData = res.data;
        if (resData && resData.code ==200&&resData.data) {
          this.$Spin.hide();
          this.$Message.success("生成密钥成功!");
          this.loadData();
        } else {
          this.$Message.error("生成密钥失败,"+resData.message);
        }
      });
    },
    deleteRSAKey(id,usage) {
      const deleteKey={
        id:id,
        usage:usage
      }
      this.$store.dispatch("deleteRSAKey", deleteKey).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200&&resData.data) {
          this.$Message.success("密钥删除成功!");
          this.loadData();
        } else {
          this.$Message.error("密钥删除失败,"+resData.message);
        }
      });
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.rsaKey;
    },
    // rows(){
    //   return this.$store.state.rsarows;
    // }
  },
  mounted() {},
  watch: {
    $route() {},
  },
};
</script>
<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>       

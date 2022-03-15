<template>
  <Card :bordered="false" dis-hover>
    <div>
      <Form class="edit-model-form" show-message :label-width="120">
        <Row>
          <div class="ivu-col ivu-col-span-6">
            <FormItem label="输入要授权的IP:">
              <Input placeholder="请输入IP地址" v-model="IP" clearable />
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-12">
            <FormItem :label-width="20">
              <Button @click="toAdd" type="success" icon="md-add">增加</Button>
            </FormItem>
          </div>
        </Row>
      </Form>

      <!--分页表格-->
      <div style="margintop: 2px">
        <Table
          ref="tab"
          stripe
          :loading="state.loading"
          :columns="columns"
          :data="rows"
          class="table"
     
        >
          <template slot-scope="{ row, index }" slot="action">
            <div>
              <Button @click="toDel(row.id)" class="ops-btn" type="error">删除</Button>
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
  </Card>
</template>

<script>
import common from "@/utils/common";
export default {
  name: "virtual-machine",
  data() {
    return {
      offsetTop: 196,
      queryParams: {
        current: 1,
        size: 10,
      },
      IP: "",
      columns: [
        {
          title: "",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index +
                (this.queryParams.current - 1) * this.queryParams.size +
                1
            );
          },
        },
        {
          title: "IP",
          key: "ip",
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
      this.$Notice.warning({
        title: "白名单通知",
        duration: 10,
        render: (h) => {
          return h("span", [
            "对客户端机器进行授权，只有在白名单中的IP地址设备才被允许访问。",
            h("a", "注：当白名单为空时，允许所有IP访问。"),
          ]);
        },
      });
      this.$store.commit("getWhiteList", this.queryParams);
    },

    toAdd() {
      var reg = /^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))/;
      var re = new RegExp(reg)
      if (!re.test(this.IP)) {
         this.$Message.error("请输入正确的IP地址!");
        return false;
      }
       this.$store.dispatch("add", this.IP).then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.$Message.success("添加成功!");
          this.loadData();
        } else {
          this.$Message.error("添加失败, "+resData.message);
        }
      });
    },
    toDel(id) {
      this.$store.dispatch("deleteIP", id).then((res) => {
        var resData = res.data;
        if (resData && resData.code == 200) {
          this.$Message.success("删除成功!");
          this.loadData();
        } else {
          this.$Message.error("删除失败!");
        }
      });
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.whiteList;
    },
  },
  mounted() {
    // this.offsetTop = this.$refs.tab.$el.getBoundingClientRect().top;
  },
  watch: {
    $route() {},
  },
};
</script>

<style>
</style>
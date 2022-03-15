<template>
  <!--
    传统的表单+分页表格布局
  -->

  <Card :bordered="false" dis-hover>
    <!--查询条件表单设计
       ivu-col-span-6  占行比： 6  / 24 
       ivu-col-span-12 占行比： 12 / 24
    -->
    <div>
      <Form class="edit-model-form" show-message :label-width="120">
        <Row>
           <div class="ivu-col ivu-col-span-2">
            <FormItem label="产生对称密钥:">
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem label="密钥索引:">
              <Input placeholder="密钥索引，例如：1,3,5-12" v-model="queryParams.IP" clearable />
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem label="模长(bits):" style="width:130px">
              <Select v-model="defaultBits" style="width:70px">
                <Option value="128">128</Option>
                <Option value="192">192</Option>
                  <Option value="256">256</Option>
              </Select>
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem :label-width="20">
              <Button @click="toAdd" type="success" icon="md-add">产生密钥</Button>
            </FormItem>
          </div>
        </Row>
      </Form>
      
 <Form class="edit-model-form" show-message >
        <Row>
           <div class="ivu-col ivu-col-span-2">
            <FormItem label="导入对称密钥:" label-width="120">
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem label="索引范围:" label-width="120">
              <Input placeholder="1-100" v-model="queryParams.IP" clearable />
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-10">
            <FormItem label="十六进制对称密钥" label-width="150">
             <Input placeholder="为8的倍数且最长为32个字节例如：00010203" v-model="queryParams.IP" clearable style="width: 300px"/>
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-2">
            <FormItem :label-width="20">
              <Button @click="toAdd" type="success" icon="md-add">导入密钥</Button>
            </FormItem>
          </div>
        </Row>
      </Form>


      <!--分页表格-->
      <div style="marginTop:2px;">
        <Table
          ref="tab"
          stripe
          :loading="state.loading"
          :columns="columns"
          :data="rows"
          class="table"
          :height="500"
        >
          <template slot-scope="{ row,index }" slot="action">
            <div>
              <Button class="ops-btn" type="error">删除</Button>
            </div>
          </template>

          <Page
            ref="page"
            slot="footer"
            :current="queryParams.pageNumber"
            :total="totalCount"
            :page-size="queryParams.pageSize"
            show-total
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            :page-size-opts="[10,20,30]"
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
      query: {},
      user: {},
      offsetTop: 196,
      queryParams: {
        pageNumber: 1,
        pageSize: 10
      },
      defaultType: "1",
      defaultBits: "128",
      columns: [
        {
          title: "#",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index +
                (this.queryParams.pageNumber - 1) * this.queryParams.pageSize +
                1
            );
          }
        },
        {
          title: "密钥索引",
          width: 300,
          key: "id"
        },
        {
          title: "密钥长度",
          width: 300,
          key: "length"
        },
        {
          title: "删除密钥",
          slot: "action"
        }
      ],
      ruleValidate: {
        id: [
          { required: true, message: "id不可为空", trigger: "blur" },
          {
            validator: this.asyncValidator({
              url: "user/validate",
              getValidatorParams: this.getValidatorParams
            }),
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    ...common.methods,
    loadData() {
      this.$store.commit("demoPages", this.queryParams);
    },
    toAdd() {},
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.symmetricKey;
    }
  },
  mounted() {
    // this.offsetTop = this.$refs.tab.$el.getBoundingClientRect().top;
  },
  watch: {
    $route() {}
  }
};
</script>


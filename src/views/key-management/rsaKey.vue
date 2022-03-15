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
      <Form class="edit-model-form" show-message :label-width="100">
        <Row>
          <div class="ivu-col ivu-col-span-6">
            <FormItem label="密钥索引:">
              <Input placeholder="密钥索引暂为1" v-model="queryParams.index" clearable />
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem label="密钥用途:">
              <Select v-model="defaultType" style="width:120px">
                <Option value="1">签名密钥</Option>
                <Option value="2">加密密钥</Option>
                <Option value="3">签名和加密</Option>
              </Select>
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem label="模长(bits):" style="width:130px">
              <Select v-model="defaultBits" style="width:100px">
                <Option value="1024">1024</Option>
                <Option value="2048">2048</Option>
              </Select>
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem :label-width="20">
              <Button @click="toAdd" type="success" icon="md-add">生成密钥对</Button>
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
          :height="tableHeight"
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
        pageSize: 10,
        index:""
      },
      defaultType: "1",
      defaultBits: "1024",
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
          width: 250,
          key: "id"
        },
        {
          title: "密钥用途",
          width: 250,
          key: "type"
        },
        {
          title: "模长",
          width: 250,
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
    toAdd() {
      if(this.queryParams.index!=1){
        this.$Message.warning("RSA索引只可为1");
        
      }else{
        alert();
      }
    },
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.asymmetricKey;
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

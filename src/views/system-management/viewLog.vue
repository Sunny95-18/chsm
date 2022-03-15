<template>
  <Card :bordered="false" dis-hover>
    <div>
      <Form class="edit-model-form" show-message :label-width="100">
        <Row>
          <div class="ivu-col ivu-col-span-6">
            <FormItem>
              <DatePicker type="daterange" split-panels placeholder="日期范围" style="width: 200px"></DatePicker>
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem>
              <Input placeholder="日志模糊查询" v-model="queryParams.content" clearable />
            </FormItem>
          </div>
          <div class="ivu-col ivu-col-span-6">
            <FormItem>
              <Select
                v-model="queryParams.type"
                placeholder="日志类别"
                style="width:200px"
                @on-change="changeLogType"
              >
                <Option
                  v-for="item in logType"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </div>

          <div class="ivu-col ivu-col-span-6">
            <FormItem :label-width="20">
              <Button @click="doQuery" type="primary" icon="md-search">查询</Button>&nbsp;
              <Button @click="toAdd" type="success" icon="md-add">导出</Button>
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
          <!-- <template slot-scope="{ row,index }" slot="action">
            <div>
              <Button v-if="true" class="ops-btn" type="success">启动</Button>
              <Button v-else class="ops-btn" type="warning">停止</Button>
              <Button class="ops-btn" type="primary">编辑</Button>
              <Button class="ops-btn" type="error">重置</Button>
            </div>
          </template>-->

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
  name: "viewLog",
  data() {
    return {
      logType: [
        {
          value: 1,
          label: "用户权限"
        },
        {
          value: 2,
          label: "密钥管理"
        },
        {
          value: 3,
          label: "备份恢复"
        },
        {
          value: 4,
          label: "系统管理"
        },
        {
          value: 5,
          label: "服务管理"
        }
      ],
      offsetTop: 196,
      queryParams: {
        current: 1,
        size: 10,
        content: null,
        type: 0
      },
      columns: [
        {
          title: "序号",
          width: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              params.index +
                (this.queryParams.current - 1) * this.queryParams.size +
                1
            );
          }
        },
        {
          title: "类别",
          width: 120,
          key: "type",
          render: (h, params) => {
            switch (params.row.type) {
              case 1: {
                return h("span","用户权限");
              }
              case 2: {
                return  h("span","密钥管理");
              }
              case 3: {
                return  h("span","备份恢复");
              }
              case 4: {
                return  h("span","系统管理");
              }
              case 5: {
                return  h("span","服务管理");
              }
            }
          }
        },
        {
          title: "日志内容",
          key: "content"
        },
        {
          title: "操作时间",
          key: "date"
        }
        // {
        //   title: "操作",
        //   slot: "action"
        // }
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
        ],
        sysRoleId: [
          {
            required: true,
            message: "请选择用户角色",
            type: "number",
            trigger: "change"
          }
        ],
        passwd: [
          { required: true, message: "重置密码不能为空", trigger: "blur" }
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
    changeLogType(value) {
      this.queryParams.type = value;
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.logList;
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

<style>
</style>
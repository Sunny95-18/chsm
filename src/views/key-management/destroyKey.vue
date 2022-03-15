<template>
  <div>
    <Card :bordered="false" dis-hover>
      <List border size="large">
        <ListItem>
          <h3>初始化密码机</h3>
        </ListItem>
        <ListItem style="color:red">该操作将会销毁所有密钥信息和权限信息,请谨慎处理。</ListItem>
        <ListItem>如果您确定销毁所有密钥,请点击确认按钮。</ListItem>
        <ListItem>
          <Poptip
            style="marginLeft:30%"
            confirm
            title="确认销毁密码机内所有密钥信息?"
            @on-ok="destroyKey"
            @on-cancel="cancel"
          >
            <Button type="success">初始化密码机</Button>
          </Poptip>
        </ListItem>
      </List>
    </Card>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {};
  },
  created() {
    // this.loadData();
  },
  methods: {
    ...common.methods,
    loadData() {
      this.$store.commit("demoPages", this.queryParams);
    },
    destroyKey() {
        this.$Message.info('销毁');
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.asymmetricKey;
    }
  },
  mounted() {},
  watch: {
    $route() {}
  }
};
</script>
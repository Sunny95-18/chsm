<template>
  <Tabs value="sm2List">
    <TabPane label="SM2密钥列表" name="sm2List">
      <sm2List></sm2List>
    </TabPane>
    <TabPane label="RSA密钥列表" name="rsaList">
      <rsaList></rsaList>
    </TabPane>
    <TabPane label="对称密钥列表" name="symmetryList">
      <symmetryList></symmetryList>
    </TabPane>
    <TabPane label="私钥授权码" name="authCode">
      <authCode></authCode>
    </TabPane>
  </Tabs>
</template>
<script>
import common from "@/utils/common";
import backup from "./compoments/backup";
import recovery from "./compoments/recovery";
import sm2List from "./compoments/sm2";
import rsaList from "./compoments/rsa";
import symmetryList from "./compoments/symmetry"
import authCode from "./compoments/authCode"
export default {
  components: { backup, recovery, sm2List, rsaList,symmetryList,authCode },
  data() {
    return {};
  },
  created() {},
  methods: {
    ...common.methods,
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.keyManagement;
    },
  },
  mounted() {},
  watch: {
    $route() {},
  },
};
</script>
<template>
  <div id="app" class="app-main">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    //关闭浏览器清空token
    // window.onunload  = function(e) {
    //   // window.localStorage.removeItem("c");
    // //  Cookies.remove("Authorization");
    // //  sessionStorage.removeItem(Authorization);
    // };
    let that = this;
    window.onresize = function() {
      that.$store.commit("setDocumentBodyClientSize");
    };
    // 解决ie下面高度加载问题
    this.$nextTick(() => {
      that.$store.commit("setDocumentBodyClientSize");
    });
  }
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
</style>
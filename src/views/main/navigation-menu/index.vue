<template>
  <div style="height: 100%;width: 100%;background:rgb(73, 80, 96)">
    <!---系统的logo模块-->
    <div class="logo-con" style="padding-top: 20px;">
      <!--展开logo-->
      <div v-show="!shrink" class="layout-logo">
        <img style="border-radius:4px;height:55px;" src="@/views/images/logo-2.png">
      </div>
      <!--折叠logo-->
      <div v-show="shrink" class="collapsed-logo-bg" key="min-logo" />
    </div>
    <div style="padding-bottom: 25px;text-align: center;">
      <h2 v-show="!shrink" style="color:white">签名验签服务器管理系统</h2>
    </div>

    <!--导航菜单-->
    <div v-show="!shrink" style="overflow-x:hidden;width:285px;overflow-y:auto;height:calc(100% - 130px);">
      <sidebar-menu :iconSize="iconSize" :openNames="openNames" :menuList="menuList" @on-change="changeMenu"></sidebar-menu>
    </div>
    <collapsed-menu v-show="shrink" :menuList="menuList" @on-change="changeMenu"></collapsed-menu>
   
  </div>
</template>

<script>

import sidebarMenu from "./sidebar-menu"
import collapsedMenu from "./collapsed-menu"

export default {
  name: "navigation-menu",
  components: {
    sidebarMenu,
    collapsedMenu
  },
  props: {
    shrink: Boolean,
    menuList: Array,
    iconSize: Number,
    openNames: {
      type: Array
    }
  },
  methods: {
    changeMenu(active) {
      this.$emit("on-change", active);
    }
  },
  computed: {
  },
  updated() {
  }
};
</script>

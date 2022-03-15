<style lang="less">
@import "./main.less";
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div
      class="sidebar-menu-con"
      :style="{width: shrink?'60px':'256px', overflow: shrink ? 'visible' : 'hidden'}"
    >
      <navigation-menu
        :shrink="shrink"
        :open-names="openNames"
        :menuList="menuList"
        @on-change="onChange"
        :isVmList="isVmList"
      ></navigation-menu>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'256px'}">
      <div class="main-header">
        <div class="navicon-con" style="margin-left: 15px;">
          <Icon
            :style="{marginTop: '12px',cursor:'pointer',transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}"
            @click.native="toggleClick"
            type="md-menu"
            size="24"
          ></Icon>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <template>
              <Breadcrumb>
                <BreadcrumbItem v-for="item in currentPath" :to="item.path" :key="item.name">
                  <Icon v-if="item.icon" :type="item.icon"></Icon>
                  {{ item.title }}
                </BreadcrumbItem>
              </Breadcrumb>
            </template>
          </div>
        </div>

        <div class="header-avator-con">
          <!--
          <theme-switch></theme-switch>
          -->
          <!-- <div style="float:left;marginTop:20px">
            <h3>当前IP:{{ip}}</h3>
          </div> -->
          <div class="user-dropdown-menu-con">
            <user :type="type" />
          </div>
        </div>
      </div>

      <div class="tags-con">
        <tabs :pageTagsList="pageTagsList" :beforePush="beforePush"></tabs>
      </div>
    </div>

    <div class="single-page-con" :style="{left: shrink?'60px':'256px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>

    <div style="display:none;">
      <iframe id="hiddenTarget" name="hiddenTarget" style="display:none;"></iframe>
    </div>
  </div>
</template>
<script>
import navigationMenu from "@/views/main/navigation-menu/";

import user from "./user/";
import tabs from "@/views/main/tabs/Tabs";
export default {
  components: {
    navigationMenu,
    user,
    tabs
  },
  data() {
    return {
      shrink: false,
      isFullScreen: false,
      type: 2,
      isVmList: false
    };
  },
  created() {
    // this.getIp();
  },
  computed: {
    ip() {
      return this.$store.state.user.vmIp;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    menuList() {
      return this.$store.getters.menus;
    },
    openNames() {
      return this.$store.state.app.openNames;
    },
    currentPath() {
      return this.$store.state.app.currentPath;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    }
  },
  methods: {
    getIp() {
      this.$store.commit("getVmIp");
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    beforePush(target) {
      let name = target;
      if (typeof target == "object") {
        name = target.name;
      }
      var targetRoute = this.$store.state.app.pathMapping[name];
      if (targetRoute) {
        // 如果当前路由就是name
        if (this.$route.name == name) {
          return false;
        }
        if (targetRoute.children && !targetRoute.meta.pushable) {
          return false;
        }
      }
      return true;
    },
    onChange(name) {
      // 判断name对应的路由是否存在
      let willpush = true;
      if (this.beforePush !== undefined) {
        if (!this.beforePush(name)) {
          willpush = false;
        }
      }
      if (willpush) {
        this.$router.push({
          name: name
        });
      }
    }
  },
  mounted() {
    this.$store.commit("setOpenName", this.$route.name);
    this.$store.commit("setCurrentPath", this.$route.name);
    this.$store.commit("openNewTab", this.$route.name);
  },
  watch: {
    $route(to) {
      this.$store.commit("setOpenName", to.name);
      // 更新路径
      this.$store.commit("setCurrentPath", to.name);
      // 更新标签
      this.$store.commit("openNewTab", to.name);
      this.$store.commit("setCurrentPageName", to.name);
      localStorage.currentPageName = to.name;
    }
  }
};
</script>
<style>
</style>

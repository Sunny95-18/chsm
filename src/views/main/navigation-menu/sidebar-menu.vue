<template>
  <Menu
      ref="sideMenu"
      theme="dark"
      :active-name="$route.name"
      :open-names="openNames"
      width="auto"
      accordion
      @on-select="changeMenu"
    >
      <template v-for="item in menuList">
        <MenuItem
          v-if="item.children.length<=1 && !item.children[0].children"
          :name="item.children[0].name"
          :key="'menuitem' + item.name"
        >
          <Icon
            :type="item.children[0].icon || item.icon"
            :size="iconSize"
            :key="'menuicon' + item.name"
          ></Icon>
          <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item.children[0]) }}</span>
        </MenuItem>
        <Submenu v-if="item.children.length > 1 || item.children[0].children" :name="item.name" :key="item.name">
          <template slot="title">
            <Icon :type="item.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{ itemTitle(item) }}</span>
          </template>
          <template v-for="child in item.children">
            <MenuItem v-if="!child.children" :name="child.name" :key="'menuitem' + child.name">
              <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
              <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
            </MenuItem>

            <!--如果要支持任意级菜单 需要单独封装一个组件实现递归 这里暂时只支持3级菜单-->
            <Submenu v-else :name="child.name" :key="'menuitem' + child.name">
                <template slot="title">
                  <Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                  <span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                </template>

                <MenuItem v-for="child2 in child.children" :name="child2.name" :key="'menuitem' + child2.name">
                  <Icon :type="child2.icon" :size="iconSize" :key="'icon' + child2.name"></Icon>
                  <span class="layout-text" :key="'title' + child2.name">{{ itemTitle(child2) }}</span>
                </MenuItem>
            </Submenu>

          </template>
        </Submenu>
      </template>
    </Menu>
</template>

<script>

export default {
  name: "sidebarMenu",
  props: {
    shrink: Boolean,
    menuList: Array,
    iconSize: Number,
    openNames: {
      type: Array
    }
  },
  data() {
    return {
      iconColor: "white"
    };
  },
  created() {
  },
  methods: {
    changeMenu(active) {
      this.$emit("on-change", active);
    },
    itemTitle(item) {
      if (typeof item.title === "object") {
        return this.$t(item.title.i18n);
      } else {
        return item.title;
      }
    }
  },
  computed: {
    menuTheme() {
      return this.theme.menuTheme;
    },
    theme() {
      return this.$store.state.common.currentTheme;
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  }
};
</script>
<template>
  <div>
  
    <div v-for="(item, index) in menuList" :key="index">
      <Dropdown placement="right-start" @on-click="changeMenu">
          <div style="width: 70px;margin-left: -5px;padding:10px 0;text-align: center;" type="text">
              <Tooltip v-if="item.children.length == 1" theme="light" placement="right-start" :content="item.children[0].title || item.title">
                <Icon :size="20" :type="item.children[0].icon || item.icon" @click.native="changeMenu(item.children[0].name)"></Icon>
              </Tooltip>
              <Icon v-else :size="20" :type="item.icon"></Icon>
          </div>
          <DropdownMenu v-if="item.children.length > 1" slot="list">
              <template v-for="(child,i) in item.children">
                  <DropdownItem v-if="!child.children" :key="i" :name="child.name">
                    <Icon type="ios-key"></Icon>
                    <span style="padding-left:10px;">{{ itemTitle(child) }}</span>
                  </DropdownItem>
                  <Dropdown v-else :key="i" placement="right-start">
                      <DropdownItem :name="child.name">
                        <Icon type="ios-key"></Icon>
                        <span style="padding-left:10px;">{{ itemTitle(child) }}</span>
                        <Icon style="padding-left:5px;" type="ios-arrow-forward"></Icon>
                      </DropdownItem>
                      <DropdownMenu slot="list">
                          <DropdownItem v-for="(child2,j) in child.children" :key="j" :name="child2.name">{{ itemTitle(child2) }}</DropdownItem>
                      </DropdownMenu>
                  </Dropdown>
              </template>
          </DropdownMenu>
      </Dropdown>
    </div>
    
  </div>
</template>
<script>
export default {
  name: "CollapsedMenu",
  props: {
    menuList: Array,
    openNames: {
      type: Array
    }
  },
  data() {
    return {
    };
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
  }
};
</script>

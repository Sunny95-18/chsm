<template>
  <div
    ref="scrollCon"
    @DOMMouseScroll="handlescroll"
    @mousewheel="handlescroll"
    class="tags-outer-scroll-con"
  >
    <div class="close-all-tag-con">
      <Dropdown id="tags-dropdown" transfer @on-click="handleTagsOption">
        <div id="ttttt">
          <Icon type="ios-arrow-down" size="16"/>
        </div>
        <DropdownMenu slot="list">
          <DropdownItem name="clearAll">
            <Icon type="ios-close-circle" />
            <span style="padding-left:10px;">关闭所有</span>
          </DropdownItem>
          <DropdownItem name="clearOthers">
            <Icon type="ios-close-circle" />
            <span style="padding-left:10px;">关闭其他</span>
          </DropdownItem>

          <!--
          <DropdownItem name="clearLeft" divided>
            <Icon type="md-close-circle" />
            <span style="padding-left:10px;">关闭左侧</span>
          </DropdownItem>
          <DropdownItem name="clearRight">
            <Icon type="md-close-circle" />
            <span style="padding-left:10px;">关闭右侧</span>
          </DropdownItem>
          
          <template v-for="(item,i) in pageTagsList">
            <DropdownItem
              :key="i"
              :selected="item.name == currentPageName"
              @click.native="linkTo(item)"
              :divided="i == 0"
              :name="item.name"
            >
              <Icon :type="item.icon"></Icon>
              <span style="padding-left:10px;">{{item.title}}</span>
            </DropdownItem>
          </template>
          -->
        </DropdownMenu>
      </Dropdown>
    </div>
    <div ref="scrollBody" class="tags-inner-scroll-body" :style="{left: tagBodyLeft + 'px'}">
      <transition-group name="taglist-moving-animation">
        <Tag
          ref="tagsPageOpened"
          type="dot"
          v-for="(item) in pageTagsList"
          :key="item.name"
          :name="item.name"
          @on-close="closePage"
          @click.native="linkTo(item)"
          :closable="item.name==='home_index'?false:true"
          :color="item.children?(item.children[0].name===currentPageName?'primary':'default'):(item.name===currentPageName?'primary':'default')"
        >{{ itemTitle(item) }}</Tag>
      </transition-group>
    </div>
  </div>
</template>

<script>
//import Vue from "vue";
//import VueI18n from "vue-i18n";
//Vue.use(VueI18n);

const OFFSET_WIDTH = 80;

export default {
  name: "tabs",
  data() {
    return {
      currentPageName: this.$route.name,
      tagBodyLeft: 0,
      refsTag: [],
      tagsCount: 1
    };
  },
  props: {
    pageTagsList: Array,
    beforePush: {
      type: Function,
      default: item => {
        return true;
      }
    }
  },
  computed: {
    title() {
      return this.$store.state.app.currentTitle;
    },
    tagsList() {
      return this.$store.state.app.pageOpenedList;
    }
  },
  methods: {
    itemTitle(item) {
      if (typeof item.title === "object") {
        return this.$t(item.title.i18n);
      } else {
        return item.title;
      }
    },
    closePage(event, name) {
      let pageOpenedList = this.$store.state.app.pageOpenedList;
      let lastPageObj = pageOpenedList[0];
      if (this.currentPageName === name) {
        let len = pageOpenedList.length;
        for (let i = 1; i < len; i++) {
          if (pageOpenedList[i].name === name) {
            if (i < len - 1) {
              lastPageObj = pageOpenedList[i + 1];
            } else {
              lastPageObj = pageOpenedList[i - 1];
            }
            break;
          }
        }
      } else {
        let tagWidth = event.target.parentNode.offsetWidth;
        this.tagBodyLeft = Math.min(this.tagBodyLeft + tagWidth, 0);
      }
      this.$store.commit("removeTag", name);
      this.$store.commit("closePage", name);
      pageOpenedList = this.$store.state.app.pageOpenedList;
      localStorage.pageOpenedList = JSON.stringify(pageOpenedList);
      if (this.currentPageName === name) {
        this.linkTo(lastPageObj);
      }
    },
    linkTo(item) {
      let routerObj = {};
      routerObj.name = item.name;
      if (item.argu) {
        routerObj.params = item.argu;
      }
      if (item.query) {
        routerObj.query = item.query;
      }
      if (this.beforePush(item)) {
        this.$router.push(routerObj);
      }
    },
    handlescroll(e) {
      var type = e.type;
      let delta = 0;
      if (type === "DOMMouseScroll" || type === "mousewheel") {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      let left = 0;
      if (delta > 0) {
        left = Math.min(0, this.tagBodyLeft + delta);
      } else {
        if (
          this.$refs.scrollCon.offsetWidth - OFFSET_WIDTH <
          this.$refs.scrollBody.offsetWidth
        ) {
          if (
            this.tagBodyLeft <
            -(
              this.$refs.scrollBody.offsetWidth -
              this.$refs.scrollCon.offsetWidth +
              OFFSET_WIDTH
            )
          ) {
            left = this.tagBodyLeft;
          } else {
            left = Math.max(
              this.tagBodyLeft + delta,
              this.$refs.scrollCon.offsetWidth -
                this.$refs.scrollBody.offsetWidth -
                OFFSET_WIDTH
            );
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
      this.tagBodyLeft = left;
    },
    handleTagsOption(type) {
      if (type === "clearAll") {
        this.$store.commit("clearAllTags");
        this.$router.push({
          name: "home_index"
        });
        this.tagBodyLeft = 0;
      } else if (type === "clearOthers") {
        this.$store.commit("clearOtherTags", this);
        this.tagBodyLeft = 0;
      } else {
        // 跳转到指定
        // this.$store.commit('openNewTab', type,this.$route.params || {}, this.$route.query || {});
      }
    },
    moveToView(tag) {
      if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + 10;
      } else if (
        tag.offsetLeft + 10 > -this.tagBodyLeft &&
        tag.offsetLeft + tag.offsetWidth <
          -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - OFFSET_WIDTH
      ) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(
          0,
          this.$refs.scrollCon.offsetWidth -
            OFFSET_WIDTH -
            tag.offsetWidth -
            tag.offsetLeft -
            20
        );
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(
          tag.offsetLeft -
          (this.$refs.scrollCon.offsetWidth - OFFSET_WIDTH - tag.offsetWidth) +
          20
        );
      }
    }
  },
  mounted() {
    this.refsTag = this.$refs.tagsPageOpened;
    setTimeout(() => {
      this.refsTag.forEach((item, index) => {
        if (this.$route.name === item.name) {
          let tag = this.refsTag[index].$el;
          this.moveToView(tag);
        }
      });
    }, 1); // 这里不设任务就会有偏移bug
    this.tagsCount = this.tagsList.length;
  },
  watch: {
    $route(to) {
      this.currentPageName = to.name;
      this.$nextTick(() => {
        this.refsTag.forEach((item, index) => {
          if (to.name === item.name) {
            let tag = this.refsTag[index].$el;
            this.moveToView(tag);
          }
        });
      });
      this.tagsCount = this.tagsList.length;
    }
  }
};
</script>

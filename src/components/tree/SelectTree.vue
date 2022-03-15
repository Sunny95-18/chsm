<template>
  <div class="ivu-select ivu-select-single ivu-select-default" :style="style">
    <div
      class="ivu-select-selection"
      @click="toggleClick"
      :class="{'ivu-select-visible' : visible}"
      @
    >
      <input type="hidden" />
      <span v-show="!currentValue" class="ivu-select-placeholder">请选择</span>
      <span v-show="currentValue" class="ivu-select-selected-value">{{currentText}}</span>
      <!---->
      <i class="ivu-icon ivu-icon-ios-close-circle ivu-select-arrow" @click.stop="clear"></i>
    </div>
    <!---->
    <template v-if="treeType == 'pop'">
      <Modal v-model="visible" title="请选择" footer-hide :width="width || 800">
        <div :style="style">
          <BaseTree
            ref="tree"
            :url="url"
            :model="model"
            :idKey="idKey"
            :titleKey="titleKey"
            :parent-key="parentKey"
            :show-tools="showTools"
            :show-icon="showIcon"
            @click="triggerNodeClick"
          />
        </div>
      </Modal>
    </template>
    <template v-else>
      <div
        v-show="visible"
        class="ivu-select-dropdown"
        style="overflow:hidden;width: 100%; transform-origin: center bottom 0px;will-change: top, left; top: 33px; left: 0px;padding-left:8px;padding-right:8px;"
        x-placement="top"
      >
        <BaseTree
          ref="tree"
          :url="url"
          :model="model"
          :id-key="idKey"
          :title-key="titleKey"
          :parent-key="parentKey"
          :show-tools="showTools"
          :show-icon="showIcon"
          @on-load-success="onLoadSuccess"
          @click="triggerNodeClick"
        />
      </div>
    </template>
  </div>
</template>

<script>
let propTypes = {
  boolTrue: {
    type: Boolean,
    default: true
  },
  boolFalse: {
    type: Boolean,
    default: false
  }
};

import BaseTree from "./BaseTree";
export default {
  components: {
    BaseTree
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    // 定义数据的哪个字段作为tree的id，默认id
    idKey: {
      type: [String, Number],
      default: "id"
    },
    // 定义数据的哪个字段作为tree的pid，数据风格为raw时使用
    parentKey: {
      type: [String, Number],
      default: "pid"
    },
    // 定义数据的哪个字段作为显示节点名称，默认title
    titleKey: {
      type: String,
      default: "title"
    },
    // 默认下拉数，可选combo和pop
    treeType: {
      type: String,
      default: "combo"
    },
    // 是否显示工具栏
    showTools: propTypes.boolTrue,
    // 是否显示过滤组件
    showFilter: propTypes.boolTrue,
    // 是否显示展开按钮
    showExpandBtn: propTypes.boolTrue,
    // 是否显示折叠按钮
    showCollapseBtn: propTypes.boolTrue,
    // 显示图标
    showIcon: propTypes.boolTrue,

    width: Number,
    height: Number,
    value: [String, Number],
    url: String,
    model: Array
  },
  data() {
    return {
      currentText: null,
      currentValue: null,
      visible: false,
      style: {},
      showClearIcon: false,
      treeData: null
    };
  },
  created() {
    if (this.height && this.height > 0) {
      this.$set(this.style, "height", this.height + "px");
    }
    if (this.treeType == "combo") {
      this.$set(this.style, "position", "relative");
      if (this.width && this.width > 0) {
        this.$set(this.style, "width", this.width + "px");
      }
    }
  },
  mounted() {
    if (this.value) {
      // if default value initing v-model value
      // this.$emit('input', this.value);
      this.setCurrentValue(this.value);
    }
  },
  methods: {
    clear() {
      this.$emit("on-clear");
      this.$emit("input", null);
      this.setCurrentValue(null);
      this.clearSelected();
    },
    triggerBlur() {
      this.visible = false;
    },
    setCurrentValue(val) {
      if (this.currentValue != val) {
        this.currentValue = val;
      }
      // 获取currentText
      var element = this.doFind(val);
      if (element) {
        this.currentText = element[this.titleKey];
      }
      this.visible = false;
    },
    doFind(val) {
      let treeData = this.$refs.tree.getTreeData();
      return (
        Array.isArray(treeData) &&
        treeData.find(item => item[this.idKey] == val)
      );
    },
    getSelected() {
      return this.$refs.tree.getSelectedNodes();
    },
    clearSelected() {
      this.$refs.tree.select(null);
    },
    load() {
      this.$nextTick(() => {
        this.$refs.tree.load();
      });
    },
    // 远程加载完成，设置初始值
    onLoadSuccess() {
      if (this.value) {
        this.setCurrentValue(this.value);
      }
    },
    toggleClick() {
      if (this.readonly) {
        this.visible = false;
      } else {
        this.visible = !this.visible;
        if (this.visible) {
          // 选中节点
          this.$refs.tree.select(this.currentValue);
        }
      }
    },
    triggerNodeClick(currentNode) {
      var value = currentNode[this.idKey];
      // 设置值
      this.currentValue = value;
      // 回写值，并关闭
      this.$emit("input", value);
      // 文本显示
      this.currentText = currentNode[this.titleKey];
      // 选择树节点后关闭弹出框
      this.visible = false;
    }
  },
  watch: {
    url(url) {
      setTimeout(() => {
        this.load();
      }, 200);
    },
    value(val) {
      this.setCurrentValue(val);
    },
    data(val) {
      if (val) {
        this.storeData = JSON.parse(JSON.stringify(val));
        this.treeData.splice(0, this.treeData.length);
        this.treeData.push(...val);
      }
    }
  }
};
</script>

<style scoped>
.ivu-select-selection .ivu-icon-ios-close-circle {
  display: none;
}
.ivu-select-selection:hover .ivu-icon-ios-close-circle {
  display: block;
}
</style>
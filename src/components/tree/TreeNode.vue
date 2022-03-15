<template>
  <span style="display: inline-block; width: calc(100% - 48px);">
    <span>
      <Icon :type="icon" style="margin-right: 8px;" />
      <span
        v-if="!editing"
        class="ivu-tree-title"
        :class="{'ivu-tree-title-selected' : data.selected}"
        @click.stop="clickTreeNode"
        @dblclick.stop="dblclickTreeNode"
      >{{data[titleKey]}}</span>
      <!--
            <span v-else class="ivu-tree-title">
                <Input ref="input" v-model="data.title" autofocus size="small" @on-blur="editing = false"/>
            </span>
      -->
    </span>

    <span v-if="tree.editable" style="display: inline-block; float: right; margin-right: 24px;">
      <Button type="default" size="small" icon="md-add" @click.stop="append"></Button>
      <Button type="default" size="small" icon="md-create" @click.stop="edit"></Button>
      <Button type="default" size="small" icon="md-remove" @click.stop="remove"></Button>
    </span>
  </span>
</template>

<script>
export default {
  props: {
    root: [Object, Array],
    node: Object,
    data: Object,
    tree: Object
  },
  data() {
    return {
      idKey: null,
      parentKey: null,
      childrenKey: null,
      titleKey: null,
      selected: false,
      editing: false,
      showIcon: false,
      folderIcon: null,
      leafIcon: null
    };
  },
  created() {
    if (this.tree) {
      // id key
      this.idKey = this.tree.idKey;
      // 父节点key
      this.parentKey = this.tree.parentKey;
      // 子节点key
      this.childrenKey = this.tree.childrenKey;
      this.titleKey = this.tree.titleKey;
      // icon设置
      this.showIcon = this.tree.showIcon;
      this.folderIcon = this.tree.folderIcon;
      this.leafIcon = this.tree.leafIcon;
    }
    if (!this.data.selected) {
      this.$set(this.data, "selected", false);
    }
  },
  methods: {
    append() {
      this.tree.dispatchBuiltInEvent("on-add", this.data);
    },
    edit() {
      this.tree.dispatchBuiltInEvent("on-edit", this.data);
    },
    remove() {
      this.tree.dispatchBuiltInEvent("on-delete", this.data);
    },
    clickTreeNode() {
      this.tree.$emit("click", this.data);

      // 选中问题,如何传播事件给其他节点清除选中
      // 暂时只操作数据
      // 获取当前树选中的节点
      var highlightSelected = this.tree.highlightSelected;
      if (highlightSelected && highlightSelected != this.data) {
        delete highlightSelected.selected;
        this.$set(highlightSelected, "selected", false);
      }
      var selected = !this.data.selected;
      this.$set(this.data, "selected", selected);
      this.tree.highlightSelected = this.data.selected ? this.data : null;
    },
    dblclickTreeNode() {
      this.tree.$emit("dblclick", this.data);
    }
  },
  computed: {
    icon() {
      if (!this.showIcon) return "";
      if (this.data.icon) {
        return this.data.icon;
      }
      const children = this.data[this.childrenKey] || [];
      if (children.length > 0) {
        return this.folderIcon;
      } else {
        return this.leafIcon;
      }
    }
  },
  watch: {}
};
</script>

<template>
  <div :style="style">
    <div v-if="showTools" style="margin-bottom:5px;">
      <Input
        v-if="showFilter"
        placeholder="输入过滤"
        style="width:200px;"
        size="small"
        @input="filter"
      />&nbsp;
      <Button
        v-if="showExpandBtn"
        type="default"
        title="全部展开"
        size="small"
        icon="md-expand"
        @click="doExpandAll"
      ></Button>&nbsp;
      <Button
        v-if="showCollapseBtn"
        type="default"
        title="全部折叠"
        size="small"
        icon="ios-expand"
        @click="doCollapseAll"
      ></Button>&nbsp;
      <Button
        v-if="url != null"
        type="default"
        title="刷新"
        size="small"
        icon="md-refresh"
        @click="reload"
      ></Button>
      <Button
        v-if="editable"
        type="default"
        size="small"
        icon="md-add"
        @click.stop="$emit('on-add');"
      ></Button>
    </div>
    <Tree
      ref="tree"
      :data="data"
      :render="render"
      :load-data="asyncload"
      :show-checkbox="showCheckbox"
      :multiple="multiple"
    ></Tree>
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

import treeNode from "./TreeNode";
export default {
  name: "base-tree",
  props: {
    // 动态数据url 【远程加载使用】
    url: String,
    // 查询参数 【远程加载使用】
    query: [String, Object],
    // GET 或 POST 【远程加载使用】
    method: {
      type: String,
      default: "GET"
    },
    // 是否异步加载数据 【远程加载使用】
    async: propTypes.boolFalse,
    // 读取属性,如果为空，读取整个json 【远程加载使用】
    readProperty: {
      type: String,
      default: "data"
    },
    // 虚拟根目录名称（树的基点）
    virtualRoot: String,
    // 是否显示工具栏
    showTools: propTypes.boolTrue,
    // 是否显示过滤组件
    showFilter: propTypes.boolTrue,
    // 是否显示展开按钮
    showExpandBtn: propTypes.boolTrue,
    // 是否显示折叠按钮
    showCollapseBtn: propTypes.boolTrue,
    // 工具栏显示项
    toolOptions: Array,
    // 是否显示编辑相关按钮
    editable: propTypes.boolFalse,
    saveMethodName: [String, Function],
    // 支持多选
    multiple: propTypes.boolFalse,
    // 显示复选框
    showCheckbox: propTypes.boolFalse,
    // 是否显示图标
    showIcon: propTypes.boolFalse,
    // 宽度
    width: Number,
    // 高度
    height: Number,
    // 是否默认展开（数据没有指定expand的时候）
    expandAll: propTypes.boolTrue,
    // 文件夹图标
    folderIcon: {
      type: String,
      default: "ios-folder-outline"
    },
    // 叶子节点图标
    leafIcon: {
      type: String,
      default: "ios-paper-outline"
    },
    // 空数据显示
    emptyText: {
      type: String,
      default: "暂无数据"
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
    // 定义数据的哪个字段作为子节点，默认children
    childrenKey: {
      type: String,
      default: "children"
    },
    // 定义数据的类型风格，可选： tree,raw
    dataType: {
      type: String,
      default: "raw"
    },
    // 支持静态模型数据
    model: Array
  },
  data() {
    return {
      style: {},
      _emptyText: "暂无数据",
      changes: [],
      storeTreeData: [],
      // 全部展开和全部折叠需要使用完整的storeArrData重新刷新树数据，但需要保持备份，指针引用
      storeArrData: [],
      storeRawData: [],
      editing: false,
      treeMeta: [],
      highlightSelected: null,
      selectNode: {},
      data: []
    };
  },
  created() {
    if (this.width && this.width > 0) {
      this.$set(this.style, "width", this.width + "px");
    }
    if (this.height && this.height > 0) {
      this.$set(this.style, "height", this.height + "px");
    }
    this._emptyText = this.emptyText;

    // 优先加载url
    if (this.url) {
      this.load();
    } else if (this.model) {
      // 静态数据加载
      var arr = JSON.parse(JSON.stringify(this.model));
      this.storeData(arr);
    }
  },
  
  methods: {
    getOriginalTree() {
      return this.$refs.tree;
    },
    load() {
      var params = {
        treeIdKey: this.idKey,
        treeParentKey: this.parentKey,
        t: new Date().getTime()
      };

      if (this.async) {
        params.async = true;
      }
      const otherParams = {};
      this.$emit("on-load-before", otherParams);
      Object.assign(params, otherParams);

      this.doRequest(params, result => {
        // this.flushMeta(result);
        this.$emit("on-load", result);
        this.loadData(result);
        this.$emit("on-load-success", result);
      });
    },
    doRequest(params, callback) {
      // 动态url请求数据
      if (!this.method || this.method == "GET") {
        var query = "";
        if (this.query) {
          query = "?" + this.query;
        }
        axios
          .get(this.url + query, {
            params: params
          })
          .then(res => {
            callback(res.data);
          })
          .catch(function(error) {
            console.trace(error);
            //alert(error);
          });
      } else if (this.method == "POST") {
        var queryParams = qs.stringify(params);
        if (this.query) {
          queryParams += "&" + this.query;
        }
        axios
          .post(this.url, queryParams)
          .then(res => {
            callback(res.data);
          })
          .catch(function(error) {
            console.trace(error);
            //alert(error);
          });
      }
    },
    loadData(result) {
      var arr = null;
      if (Array.isArray(result || [])) {
        arr = result;
      } else {
        if (this.readProperty) {
          arr = result && result[this.readProperty];
        }
      }
      this.storeData(arr);
    },
    storeData(arr) {
      // 不管远程还是本地加载饿数据，只在初始化调用一次
      // 后续调用直接使用setTreeData
      this.storeRawData = JSON.parse(JSON.stringify(arr));
      this.setTreeData(arr);
    },
    getTreeData() {
      return this.storeRawData;
    },
    select(val) {
      // storeArrData保留指针引用，遍历即可
      if (!val) {
        if (this.highlightSelected) {
          this.$set(this.highlightSelected, "selected", false);
          this.highlightSelected = null;
        }
      } else {
        var element = this.storeArrData.find(item => item[this.idKey] == val);
        if (element) {
          if (this.highlightSelected) {
            // this.highlightSelected.selected = false;
            this.$set(this.highlightSelected, "selected", false);
          }
          // element.selected = true;
          this.$set(element, "selected", true);
          this.highlightSelected = element;
        } else {
          this.highlightSelected = null;
        }
      }
    },
    getHighlightSelected() {
      return this.highlightSelected;
    },
    getSelectedNodes() {
      return this.$refs.tree.getSelectedNodes();
    },
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    // 当节点的loading为false时，如果子节点为空 ，点击展开会触发此方法 异步加载
    asyncload(node, callback) {
      var params = {
        async: this.async,
        treeIdKey: this.idKey,
        treeParentKey: this.parentKey,
        treeDataCode: this.treeDataCode,
        t: new Date().getTime()
      };
      Object.assign(params, node);
      this.doRequest(params, result => {
        var arr = null;
        if (this.readProperty) {
          arr = result && result[this.readProperty];
        } else {
          arr = result;
        }
        // 初始化异步加载的数据
        this.initialState(arr);
        // 渲染
        callback(arr);
        // 更新store
        this.flushStore();
      });
    },
    filter(value) {
      var tmp = JSON.parse(JSON.stringify(this.storeTreeData));
      var arr = this.doFilter(value, tmp);
      this.data.length = 0;

      // 过滤时同步数据（展开和折叠2个按钮需要）
      this.storeArrData.length = 0;
      this.initialState(arr);

      this.data.push(...arr);
    },
    doFilter(value, arr) {
      return arr.filter(item => {
        var text = item[this.titleKey];
        var matched = text.indexOf(value) > -1;
        if (item[this.childrenKey]) {
          var children = item[this.childrenKey];
          var filterArr = this.doFilter(value, children);
          item[this.childrenKey] = filterArr;
          if (filterArr.length > 0) {
            return true;
          }
        }
        return matched;
      });
    },
    // 重新加载
    reload() {
      this.load();
    },
    clear() {
      this.data.splice(0, this.data.length);
      this.changes.splice(0, this.changes.length);
      this.storeArrData.splice(0, this.storeArrData.length);
      this.storeTreeData.splice(0, this.storeTreeData.length);
    },
    setTreeData(arr) {
      // raw数据中每个数据必须包含idKey和parentKey
      let treeData = [];
      this.clear();
      if (!arr || arr.length == 0) {
        return;
      }
      if (this.dataType == "raw") {

        this.rendering = true;

        let rootNode = null;
        if (this.virtualRoot && this.virtualRoot.length > 0) {
          rootNode = {};
          rootNode[this.titleKey] = this.virtualRoot;
          rootNode[this.idKey] = -1;
          rootNode[this.childrenKey] = [];
          // 唯一单节点
          treeData.push(rootNode);
        }

        try {
          let nodeMap = {};
          let key = this.idKey;
          arr.forEach(item => {
            let id = item[key];
            if (!id) {
              throw new Error("数据中必须指定key【" + key + "】");
            }
            nodeMap[id] = item;
          });
          arr.forEach(item => {
            let pid = item[this.parentKey];
            if (nodeMap[pid]) {
              let pnode = nodeMap[pid];
              pnode[this.childrenKey] = pnode[this.childrenKey] || [];
              // 防止数据重复
              if (pnode[this.childrenKey].indexOf(item) == -1) {
                pnode[this.childrenKey].push(item);
              }
            } else {
              if (rootNode) {
                rootNode[this.childrenKey].push(item);
              } else {
                treeData.push(item);
              }
            }
          });
        } catch (e) {
          console.trace(e);
          this._emptyText = "数据渲染错误:  " + e.message + "";
        }

        // 延迟变更状态
        this.$nextTick(() => {
            this.rendering = false;
            this.$emit("on-rendered");
        })

      } else {
        treeData = arr;
      }

      // 初始化每个节点的状态
      this.initialState(treeData);

      // 渲染数据
      this.data.push(...treeData);

      // 原始数据（未修改前的数据）
      this.flushStore();
    },
    flushStore() {
      this.storeTreeData = JSON.parse(JSON.stringify(this.data));
      // this.storeArrData = JSON.parse(JSON.stringify(this.storeArrData));
    },
    render(h, { root, node, data }) {
      let tree = this;
      return h(treeNode, {
        props: { root, node, data, tree }
      });
    },
    initialState(arr) {
      arr.forEach(item => {
        item.$state = 0;
        var children = item[this.childrenKey] || [];
        this.$delete(item, this.childrenKey);
        this.$set(item, this.childrenKey, children);

        if (item.expand !== false && this.expandAll && !this.async) {
          // item.expand = true;
          this.$set(item, "expand", true);
        }

        if (children.length > 0) {
          this.initialState(children);
        }
        // 保存到数组中
        this.storeArrData.push(item);
      });
    },
    doExpandAll() {
      this.storeArrData.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.expand = true;
        }
      });
    },
    doCollapseAll() {
      this.storeArrData.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.expand = false;
        }
      });
    },
    dispatchBuiltInEvent(eventName, data) {
      this.$emit(eventName, data);
    }
  },
  watch: {
    model: {
        handler(model) {
            // 如何重新加载
            console.log(" this.rendering " + this.rendering);
            if(!this.rendering) {
                var arr = JSON.parse(JSON.stringify(model));
                this.storeData(arr);
            }
        },
        deep: true
    }
  }
};
</script>

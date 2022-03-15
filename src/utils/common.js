

import consts from './consts'
import conf from '@/conf/'
export const getOptions = (jsonStructure, keyNames, prop, excludes) => {
    if (typeof (keyNames) !== "string") {
        console.error("参数类型错误:" + keyNames)
        return [];
    }
    var options = [];
    var keys = keyNames.split(",");
    keys.forEach(key => {
        var json = jsonStructure;
        var expr = key + "." + prop;
        try {
            var items = eval("json." + expr);
            if (!items || items.length == 0) {
                console.error("未找到指定的key:" + expr)
            } else {
                options.push(...items);
            }
        } catch (e) {
            // console.log(json);
        }
    });

    if (keys.length == 1 && !excludes) {
        return options;
    } else {
        var values = [];
        if (excludes && Array.isArray(excludes)) {
            values.push(...excludes);
        }
        return options.filter(option => {
            if (values.indexOf(option.value) == -1) {
                values.push(option.value);
                return true;
            }
            return false;
        })
    }
}

export default {
    consts: consts,
    computed: {
        /**
         * 内容高度
         */
        contentHeight() {
            // 在缓存路由时能解决性能开销问题（即使documentBodyClientHeight变化也不会触发updated钩子函数以及虚拟dom渲染）
            if (this.$options.name != this.$route.name) return 0;
            return this.$store.state.common.documentBodyClientHeight - this.offsetTop;
        },
        tableHeight() {
            return this.$store.state.common.documentBodyClientHeight - this.offsetTop;
        },
        /**
         * 时间范围
         */
        compareTime: {
            get() {
                return [
                    this.queryParams.compareBeginTime,
                    this.queryParams.compareEndTime
                ];
            },
            set(daterange) {
                this.$set(this.queryParams, "compareBeginTime", this.toDateString(daterange[0]));
                this.$set(this.queryParams, "compareEndTime", this.toDateString(daterange[1]));
            }
        },
        totalCount() {
            return this.state.totalCount;
        },
        rows() {
            return this.state.rows;
        }
    },
    methods: {
        // 查询函数
        doQuery() {
            this.queryParams.pageNumber = 1;
            this.loadData();
        },
        // 改变分页页码后
        changePage(p) {
            this.queryParams.pageNumber = p;
            this.loadData();
        },
        // 每页数量改变事件
        changePageSize(size) {
            this.queryParams.pageSize = size;
            this.loadData();
        },
        setSelectLabel(args, record, prop) {
            if (args.length > 0 && args[0] && record && prop) {
                record[prop] = args[0].label;
            }
        },
        /**
         * 确认提示框
         * @param {*} title 
         * @param {*} content 
         * @param {*} fn 
         */
        confirmModal(title, content, fn) {
            this.$Modal.confirm({
                title: title,
                content: content,
                onOk: () => {
                    fn();
                }
            });
        },
        /**
         * @description 重置查询条件
         * @param {*} params 
         */
        resetQueryFields() {
            var params = this.queryParams;
            if (params) {
                for (var p in params) {
                    if (p != "pageNumber" && p != "pageSize") {
                        this.$set(params, p, null);
                    }
                }
            }
        },
        /**
         * 获取节点的下拉选项
         * @param {*} reload 是否重新加载
         */
        getNodeOptions() {
            // 从node的store中获取
            var state = this.$store.state.cluster.clusterNode;
            return state.nodeList;
        },
        /**
         * 根据值获取选项的名称
         * @param {*} arr 
         * @param {*} valueKey 
         * @param {*} labelKey 
         * @param {*} value 
         */
        getOptionLabel(arr, valueKey, labelKey, value) {
            if (arr) {
                var f = arr.find(item => item[valueKey || "value"] == value);
                return f && f[labelKey || "label"];
            }
            return null;
        },
        /**
         * 获取字典的label（名称）
         * @param {*} dictName 
         * @param {*} val 
         */
        getDictLabel(dictName, val) {
            var items = this.getDictItems(dictName);
            var item = items.find(item => item.value == val);
            return item ? item.label : null;
        },
        /**
         * @description 根据字典英文名获取字典信息
         *              支持 a.b.c这种格式
         * 
         * @param {*} dictNames 
         */
        getDictItems(dictNames, excludes) {
            if (typeof (dictNames) !== "string") {
                console.error("参数类型错误:" + dictNames)
                return [];
            }
            return getOptions(this.$store.state.dictmanage.dictStructure, dictNames, "items", excludes);
        },
        /**
         * 日期转化为字符串 yyyy-mm-dd HH:mm:ss
         * @param {*} date 
         */
        toDateString(date) {
            if (date == null || date == "") return null;
            var values = [date.getFullYear()];
            values.push("-")
            var month = date.getMonth() + 1;
            if (month < 10) {
                values.push(0);
            }
            values.push(month);
            values.push("-")
            var day = date.getDate();
            if (day < 10) {
                values.push(0);
            }
            values.push(day);
            values.push(" ")

            // yyyy-mm-dd HH:mm:ss
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            values.push((hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds));

            return values.join("");
        },
        /*
         * 将yyyy-mm-dd HH:mm:ss格式的字符串转化为日期
         */
        parseDate(dateStr) {
            if (dateStr == null) return null;
            return new Date(dateStr.replace(/-/g, '/'));
        },
        /**
         * 异步校验，根据返回的响应判定成功和失败
         * 
         * @param {*} config 
         */
        asyncValidator(config) {
            let url = config.url;
            let getValidatorParams = config.getValidatorParams;
            return function (rule, value, callback) {
                if (!value || value == '') {
                    callback();
                    return;
                }
                axios.post(conf.apiServer + url, getValidatorParams()).then(
                    res => {
                        if (res.data.data) {
                            callback(new Error(res.data.data));
                        } else {
                            callback();
                        }
                    }).catch(err => {
                        callback(new Error(err));
                    });
            }
        },
        /**
         * 获取校验参数
         */
        getValidatorParams() {
            return this.record;
        }
    }
}
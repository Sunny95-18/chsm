<template>
  <DatePicker
    v-model="currentValue"
    :type="type"
    :placeholder="placeholder"
    :readonly="readonly"
    @input="handerInput"
    :style="style"
  ></DatePicker>
</template>

<script>
export default {
  name: "combo-datebox",
  props: {
    type: {
      type: String,
      default: "date"
    },
    readonly: Boolean,
    width: Number,
    placeholder: String,
    value: [String, Date]
  },
  data() {
    return {
      // 日期对象
      currentValue: null,
      // 字符串格式类型： 0 不带时分秒， 1带时分秒
      formatType: 0,
      style: {
        width: "216px"
      },
      initValueType: "string"
    };
  },
  created() {
    if (typeof this.value == "date") {
      this.initValueType = "date";
    } else {
      // 如果是字符串日期
      if (this.value) {
        if (/^\d{4}([-/]\d{2}){2} \d{1,2}(:\d{1,2}){1,2}$/.test(this.value)) {
          this.formatType = 1;
        }
        // 初始化
        var val = this.value;
        val = val.replace(/-/g, "/");
        this.currentValue = new Date(val);
      }
      // 强制带时分秒
      if (this.type == "datetime") {
        this.formatType = 1;
      }
    }
    if (this.width && this.width > 0) {
      if (this.width > 100) {
        this.style.width = this.width + "px";
      } else {
        this.style.width = this.width + "%";
      }
    }
  },
  
  methods: {
    setCurrentValue(val) {
      // 设值
      if (!val) {
        this.currentValue = null;
        return;
      }
      if (this.initValueType == "date") {
        if (this.currentValue != val) {
          this.currentValue = val;
        }
      } else if (this.initValueType == "string") {
        // 日期字符串转化为日期对象
        // 判断日期格式是否 yyyy-mm-dd HH:mm:ss
        if (/^\d{4}([-/]\d{1,2}){1,2}( \d{1,2}(:\d{1,2}){1,2})?$/.test(val)) {
          val = val.replace(/-/g, "/");
          this.currentValue = new Date(val);
        } else {
          console.error(
            "日期格式错误:" +
              val +
              ",支持yyyy-mm-dd,yyyy/mm/dd,yyyy-mm-dd HH:mm:ss,yyyy/mm/dd HH:mm:ss"
          );
        }
      }
    },
    handerInput(date) {
      // 数据回写
      var value = null;
      if (date) {
        if (this.initValueType == "string") {
          var month = date.getMonth() + 1;
          month = month < 10 ? "0" + month : month;

          var day = date.getDate();
          day = day < 10 ? "0" + day : day;

          value = date.getFullYear() + "-" + month + "-" + day;
          // 日期转为字符串 暂时固定格式： yyyy-mm-dd 或 yyyy-mm-dd HH:mm:ss
          if (this.formatType) {
            // yyyy-mm-dd HH:mm:ss
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            value +=
              " " +
              (hours < 10 ? "0" + hours : hours) +
              ":" +
              (minutes < 10 ? "0" + minutes : minutes) +
              ":" +
              (seconds < 10 ? "0" + seconds : seconds);
          }
        } else {
          value = date;
        }
      }

      this.$emit("input", value);
    }
  },
  watch: {
    value(val) {
      this.setCurrentValue(val);
    }
  }
};
</script>
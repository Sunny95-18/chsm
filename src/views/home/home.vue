<style lang="less">
@import "./home.less";
</style>
<template>
  <div class="home-bg">
    <Row :gutter="20" style="margin-top: 10px">
      <Col
        span="8"
        v-for="(infor, i) in inforCardData"
        :key="`infor-${i}`"
        style="height: 120px"
      >
        <infor-card
          shadow
          :color="infor.color"
          :icon="infor.icon"
          :icon-size="36"
        >
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </Col>
    </Row>
    <Row :gutter="20" style="margin-top: 20px; height: 300px">
      <Col span="12">
        <Card shadow>
          <h3>设备运行状态</h3>
          <div style="margintop: 20px; margin-left: 20px; margin-top: 30px">
            CPU利用率： {{ cpu }}% of 4 CPU(s)
            <Progress
              v-if="cpu <= 20"
              :percent="cpu"
              :stroke-color="['#0f0', '#0f0']"
            />
            <Progress
              v-else-if="cpu > 20 && cpu <= 80"
              :percent="cpu"
              :stroke-color="['#0f0', '#f78603']"
            />
            <Progress
              v-else
              :percent="cpu"
              :hide-info="true"
              :stroke-color="['#0f0', '#FF0000']"
            />
          </div>
          <div style="margintop: 40px; margin-left: 20px; margin-top: 20px">
            内存使用率: {{ memory }}%
            <Progress
              v-if="memory <= 20"
              :percent="memory"
              :stroke-color="['#0f0', '#0f0']"
            />
            <Progress
              v-else-if="memory > 20 && memory <= 80"
              :percent="memory"
              :stroke-color="['#0f0', '#f78603']"
            />
            <Progress
              v-else
              :percent="memory"
              :hide-info="true"
              :stroke-color="['#0f0', '#FF0000']"
            />
          </div>
          <div style="margintop: 40px; margin-left: 20px; margin-top: 20px">
            硬盘容量: {{ capacity }}% 
            <Progress
              v-if="capacity <= 20"
              :percent="capacity"
              :stroke-color="['#0f0', '#0f0']"
            />
            <Progress
              v-else-if="capacity > 20 && capacity <= 80"
              :percent="capacity"
              :stroke-color="['#0f0', '#0f0']"
            />
            <Progress
              v-else
              :percent="capacity"
              :hide-info="true"
              :stroke-color="['#0f0', '#FF0000']"
            />
          </div>
        </Card>
      </Col>
      <!-- <Col span="12">
        <Card shadow style="height: 300px">
          <ve-line :data="visitData" style="height: 300px"></ve-line>
        </Card>
      </Col> -->
    </Row>

    <!-- <Row :gutter="20" style="margin-top: 20px">
      <Col span="12">
        <Card shadow>
          <ve-line :data="visitData"></ve-line>
        </Card>
      </Col>
      <Col span="12">
        <Card shadow>
          <ve-line :data="visitData"></ve-line>
        </Card>
      </Col>
    </Row> -->
  </div>
</template>

<script>
import conf from "@/conf/";
import { setInterval } from "timers";
import VeGauge from "v-charts/lib/gauge";
import VeLine from "v-charts/lib/line";
import common from "@/utils/common";
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { getToken } from "@/utils/token";

export default {
  name: "home",
  components: { VeLine, VeGauge, InforCard, CountTo },
  data() {
    return {
      cpu: 0,
      memory: 0,
      capacity: 0,
      inforCardData: [
        {
          title: "用户数量",
          icon: "md-contacts",
          count: 0,
          color: "#2d8cf0",
        },

        {
          title: "虚拟机数量",
          icon: "md-book",
          count: 0,
          color: "#19be6b",
        },
        { title: "密钥数量", icon: "md-key", count: 0, color: "#ed3f14" },
      ],
      visitData: {
        columns: ["日期", "日访问量"],
        rows: [],
      },
      chartData: {
        columns: ["type", "a", "b", "value"],
        rows: [{ type: "速度", value: 80, a: 0, b: 2 }],
      },
      offsetTop: 126,
      outLine: {},
      timer: -1,
    };
  },
  created() {
    // this.loadVisitData();
    this.loadPanelData();
    window.setInterval(() => {
      setTimeout(this.getDeviceInfo(), 0);
    }, 15000);
  },
  methods: {
    ...common.methods,
    getDeviceInfo() {
      const token = getToken();
      if (!token) {
        return;
      }
      this.$store.dispatch("getDeviceInfo").then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          this.cpu = resData.data.cpu;
          this.memory = resData.data.memory;
          this.capacity = resData.data.disk;
        }
      });
    },
    loadVisitData() {
      this.$store.dispatch("getVisitData").then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          const data = resData.data;

          data.forEach((element) => {
            this.visitData.rows.push({
              日期: element.date,
              日访问量: element.count,
            });
          });
        }
      });
    },
    loadPanelData() {
      this.$store.dispatch("getPanelInfo").then((res) => {
        var resData = res.data;
        if (resData && resData.code == "200") {
          const data = resData.data;
          this.inforCardData[0].count = data.userCount;
          this.inforCardData[1].count = data.vsmCount;
          this.inforCardData[2].count = data.vsmCount;
        }
      });
    },
  },
  beforeDestroy() {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
  },
  mounted() {},
  computed: {
    state() {
      return this.$store.state.home;
    },
    height() {
      return this.$store.state.common.documentBodyClientHeight - this.offsetTop;
    },
  },
};
</script>
<style lang="less">
.home-bg {
  height: 1000px;
  overflow: scroll;
}
.count-style {
  font-size: 50px;
}
canvas {
  height: 300px !important;
}
</style>
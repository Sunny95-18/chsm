<template>
  <div>
    <Card>
      <div style="marginTop:20px">
        <Steps :current="guide" size="small">
          <Step title="初始化密码机"></Step>
          <Step title="增加管理员"></Step>
          <Step title="增加操作员"></Step>
          <Step title="密钥管理"></Step>
          <Step title="备份密钥"></Step>
          <Step title="重启密码机"></Step>
        </Steps>
      </div>

      <div style="marginTop:50px">
        <List v-if="step===1" border size="large">
          <ListItem><h3>初始化密码机</h3></ListItem>
          <ListItem>
            <span class="interval redClass">该操作将会销毁所有密钥信息和权限信息,请谨慎处理。</span>
          </ListItem>
          <ListItem>
            <span class="interval">如果您确定销毁所有密钥,请点击确认按钮。</span>
          </ListItem>
          <ListItem>
            <Button style="marginLeft:40%" type="info" @click="initDevice">初始化密码机</Button>
          </ListItem>
          <ListItem>
            <a @click="addAdmin">下一步</a>
          </ListItem>
        </List>

        <List v-else-if="step===2"  border size="large">
           <ListItem><h3>增加管理员</h3></ListItem>
          <ListItem>
            <span class="interval redClass">密码机支持1~3个管理员，为保证密码设备的安全性及可靠性，建议设置3个管理员。</span>
          </ListItem>
          <ListItem>
            <span class="interval">请将标记为“管理员”的USBKey按照正确的方向插入设备中，并输入USBKey保护口令。。</span>
          </ListItem>
          <ListItem>
            <Form :model="formItem" :label-width="100" inline>
              <FormItem label="PIN口令:">
                <Input type="password" v-model="formItem.adminKey" />
              </FormItem>
              <FormItem :label-width="0">
                <Button type="info" @click="createAdmin">增加管理员</Button>
              </FormItem>
            </Form>
          </ListItem>
          <ListItem>
            <a @click="goFirst">上一步</a>
            <a style="marginLeft:20px" @click="addOpt">下一步</a>
          </ListItem>
        </List>
        <List v-else-if="step===3" border size="large">
           <ListItem><h3>增加操作员</h3></ListItem>
          <ListItem>
            <span>请将标记为“操作员”的USBKey按照正确的方向插入设备中，并输入USBKey保护口令。</span>
          </ListItem>
          <ListItem>
            <Form :model="formItem" :label-width="100" inline>
              <FormItem label="PIN口令:">
                <Input type="password" v-model="formItem.optKey" />
              </FormItem>
              <FormItem :label-width="0">
                <Button type="info" @click="createOpt">增加操作员</Button>
              </FormItem>
            </Form>
          </ListItem>
          <ListItem>
            <a @click="goSecond">上一步</a>
            <a style="marginLeft:20px" @click="RSAManagement">下一步</a>
          </ListItem>
        </List>

        <List v-else-if="step===4" header="" border>
          <ListItem><h3>内部RSA密钥对管理 -- 生成RSA密钥对</h3></ListItem>
          <ListItem>
            <Form :model="formItem" :label-width="100" inline>
              <FormItem label="密钥索引:">
                <Input
                  type="text"
                  v-model="formItem.index"
                  style="width:120px"
                  placeholder="密钥索引暂为1"
                />
              </FormItem>
              <FormItem label="密钥用途:">
                <Select v-model="defaultRSAType" style="width:120px">
                  <Option value="1">签名密钥</Option>
                  <Option value="2">加密密钥</Option>
                  <Option value="3">签名和加密</Option>
                </Select>
              </FormItem>
              <FormItem label="模长(bits):" style="width:130px">
                <Select v-model="defaultRSABits" style="width:100px">
                  <Option value="1024">1024</Option>
                  <Option value="2048">2048</Option>
                </Select>
              </FormItem>
              <FormItem>
                <Button type="info" @click="createRsa">生成密钥对</Button>
              </FormItem>
            </Form>
          </ListItem>
          <ListItem>
            <a @click="goThird">上一步</a>
            <a style="marginLeft:20px" @click="ECCManagement">下一步</a>
          </ListItem>
        </List>

        <List v-else-if="step===5" border>
          <ListItem><h3>内部ECC密钥对管理 -- 生成ECC密钥对</h3></ListItem>
          <ListItem>
            <Form :model="formItem" :label-width="100" inline>
              <FormItem label="密钥索引:">
                <Input
                  type="text"
                  v-model="formItem.index"
                  style="width:120px"
                  placeholder="例如:1,3,5-12"
                />
              </FormItem>
              <FormItem label="密钥用途:">
                <Select v-model="defaultECCType" style="width:120px">
                  <Option value="1">签名密钥</Option>
                  <Option value="2">加密密钥</Option>
                  <Option value="3">签名和加密</Option>
                </Select>
              </FormItem>
              <FormItem label="模长(bits):" style="width:130px">
                <Select v-model="defaultECCBits" style="width:100px">
                  <Option value="256">256</Option>
                </Select>
              </FormItem>
              <FormItem>
                <Button type="info" @click="createEcc">生成密钥对</Button>
              </FormItem>
            </Form>
          </ListItem>
          <ListItem>
            <a @click="goFour">上一步</a>
            <a style="marginLeft:20px" @click="SymmetricManagement">下一步</a>
          </ListItem>
        </List>
        <List v-else-if="step===6" border>
          <ListItem><h3>对称密钥管理 -- 产生对称密钥</h3></ListItem>
          <ListItem>
            <Form :model="formItem" :label-width="100" inline>
              <FormItem label="密钥索引:">
                <Input
                  type="text"
                  v-model="formItem.index"
                  style="width:120px"
                  placeholder="例如:1,3,5-12"
                />
              </FormItem>
              <FormItem label="模长(bits):" style="width:130px">
                <Select v-model="SymmetricBits" style="width:100px">
                  <Option value="128">128</Option>
                  <Option value="192">192</Option>
                  <Option value="256">256</Option>
                </Select>
              </FormItem>
              <FormItem>
                <Button type="info" @click="createEcc">生成密钥</Button>
              </FormItem>
            </Form>
          </ListItem>
          <ListItem>
            <a @click="goFive">上一步</a>
            <a style="marginLeft:20px" @click="backup">下一步</a>
          </ListItem>
        </List>

        <List v-else-if="step===7" border>
          <ListItem><h3>密钥备份向导</h3></ListItem>
          <ListItem>2、输出备份密钥分量[{{count}}]。</ListItem>
          <ListItem>请选择第1个管理员USBKey根据正确的方向插入设备中，并输入保护口令。</ListItem>
          <ListItem>管理员USBKey可以任意顺序，但不能重复。。</ListItem>
          <ListItem>
            <Form :model="formItem" :label-width="140" inline>
              <FormItem label="请输入PIN口令:">
                <Input type="password" v-model="formItem.backupKey" />
              </FormItem>
              <FormItem>
                <Button type="info" @click="backupSecondOk">确定</Button>
              </FormItem>
            </Form>
          </ListItem>
          <ListItem>
            <a @click="goSex">上一步</a>
            <a style="marginLeft:20px" @click="restart">下一步</a>
          </ListItem>
        </List>
        <List v-else-if="step===8" border>
            <ListItem><h3>密钥备份向导</h3></ListItem>
          <ListItem>3、导出备份文件。</ListItem>
          <ListItem>密码机内的密钥信息已经备份到密钥备份文件中。</ListItem>

          <ListItem>
            <Form :model="formItem" :label-width="140" inline>
              <FormItem>
                <Button type="info" @click="thirdOk">下载文件</Button>
              </FormItem>
            </Form>
          </ListItem>
          <ListItem>
            <a @click="goSex">上一步</a>
            <a style="marginLeft:20px" @click="restart">下一步</a>
          </ListItem>
        </List>

        <List v-else-if="step===9" border>
            <ListItem><h3>密钥备份向导</h3></ListItem>
          <ListItem>4. 完成密钥备份。</ListItem>
          <ListItem>已经完成密钥备份，请妥善保管好密钥备份文件。</ListItem>
          <ListItem>备份过程中在密码机内生成的临时备份文件已删除。</ListItem>
          <ListItem>
            <Button type="info" @click="backupEnd">完成</Button>
          </ListItem>
          <ListItem>
            <a @click="goSex">上一步</a>
            <a style="marginLeft:20px" @click="restart">下一步</a>
          </ListItem>
        </List>
        <List v-else  border size="large">
           <ListItem><h3>重新启动密码机</h3></ListItem>
          <ListItem>恭喜你完成密码机的安装和初始化，已经可以使用密码机了。</ListItem>
          <ListItem>为确保所有设置已经生效，建议重新启动密码机。</ListItem>
          <ListItem class="redClass">注意：重启密码机前请先插入操作员口令USBKey。</ListItem>
            <ListItem>
            <a @click="goSeven">上一步</a>
            <a style="marginLeft:20px" @click="goHome">返回</a>
          </ListItem>
        </List>
      </div>
    </Card>

    <div v-if="step===4||step===5" style="marginTop:5px;">
      <List border>
        <ListItem><h3>内部密钥状态</h3></ListItem>
        <Table
          ref="tab"
          stripe
          :loading="state.loading"
          :columns="columns"
          :data="rows"
          class="table"
          :height="240"
        >
          <template slot-scope="{ row,index }" slot="action">
            <div>
              <Button class="ops-btn" type="error">删除</Button>
            </div>
          </template>
        </Table>
      </List>
    </div>
    <div v-if="step===6" style="marginTop:5px;">
      <List header="内部对称密钥状态" border>
        <Table
          ref="tab"
          stripe
          :loading="state.loading"
          :columns="columns1"
          :data="rows"
          class="table"
          :height="240"
        >
          <template slot-scope="{ row,index }" slot="action">
            <div>
              <Button class="ops-btn" type="error">删除</Button>
            </div>
          </template>
        </Table>
      </List>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      step: 1,
      guide: 0,
      count: 1,
      formItem: {
        adminKey: "",
        optKey: "",
        index: "",
        backupKey: ""
      },
      defaultRSAType: "1",
      defaultRSABits: "1024",
      defaultECCType: "1",
      defaultECCBits: "256",
      SymmetricBits: "192",
      columns: [
        {
          title: "密钥索引",
          width: 250,
          key: "id"
        },
        {
          title: "密钥用途",
          width: 250,
          key: "type"
        },
        {
          title: "模长",
          width: 250,
          key: "length"
        },
        {
          title: "删除密钥",
          slot: "action"
        }
      ],
      columns1: [
        {
          title: "密钥索引",
          width: 250,
          key: "id"
        },
        {
          title: "模长",
          width: 250,
          key: "length"
        },
        {
          title: "删除密钥",
          slot: "action"
        }
      ]
    };
  },
  created() {},
  methods: {
    ...common.methods,
    loadRSAData() {
      this.$store.commit("RsaList", this.queryParams);
    },
    loadECCData() {
      this.$store.commit("EccList", this.queryParams);
    },
    loadSymmetricData() {
      this.$store.commit("SymmetricList", this.queryParams);
    },
    initDevice() {},
    createAdmin() {},
    createOpt() {},
    createRsa() {},
    createEcc() {},
    //下一步
    addAdmin() {
      this.guide = 1;
      this.step = 2;
    },
    addOpt() {
      this.guide = 2;
      this.step = 3;
    },
    RSAManagement() {
      this.guide = 3;
      this.step = 4;
      this.loadRSAData();
    },
    ECCManagement() {
      this.step = 5;
      this.loadECCData();
    },
    SymmetricManagement() {
      this.step = 6;
    },
    backup() {
      this.guide = 4;
      this.step = 7;
    },
    backupSecondOk() {
      this.step = 8;
    },
    backupEnd() {
      this.guide = 5;
      this.step = 10;
    },
    restart() {
      this.guide = 5;
      this.step = 10;
    },
    goHome(){
       this.$router.push({name: "home_index"});
    },
    //上一步
    goFirst() {
      this.guide = 0;
      this.step = 1;
    },
    goSecond() {
      this.guide = 1;
      this.step = 2;
    },
    goThird() {
      this.guide = 2;
      this.step = 3;
    },
    goFour() {
      this.step = 4;
    },
    goFive() {
      this.step = 5;
    },
    goSex() {
      this.guide = 3;
      this.step = 6;
    },
    goSeven(){
      this.guide=4;
      this.step=7;
    }
  },
  computed: {
    ...common.computed,
    state() {
      return this.$store.state.guide;
    }
  },
  watch: {
    $route() {}
  }
};
</script>
<style scoped>
.interval {
  margin-left: 40px;
}
.redClass {
  color: red;
}
</style>
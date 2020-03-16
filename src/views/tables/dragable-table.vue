<template>
  <div class="address" @click="contractClick('outside')">
    <div :style="{background: '#fff',minWidth:'400px', padding: '10px'}">
      <Row>
        <div class="tip" style="float:left;margin-top:10px;margin-bottom: 10px">
          <p class="tooltip" @click.stop="contractClick('inside')">
            按业务公司
            <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
          </p>
          <div class="tooltipslot" v-show="tooptipShow">
            <p>按业务类型</p>
            <!-- <p
                v-for="(item,index) in contractStatus"
                @click="changeStatus(index)"
                :key="index"
            >{{item.status}}</p>-->
          </div>
        </div>

        <div style="float:right;">
          <span class="f-more">
            <span @click="morehtztClick" class="cor1">
              <Icon type="navicon-round"></Icon>
              <span>更多</span>
            </span>
            <div v-show="showExport" class="more">
              <p @click="exportAll">导出当前视图数据</p>
            </div>
          </span>
        </div>
      </Row>
      <Form ref="filterItem" :model="filterItem" :label-width="80">
        <FormItem label="操作时间段">
          <Row>
            <Col span="4">
              <DatePicker
                style="width: 100%"
                type="date"
                :options="startOption"
                placeholder="开始日期"
                v-model="filterItem.kssj"
              ></DatePicker>
            </Col>
            <Col span="1" style="text-align: center">-</Col>
            <Col span="4">
              <DatePicker
                style="width: 100%"
                type="date"
                :options="endOption"
                placeholder="结束日期"
                v-model="filterItem.jssj"
              ></DatePicker>
            </Col>
            <Col span="15" style="text-align:right">
              <span
                style="cursor: pointer;color: #4a9af5"
                @click="showMore = true"
                v-if="!showMore"
              >
                高级筛选
                <Icon type="chevron-down"></Icon>
              </span>
            </Col>
          </Row>
        </FormItem>
        <div v-if="showMore">
          <el-divider></el-divider>
          <FormItem label="业务公司" prop="ywgs">
            <Row>
              <Col :span="12">
                <Select v-model="filterItem.ywgs" clearable filterable multiple>
                  <Option
                    :value="item.id"
                    v-for="(item,index) in companys"
                    :key="index"
                  >{{item.name}}</Option>
                </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="区域" prop="qy">
            <Row>
              <Col :span="12">
                <el-cascader
                  style="width: 100%"
                  clearable
                  v-model="filterItem.qy"
                  :options="regions"
                  filterable
                  show-all-levels
                  :props="{ value: 'name', label: 'name',checkStrictly: true, multiple: true}"
                  size="small"
                ></el-cascader>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="销售模式">
            <el-radio-group v-model="filterItem.xsms" size="small">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button label="2">自营</el-radio-button>
              <el-radio-button label="1">渠道</el-radio-button>
            </el-radio-group>
          </FormItem>
          <FormItem label="监测点数" prop="jcds">
            <Row>
              <Col :span="6">
                <el-radio-group v-model="filterItem.jcds" size="small">
                  <el-radio-button :label="0">全部</el-radio-button>
                  <el-radio-button :label="1">10点以下</el-radio-button>
                  <el-radio-button :label="2">10点以上20点以下</el-radio-button>
                  <el-radio-button :label="3">20点以上</el-radio-button>
                </el-radio-group>
              </Col>
              <Col :span="18">
                <Input-number v-model="filterItem.jcdsks"></Input-number>-
                <Input-number v-model="filterItem.jcdsjs"></Input-number>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="设备状态" prop="sbzt">
            <el-checkbox-group v-model="filterItem.sbzt">
              <el-checkbox :label="1">勘察未审核</el-checkbox>
              <el-checkbox :label="2">勘察已审核</el-checkbox>
              <el-checkbox :label="3">全部已勘察</el-checkbox>
              <el-checkbox :label="4">安装未上线</el-checkbox>
              <el-checkbox :label="5">安装已上线</el-checkbox>
              <el-checkbox :label="6">全部已安装</el-checkbox>
            </el-checkbox-group>
          </FormItem>
          <FormItem label="设备分类" prop="sbfl">
            <el-radio-group v-model="filterItem.sbfl" size="small">
              <el-radio-button :label="1">设备数</el-radio-button>
              <el-radio-button :label="2">分路数</el-radio-button>
            </el-radio-group>
          </FormItem>
          <FormItem label="设备型号" prop="sbxh">
            <Row>
              <Col :span="12">
                <Select v-model="filterItem.sbxh" clearable filterable multiple>
                  <Option
                    :value="item.device_model"
                    v-for="(item,index) in devices"
                    :key="index"
                  >{{item.device_model_name}}</Option>
                </Select>
              </Col>
              <Col span="12" style="text-align:right">
                <span
                  style="cursor: pointer;color: #4a9af5"
                  @click="showMore = false"
                  v-if="showMore"
                >
                  基本筛选
                  <Icon type="chevron-up"></Icon>
                </span>
              </Col>
            </Row>
          </FormItem>
        </div>

        <FormItem>
          <Button @click="handleReset('filterItem')" style="margin-left: 8px">重置</Button>
          <Button type="primary" @click="handleSubmit('filterItem')">确定</Button>
        </FormItem>
      </Form>
    </div>
    <Content
      :style="{background: '#fff', minHeight: '760px',marginTop: '10px'}"
      style="padding:20px 20px 0"
    >
      <el-table
        ref="table"
        style="position:relative;"
        :columns="columns"
        :span-method="objectSpanMethod"
        :loading="loading"
        :data="data1"
        size="small"
        row-class-name="statistics"
        :row-style="{background: '#F0F9EB', height: '100px', color: '#67C23A'}"
      >
        <el-table-column property="index" label="序号1" width="35">
          <template slot="header" slot-scope="scope">
            <span @click="setting">
              <i class="el-icon-setting" style="cursor:pointer"></i>
            </span>
          </template>
          <template slot-scope="scope">
            <i class="el-icon-s-marketing" style=" font-size: 20px"></i>
            <span>预测分析</span>
          </template>
        </el-table-column>
        <el-table-column property="contractNature" label="序号" width="50"></el-table-column>
        <el-table-column property="contractNature" label="业务公司">
          <template slot-scope="scope">
            <span style="padding-left: 30px; font-size: 16px">{{scope.row.contractNature}}</span>
          </template>
        </el-table-column>
        <el-table-column property="contractNature1" label="业务类型">
          <template slot-scope="scope">
            <span style="font-size: 14px;color: #000">{{scope.row.contractNature1}}</span>
            <br />
            <span style="font-size: 14px">{{scope.row.contractNature2}}</span>
          </template>
        </el-table-column>
        <el-table-column property="contractNature2" label="销售方式">
          <template slot-scope="scope">
            <span style="font-size: 14px;color: #000">{{scope.row.contractNature3}}</span>
            <br />
            <span style="font-size: 14px">{{scope.row.contractNature4}}</span>
          </template>
        </el-table-column>
        <el-table-column property="contractNature3" label="区域">
          <template slot-scope="scope">
            <span style="font-size: 14px; color: #000">{{scope.row.contractNature5}}</span>
            <br />
            <span style="font-size: 14px">{{scope.row.contractNature6}}</span>
          </template>
        </el-table-column>
        <el-table-column property="contractNature4" label="用户ID"></el-table-column>
        <el-table-column property="contractNature5" label="用户名称"></el-table-column>
        <el-table-column property="contractNature6" label="网关数"></el-table-column>
        <el-table-column property="contractNature7" label="监测点数"></el-table-column>
        <el-table-column property="contractNature8" label="CJJ-XL（400A）"></el-table-column>
        <el-table-column property="contractNature9" label="2.5代G01-1型"></el-table-column>
      </el-table>
      <el-table
        ref="table"
        :show-header="false"
        style="position:relative;"
        :span-method="objectSpanMethod1"
        :loading="loading"
        :data="data"
        size="small"
      >
        <el-table-column property="index" label="序号" width="35" class-name="result">
          <template slot-scope="scope">
            <span style="color: #4A99FF">查询结果</span>
          </template>
        </el-table-column>
        <el-table-column property="contractNature" label="序号" width="50"></el-table-column>
        <el-table-column property="contractNature" label="业务公司"></el-table-column>
        <el-table-column property="contractNature1" label="业务类型"></el-table-column>
        <el-table-column property="contractNature2" label="销售方式"></el-table-column>
        <el-table-column property="contractNature3" label="区域"></el-table-column>
        <el-table-column property="contractNature4" label="用户ID"></el-table-column>
        <el-table-column property="contractNature5" label="用户名称"></el-table-column>
        <el-table-column property="contractNature6" label="网关数"></el-table-column>
        <el-table-column property="contractNature7" label="监测点数"></el-table-column>
        <el-table-column property="contractNature8" label="CJJ-XL（400A）"></el-table-column>
        <el-table-column property="contractNature9" label="2.5代G01-1型"></el-table-column>
      </el-table>
      <!-- <Page
        :total="sum"
        :current.sync="pageNum"
        :page-size="10"
        show-total
        size="small"
        show-elevator
        style="text-align:center;margin-top:20px;"
      ></Page>-->
    </Content>
    <el-dialog
      class="dialog"
      title="设置统计字段"
      :visible.sync="dialogVisible"
      width="50%"
      :append-to-body="true"
    >
      <el-row>
        <el-col :span="10" :offset="1">
          <span>可选字段</span>
          <div class="box-card">
            <el-row class="box-card-row" v-for="item in columnsData" :key="item.key">
              <span v-if="item.checked">
                <el-col :span="20">{{item.label}}</el-col>
                <el-col :span="4">
                  <i class="el-icon-check" style="color: rgb(104,155,255);font-size: 20px"></i>
                </el-col>
              </span>
              <span v-else>
                <el-col :span="24" style="cursor: pointer">
                  <div @click="addRow(item)">{{item.label}}</div>
                </el-col>
              </span>
            </el-row>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="center-box">
            <div class="arrow-left">
              <i
                class="el-icon-arrow-left"
                style="font-size: 30px;font-weight:bold;color:rgb(215,215,215);"
              ></i>
            </div>
            <div class="arrow-right">
              <i
                class="el-icon-arrow-right"
                style="font-size: 30px;font-weight:bold;color:rgb(215,215,215);"
              ></i>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <span>已选字段</span>
          <div class="box-card">
            <el-row
              class="box-card-row"
              v-for="item in columnsData"
              :key="item.key"
              v-if="item.checked"
            >
              <el-col :span="20">{{item.label}}</el-col>
              <el-col :span="4" style="cursor: pointer">
                <span @click="delRow(item)" class="el-icon-close"></span>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PreCast",
  data() {
    return {
      radio: "1",
      loading: false,
      companys: [],
      devices: [],
      columns: [
        {
          title: "序号",
          width: 20,
          key: "setting",
          align: "center",
          renderHeader: (h, { column, $index }) => {
            return h("i", {
              class: "el-icon-setting",
              style: {
                cursor: "pointer"
              },
              on: {
                click: () => {
                  this.getTransferColumns();
                  this.dialogVisible = true;
                }
              }
            });
          }
        },
        {
          title: "序号",
          width: 50,
          align: "center",
          key: "index"
        },
        {
          title: "业务公司",
          key: "contractNature",
          align: "center"
        },
        {
          title: "业务类型",
          key: "contractNature1",
          align: "center"
        },
        {
          title: "销售方式",
          key: "contractNature2",
          align: "center"
        },
        {
          title: "区域",
          key: "contractNature3",
          align: "center"
        },
        {
          title: "用户ID",
          key: "contractNature4",
          align: "center"
        },
        {
          title: "用户名称",
          key: "contractNature5",
          align: "center"
        },
        {
          title: "网关数",
          key: "contractNature6",
          align: "center"
        },
        {
          title: "监测点数",
          key: "contractNature7",
          align: "center"
        },
        {
          title: "CJJ-XL（400A）",
          key: "contractNature8",
          align: "center"
        },
        {
          title: "2.5代G01-1型",
          key: "contractNature9",
          align: "center"
        }
      ],
      data: [
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 2,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 3,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        }
      ],
      data1: [
        {
          index: "0",
          contractNature: "本次查询结果：用户数 3436, 设备数 136922。",
          contractNature1: "户均",
          contractNature2: "预测",
          contractNature3: "0.26",
          contractNature4: "2000",
          contractNature5: "0.21",
          contractNature6: "200"
        }
      ],
      dialogVisible: false,
      columnsData: [],
      value: [],
      showMore: false,
      showExport: false,
      tooptipShow: false,
      filterItem: {
        kssj: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        jssj: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ywgs: "",
        qy: "",
        xsms: 0,
        jcds: 0,
        jcdsks: null,
        jcdsjs: null,
        sbzt: [1, 2, 3, 4, 5, 6],
        sbfl: 1,
        sbxh: ""
      },
      startOption: {
        disabledDate: time => {
          if (this.filterItem.jssj) {
            return time.getTime() > new Date(this.filterItem.jssj).getTime();
          }
        }
      },
      endOption: {
        disabledDate: time => {
          if (this.filterItem.kssj) {
            return time.getTime() < new Date(this.filterItem.kssj).getTime();
          }
        }
      }
    };
  },
  mounted() {
    this.getList(1);
    this.getManagecompanys();
    this.getDevices();
  },
  computed: {
    isFinance() {
      if (
        this.$store.state.app.authority &&
        this.$store.state.app.authority.length > 0 &&
        this.$store.state.app.authority[0].role
      ) {
        return this.$store.state.app.authority[0].role.find(r => r === "财务");
      }
    },
    isCooperative() {
      if (
        this.$store.state.app.authority &&
        this.$store.state.app.authority.length > 0 &&
        this.$store.state.app.authority[0].role
      ) {
        return this.$store.state.app.authority[0].role.find(
          r => r === "合作伙伴"
        );
      }
    },
    isSaleManage() {
      if (
        this.$store.state.app.authority &&
        this.$store.state.app.authority.length > 0 &&
        this.$store.state.app.authority[0].role
      ) {
        return this.$store.state.app.authority[0].role.find(
          r => r === "业务管控"
        );
      }
    },
    isSaleMan() {
      if (
        this.$store.state.app.authority &&
        this.$store.state.app.authority.length > 0 &&
        this.$store.state.app.authority[0].role
      ) {
        return this.$store.state.app.authority[0].role.find(
          r => r === "销售人员"
        );
      }
    },
    regions() {
      return JSON.parse(localStorage.getItem("regions")) || [];
    }
  },
  methods: {
    getManagecompanys() {
      let request = {
        typeid: 27001
      };
      this.$http.XLSELECT(request).then(response => {
        this.companys = response.data.result.data;
      });
    },
    getDevices() {
      let request = {
        typeid: 22001,
        data: []
      };
      this.$http.XLREPORT(request).then(response => {
        this.devices = response.data.result.data;
      });
    },
    contractClick(side) {
      if (side === "inside") {
        this.tooptipShow = !this.tooptipShow;
      } else if (side === "outside") {
        if (this.tooptipShow) this.tooptipShow = false;
      }
    },
    setting() {
      this.getTransferColumns();
      this.dialogVisible = true;
    },
    morehtztClick() {
      this.showExport = !this.showExport;
      //   this.glShow = false;
      if (this.showExport) {
        $(".cor1").css({ color: "#4a9af5" });
      } else {
        $(".cor1").css({ color: "#000000" });
      }
    },
    getTransferColumns() {
      const tColumns = [];
      const tValues = [];
      this.columns.map(item => {
        if (item.title !== "序号") {
          tColumns.push({
            key: item.key,
            label: item.title,
            checked: true
          });
          tValues.push(item.key);
        }
      });
      this.value = tValues;
      this.columnsData = tColumns;
    },
    delRow(row) {
      this.columnsData.map(
        item => item.key === row.key && (item.checked = false)
      );
    },
    addRow(row) {
      this.columnsData.map(
        item => item.key === row.key && (item.checked = true)
      );
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [0, 0];
      } else if (columnIndex === 2) {
        return [1, 8];
      }
    },
    objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 100 === 0) {
          return {
            rowspan: 100,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    handleReset() {
      for (let key in this.filterItem) {
        if (key === "kssj") {
          this.filterItem[key] = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          );
        } else if (key === "jssj") {
          this.filterItem[key] = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          );
        } else {
          this.filterItem[key] = "";
        }
      }
    },
    handleSubmit(name) {
      console.log("reser", name);
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getList();
          //   if (this.jbxx_data == "") {
          //     this.sum = 0;
          //   }
          this.$Message.success("查询成功！");
        } else {
          this.$Message.error("查询失败，请重试!");
        }
      });
    },
    getList() {
      console.log("this get list", this.filterItem);
      let startTime = "",
        endTime = "";
      if (this.filterItem.kssj && this.filterItem.kssj !== "") {
        startTime =
          this.filterItem.kssj.getFullYear() +
          "-" +
          (this.filterItem.kssj.getMonth() + 1) +
          "-" +
          this.filterItem.kssj.getDate() +
          " 00:00:00";
      }
      if (this.filterItem.jssj && this.filterItem.jssj !== "") {
        endTime =
          this.filterItem.jssj.getFullYear() +
          "-" +
          (this.filterItem.jssj.getMonth() + 1) +
          "-" +
          this.filterItem.jssj.getDate() +
          " 23:59:59";
      }
      let request = {
        typeid: 25001,
        data: [
          {
            // account_id: this.$store.state.user.accountId,

            // customer_name: "",
            // create_starttime: startTime,
            // create_endtime: endTime
            company_id: [324090802, 324090803],
            area_id: [320121, 320115],
            sale_type: 0,
            limit_up: 100,
            limit_down: 20,
            device_state: [1, 2, 3, 4],
            device_type: 1,
            device_model: ["S400", "S40"],
            start_time: "2019-10-11 13:40:45",
            end_time: "2020-10-11 13:40:45"
          }
        ]
      };
      //   this.loading = true;
      //   this.$http.XLCUSTOMER(request).then(
      //     response => {
      //       let res = response.data.result.data;
      //       this.data = [];
      //       this.sum = res.sum;
      //       res.customerList.forEach(data => {
      //         let item = {};
      //         item.name = data.customer_name;
      //         item.time = data.create_date;
      //         item.salesman = data.sale_no;
      //         item.company = data.manage_company_cn;
      //         item.data = data;
      //         this.customList_data.push(item);
      //       });
      //       this.loading = false;
      //     },
      //     error => {
      //       this.loading = false;
      //     }
      //   );
    },
    exportAll() {
      if (this.isFinance || this.isCooperative || this.isSaleMan) {
        this.$Message.error("权限不足！");
        return;
      }
      this.export();
    },
    export(list) {
      if (this.isFinance || this.isCooperative || this.isSaleMan) {
        return;
      }
      //   let request = {
      //     data: [
      //       {
      //         account_id: this.$store.state.user.accountId,
      //         contractList: list
      //       }
      //     ]
      //   };
      this.$Message.info("导出中...");
      this.$http.CONTRACTEXPORT(request).then(
        res => {},
        error => {
          if (error.data.code === 0) {
            this.exportUrl = error.data.exportUrl;
            this.$nextTick(() => {
              this.$refs.downloadLink.click();
              this.exportUrl = "";
            });
            this.morehtztClick();
          } else {
            this.$Message.error("导出失败，请稍后重试！");
          }
        }
      );
    }
  }
};
</script>

<style scoped>
@import "../assetmanagement/assetmanage.css";
.dialog .box-card {
  border: 1px solid rgba(220, 223, 230, 1);
  border-radius: 4px;
  min-height: 400px;
}
.dialog .box-card .box-card-row {
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
}

.dialog .box-card .box-card-row:hover {
  background-color: rgb(242, 242, 242);
}
.dialog .center-box .arrow-left {
  text-align: center;
  margin-top: 200px;
}
.dialog .center-box .arrow-right {
  text-align: center;
  margin-top: 10px;
}
</style>
<style>
.statistics td:first-child {
  border-left: 2px solid #67c23a;
}

.result {
  background: #e6f5ff;
  padding-right: 5px;
}
</style>
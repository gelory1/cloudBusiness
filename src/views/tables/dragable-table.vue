<template>
  <div class="address" @click="contractClick('outside')">
    <div :style="{background: '#fff',minWidth:'400px', padding: '10px'}">
      <Row>
        <div class="tip" style="float:left;margin-top:10px;margin-bottom: 10px">
          <p class="tooltip" @click.stop="contractClick('inside')">
            {{this.filterItem.sort_order === 1 ? '按业务公司' : '按业务类型'}}
            <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
          </p>
          <div class="tooltipslot" v-show="tooptipShow">
            <p @click="changeStatus">{{this.filterItem.sort_order === 2 ? '按业务公司' : '按业务类型'}}</p>
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
        <el-collapse-transition>
          <div v-show="showMore">
            <Row>
              <el-divider></el-divider>
            </Row>
            <FormItem label="业务公司" prop="ywgs">
              <Row>
                <Col :span="12">
                  <Select v-model="filterItem.ywgs" clearable filterable placeholder="所有业务公司">
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
                <el-radio-button :label="2">自营</el-radio-button>
                <el-radio-button :label="1">渠道</el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem label="监测点数" prop="jcds">
              <Row>
                <Col :span="6">
                  <el-radio-group v-model="filterItem.jcds" size="small" @change="changeMonitor">
                    <el-radio-button :label="0">全部</el-radio-button>
                    <el-radio-button :label="1">10点以下</el-radio-button>
                    <el-radio-button :label="2">10点以上20点以下</el-radio-button>
                    <el-radio-button :label="3">20点以上</el-radio-button>
                  </el-radio-group>
                </Col>
                <Col :span="18">
                  <Input-number v-model="filterItem.jcdsks" @input="emptyRadioMonitor"></Input-number> -
                  <Input-number v-model="filterItem.jcdsjs" @input="emptyRadioMonitor"></Input-number>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="设备状态" prop="sbzt">
              <el-radio-group v-model="filterItem.sbzt" size="small" @change="changeMonitor">
                <el-radio-button :label="1">勘察未审核</el-radio-button>
                <el-radio-button :label="2">勘察已审核</el-radio-button>
                <el-radio-button :label="3">全部已勘察</el-radio-button>
                <el-radio-button :label="4">安装未上线</el-radio-button>
                <el-radio-button :label="5">安装已上线</el-radio-button>
                <el-radio-button :label="6">全部已安装</el-radio-button>
              </el-radio-group>
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
        </el-collapse-transition>
        <FormItem>
          <Button @click="handleReset('filterItem')" style="margin-left: 8px">重置</Button>
          <Button type="primary" @click="handleSubmit('filterItem')">确定</Button>
        </FormItem>
      </Form>
    </div>
    <Content
      :style="{background: '#fff', minHeight: '610px',marginTop: '10px'}"
    >
      <el-table
        style="width: 100%"
        :span-method="objectSpanMethod"
        :row-class-name="tableRowClassName"
        v-loading="loading"
        :data="data"
        size="small"
        max-height="610"
      >
        <el-table-column property="index" label="序号" width="38" class-name="result" fixed="left">
          <template slot="header" slot-scope="scope">
            <span>
              <i class="el-icon-setting" style="cursor:pointer"></i>
            </span>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.$index === 0" style="color: #67c23a; font-weight: bold; font-size: 14px;">
              <i class="el-icon-s-marketing" style=" font-size: 30px; "></i> 预测分析
            </span>
            <span v-if="scope.$index === 1" style="color: #4A99FF">查询结果</span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50" fixed="left">
          <template slot-scope="scope">
            <span v-if="scope.$index === 0" style="color: #67c23a">
            </span>
            <span v-else>{{scope.$index}}</span>
          </template>
        </el-table-column>
        <el-table-column :property="baseTypeColumns[0].key" :label="baseTypeColumns[0].title" :width="baseTypeColumns[0].width" fixed="left">
          <template slot-scope="scope">
            <span v-if="scope.$index === 0" style="color: #67c23a !important; text-align: right">
              本次查询结果：用户数 {{scope.row.unit_num}}, 设备数 {{scope.row.device_num}}。
            </span>
            <span v-else>{{scope.row[baseTypeColumns[0].key]}}</span>
          </template>
        </el-table-column>
        <el-table-column :property="baseTypeColumns[1].key" :label="baseTypeColumns[1].title" :width="baseTypeColumns[1].width" fixed="left">
        </el-table-column>   
        <el-table-column property="sale_type_name" label="销售方式" width="80" fixed="left">
        </el-table-column>
        <el-table-column property="area" label="区域" width="150" fixed="left">
        </el-table-column>
        <el-table-column property="unit_id" label="用户ID" width="80" fixed="left">
        </el-table-column>
        <el-table-column property="unit_name" label="用户名称" width="200" fixed="left">
        </el-table-column>
        <el-table-column property="gateway_count" label="网关数" width="80" fixed="left">
        </el-table-column>
        <el-table-column property="monitor_count" label="监测点数" width="80" fixed="left">
          <template slot-scope="scope">
            <div v-if="scope.$index === 0" style="color: #000 !important; text-align: right">
              户均
            </div>
            <span v-else>{{scope.row.monitor_count}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(column, index) in columns" :key="index" :property="column.key" :label="column.title" :width="column.width" :formatter="formatter">
        </el-table-column>
      </el-table>
      <Table
        v-show="false"
        ref="table"
        :columns="columns"
        :data="data"
        size="small"
        :loading="loading"
      ></Table>
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
      loading: false,
      companys: [],
      devices: [],
      baseTypeColumns: [
        {
          title: "业务公司",
          key: "company",
          width: 200
        },
        {
          title: "业务类型",
          key: "business_type",
          width: 100
        },
      ],
      baseColumns: [
        {
          title: "销售方式",
          key: "sale_type_name",
          align:"center"
        },
        {
          title: "区域",
          key: "area",
          align:"center"
        },
        {
          title: "用户ID",
          key: "unit_id",
          align:"center"
        },
        {
          title: "用户名称",
          key: "unit_name",
          align:"center"
        },
        {
          title: "网关数",
          key: "gateway_count",
          align:"center"
        },
        {
          title: "监测点数",
          key: "monitor_count",
          align:"center"
        }
      ],
      columns: [],
      data: [],
      total: 0,
      dialogVisible: false,
      columnsData: [],
      value: [],
      showMore: false,
      showExport: false,
      tooptipShow: false,
      filterItem: {
        kssj: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        jssj: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ywgs: 0,
        qy: [],
        xsms: 0,
        jcds: 0,
        jcdsks: null,
        jcdsjs: null,
        sbzt: 2,
        sbfl: 1,
        sbxh: [],
        sort_order: 1
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
    changeStatus() {
      if(this.filterItem.sort_order === 1) {
        this.filterItem.sort_order = 2
      }else {
        this.filterItem.sort_order = 1
      }
    },
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
        typeid: 29004,
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
      if(rowIndex === 0) {
        if (columnIndex === 1 || columnIndex === 4 ||columnIndex === 5  ) {
          return [0, 0];
        } else if (columnIndex === 2) {
          return [1, 4];
        }
      }
    },
    handleReset() {
      this.filterItem = {
        kssj: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        jssj: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ywgs: 0,
        qy: [],
        xsms: 0,
        jcds: 0,
        jcdsks: null,
        jcdsjs: null,
        sbzt: 2,
        sbfl: 1,
        sbxh: [],
        sort_order: 1
      }
    },
    changeMonitor() {
      this.filterItem.jcdsks = null
      this.filterItem.jcdsjs = null
    },
    emptyRadioMonitor() {
      this.filterItem.jcds = null
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'warning-row';
      }
      return '';
    },
    formatter(row, column) {
      return row[column.property] ? row[column.property] : '-'
    },
    handleSubmit(name) {
      // 添加校验 用户选择的时间范围不超过3个月
      if(parseInt(((this.filterItem.jssj.getTime() - this.filterItem.kssj.getTime())/(1000 * 60 * 60 * 24))) > 90) {
        this.$Message.error("操作时间段选择不超过3个月，请重新选择！");
        return
      }
      // 校验监测点数
      if(this.filterItem.jcds === null) {
        if(this.filterItem.jcdsks && this.filterItem.jcdsjs && this.filterItem.jcdsks > this.filterItem.jcdsjs){
          this.$Message.error("监测点数开始值需小于结束值!");
          return
        }
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getList();
        } else {
          this.$Message.error("查询失败，请重试!");
        }
      });
    },
    getList() {
      let startTime = "",
        endTime = "";
      if (this.filterItem.kssj && this.filterItem.kssj !== "") {
        startTime =
          this.filterItem.kssj.getFullYear() +
          "-" +
          ((this.filterItem.kssj.getMonth() + 1) < 10 ? ('0'+(this.filterItem.kssj.getMonth() + 1)) : (this.filterItem.kssj.getMonth() + 1) )+
          "-" +
          (this.filterItem.kssj.getDate() < 10 ? ('0' + this.filterItem.kssj.getDate()): this.filterItem.kssj.getDate())
      }
      if (this.filterItem.jssj && this.filterItem.jssj !== "") {
        endTime =
          this.filterItem.jssj.getFullYear() +
          "-" +
          ((this.filterItem.jssj.getMonth() + 1) < 10 ? ('0'+(this.filterItem.jssj.getMonth() + 1)) : (this.filterItem.jssj.getMonth() + 1) )+
          "-" +
          (this.filterItem.jssj.getDate() < 10 ? ('0' + this.filterItem.jssj.getDate()): this.filterItem.jssj.getDate())
      }
      const data = {
        area_id: this.filterItem.qy,
        sale_type: this.filterItem.xsms,
        device_state: this.filterItem.sbzt,
        device_type: this.filterItem.sbfl,
        device_model: this.filterItem.sbxh,
        start_time: startTime,
        end_time: endTime,
        sort_order: this.filterItem.sort_order
      }


      if(this.filterItem.ywgs) {
        data['company_id'] = this.filterItem.ywgs
      }
      if(this.filterItem.jcds) {
        if(this.filterItem.jcds === 1) {
          data['limit_up'] = 10
        }else if(this.filterItem.jcds === 2) {
          data['limit_up'] = 20
          data['limit_down'] = 10
        } else if(this.filterItem.jcds === 3) {
          data['limit_down'] = 20
        }
      }else {
        if(this.filterItem.jcdsjs) {
          data['limit_up'] = this.filterItem.jcdsjs
        }
        if(this.filterItem.jcdsks) {
          data['limit_down'] = this.filterItem.jcdsks
        }  
      }
      
      let request = {
        typeid: 29003,
        data: [
          {
            ...data
          }
        ]
      };
     
      this.loading = true;
      this.$http.XLREPORT(request).then(
        response => {
          if(this.filterItem.sort_order === 1) {
            this.baseTypeColumns = [ {
                title: "业务公司",
                key: "company",
                width: 200
              },
              {
                title: "业务类型",
                key: "business_type",
                width: 100
              }]
          }else {
            this.baseTypeColumns = [ {
                title: "业务类型",
                key: "business_type",
                width: 100
              },
              {
                title: "业务公司",
                key: "company",
                width: 200
              }]
          }
          let res = response.data.result.data;
          const total = response.data.result.total;
          this.data = [];
          this.columns = [];
          res.forEach((data, index) => {
            let item = {};
            if(index === 0) {
              const dict = total.product_dict
              const totalItem = {
                unit_num: total.unit_num,
                device_num: total.device_num
              }
              Object.keys(dict).forEach(it => {
                totalItem[it] = (dict[it] / total.unit_num).toFixed(2)
              })
              this.data.push(totalItem)
              this.total = total.unit_num
            }
            item['gateway_count'] = data['gateway_count']
            item['sale_type_name'] = data['sale_type_name']
            item['company'] = data['company']
            item['monitor_count'] = data['monitor_count']
            item['business_type'] = data['business_type']
            item['unit_id'] = data['unit_id']
            item['unit_name'] = data['unit_name']
            item['area'] = data['area']
            data['device_list'].forEach(it => {
              item[it['device_model_name']] = it['device_count']
              if(!this.existInColumns(this.columns, it['device_model_name'])) {
                this.columns.push({
                  title: it['device_model_name'],
                  key: it['device_model_name'],
                  width: 150
                })
              }
            })
            this.data.push(item)
            
          });
          this.loading = false;
          this.$Message.success("查询成功！");
        },
        error => {
          this.loading = false;
          this.$Message.error("查询失败，请重试!");
        }
      );
    },
    existInColumns(coloumns, str) {
      for(let i = 0; i< coloumns.length; i++) {
        const item = coloumns[i]
        if(item.title === str) {
          return true
        }
      }
      return false
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
      this.data[0]['company'] = `本次查询结果：用户数 ${this.data[0]['unit_num'] }, 设备数 ${this.data[0]['device_num'] }`
      this.data[0]['monitor_count'] = '户均'
      this.$refs['table'].exportCsv({
        filename: '设备统计列表',
        columns: [...this.baseTypeColumns, ...this.baseColumns, ...this.columns],
        data: this.data
      })
      this.morehtztClick();
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

.warning-row {
  font-size: 14px;
  height: 100px;
  color: #000;
  background-color: #F0F9EB !important;
}

.warning-row .result {
  background-color: #F0F9EB !important;
  border-left: 2px solid #67c23a;
}

.result {
  background: #e6f5ff;
  padding-right: 5px;
}


</style>
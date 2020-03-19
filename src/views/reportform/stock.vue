<template>
  <div class="address">
    <div :style="{background: '#fff', padding: '10px', borderRadius: '5px'}">
      <Row>
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
          </Row>
        </FormItem>

        <FormItem label="业务公司" prop="ywgs">
          <Row>
            <Col :span="12">
              <Select v-model="filterItem.ywgs" clearable filterable @on-change="getPartners">
                <Option :value="item.company_id" v-for="(item,index) in companys" :key="index">{{item.company}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="合作伙伴" prop="hzhb">
          <Row>
            <Col :span="12">
              <Select v-model="filterItem.hzhb" clearable filterable>
                <Option :value="item.agent_id" v-for="(item,index) in partners" :key="index">{{item.agent_name}}</Option>
              </Select>
            </Col>
          </Row>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit('filterItem')">生成报表</Button>
        </FormItem>
      </Form>
    </div>
    <Content
      :style="{background: '#fff', minHeight: '760px',marginTop: '10px', borderRadius: '5px'}"
      style="padding:20px 20px 0"
    >
      <el-table
        ref="table"
        style="position:relative;"
        :loading="loading"
        :data="data"
        size="small"
        :row-class-name="tableRowClassName"
        :span-method="objectSpanMethod"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{scope.$index}}</span>
          </template>
        </el-table-column>
        <el-table-column property="product_model" label="产品型号"></el-table-column>
        <el-table-column property="product_code" label="存货编码">
          <template slot-scope="scope">
            <div v-if="scope.$index === 0" style="color: #0099FF !important; text-align: right; font-weight: bold">
              {{scope.row.product_code}}
            </div>
            <span v-else>{{scope.row.product_code}}</span>
          </template>
        </el-table-column>
        <el-table-column property="stock_count" label="备货数量"></el-table-column>
        <el-table-column property="stock_amount" label="备货金额（元）"></el-table-column>
        <el-table-column property="install_count" label="已安装数量"></el-table-column>
        <el-table-column property="install_amount" label="已安装金额（元）"></el-table-column>
        <el-table-column property="pay_count" label="已结算数量"></el-table-column>
        <el-table-column property="no_install_count" label="未安装数量"></el-table-column>
        <el-table-column property="no_pay_count" label="未结算数量"></el-table-column>
        <el-table-column property="no_pay_amount" label="未结算金额（元）"></el-table-column>
      </el-table>
      <Table
        v-show="false"
        ref="table"
        :columns="columns"
        :data="data"
        size="small"
      ></Table>
    </Content>
  </div>
</template>

<script>
export default {
  name: "Stock",
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "产品型号",
          key: "product_model",
        },
        {
          title: "存货编码",
          key: "product_code",
        },
        {
          title: "备货数量",
          key: "stock_count",
        },
        {
          title: "备货金额（元）",
          key: "stock_amount",
        },
        {
          title: "已安装数量",
          key: "install_count",
        },
        {
          title: "已安装金额（元）",
          key: "install_amount",
        },
        {
          title: "已结算数量",
          key: "pay_count",
        },
        {
          title: "未安装数量",
          key: "no_install_count",
        },
        {
          title: "未结算数量",
          key: "no_pay_count",
        },
        {
          title: "未结算金额（元）",
          key: "no_pay_amount",
        }
      ],
      data: [],
      showMore: false,
      showExport: false,
      tooptipShow: false,
      filterItem: {
        kssj: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        jssj: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ywgs: 0,
        hzhb: ""
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
      },
      companys: [],
      partners: [],
      partnerIds: []
    };
  },
  mounted() {
    this.getList();
    this.getManagecompanys();
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
    morehtztClick() {
      this.showExport = !this.showExport;
      //   this.glShow = false;
      if (this.showExport) {
        $(".cor1").css({ color: "#4a9af5" });
      } else {
        $(".cor1").css({ color: "#000000" });
      }
    },
    getManagecompanys() {
      let request = {
        typeid: 29008
      };
      this.$http.XLREPORT(request).then(response => {
        this.companys = response.data.result.data;
      });
    },
    getPartners() {
      if(!this.filterItem.ywgs) {
        return
      }
      let request = {
        typeid: 29007,
        data: [
          {
            company_id: this.filterItem.ywgs
          }
        ]
      };
      this.$http.XLREPORT(request).then(response => {
        this.partners = response.data.result.data;
        response.data.result.data.forEach(element => {
          this.partnerIds.push(element.agent_id)
        });
      });
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'warning-row';
      }
      return '';
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if(rowIndex === 0) {
        if (columnIndex === 0) {
          return {
            rowspan: 0,
            colspan: 0
          }
        }else if(columnIndex === 1) {
          return {
            rowspan: 1,
            colspan: 2
          }
        }
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getList();
          this.$Message.success("查询成功！");
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
      let request = {
        typeid: 29006,
        data: [
          {
            company_id: this.filterItem.ywgs,
            start_time: startTime,
            end_time: endTime,
            agent_id:  this.filterItem.hzhb ? [this.filterItem.hzhb] : this.partnerIds
          }
        ]
      };
        this.loading = true;
        this.$http.XLREPORT(request).then(
          response => {
            let res = response.data.result.data;
            const total = {
              stock_count: 0,
              stock_amount: 0,
              install_count: 0,
              install_amount: 0,
              pay_count: 0,
              pay_amount: 0,
              no_install_count: 0,
              no_install_amount: 0,
              no_pay_count: 0,
              no_pay_amount: 0,
              product_code: '总计：'
            }
            res.forEach((element, index) => {
              total['stock_count'] += element['stock_count']
              total['stock_amount'] += element['stock_amount']
              total['install_count'] += element['install_count']
              total['install_amount'] += element['install_amount']
              total['pay_count'] += element['pay_count']
              total['pay_amount'] += element['pay_amount']
              total['no_install_count'] += element['no_install_count']
              total['no_install_amount'] += element['no_install_amount']
              total['no_pay_count'] += element['no_pay_count']
              total['no_pay_amount'] += element['no_pay_amount']
            });
            this.data = res.length > 0 ? [total, ...res] : []
            this.$Message.success("查询成功！");
            this.loading = false;
          },
          error => {
            this.loading = false;
          }
        );
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
      this.$refs['table'].exportCsv({
        filename: '备货与结账统计',
        columns: this.columns,
        data: this.data
      })
      this.morehtztClick();
    }
  }
};
</script>

<style scoped>
@import "../assetmanagement/assetmanage.css";
</style>
<style>
.result {
  background: #e6f5ff;
  padding-right: 5px;
}
.warning-row {
  font-size: 14px;
  height: 80px;
  color: #000;
  background-color: rgba(242, 242, 242, 1) !important;
}
</style>
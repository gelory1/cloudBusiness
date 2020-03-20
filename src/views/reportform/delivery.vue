<template>
  <div class="address">
    <div :style="{background: '#fff',minWidth:'400px', padding: '10px', borderRadius: '5px'}">
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
        <FormItem label="时间">
          <Row>
            <Col span="4">
              <DatePicker
                style="width: 100%"
                type="date"
                placeholder="日期"
                v-model="filterItem.sj"
                :options="options"
              ></DatePicker>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="业务公司" prop="ywgs">
          <Row>
            <Col :span="8">
              <Select v-model="filterItem.ywgs" clearable filterable placeholder="所有业务公司">
                <Option :value="item.company_id" v-for="(item,index) in companys" :key="index">{{item.company}}</Option>
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
        :row-class-name="tableRowClassName"
        :span-method="objectSpanMethod"
        :data="data"
        size="small"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="50">
          <template slot-scope="scope">
            <span>{{scope.$index}}</span>
          </template>
        </el-table-column>
        <el-table-column property="product_code" label="存货编码"></el-table-column>
        <el-table-column property="product_name" label="产品名称" width="350"></el-table-column>
        <el-table-column property="product_model" label="产品型号" width="300">
          <template slot-scope="scope">
            <div v-if="scope.$index === 0" style="color: #0099FF !important; text-align: right; font-weight: bold">
              {{scope.row.product_model}}
            </div>
            <span v-else>{{scope.row.product_model}}</span>
          </template>
        </el-table-column>
        <el-table-column property="stock" label="当日库存"></el-table-column>
        <el-table-column property="in_day" label="当日入库"></el-table-column>
        <el-table-column property="out_day" label="当日发货"></el-table-column>
        <el-table-column property="to_sent" label="待发数量"></el-table-column>
        <el-table-column property="in_month" label="本月累计入库"></el-table-column>
        <el-table-column property="out_month" label="本月累计发货"></el-table-column>
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
  name: "delivery",
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "存货编码",
          key: "product_code",
        },
        {
          title: "产品名称",
          key: "product_name",
        },
        {
          title: "产品型号",
          key: "product_model",
        },
        {
          title: "当日库存",
          key: "stock",
        },
        {
          title: "当日入库",
          key: "in_day",
        },
        {
          title: "当日发货",
          key: "out_day",
        },
        {
          title: "待发数量",
          key: "to_sent",
        },
        {
          title: "本月累计入库",
          key: "in_month",
        },
        {
          title: "本月累计发货",
          key: "out_month",
        }
      ],
      data: [],
      showMore: false,
      showExport: false,
      filterItem: {
        sj: new Date(),
        ywgs: 0,
      },
      companys: [],
      options: {
        disabledDate: time => {
          return time.getTime() > new Date().getTime();
        }
      },
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
    getManagecompanys() {
      let request = {
        typeid: 29008
      };
      this.$http.XLREPORT(request).then(response => {
        this.companys = response.data.result.data;
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getList();
        } else {
          this.$Message.error("查询失败，请重试!");
        }
      });
    },
    getList() {
      let time = ""
      if (this.filterItem.sj && this.filterItem.sj !== "") {
        time =
          this.filterItem.sj.getFullYear() +
          "-" +
          ((this.filterItem.sj.getMonth() + 1) < 10 ? ('0'+(this.filterItem.sj.getMonth() + 1)) : (this.filterItem.sj.getMonth() + 1) )+
          "-" +
          (this.filterItem.sj.getDate() < 10 ? ('0' + this.filterItem.sj.getDate()): this.filterItem.sj.getDate())
      }
    
      let request = {
        typeid: 29005,
        data: [
          {
            company_id: this.filterItem.ywgs,
            datetime: time
          }
        ]
      };
        this.loading = true;
        this.$http.XLREPORT(request).then(
          response => {
            let res = response.data.result.data;
            const total = {
              in_day: 0,
              out_day: 0,
              out_month: 0,
              to_sent: 0,
              stock: 0,
              in_month: 0,
              product_model: '总计：'
            }
            res.forEach((element, index) => {
              total['in_day'] += element['in_day']
              total['out_day'] += element['out_day']
              total['out_month'] += element['out_month']
              total['to_sent'] += element['to_sent']
              total['stock'] += element['stock']
              total['in_month'] += element['in_month']
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
        filename: '发货台账统计',
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
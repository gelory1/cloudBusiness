<template>
  <div class="contract" @click="contractClick('outside')">
    <Layout>
      <Menu width="auto" size="small">
        <div class="tip" style="float:left;margin-top:10px;">
          <p class="tooltip" @click.stop="contractClick('inside')">
            {{selectedStatus.status}}
            <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
          </p>
          <div class="tooltipslot" v-show="tooptipShow">
            <p
              v-for="(item,index) in contractStatus"
              @click="changeStatus(index)"
              :key="index"
            >{{item.status}}</p>
          </div>
        </div>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;">
            <Input
              icon="ios-search"
              placeholder="请输入内容"
              style="width: 200px;margin-right:20px;"
              v-model="inputVal"
              @on-enter="goSearch"
              @on-click="goSearch"
            />
            <span class="f_gl">
              <span @click="glhtztClick" class="cor">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>
              <!-- 过滤 -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="filterItem" :model="filterItem" :label-width="100">
                  <FormItem label="客户名称" prop="customerName">
                    <Input type="text" v-model="filterItem.customerName" />
                  </FormItem>
                  <FormItem label="合同性质" prop="contractNature">
                    <Select v-model="filterItem.contractNature" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in natures"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="合同内容" prop="htnr">
                    <Select v-model="filterItem.contractContent" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in contents"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="省份/城市" prop="city">
                    <Row>
                      <Col span="12">
                        <Select v-model="filterItem.province" clearable filterable>
                          <Option
                            :value="item.id"
                            v-for="(item,index) in provinces"
                            :key="index"
                          >{{item.name}}</Option>
                        </Select>
                      </Col>
                      <Col span="12">
                        <Select v-model="filterItem.city" clearable filterable :disabled="disabled">
                          <Option
                            :value="item.id"
                            v-for="(item,index) in citys"
                            :key="index"
                          >{{item.name}}</Option>
                        </Select>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="运营公司" prop="manageCompany">
                    <Select v-model="filterItem.manageCompany" clearable filterable>
                      <Option
                        :value="item.id"
                        v-for="(item,index) in companys"
                        :key="index"
                      >{{item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售性质" prop="salesType">
                    <Select v-model="filterItem.salesType" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in salesTypes"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售人员" prop="saleName">
                    <Input type="text" v-model="filterItem.saleName" />
                  </FormItem>
                  <FormItem label="建档日期">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          placeholder="开始日期"
                          v-model="filterItem.signStarttime"
                          :options="startOption"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          placeholder="结束日期"
                          v-model="filterItem.signEndtime"
                          :options="endOption"
                          @on-change="changeTime"
                        ></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="合同到期时间于">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          :options="startOption1"
                          placement="bottom"
                          placeholder="开始日期"
                          v-model="filterItem.dueStarttime"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          :options="endOption1"
                          placeholder="结束日期"
                          v-model="filterItem.dueEndtime"
                        ></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Button @click="handleResetht('filterItem')" style="margin-left: 8px">重置</Button>
                    <Button type="primary" @click="handleSubmitht('filterItem')">确定</Button>
                  </FormItem>
                </Form>
              </div>
            </span>
            <span style="padding:0 5px">|</span>
            <span class="f-more">
              <span @click="morehtztClick" class="cor1">
                <Icon type="navicon-round"></Icon>
                <span>更多</span>
              </span>
              <!-- 更多 -->
              <div v-show="moreShow" class="more">
                <p>导出所选结果</p>
                <p>导出全部结果</p>
                <p>上传合同附件</p>
              </div>
            </span>
          </div>
        </Header>
      </Menu>
      <Content :style="{background: '#fff', minHeight: '800px'}" style="padding-left:20px">
        <Table
          style="position:relative;"
          :columns="contract_columns"
          :loading="loading"
          :data="contract_data"
          size="small"
        ></Table>
        <Page
          :total="sum"
          :current.sync="pageNum"
          :page-size="10"
          @on-change="getContracts"
          size="small"
          show-elevator
          style="text-align:center;margin-top:20px;"
        ></Page>
      </Content>
    </Layout>
  </div>
</template>
``
<script>
const contractStatus = [
  {
    status: "所有合同状态",
    index: -1
  },
  {
    status: "审批签约中",
    index: 0
  },
  {
    status: "生效实施中",
    index: 1
  },
  {
    status: "上线试运行",
    index: 2
  },
  {
    status: "回款待确认",
    index: 3
  },
  {
    status: "财务开票中",
    index: 4
  },
  {
    status: "商务转运营",
    index: 5
  },
  {
    status: "到期待续签",
    index: 6
  }
];
const contractNatureMap = {
  1: "新签",
  2: "续签",
  3: "补装",
  4: "移点",
  5: "减点",
  6: "重签",
  7: "作废",
  8: "续费",
  9: "其他"
};
const contractContentMap = {
  1: "配用电",
  2: "环保设施智能监测系统",
  3: "中央空调",
  4: "油烟监测",
  5: "工地扬尘",
  6: "园区抄表",
  7: "综合能源",
  100: "其他"
};
const contents = [
  {
    val: "配用电",
    index: 1
  },
  {
    val: "环保设施智能监测系统",
    index: 2
  },
  {
    val: "中央空调",
    index: 3
  },
  {
    val: "油烟监测",
    index: 4
  },
  {
    val: "工地扬尘",
    index: 5
  },
  {
    val: "园区抄表",
    index: 6
  },
  {
    val: "综合能源",
    index: 7
  },
  {
    val: "其他",
    index: 100
  }
];
const natures = [
  {
    val: "新签",
    index: 1
  },
  {
    val: "续签",
    index: 2
  },
  {
    val: "补装",
    index: 3
  },
  {
    val: "移点",
    index: 4
  },
  {
    val: "减点",
    index: 5
  },
  {
    val: "重签",
    index: 6
  },
  {
    val: "作废",
    index: 7
  },
  {
    val: "续费",
    index: 8
  },
  {
    val: "其他",
    index: 9
  }
];
const salesTypeMap = {
  1: "渠道",
  2: "直销",
  3: "其他"
};
const salesTypes = [
  {
    val: "渠道",
    index: 1
  },
  {
    val: "直销",
    index: 2
  },
  {
    val: "其他",
    index: 3
  }
];
const statusColorMap = {
  审批签约中: {
    backgroundColor: "#FDF6EC",
    color: "#E7A440"
  },
  生效实施中: {
    backgroundColor: "#F0F9EC",
    color: "#78C950"
  },
  上线试运行: {
    backgroundColor: "#CCF5F5",
    color: "#66E0E0"
  },
  回款待确认: {
    backgroundColor: "#EBF5FE",
    color: "#54A3F6"
  },
  财务开票中: {
    backgroundColor: "#EEEEFF",
    color: "#7272D0"
  },
  商务转运营: {
    backgroundColor: "#F4F4F5",
    color: "#7D7F82"
  },
  到期待续签: {
    backgroundColor: "#F8EBEB",
    color: "#F68C8C"
  }
};
export default {
  name: "contract",
  data() {
    return {
      contractStatus,
      contractNatureMap,
      salesTypeMap,
      contract_columns: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "合同编号",
          key: "contractNo",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  class: "iconShow",
                  style: {},
                  on: {
                    click: () => {
                      this.openDetail(params.row);
                    }
                  }
                },
                params.row.contractNo
              )
            ]);
          }
        },
        {
          title: "合同性质",
          key: "contractNature",
          align: "center"
        },
        {
          title: "合同状态",
          key: "contractStatus",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "ghost",
                    size: "small"
                  },
                  style: {
                    backgroundColor: params.row.contractStatus
                      ? statusColorMap[params.row.contractStatus]
                          .backgroundColor
                      : "white",
                    color: params.row.contractStatus
                      ? statusColorMap[params.row.contractStatus].color
                      : "#7D7F82"
                  }
                },
                params.row.contractStatus
              )
            ]);
          }
        },
        {
          title: "归档时间",
          key: "archiveTime",
          align: "center"
        },
        {
          title: "合同到期时间",
          key: "dueTime",
          align: "center",
          width: 120
        },
        {
          title: "合同名称",
          key: "customerName",
          align: "center"
        },
        {
          title: "省份城市",
          key: "city",
          align: "center"
        },
        {
          title: "销售方式",
          key: "saleType",
          align: "center"
        },
        {
          title: "销售负责人",
          key: "saleName",
          align: "center"
        },
        {
          title: "运营公司",
          key: "manageCompany",
          align: "center"
        }
      ],
      contract_data: [
        {
          saleName: "热尔"
        }
      ],
      filterItem: {
        customerName: "",
        contractNature: "",
        contractContent: "",
        province: "",
        city: "",
        manageCompany: "",
        salesType: "",
        saleName: "",
        signStarttime: "",
        signEndtime: "",
        dueStarttime: "",
        dueEndtime: ""
      },
      startOption:{
        disabledDate:time =>{
          if(this.filterItem.signEndtime){
            return time.getTime() > new Date(this.filterItem.signEndtime).getTime()
          }
        }
      },
      endOption:{
        disabledDate:time =>{
          if(this.filterItem.signStarttime){
            return time.getTime() < new Date(this.filterItem.signStarttime).getTime()
          }
        }
      },
      startOption1:{
        disabledDate:time =>{
          if(this.filterItem.dueEndtime){
            return time.getTime() > new Date(this.filterItem.dueEndtime).getTime()
          }
        }
      },
      endOption1:{
        disabledDate:time =>{
          if(this.filterItem.dueStarttime){
            return time.getTime() < new Date(this.filterItem.dueStarttime).getTime()
          }
        }
      },
      khmch: [
        {
          val: ""
        }
      ],
      htxzh: [
        {
          val: ""
        }
      ],
      htnrh: [],
      cityh: [],
      yygsh: [],
      salesTypeh: [],
      tooptipShow: false,
      glShow: false,
      moreShow: false,
      disabled: true,
      butZT: "XXX",
      selectedStatus: contractStatus[0],
      sum: 0,
      inputVal: "",
      loading: false,
      pageNum: 1,
      filterStatus: false,
      natures,
      salesTypes,
      provinces: [],
      citys: [],
      companys: [],
      contractContentMap,
      contents
    };
  },
  methods: {
    changeTime(){
      if (
        new Date(this.filterItem.signStarttime).getTime() <
        new Date(this.filterItem.signEndtime).getTime()
      ) {
        this.$message.error("结束时间不能小于开始时间");
        return false;
      }
    },
    contractClick(side) {
      if (side === "inside") {
        this.tooptipShow = !this.tooptipShow;
      } else if (side === "outside") {
        if (this.tooptipShow) this.tooptipShow = false;
      }
    },
    changeStatus(index) {
      this.tooptipShow = false;
      this.selectedStatus = this.contractStatus[index];
      this.pageNum = 1;
      this.getContracts(1);
    },
    openDetail(data) {
      this.$store.commit("selectedContract", JSON.parse(JSON.stringify(data)));
      localStorage.setItem("contractInfo", JSON.stringify(data));
      this.$router.push({ path: "/contractmanage/detail" });
    },
    handleSubmitht(name) {
      let status = true;
      for (let key in this.filterItem) {
        if (this.filterItem[key] !== "" && this.filterItem[key] !== 0) {
          status = false;
        }
      }
      if (status) {
        this.filterStatus = false;
        $(".cor").css({ color: "#000000" });
        this.glShow = false;
        this.getContracts(1);
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.filterStatus = true;
          this.glShow = false;
          this.getContracts(1);
          // this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleResetht() {
      this.filterStatus = false;
      for (let key in this.filterItem) {
        this.filterItem[key] = "";
      }
    },
    glhtztClick() {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow || this.filterStatus) {
        $(".cor").css({ color: "#4a9af5" });
        $(".cor1").css({ color: "#000000" });
      } else {
        $(".cor").css({ color: "#000000" });
      }
    },
    morehtztClick() {
      this.moreShow = !this.moreShow;
      this.glShow = false;
      if (this.moreShow) {
        $(".cor1").css({ color: "#4a9af5" });
        // $(".cor").css({ color: "#000000" });
      } else {
        $(".cor1").css({ color: "#000000" });
      }
    },
    closeglClick() {
      this.glShow = false;
      if (!this.filterStatus) $(".cor").css({ color: "#000000" });
    },
    getContracts(p) {
      let request = {
        typeid: 26001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            customerName: this.filterItem.customerName,
            signStarttime:
              this.filterItem.signStarttime === ""
                ? ""
                : this.filterItem.signStarttime.getFullYear() +
                  "-" +
                  (this.filterItem.signStarttime.getMonth() + 1) +
                  "-" +
                  this.filterItem.signStarttime.getDate() +
                  " 00:00:00",
            signEndtime:
              this.filterItem.signEndtime === ""
                ? ""
                : this.filterItem.signEndtime.getFullYear() +
                  "-" +
                  (this.filterItem.signEndtime.getMonth() + 1) +
                  "-" +
                  this.filterItem.signEndtime.getDate() +
                  " 23:59:59",
            dueStarttime:
              this.filterItem.dueStarttime === ""
                ? ""
                : this.filterItem.dueStarttime.getFullYear() +
                  "-" +
                  (this.filterItem.dueStarttime.getMonth() + 1) +
                  "-" +
                  this.filterItem.dueStarttime.getDate() +
                  " 00:00:00",
            dueEndtime:
              this.filterItem.dueEndtime === ""
                ? ""
                : this.filterItem.dueEndtime.getFullYear() +
                  "-" +
                  (this.filterItem.dueEndtime.getMonth() + 1) +
                  "-" +
                  this.filterItem.dueEndtime.getDate() +
                  " 23:59:59",
            contractNature:
              this.filterItem.contractNature === ""
                ? 0
                : this.filterItem.contractNature,
            contractContent:
              this.filterItem.contractContent === ""
                ? 0
                : this.filterItem.contractContent,
            customerProvince:
              this.filterItem.province === "" ? 0 : this.filterItem.province,
            customerCity:
              this.filterItem.city === "" ? 0 : this.filterItem.city,
            manageCompany:
              this.filterItem.manageCompany === ""
                ? 0
                : this.filterItem.manageCompany,
            saleType:
              this.filterItem.salesType === "" ? 0 : this.filterItem.salesType,
            saleName: this.filterItem.saleName,
            keyword: this.inputVal,
            contractStatus: this.selectedStatus.index,
            page_num: p,
            page_size: 10
          }
        ]
      };
      this.contract_data = [];
      this.loading = true;
      this.$http.XLCONTRACT(request).then(
        response => {
          console.log(response);
          let { data } = response.data.result;
          this.sum = data.sum;
          data.contractList.forEach(con => {
            let item = {};
            item.contractNo = con.contractNo;
            item.contractNature = this.contractNatureMap[con.contractNature];
            item.contractStatus = this.contractStatus.find(
              s => s.index === con.contractStatus
            ).status;
            item.archiveTime = con.archiveTime;
            item.dueTime = con.dueTime;
            item.customerName =
              (con.customerName || "") +
              "-" +
              this.contractContentMap[con.contractContent];
            item.city =
              (con.customerProvince_cn || "--") +
              " " +
              (con.customerCity_cn || "--");
            item.saleType = this.salesTypeMap[con.saleType];
            item.saleName = con.saleManName;
            item.manageCompany = con.manageCompanyName;
            item.data = con;
            this.contract_data.push(item);
          });
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
    },
    goSearch() {
      this.pageNum = 1;
      this.getContracts(1);
    },
    getProvinces() {
      let request = {
        typeid: 27002
      };
      this.$http.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.provinces = res;
        this.$store.commit("getProvinces", res);
      });
    },
    getCitys() {
      if (this.filterItem.province === "") this.filterItem.province = 0;
      let request = {
        typeid: 27003,
        data: [
          {
            province: this.filterItem.province
          }
        ]
      };
      this.citys = [];
      this.$http.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.citys = res;
      });
    },
    getManagecompanys() {
      let request = {
        typeid: 27001
      };
      this.$http.XLSELECT(request).then(response => {
        this.companys = response.data.result.data;
      });
    }
  },
  mounted() {
    this.getContracts(1);
    this.getProvinces();
    this.getManagecompanys();
  },
  watch: {
    "filterItem.province": function(nv) {
      if (nv !== 0 && nv !== "") this.getCitys();
      if (this.filterItem.province == "") {
        this.filterItem.city = "";
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    }
  }
};
</script>

<style>
@import "../assetmanagement/assetmanage.css";
@import "../customermanage/customer.css";
@import "./contract.css";
</style>
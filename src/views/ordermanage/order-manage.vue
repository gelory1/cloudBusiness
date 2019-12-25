<template>
  <div class="order" @click="selectedDown('outside')">
    <Layout>
      <Menu width="auto" size="small" style="height:60px;">
        <div class="tip" style="float:left;margin-top:-5px;">
          <p
            class="tooltip"
            @click.stop="selectedDown('inside')"
            style="margin-top:20px;margin-left:20px;"
          >
            {{selectedType.type ==='全部'?'所有订单类型':selectedType.type}}
            <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
          </p>
          <div class="tooltipslot" v-show="tooptipShow">
            <p
              v-for="(item,index) in orderTypes"
              :key="item.type"
              @click="selectOrderType(index)"
            >{{item.type}}</p>
          </div>
        </div>
        <Header :style="{background: '#fff',minWidth:'400px',postion:'relative'}">
          <div style="float:right;">
            <Input
              icon="ios-search"
              placeholder="请输入内容"
              v-model="inputVal"
              @on-enter="search"
              @on-click="search"
              style="width: 200px;margin-right:20px;"
            />
            <span class="f_gl">
              <span @click="glkhClick" class="cor">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>
              <!--  -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="filterItem" :model="filterItem" :label-width="80">
                  <FormItem label="运营公司" prop="yygs">
                    <Select v-model="filterItem.manageCompany" clearable filterable>
                      <Option
                        :value="item.id"
                        v-for="(item,index) in companys"
                        :key="index"
                      >{{item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售类型" prop="xslx">
                    <Select v-model="filterItem.salesType" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in salesTypes"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售人员" prop="saleName">
                    <Input type="text" placeholder="请输入销售人员姓名" v-model="filterItem.saleName" />
                  </FormItem>
                  <FormItem label="下单日期">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          :options="startOption"
                          placement="top"
                          placeholder="开始日期"
                          v-model="filterItem.startTime"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          :options="endOption"
                          placement="top"
                          placeholder="结束日期"
                          v-model="filterItem.endTime"
                        ></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Button @click="handleReset('filterItem')" style="margin-left: 8px">重置</Button>
                    <Button type="primary" @click="handleSubmitgl('filterItem')">确定</Button>
                  </FormItem>
                </Form>
              </div>
            </span>
            <span style="padding:0 5px">|</span>
            <span class="f-more">
              <span @click="moreClick" class="cor1">
                <Icon type="navicon-round"></Icon>
                <span>更多</span>
              </span>
              <!-- 更多 -->
              <div v-show="moreShow" class="more">
                <p @click="plfhClick" style="cursor:pointer">批量发货</p>
              </div>
            </span>
          </div>
        </Header>
        <Button
          type="primary"
          icon="ios-plus-empty"
          class="addBut1"
          style="margin-top:5px;"
          @click="addOrder"
        >申请备货</Button>
      </Menu>
      <Content
        :style="{background: '#fff', minHeight: '800px'}"
        style="padding-left:20px;margin-top:0px;"
      >
        <Tabs ref="tab" v-model="tabName">
          <TabPane
            v-for="item in orderStatus"
            :label="item.type"
            :name="item.name"
            :key="item.name"
          >
            <Table
              :columns="order_columns"
              :data="order_data[item.index]"
              size="small"
              @on-selection-change="changeSelection"
              :loading="loading"
            ></Table>
            <Page
              :current.sync="pageNum"
              :total="sum"
              :page-size="10"
              size="small"
              show-total
              @on-change="getOrderList"
              show-elevator
              style="text-align:center;margin-top:20px;margin-bottom:200px"
            ></Page>
          </TabPane>
        </Tabs>
        <Modal v-model="orderDetailOpen" width="1000">
          <orderDetail :orderNO="selectedOrder"></orderDetail>
        </Modal>
      </Content>
    </Layout>
  </div>
</template>
<script>
let $ = require("jquery");
import api from "@/api/axios";
import orderDetail from "./order-detail";
const orderStatus1 = [
  {
    type: "全部",
    name: "name1",
    index: 0
  },
  {
    type: "已下单",
    name: "name8",
    index: 3
  },
  {
    type: "已发货",
    name: "name9",
    index: 4
  },
  {
    type: "已到货",
    name: "name10",
    index: 5
  }
];
const orderStatus2 = [
  {
    type: "全部",
    name: "name1",
    index: 0
  },
  {
    type: "审批中",
    name: "name2",
    index: 1
  },
  {
    type: "待支付",
    name: "name3",
    index: 2
  },
  {
    type: "已下单",
    name: "name4",
    index: 3
  },
  {
    type: "已发货",
    name: "name5",
    index: 4
  },
  {
    type: "已到货",
    name: "name6",
    index: 5
  },
  {
    type: "被驳回",
    name: "name7",
    index: 6
  }
];
const orderTypes = [
  {
    type: "全部",
    ids: [0, 1]
  },
  {
    type: "合同订单",
    ids: [0]
  },
  {
    type: "备货订单",
    ids: [1]
  }
];
const businessMap = {
  0: "合同订单",
  1: "备货订单"
};
const saleMap = {
  2: "直销",
  1: "渠道",
  3: "其他"
};
const statusMap = {
  0: "审批中",
  1: "待支付",
  2: "已下单",
  3: "已发货",
  4: "已到货",
  5: "被驳回"
};
const statusMap2 = {
  0: "申请",
  1: "审批",
  2: "支付",
  3: "下单",
  4: "出库",
  5: "到货"
};
const statusColorMap = {
  审批中: {
    backgroundColor: "#FDF6EC",
    color: "#E7A440"
  },
  待支付: {
    backgroundColor: "#F0F9EC",
    color: "#78C950"
  },
  已下单: {
    backgroundColor: "#F4F4F5",
    color: "#7D7F82"
  },
  已发货: {
    backgroundColor: "#EEEEFF",
    color: "#7272D0"
  },
  已到货: {
    backgroundColor: "#EBF5FE",
    color: "#54A3F6"
  },
  被驳回: {
    backgroundColor: "#F4F4F5",
    color: "#7D7F82"
  }
};
const deviceList_columns = [
  {
    title: "条码",
    key: "tm",
    align: "center"
  },
  {
    title: "存货编码",
    key: "chbm",
    align: "center"
  },
  {
    title: "存货名称",
    key: "chmc",
    align: "center"
  },
  {
    title: "规格型号",
    key: "ggxh",
    align: "center"
  },
  {
    title: "计量单位",
    key: "jldw",
    align: "center"
  },
  {
    title: "箱码",
    key: "xm",
    align: "center"
  },
  {
    title: "状态",
    key: "zt",
    align: "center"
  },
  {
    title: "最新操作时间",
    key: "newtime",
    width: 150,
    align: "center"
  }
];
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

export default {
  name: "orderManage",
  components: { orderDetail },
  data() {
    return {
      orderStatus1,
      orderStatus2,
      tabName: "name1",
      order_columns:[
        {
          type: "selection",
          align: "center",
          width: 80
        },
        {
          key: "orderNO",
          title: "单据编号",
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
                      this.openOrder(params.row);
                    }
                  }
                },
                params.row.orderNO
              )
            ]);
          }
        },
        {
          key: "type",
          title: "业务类型",
          width: 100,
          align: "center"
        },
        {
          key: "time",
          title: "下单时间",
          align: "center"
        },
        {
          key: "salesType",
          title: "销售类型",
          width: 100,
          align: "center"
        },
        {
          key: "customName",
          title: "客户名称",
          align: "center",
          width: 250
        },
        {
          key: "contractNO",
          title: "合同编号",
          align: "center"
        },
        {
          key: "count",
          title: "设备数量",
          width: 100,
          align: "center"
        },
        {
          key: "status",
          title: "状态",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    // type: "",
                    size: "small"
                  },
                  style: {
                    backgroundColor: params.row.status
                      ? statusColorMap[params.row.status].backgroundColor
                      : "white",
                    color: params.row.status
                      ? statusColorMap[params.row.status].color
                      : "#7D7F82"
                  }
                },
                params.row.status || "无状态"
              )
            ]);
          }
        }
      ],
      order_data: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      },
      tooptipShow: false,
      businessMap,
      saleMap,
      statusMap,
      loading: false,
      orderDetailOpen: false,
      selectedOrder: "",
      bcjh: "700",
      sydf: "9090",
      filterItem: {
        manageCompany: "",
        salesType: "",
        saleName: "",
        startTime: "",
        endTime: ""
      },
      startOption: {
        disabledDate: time => {
          if (this.filterItem.endTime) {
            return time.getTime() > new Date(this.filterItem.endTime).getTime();
          }
        }
      },
      endOption: {
        disabledDate: time => {
          if (this.filterItem.startTime) {
            return (
              time.getTime() < new Date(this.filterItem.startTime).getTime()
            );
          }
        }
      },
      device_data: [],
      deviceList_columns,
      deviceList_data: [],
      deviceSum: 0,
      statusMap2,
      glShow: false,
      moreShow: false,
      sum: 0,
      inputVal: "",
      pageNum: 1,
      orderTypes,
      selectedType: orderTypes[0],
      statusColorMap,
      salesTypes,
      companys: [],
      filterStatus: false,
      deviceTabName: "name1",
      selectOrderList: {}
    };
  },
  methods: {
    plfhClick() {
      let list = [];
      let status = false;
      if (!this.$store.state.app.authority.find(a => a.id === 1005)) {
        this.$Message.error("权限不足！");
        return;
      }
      for (let key in this.selectOrderList) {
        this.selectOrderList[key].forEach(s => {
          if (s.status !== "已下单") {
            status = true;
          } else {
            list.push(s.data.order_id);
          }
        });
      }
      if (list.length === 0) {
        if (status) {
          this.$Message.error("只能选择订单状态为已下单的订单，请重新选择！");
          return;
        }
        this.$Message.error("请先选择需要发货的订单！");
        return;
      }
      if (status) {
        this.$Message.info("只能添加订单状态为已下单的订单，已为您自动过滤掉其他状态的订单！");
      }
      this.$router.push({
        path: "/assetmanage/delivery-manage/newbuild",
        query: { order: JSON.stringify(list) }
      });
    },
    selectedDown(side) {
      if (side === "inside") {
        this.tooptipShow = !this.tooptipShow;
      } else if (side === "outside") {
        if (this.tooptipShow) this.tooptipShow = false;
      }
    },
    selectOrderType(index) {
      this.tabName = "name1";
      this.selectedType = this.orderTypes[index];
      this.pageNum = 1;
      this.getOrderList(1);
    },
    openOrder(o) {
      this.orderDetailOpen = true;
      this.selectedOrder = o.orderNO;
    },
    getOrderList(p) {
      this.order_data[this.selectedTab.index] = [];
      this.loading = true;
      this.sum = 0;
      const param = {
        typeid: 24007,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            order_status:
              this.selectedTab.index === 0
                ? undefined
                : this.selectedTab.index - 1,
            // customer_name:'',
            order_starttime:
              this.filterItem.startTime === ""
                ? undefined
                : this.filterItem.startTime.getFullYear() +
                  "-" +
                  (this.filterItem.startTime.getMonth() + 1) +
                  "-" +
                  this.filterItem.startTime.getDate() +
                  " 00:00:00",
            order_endtime:
              this.filterItem.endTime === ""
                ? undefined
                : this.filterItem.endTime.getFullYear() +
                  "-" +
                  (this.filterItem.endTime.getMonth() + 1) +
                  "-" +
                  this.filterItem.endTime.getDate() +
                  " 23:59:59",
            order_type: this.selectedType.ids,
            sale_type:
              this.filterItem.salesType === ""
                ? undefined
                : this.filterItem.salesType,
            // contract_subject:0,
            sell_name:
              this.filterItem.saleName === ""
                ? undefined
                : this.filterItem.saleName,
            company_id:
              this.filterItem.manageCompany === ""
                ? undefined
                : this.filterItem.manageCompany,
            keyword: this.inputVal === "" ? undefined : this.inputVal,
            page_num: p,
            page_size: 10
          }
        ]
      };
      api.XLORDER(param).then(
        res => {
          this.loading = false;
          let index = this.selectedTab.index || 0;
          this.sum = res.data.result.data[0].sum;
          res.data.result.data[0].orderList.forEach(data => {
            let item = {};
            if (
              (this.selectOrderList[this.pageNum] || []).find(
                s => s.data.order_id === data.order_id
              )
            ) {
              item._checked = true;
            } else {
              item._checked = false;
            }
            item.orderNO = data.order_no;
            item.type = this.businessMap[data.order_type];
            item.time = data.order_time;
            item.salesType = this.saleMap[data.sale_type];
            item.customName = data.agent_name;
            item.contractNO = data.contract_no;
            item.count = data.quantity;
            item.status = this.statusMap[data.order_status];
            item.cellClassName = {
              status: `button${data.order_status}`
            };
            item.data = data;
            this.order_data[index].push(item);
          });
          // this.selectedOrder = this.order_data[0];
        },
        error => {
          this.loading = false;
        }
      );
    },
    closeglClick() {
      this.glShow = false;
      if (!this.filterStatus) $(".cor").css({ color: "#000000" });
    },
    search() {
      this.pageNum = 1;
      this.getOrderList(1);
    },
    glkhClick() {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow || this.filterStatus) {
        $(".cor").css({ color: "#4a9af5" });
        $(".cor1").css({ color: "#000000" });
      } else {
        $(".cor").css({ color: "#000000" });
      }
    },
    moreClick() {
      this.moreShow = !this.moreShow;
      this.glShow = false;
      if (this.moreShow) {
        $(".cor1").css({ color: "#4a9af5" });
        // $(".cor").css({ color: "#000000" });
      } else {
        $(".cor1").css({ color: "#000000" });
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
    handleSubmitgl(name) {
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
        this.getOrderList(1);
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.filterStatus = true;
          this.glShow = false;
          this.getOrderList(1);
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset() {
      this.filterStatus = false;
      for (let key in this.filterItem) {
        this.filterItem[key] = "";
      }
    },
    addOrder(){
      if(!this.$store.state.app.authority.find(a => a.id === 901)||!(this.isCooperative||this.isSuper)){
        this.$Message.error('权限不足！');
        return;
      }
      this.$router.push("/ordermanage/create");
    },
    toPay() {
      // console.log(111);
    },
    changeSelection(selection) {
      if (!this.selectOrderList[this.pageNum]) {
        this.selectOrderList[this.pageNum] = [];
      }
      this.selectOrderList[this.pageNum] = selection;
    }
  },
  mounted() {
    this.getOrderList(1);
    this.getManagecompanys();
    $(".ivu-poptip-body-content-inner").css("color", "#2d8cf0");
    $(".ivu-poptip-body-content-inner").css("cursor", "pointer");
    $(".ivu-poptip-body").on("click", () => {
      this.toPay();
    });
  },
  computed:{
    selectedTab(){
      let select = {};
      if (this.orderStatus.length > 0) {
        select = this.orderStatus.find(t => t.name === this.tabName);
      }
      return select;
    },
    orderStatus() {
      let orderStatus = [];
      if (this.selectedType && this.selectedType.type === "合同订单") {
        this.orderStatus1.forEach(item => {
          orderStatus.push(item);
        });
      } else if (this.selectedType) {
        this.orderStatus2.forEach(item => {
          orderStatus.push(item);
        });
      }
      return orderStatus;
    },
    isSuper(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '超级管理员');
      }
    },
    isSale(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '销售人员');
      }
    },
    isCooperative(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '合作伙伴');
      }
    }
  },
  watch: {
    tabName(nv) {
      this.pageNum = 1;
      this.getOrderList(1);
    }
  }
};
</script>

<style>
@import "../assetmanagement/assetmanage.css";
@import "../customermanage/customer.css";
.button0 {
  color: blue;
}
.ivu-layout-header {
  line-height: 50px;
  height: 50px;
}
/* .order .ivu-menu-light{
  position:relative;
  z-index: 0
} */
</style>
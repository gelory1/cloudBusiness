<template>
  <div class="delivery" @click="tooltipClick('outside')">
    <Layout>
      <Menu width="auto" size="small" style="height:70px;">
        <div class="fh_but">
          <Button type="ghost" style="margin-top:15px;margin-left:5px;">发货方案查询</Button>
        </div>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;" @click.stop="tooltipClick('inside')">
            <Input
              icon="ios-search"
              placeholder="请输入内容"
              v-model="inputVal"
              @on-enter="getDeliveryList(1)"
              @on-click="getDeliveryList(1)"
              style="width: 200px;margin-right:20px;"
            />
            <span class="f_gl">
              <span class="cor" @click="glkhClick">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>

              <!-- 过滤页面... -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="filterItem" :model="filterItem" :label-width="100">
                  <FormItem label="客户名称" prop="customerName">
                    <Input type="text" v-model="filterItem.customerName" />
                  </FormItem>
                  <FormItem label="发起时间段">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          placeholder="开始日期"
                          v-model="filterItem.startTime"
                          :options="startOption"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          placeholder="结束日期"
                          v-model="filterItem.endTime"
                          :options="endOption"
                        ></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="订单数量级">
                    <Row>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.orderstart" style="width:140px"></InputNumber>
                      </Col>
                      <Col span="2" style="text-align: center">至</Col>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.orderend" style="width:140px"></InputNumber>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="设备数量级" prop>
                    <Row>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.setstart" style="width:140px"></InputNumber>
                      </Col>
                      <Col span="2" style="text-align: center">至</Col>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.setend" style="width:140px"></InputNumber>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="金额范围" prop>
                    <Row>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.moneystart" style="width:140px"></InputNumber>
                      </Col>
                      <Col span="2" style="text-align: center">至</Col>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.moneyend" style="width:140px"></InputNumber>
                      </Col>
                    </Row>
                  </FormItem>
                  <!-- <FormItem label="完成度">
                    <Row>
                      <Col span="11">
                        <Input type="text" v-model="filterItem.prostart" />
                      </Col>
                      <Col span="2" style="text-align: center">至</Col>
                      <Col span="11">
                        <Input type="text" v-model="filterItem.proend" />
                      </Col>
                    </Row>
                  </FormItem> -->
                  <FormItem>
                    <Button @click="handleResetht('filterItem')" style="margin-left: 8px">重置</Button>
                    <Button type="primary" @click="handleSubmitht('filterItem')">确定</Button>
                  </FormItem>
                </Form>
              </div>
            </span>
            <span style="padding:0 5px">|</span>
            <span class="f-more">
              <span class="cor1" @click="moreClick">
                <Icon type="navicon-round"></Icon>
                <span>更多</span>
              </span>
              <!-- 更多页面... -->
              <div v-show="moreShow" class="more">
                <p>敬请期待......</p>
              </div>
            </span>
          </div>
          <div></div>
        </Header>
         <Button
          type="primary"
          icon="ios-plus-empty"
          class="addBut1"
          @click="addClick"
        >新建发货方案</Button>
      </Menu>
      <Content
        :style="{background: '#fff', minHeight: '800px'}"
        style="padding-left:20px;margin-top:00px;"
      >
        <Tabs ref="tab" v-model="tabName" @on-change="changeTab">
          <TabPane
            v-for="(item,index) in fhStatus"
            :label="item.type"
            :name="item.name"
            :key="item.type"
          >
            <Table
              :columns="fh_columns"
              :data="fh_data"
              size="small"
              :loading="loading"
              @on-row-dblclick="editClick"
            ></Table>
            <Page
              :total="sum"
              :current.sync="pageNum"
              :page-size="10"
              size="small"
              show-total
              @on-change="getDeliveryList"
              show-elevator
              style="text-align:center;margin-top:20px;margin-bottom:200px"
            ></Page>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  </div>
</template>

<script>
const fhStatus = [
  {
    type: "全部",
    name: "name1",
    index: 0
  },
  {
    type: "草稿",
    name: "name2",
    index: 1
  },
  {
    type: "审批中",
    name: "name3",
    index: 2
  },
  {
    type: "已通过",
    name: "name4",
    index: 3
  },
  {
    type: "被驳回",
    name: "name5",
    index: 4
  }
];
export default {
  name: "deliveryManage",
  data() {
    return {
      fhStatus,
      inputVal: "",
      sum: 0,
      pageNum: 1,
      loading: false,
      glShow: false,
      moreShow: false,
      filterStatus: false,
      filterItem: {
        customerName: "",
        startTime: "",
        endTime: "",
        orderstart: 0,
        orderend: 0,
        setstart: 0,
        setend: 0,
        moneystart: 0,
        moneyend: 0,
        prostart: "",
        proend: ""
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
      fh_columns: [
        {
          type: "selection",
          align: "center",
          width: 80
        },
        {
          key: "fabh",
          title: "方案编号",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  props: {},
                  on: {
                    click: () => {
                      let data = { ...params.row };
                      data.shipments_id = data.data.shipments_id;
                      this.$router.push({
                        name: "delivery_detail",
                        query: data
                      });
                    }
                  }
                },
                params.row.fabh
              )
            ]);
          }
        },
        {
          key: "fqr",
          title: "发起人",
          align: "center"
        },
        {
          key: "fqsj",
          title: "发起时间",
          align: "center"
        },
        {
          key: "fqms",
          title: "方案描述",
          align: "center"
        },
        {
          key: "ddsl",
          title: "订单数量",
          align: "center"
        },
        {
          key: "sbsl",
          title: "设备数量",
          align: "center"
        },
        {
          key: "jexj",
          title: "金额小计（元）",
          align: "center"
        },
        {
          key: "zt",
          title: "状态",
          align: "center"
        }
      ],
      fh_data: [],
      tabName: "name1",
      filterStatus: false,
    };
  },
  methods: {
    handleSubmitht(name){
      let status = true;
      for(let key in this.filterItem){
        if(this.filterItem[key] !== ''&&this.filterItem[key] !== 0){
          status = false;
        }
      }
      if(status){
        this.filterStatus = false;
        $(".cor").css({ color: "#000000" });
        this.glShow = false;
        this.getDeliveryList(1);
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.filterStatus = true;
          this.glShow = false;
          this.getDeliveryList(1);
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleResetht(){
      this.filterStatus = false;
      for (let key in this.filterItem) {
        this.filterItem[key] = "";
      }
    },
    tooltipClick(side) {
      if (side === "inside") {
        this.tooptipShow = !this.tooptipShow;
      } else if (side === "outside") {
        if (this.tooptipShow) this.tooptipShow = false;
      }
    },
    editClick(item) {
      if (
        item.data.shipments_status === 0 ||
        item.data.shipments_status === 3
      ) {
        item.shipments_id = item.data.shipments_id;
        this.$router.push({
          name: "delivery_detail2",
          query: item
        });
      } else {
        this.$Message.error("当前状态不支持编辑！");
      }
    },
    addClick() {
      this.$router.push({
        path: "/assetmanage/delivery-manage/newbuild"
      });
    },
    getDeliveryList(p) {
      let index = this.fhStatus.find(f => f.name === this.tabName).index - 1;
      let request = {
        typeid: 23019,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            page_num: p,
            page_size: 10,
            keyword: this.inputVal,
            shipments_status: index === -1 ? undefined : index,
            agent_name:this.filterItem.customerName === "" ? undefined : this.filterItem.customerName,
            shipments_start_time:this.filterItem.startTime === "" ? undefined : this.filterItem.startTime,
            shipments_end_time:this.filterItem.endTime === "" ? undefined : this.filterItem.endTime,
            order_count_start:this.filterItem.orderstart === "" ? undefined : this.filterItem.orderstart,
            order_count_end:this.filterItem.orderend === "" ? undefined : this.filterItem.orderend,
            product_count_start:this.filterItem.setstart === "" ? undefined : this.filterItem.setstart,
            product_count_end:this.filterItem.setend === "" ? undefined : this.filterItem.setend,
            money_start:this.filterItem.moneystart === "" ? undefined : this.filterItem.moneystart,
            money_end:this.filterItem.moneyend === "" ? undefined : this.filterItem.moneyend,
          }
        ]
      };
      this.fh_data = [];
      this.loading = true;
      this.$http.PostXLASSETS(request).then(
        response => {
          this.loading = false;
          this.fh_data = [];
          let { data } = response.data.result;
          this.sum = data[0].sum;
          data[0].shipments_list.forEach(s => {
            this.fh_data.push({
              fabh: s.shipments_no,
              fqr: s.user_name,
              fqsj: s.shipments_creation_time,
              fqms: s.shipments_describe,
              ddsl: s.order_quantity,
              sbsl: s.product_sum,
              jexj: s.total_money,
              zt: (
                this.fhStatus.find(f => f.index === s.shipments_status + 1) ||
                {}
              ).type,
              data: s
            });
          });
        },
        error => {
          this.loading = false;
          this.fh_data = [];
        }
      );
    },
    changeTab() {
      this.pageNum = 1;
      this.getDeliveryList(1);
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
        $(".cor").css({ color: "#000000" });
      }
    },
    closeglClick() {
      this.glShow = false;
      if (!this.filterStatus) $(".cor").css({ color: "#000000" });
    }
  },
  mounted() {
    this.getDeliveryList(1);
  },
  watch: {
    tabName() {
      this.changeTab();
    }
  }
};
</script>

<style>
@import "../assetmanage.css";
</style>
<template>
  <div class="order" @click="selectedDown('outside')">
    <Layout>
      <Menu width="auto" size="small" style="padding-top:30px;">
        <div class="tip" style="float:left">
          <p class="tooltip" @click.stop="selectedDown('inside')">
            {{selectedType.type ==='全部'?'所有订单类型':selectedType.type}}
            <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
          </p>
          <div class="tooltipslot" v-show="tooptipShow">
            <p v-for="(item,index) in orderTypes" :key="item.type"  @click="selectOrderType(index)">{{item.type}}</p>
          </div>
        </div>
        <Header :style="{background: '#fff',minWidth:'400px',postion:'relative'}">
          <div style="float:right;">
            <Input icon="ios-search" placeholder="请输入内容" v-model="inputVal" @on-enter="getOrderList(1)" style="width: 200px;margin-right:20px;" />
            <!-- <Button type="text" @click="glShow=!glShow;">
              <Icon type="ios-list" />
              <span>过滤</span>
            </Button> -->
            <span class="f_gl">
              <span @click="glkhClick" class="cor">
                <Icon type="ios-list" />
                <span>过滤</span>
              </span>
              <!--  -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="filterItem" :model="filterItem" :label-width="80">
                  <FormItem label="运营公司" prop="yygs">
                    <Select v-model="filterItem.manageCompany" clearable>
                      <Option :value="item.id" v-for="(item,index) in companys" :key="index">{{item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售类型" prop="xslx">
                    <Select v-model="filterItem.salesType" clearable>
                      <Option :value="item.index" v-for="(item,index) in salesTypes" :key="index">{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售人员" prop="saleName">
                    <Input type="text" v-model="filterItem.saleName" />
                  </FormItem>
                  <FormItem label="下单日期">
                    <Row>
                      <Col span="11">
                        <DatePicker type="date" placeholder="开始日期" v-model="filterItem.startTime"></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker type="date" placeholder="结束日期" v-model="filterItem.endTime"></DatePicker>
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
                <Icon type="ios-list" />
                <span>更多</span>
              </span>
              <!-- 更多 -->
              <div v-show="moreShow" class="more">
                <p>敬请期待....</p>
              </div>
            </span>
          </div>       
        </Header>
      </Menu>
      <Content :style="{background: '#fff', minHeight: '800px'}" style="padding-left:20px">
        <Tabs ref="tab" v-model="tabName">
          <TabPane v-for="(item,index) in orderStatus" :label="item.type" :name="item.name" :key="item.type">
            <Table :columns="order_columns" :data="order_data[index]" size="small" @on-row-click="openOrder" :loading="loading"></Table>
             <Page
              :current.sync="pageNum"
              :total="sum"
              :page-size="10"
              size="small"
              @on-change="getOrderList"
              show-elevator
              style="text-align:center;margin-top:20px;margin-bottom:200px"
            ></Page>
          </TabPane>
        </Tabs>
      <Modal v-model="orderDetailOpen" width="1000">
        <div style="postion:relative">
          <div style="margin:30px  20px;">
            <h3>订单详情</h3>
            <p style="font-size:11px;">
              单据编号:
              <span>{{selectedOrder.order_no}}</span>
            </p>
          </div>
          <Button :style="`position:absolute;margin:30px 0 0 0;
          right:30px;top:30px;background-color:${(statusColorMap[selectedOrder.status]||{}).backgroundColor};
          color:${(statusColorMap[selectedOrder.status]||{}).color}`">{{selectedOrder.status}}</Button>
          <div style="position:relative;">
            <div style="height:28px;position:absolute;z-index:0;background-color:#49D790;color:white;border-radius:20px;">
              <div style="padding:5px;border-radius:20px;over-flow:hidden;display:flex;">
                <div style="width:190px;text-align:center" v-for="(item,index) in orderStatus" v-show="index<=selectedOrder.order_status" :key="index">{{statusMap2[index]}}</div>
              </div>
            </div>
            <div style="display:flex;padding:5px;background-color:#F2F2F2;border-radius:20px">
              <div style="width:20%;text-align:center">下单</div>
              <div style="width:20%;text-align:center">出库</div>
              <div style="width:20%;text-align:center">到货</div>
              <div style="width:20%;text-align:center">安装</div>
              <div style="width:20%;text-align:center">上线</div>
            </div>
            <div style="display:flex;padding:5px;;border-radius:20px;">
              <div style="width:20%;text-align:center" v-for="(item,index) in selectedOrder.order_resume" :key="index">{{item.operation_time}}</div>
            </div>
          </div>
          
        </div>
        <div style="clear:both;">
        <p class="djtitle">单据信息</p>
        <div style="line-height:40px;width:40%;float:left">
          <div>
            <span class="jbleft">业务类型：</span>
            <span class="jbright">{{selectedOrder.business_type}}</span>
          </div>
          <div>
            <span class="jbleft">下单时间：</span>
            <span class="jbright">{{selectedOrder.order_time}}</span>
          </div>
          <div>
            <span class="jbleft">销售类型：</span>
            <span class="jbright">{{selectedOrder.sale_type}}</span>
          </div>
          <div>
            <span class="jbleft">客户名称：</span>
            <span class="jbright">{{selectedOrder.customer_name}}</span>
          </div>
        </div>
        <div style="line-height:40px;width:50%;float:right">
          <div>
            <span class="jbleft">合同编号：</span>
            <span class="jbright">{{selectedOrder.contract_no}}</span>
          </div>
          <div>
            <span class="jbleft">合同主体：</span>
            <span class="jbright">{{subjectName[selectedOrder.contract_subject]}}</span>
          </div>
          <div>
            <span class="jbleft">设备数量：</span>
            <span class="jbright">{{selectedOrder.device_count}}</span>
          </div>
        </div>
      </div>
      <div style="clear:both;overflow: hidden;">
        <p class="djtitle">设备清单</p>
        <div>
          <Table :columns="device_columns" :data="device_data" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
        </div>
      </div>
      </Modal>
      <Modal v-model="deviceListOpen" width="800" title="设备列表">
       <Table 
        :columns="deviceList_columns"
        :data="deviceList_data" size="small" 
        >
        </Table>
        <Page
          :total="deviceSum"
          :page-size="10"
          @on-change="getDeviceList"
          size="small"
          show-elevator
          style="text-align:center;margin-top:20px;margin-bottom:200px;"
        ></Page>
      </Modal>
      </Content>
    </Layout>
  </div>
</template>
<script>
import api from "@/api/axios";
const orderStatus = [
  {
    type: "全部",
    name: 'name1',
    index: 0
  },
  {
    type: "已下单",
    name: 'name2',
    index: 1
  },
  {
    type: "已发货",
    name: 'name3',
    index: 2
  },
  {
    type: "已到货",
    name: 'name4',
    index: 3
  },
  {
    type: "已安装",
    name: 'name5',
    index: 4
  },
  {
    type: "已上线",
    name: 'name6',
    index: 5
  },
];
const orderTypes = [
  {
    type:'全部',
    ids:[0,1]
  },
  {
    type:'合同订单',
    ids:[0]
  },
  {
    type:'备货订单',
    ids:[1]
  },
]
const order_columns = [
  {
    type: 'selection',
    align: 'center',
    width: 80
  },
  {
    key: 'orderNO',
    title: '单据编号',
  },
  {
    key: 'type',
    title: '业务类型',
    width: 100
  },
  {
    key: 'time',
    title: '下单时间',
  },
  {
    key: 'salesType',
    title: '销售类型',
    width: 100
  },
  {
    key: 'customName',
    title: '客户名称',
    align: 'center',
    width: 250
  },
  {
    key: 'contractNO',
    title: '合同编号'
  },
  {
    key: 'count',
    title: '设备数量',
    width: 100
  },
  {
    key: 'status',
    title: '状态',
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
              backgroundColor: params.row.status?statusColorMap[params.row.status].backgroundColor:'white',
              color: params.row.status?statusColorMap[params.row.status].color:'#7D7F82'
            },
          },
          params.row.status||'无状态'
        )
      ]);
    }
  },

];
const businessMap = {
  0: '合同订单',
  1: '备货订单'
};
const saleMap = {
  0: '直销',
  1: '渠道'
};
const statusMap = {
  0:'已下单',1: '已发货',2:'已到货',3:'已安装',4:'已上线'
};
const statusMap2 = {
  0:'下单',1: '发货',2:'到货',3:'安装',4:'上线'
};
const statusColorMap = {
  '已下单':{
    backgroundColor: '#FDF6EC',
    color: '#E7A440'
  },
  '已发货':{
    backgroundColor: '#F0F9EC',
    color: '#78C950'
  },
  '已到货': {
    backgroundColor: '#F4F4F5',
    color: '#7D7F82'
  },
  '已安装':{
    backgroundColor: '#EEEEFF',
    color: '#7272D0'
  },
  '已上线':{
    backgroundColor: '#EBF5FE',
    color: '#54A3F6'
  }
};
const subjectName = {
  1:'电能云',
  2:'智慧能源',
  3:'维智泰',
  4:'耀邦达',
  5:'股份公司',
  6:'志达',
  7:'康源',
  8:'新联能源',
  100:'其他',
};

const deviceList_columns = [
   {
    title: "条码",
    key: "tm"
  },
  {
    title: "存货编码",
    key: "chbm"
  },
  {
    title: "存货名称",
    key: "chmc"
  },
  {
    title: "规格型号",
    key: "ggxh"
  },
  {
    title: "计量单位",
    key: "jldw"
  },
  {
    title: "箱码",
    key: "xm"
  },
  {
    title: "状态",
    key: "zt"
  },
  {
    title: "最新操作时间",
    key: "newtime",
    width:150
  }
];
const salesTypes = [
  {
    val:'渠道',
    index:1
  },
  {
    val:'直销',
    index:2
  },
  {
    val:'其他',
    index:3
  },
]

export default {
  name: "orderManage",
  data() {
    return {
      orderStatus,
      tabName: 'name1',
      order_columns,
      order_data: {
        0: [
        ],
          1: [
        ],
          2: [
        ],
          3: [
        ],
          4: [
        ],
          5: [
        ]
      },
      tooptipShow: false,
      businessMap,
      saleMap,
      statusMap,
      loading: false,
      orderDetailOpen: false,
      selectedOrder: {
      },
      device_columns: [
        {
          title: "序号",
          key: "index",
          width:80
        },
        {
          title: "存货编码",
          key: "no"
        },
        {
          title: "存货名称",
          key: "name"
        },
        {
          title: "规格型号",
          key: "spec",
          width: 200
        },
        {
          title: "计量单位",
          key: "unit"
        },
        {
          title: "数量",
          key: "count"
        },
        // {
        //   title: "操作",
        //   key: "action",
        //   width: 150,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h("Icon", {
        //         class: "demo-spin-icon-load",
        //         props: {
        //           type: "clipboard",
        //           size: 12
        //         }
        //       }),
        //       h(
        //         "span",
        //         {
        //           props: {
        //             type: "primary",
        //             size: "small",
        //             backgroundColor: "#3896f5 "
        //           },
        //           style: {
        //             marginLeft: "3px",
        //             color: "#3896f5 ",
        //             cursor: "pointer"
        //           },
        //           on: {
        //             click: () => {
        //               this.deviceListOpen = true;
        //               this.selectedprocode = params.row.no;
        //               this.getDeviceList(1);
        //             }
        //           }
        //         },
        //         "设备列表"
        //       )
        //     ]);
        //   }
        // }
      ],
      filterItem:{
        manageCompany:"",
        salesType:"",
        saleName:"",
        startTime:"",
        endTime:""
      },
      device_data: [],
      deviceListOpen: false,
      deviceList_columns,
      deviceList_data: [],
      deviceSum: 0,
      statusMap2,
      subjectName,
      glShow:false,
      moreShow:false,
      sum: 0,
      inputVal:'',
      pageNum:1,
      orderTypes,
      selectedType:orderTypes[0],
      statusColorMap,
      salesTypes,
      companys:[],
      filterStatus:false,
    };
  },
  methods: {
    selectedDown(side) {
       if(side === 'inside'){
        this.tooptipShow = !this.tooptipShow;
      }else if(side === 'outside'){
        if(this.tooptipShow) this.tooptipShow = false;
      }
    },
    selectOrderType(index) {
      this.selectedType = this.orderTypes[index];
      this.pageNum = 1;
      this.getOrderList(1);
    },
    openOrder(o){
      this.orderDetailOpen = true;
      this.getOrderDetail(o);
    },
    getOrderList(p){
      this.order_data[this.selectedTab.index] = [];
      this.loading = true;
      const param = {
        typeid: "24001",
        data: [
          {
            account_id: 520,
            order_status: this.selectedTab.index === 0?undefined:(this.selectedTab.index-1),
            // customer_name:'',
            order_starttime:this.filterItem.startTime === ''?undefined:this.filterItem.startTime,
            order_endtime:this.filterItem.endTime === ''?undefined:this.filterItem.endTime,
            order_type: this.selectedType.ids,
            sale_type:this.filterItem.salesType === ''?undefined:this.filterItem.salesType,
            // contract_subject:0,
            company_id:this.filterItem.manageCompany === ''?undefined:this.filterItem.manageCompany,
            keyword:this.inputVal === ''?undefined:this.inputVal,
            page_num: p,
            page_size: 10
          }
        ],
      };
      api.XLORDER(param).then((res)=>{
        let index = this.selectedTab.index||0;
        this.sum = res.data.result.data[0].sum;
        res.data.result.data[0].orderlist.forEach(data => {
          let item = {};
          item.orderNO = data.order_no;
          item.type = this.businessMap[data.order_type];
          item.time = data.order_time;
          item.salesType = this.saleMap[data.sale_type];
          item.customName = data.customer_name;
          item.contractNO = data.contract_no;
          item.count = data.product_count;
          item.status = this.statusMap[data.order_status];
          item.cellClassName = {
            status:`button${data.order_status}`
          };
          this.order_data[index].push(item);
        });
        this.loading = false;
      },error => {
        this.loading = false;
      })
    },
    getOrderDetail(order){
      const param = {
        typeid: "24002",
        data: [
          {
            order_no: order.orderNO
          }
        ],
      };
      this.device_data = [];
      api.XLORDER(param).then(res => {
        let { data } = res.data.result;
        this.selectedOrder = JSON.parse(JSON.stringify(data[0]));
        this.selectedOrder.status = this.statusMap[this.selectedOrder.order_status];
        data[0].product_list.forEach((p,i) => {
          let item = {};
          item.index = i+1;
          item.name = p.product_name;
          item.no = p.product_code;
          item.spec = p.product_models;
          item.count = p.device_count;
          item.unit = p.product_unit;
          this.device_data.push(item);
        });
      })
    },
    getDeviceList(p){
      let request = {
        typeid: "23009",
        data: [
          {
            account_id: 520,
            wh_id: this.selectedWhid,
            product_code: this.selectedprocode,
            page_num: p,
            page_size: 10
          }
        ],
              
      };
      api.PostXLASSETS(request).then((response)=>{
        let { data } = response.data.result;
        this.deviceList_data = [];
        this.deviceSum = data[0].sum;
        data[0].devicelist.forEach((d)=>{
          let item = {};
          item.tm = d.device_address;
          item.chbm = d.product_code;
          item.chmc = d.product_name;
          item.ggxh = d.product_models;
          item.jldw = d.product_unit;
          item.xm = d.box_address;
          item.zt = this.mapStatus[d.device_status];
          item.newtime = d.device_ts;
          this.deviceList_data.push(item);
        })
      })
    },
    closeglClick() {
      this.glShow = false;
      if(!this.filterStatus) $(".cor").css({ color: "#000000" });
    },
    glkhClick() {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow||this.filterStatus) {
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
    getManagecompanys(){
      let request = {
        typeid:27001
      }
      this.$http.XLSELECT(request).then(response => {
        this.companys = response.data.result.data;
      })
    },
    handleSubmitgl(name) {
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
      for(let key in this.filterItem){
        this.filterItem[key] = '';
      }
    },
  },
  mounted(){
    this.getOrderList(1);
    this.getManagecompanys();
    if(this.$route.query.orderNo){
      this.orderDetailOpen = true;
      this.getOrderDetail({orderNO:this.$route.query.orderNo});
    }
  },
  computed:{
    selectedTab(){
      return this.orderStatus.find(t => t.name === this.tabName);
    }
  },
  watch: {
    tabName(nv){
      this.pageNum = 1;
      this.getOrderList(1);
    }
  }
};
</script>

<style>
@import "../assetmanagement/assetmanage.css";
@import "../customermanage/customer.css";
.button0{
  color: blue;
}
</style>
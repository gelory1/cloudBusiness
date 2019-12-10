<template>
  <div class="order" @click="selectedDown('outside')">
    <Layout>
      <Menu width="auto" size="small" style="padding-top:30px;">
        <div class="tip" style="float:left;margin-top:20px">
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
            <Input icon="ios-search" placeholder="请输入内容" v-model="inputVal" @on-enter="search" @on-click="search" style="width: 200px;margin-right:20px;" />
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
                    <Select v-model="filterItem.manageCompany" clearable filterable>
                      <Option :value="item.id" v-for="(item,index) in companys" :key="index">{{item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售类型" prop="xslx">
                    <Select v-model="filterItem.salesType" clearable filterable>
                      <Option :value="item.index" v-for="(item,index) in salesTypes" :key="index">{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售人员" prop="saleName">
                    <Input type="text" v-model="filterItem.saleName" />
                  </FormItem>
                  <FormItem label="下单日期">
                    <Row>
                      <Col span="11">
                        <DatePicker type="date" placement="top" placeholder="开始日期" v-model="filterItem.startTime"></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker type="date" placement="top" placeholder="结束日期" v-model="filterItem.endTime"></DatePicker>
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
          <Button type="primary" size="large" icon="ios-plus-empty" class="addBut" style="position:absolute;right:10px;top:10px;" @click="addOrder">申请备货</Button>     
        </Header>
      </Menu>
      <Content :style="{background: '#fff', minHeight: '800px'}" style="padding-left:20px;margin-top:-10px;">
        <Tabs ref="tab" v-model="tabName">
          <TabPane v-for="item in orderStatus" :label="item.type" :name="item.name" :key="item.name">
            <Table :columns="order_columns" :data="order_data[item.index]" size="small" @on-row-click="openOrder" :loading="loading"></Table>
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
              <span>{{(selectedOrder.data||{}).order_no}}</span>
            </p>
          </div>
          <Button :style="`position:absolute;margin-top:30px;right:30px;top:30px;background-color:${(statusColorMap[selectedOrder.status]||{}).backgroundColor};
            color:${(statusColorMap[selectedOrder.status]||{}).color}`" v-show="selectedOrder.status !== '待支付'">
            {{selectedOrder.status}}
          </Button>
          <Poptip ref="popTip" trigger="hover" content="去支付" placement="bottom" style="position:absolute;right:30px;top:30px;text-align:center;" v-show="selectedOrder.status === '待支付'">
            <Button :style="`margin-top:30px;background-color:${(statusColorMap[selectedOrder.status]||{}).backgroundColor};
              color:${(statusColorMap[selectedOrder.status]||{}).color}`">
              {{selectedOrder.status}}
            </Button>
          </Poptip>
          
          <div style="position:relative;">
            <div :style="{
              height: 28 + 'px',
              position:'absolute',
              zIndex:0,
              backgroundColor:'#49D790',
              color:'white',
              borderRadius: 20+'px',
              display:'flex',
              padding: 5+'px',
              width: `${length}%`
            }">
                <div :style="{textAlign:'center',width:'100%' }" v-for="(item,index) in statuses" v-show="index < selectedIndex" :key="index">{{item.value}}</div>
            </div>
            <div style="display:flex;padding:5px;background-color:#F2F2F2;border-radius:20px">
              <div v-for="(item,index) in statuses" :style="{width:`${(100/statuses.length)}%`,textAlign:'center'}" :key="index">{{item.value}}</div>
            </div>
            <div style="display:flex;padding:5px;;border-radius:20px;">
              <div :style="{textAlign:'center',width:`${(100/statuses.length)}%` }" v-for="(item,index) in (selectedOrder.data||{}).order_log" :key="index">{{item.orderlog_time}}</div>
            </div>
          </div>
          
        </div>
        <div style="clear:both;">
        <p class="djtitle">单据信息</p>
        <div style="line-height:40px;width:40%;float:left">
          <div>
            <span class="jbleft">业务类型：</span>
            <span class="jbright">{{selectedOrder.type}}</span>
          </div>
          <div>
            <span class="jbleft">下单时间：</span>
            <span class="jbright">{{selectedOrder.time}}</span>
          </div>
          <div>
            <span class="jbleft">销售类型：</span>
            <span class="jbright">{{selectedOrder.salesType}}</span>
          </div>
          <div>
            <span class="jbleft">客户名称：</span>
            <span class="jbright">{{selectedOrder.customName}}</span>
          </div>
        </div>
        <div style="line-height:40px;width:50%;float:right">
          <div>
            <span class="jbleft">合同编号：</span>
            <span class="jbright">{{selectedOrder.contractNo}}</span>
          </div>
          <div>
            <span class="jbleft">合同主体：</span>
            <span class="jbright">{{subjectName[(selectedOrder.data||{}).contract_subject]}}</span>
          </div>
          <div>
            <span class="jbleft">设备数量：</span>
            <span style="color:#8D8D8D">{{selectedOrder.count}}
              <span>（<small style="color:green">本次交货：{{(selectedOrder.data||{}).issued_count}}</small>，<small style="color:red">剩余待发：{{selectedOrder.count - (selectedOrder.data||{}).issued_count}}</small>）</span>
            </span>
          </div>
          <div>
            <span class="jbleft">收货地址：</span>
            <span style="color:#8D8D8D">{{(selectedOrder.data||{}).address_id}}</span>
          </div>
        </div>
      </div>
      <div style="clear:both;overflow: hidden;">
        <p class="djtitle">设备清单</p>
        <Tabs v-model="deviceTabName">
          <TabPane label="全部" name="name1">
            <Table :columns="device_columns" :data="device_data" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
          </TabPane>
          <TabPane :label="`已到货（${(selectedOrder.data||{}).issued_count}）`" name="name2">
            <Table :columns="device_columns" :data="device_data1" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
          </TabPane>
          <TabPane :label="`待发货（${selectedOrder.count - (selectedOrder.data||{}).issued_count}）`" name='name3'>
            <Table :columns="device_columns" :data="device_data2" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
          </TabPane>
        </Tabs>
      </div>
      </Modal>
      </Content>
    </Layout>
  </div>
</template>
<script>
let $ = require("jquery");
import api from "@/api/axios";
const orderStatus1 = [{
    type: "全部",
    name: 'name1',
    index: 0
  },{
    type: "已下单",
    name: 'name8',
    index: 3
  },
  {
    type: "已发货",
    name: 'name9',
    index: 4
  },
  {
    type: "已到货",
    name: 'name10',
    index: 5
  },];
const orderStatus2 = [
  {
    type: "全部",
    name: 'name1',
    index: 0
  },
  {
    type: "审批中",
    name: 'name2',
    index: 1
  },
  {
    type: "待支付",
    name: 'name3',
    index: 2
  },
  {
    type: "已下单",
    name: 'name4',
    index: 3
  },
  {
    type: "已发货",
    name: 'name5',
    index: 4
  },
  {
    type: "已到货",
    name: 'name6',
    index:5
  },
  {
    type: "被驳回",
    name: 'name7',
    index: 6
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
    align:"center"
  },
  {
    key: 'type',
    title: '业务类型',
    width: 100,
    align:"center"
  },
  {
    key: 'time',
    title: '下单时间',
    align:"center"
  },
  {
    key: 'salesType',
    title: '销售类型',
    width: 100,
    align:"center"
  },
  {
    key: 'customName',
    title: '客户名称',
    align: 'center',
    width: 250
  },
  {
    key: 'contractNO',
    title: '合同编号',
    align:"center"
  },
  {
    key: 'count',
    title: '设备数量',
    width: 100,
    align:"center"
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
  0:'审批中',1: '待支付',2:'已下单',3:'已发货',4:'已到货',5:'被驳回'
};
const statusMap2 = {
  0:'申请',1: '审批',2:'支付',3:'下单',4:'出库',5:'到货'
};
const statusMap3 = {
  3:'下单',4: '出库',5:'到货'
};
const statusColorMap = {
  '审批中':{
    backgroundColor: '#FDF6EC',
    color: '#E7A440'
  },
  '待支付':{
    backgroundColor: '#F0F9EC',
    color: '#78C950'
  },
  '已下单': {
    backgroundColor: '#F4F4F5',
    color: '#7D7F82'
  },
  '已发货':{
    backgroundColor: '#EEEEFF',
    color: '#7272D0'
  },
  '已到货':{
    backgroundColor: '#EBF5FE',
    color: '#54A3F6'
  },
  '被驳回':{
    backgroundColor: '#F4F4F5',
    color: '#7D7F82'
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
    key: "tm",
    align:"center"
  },
  {
    title: "存货编码",
    key: "chbm",
    align:"center"
  },
  {
    title: "存货名称",
    key: "chmc",
    align:"center"
  },
  {
    title: "规格型号",
    key: "ggxh",
    align:"center"
  },
  {
    title: "计量单位",
    key: "jldw",
    align:"center"
  },
  {
    title: "箱码",
    key: "xm",
    align:"center"
  },
  {
    title: "状态",
    key: "zt",
    align:"center"
  },
  {
    title: "最新操作时间",
    key: "newtime",
    width:150,
    align:"center"
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
      orderStatus1,
      orderStatus2,
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
        ],
        6:[]
      },
      tooptipShow: false,
      businessMap,
      saleMap,
      statusMap,
      loading: false,
      orderDetailOpen: false,
      selectedOrder: {
        data:{}
      },
      bcjh:"700",
      sydf:"9090",
      device_columns: [
        {
          title: "序号",
          key: "index",
          width:80,
          align:"center"
        },
        {
          title: "存货编码",
          key: "no",
          align:"center"
        },
        {
          title: "存货名称",
          key: "name",
          align:"center",
          render: (h, params) => {
              let texts = ''
              if (params.row.name !== null) {
                if (params.row.name.length > 15) {
                  texts = params.row.name.substring(0, 15) + '...'
                } else {
                  texts = params.row.name
                }
              }
              return h('Tooltip', {
                props: {
                  placement: 'top'
                }
              }, [
                texts,
                h('span', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-all'
                  }
                }, params.row.name)
              ])
            }

        },
        {
          title: "规格型号",
          key: "spec",
          width: 200,
          align:"center",
          render: (h, params) => {
              let texts = ''
              if (params.row.spec !== null) {
                if (params.row.spec.length > 20) {
                  texts = params.row.spec.substring(0, 20) + '...'
                } else {
                  texts = params.row.spec
                }
              }
              return h('Tooltip', {
                props: {
                  placement: 'top'
                }
              }, [
                texts,
                h('span', {
                  slot: 'content',
                  style: {
                    whiteSpace: 'normal',
                    wordBreak: 'break-all'
                  }
                }, params.row.spec)
              ])
            }
        },
        {
          title: "计量单位",
          key: "unit",
          align:"center"
        },
        {
          title: "数量",
          key: "count",
          align:"center"
        }
      ],
      filterItem:{
        manageCompany:"",
        salesType:"",
        saleName:"",
        startTime:"",
        endTime:""
      },
      device_data: [],
      deviceList_columns,
      deviceList_data: [],
      deviceSum: 0,
      statusMap2,
      statusMap3,
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
      deviceTabName: 'name1'
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
      this.tabName = 'name1';
      this.selectedType = this.orderTypes[index];
      this.pageNum = 1;
      this.getOrderList(1);
    },
    openOrder(o){
      if(o.type = "合同订单"){
        
      }
      this.getOrderDetail(o);
    },
    getOrderList(p){
      this.order_data[this.selectedTab.index] = [];
      console.log(this.selectedTab);
      this.loading = true;
      const param = {
        typeid: 24001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            order_status: this.selectedTab.index === 0?undefined:(this.selectedTab.index-1),
            // customer_name:'',
            order_starttime:this.filterItem.startTime === ''?undefined:this.filterItem.startTime.getFullYear() + '-' + (this.filterItem.startTime.getMonth()+1) + '-' + (this.filterItem.startTime.getDate())+ ' 00:00:00',
            order_endtime:this.filterItem.endTime === ''?undefined:this.filterItem.endTime.getFullYear() + '-' + (this.filterItem.endTime.getMonth()+1) + '-' + (this.filterItem.endTime.getDate()) +' 23:59:59',
            order_type: this.selectedType.ids,
            sale_type:this.filterItem.salesType === ''?undefined:this.filterItem.salesType,
            // contract_subject:0,
            sell_name:this.filterItem.saleName===''?undefined:this.filterItem.saleName,
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
          item.data = data;
          this.order_data[index].push(item);
        });
        // this.selectedOrder = this.order_data[0];
        this.loading = false;
      },error => {
        this.loading = false;
      })
    },
    getOrderDetail(order){
      if(order.type){
        this.orderDetailOpen = true;
        let index = this.selectedTab.index||0;
        this.selectedOrder = this.order_data[index].find(data => data.orderNO === order.orderNO);
        this.device_data = [];
        this.selectedOrder.status = this.statusMap[this.selectedOrder.data.order_status];
        this.selectedOrder.data.product_list.forEach((p,i) => {
          let item = {};
          item.index = i+1;
          item.name = p.product_name;
          item.no = p.product_code;
          item.spec = p.product_models;
          item.count = p.device_count;
          item.unit = p.product_unit;
          item.data = p;
          this.device_data.push(item);
        });
        return;
      }
      const param = {
        typeid: 24001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            order_no: order.orderNO,
            order_type: [0,1],
            page_num: 1,
            page_size: 10
          }
        ],
      };
      api.XLORDER(param).then((res)=>{
        this.orderDetailOpen = true;
        let data = res.data.result.data[0].orderlist[0]||{};
        this.selectedOrder = {};
        this.selectedOrder.orderNO = data.order_no;
        this.selectedOrder.type = this.businessMap[data.order_type];
        this.selectedOrder.time = data.order_time;
        this.selectedOrder.salesType = this.saleMap[data.sale_type];
        this.selectedOrder.customName = data.customer_name;
        this.selectedOrder.contractNO = data.contract_no;
        this.selectedOrder.count = data.product_count;
        this.selectedOrder.status = this.statusMap[data.order_status];
        this.selectedOrder.cellClassName = {
          status:`button${data.order_status}`
        };
        this.selectedOrder.data = data;
        this.device_data = [];
        this.selectedOrder.status = this.statusMap[data.order_status];
        data.product_list.forEach((p,i) => {
          let item = {};
          item.index = i+1;
          item.name = p.product_name;
          item.no = p.product_code;
          item.spec = p.product_models;
          item.count = p.device_count;
          item.unit = p.product_unit;
          item.data = p;
          this.device_data.push(item);
        });
      })
    },
    closeglClick() {
      this.glShow = false;
      if(!this.filterStatus) $(".cor").css({ color: "#000000" });
    },
    search(){
      this.pageNum = 1;
      this.getOrderList(1)
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
    addOrder(){
      this.$router.push('/ordermanage/create');
    },
    toPay(){
      // console.log(111);
    }
  },
  mounted(){
    this.getOrderList(1);
    this.getManagecompanys();
    if(this.$route.query.orderNo){
      this.getOrderDetail({orderNO:this.$route.query.orderNo});
    }
    $('.ivu-poptip-body-content-inner').css('color','#2d8cf0');
    $('.ivu-poptip-body-content-inner').css('cursor','pointer');
    $('.ivu-poptip-body').on('click',() => {this.toPay()});
  },
  computed:{
    selectedTab(){
      let select = {};
      if(this.orderStatus.length>0){
        select = this.orderStatus.find(t => t.name === this.tabName);
      }
      return select;
    },
    statuses(){
      let statuses = [];
      if(this.selectedOrder){
        if(this.selectedOrder.type === '合同订单'){
          for(let key in this.statusMap3){
            statuses.push({
              index: key,
              value: this.statusMap3[key]
            })
          }
        }else{
          for(let key in this.statusMap2){
            statuses.push({
              index: key,
              value: this.statusMap2[key]
            })
          }
        }
      }
      return statuses;
    },
    orderStatus(){
      let orderStatus = [];
      if(this.selectedType &&this.selectedType.type === '合同订单'){
        this.orderStatus1.forEach((item) => {
          orderStatus.push(item);
        })
      }else if(this.selectedType){
        this.orderStatus2.forEach((item) => {
          orderStatus.push(item);
        })
      }
      return orderStatus;
    },
    selectedIndex(){
      let index = 0;
      if(this.selectedOrder){
        if(this.selectedOrder.type === '合同订单'){
          index = ((this.selectedOrder||{}).data||{}).order_status - 1;
          if(index > 3) index = 3;
          if(index < 1) index = 1;
        }else{
          index = ((this.selectedOrder||{}).data||{}).order_status + 1;
          if(index > 6) index = 6;
          if(index < 1) index = 1;
        }
      }
      return index;
    },
    length(){
      let length = 0;
      length = this.selectedIndex*100/this.statuses.length;
      return length;
    },
    device_data1(){
      let data = [];
      if(this.device_data&&this.device_data.length>0){
        data = this.device_data.filter(d => d.data.issued_count !== 0);
        data.forEach(d => {
          d.count = d.data.issued_count;
        })
      }
      return data;
    },
    device_data2(){
      let data = [];
      if(this.device_data&&this.device_data.length>0){
        data = this.device_data.filter(d => d.data.device_count - d.data.issued_count !== 0);
        data.forEach(d => {
          d.count = d.data.device_count - d.data.issued_count;
        })
      }
      return data;
    },
  },
  watch: {
    tabName(nv){
      this.pageNum = 1;
      this.getOrderList(1);
    },
    orderDetailOpen(){
      this.deviceTabName = 'name1';
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
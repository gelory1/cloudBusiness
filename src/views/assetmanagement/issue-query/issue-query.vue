<template>
  <div class="issue" @click="tooltipClick('outside')">
    <Layout>
      <Sider
        breakpoint="md"
        collapsible
        style="background-color: #ffffff;flex: 0 0 150px;min-width: 500;"
      >
        <Menu width="auto" size="small">
          <div class="tip">
            <p class="tooltip" @click.stop="tooltipClick('inside')">
              {{cpxhpz[cktype_current_index].mc}}
              <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
            </p>
            <div class="tooltipslot" v-show="tooptipShow">
              <p v-for="(item,index) in cpxhpz" @click="selectClick(index)" :key="index">{{item.mc}}</p>
            </div>
          </div>
        </Menu>
        <hr
          style="border:0.6px solid #DDDDDD;width:90%;margin:0 auto;margin-top:20px;margin-bottom:5px"
        />
        <div :style="{height:scrollHeight,overflow:'auto'}">
          <Menu width="auto" class="menu" ref="menu" :open-names="['2']" @on-select="selecttwoClick">
            <Submenu name="2">
              <template slot="title">
                <Icon type="arrow-down-b"></Icon>
                <span>{{menuitem}}</span>
              </template>
              <MenuItem v-for="(item,index) in menudata" :name="index" :key="item.wh_id">
                {{item.wh_name}}
              </MenuItem>
            </Submenu>
          </Menu>
        </div>
        <div slot="trigger"></div>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;">
            <Input icon="ios-search" placeholder="请输入内容" style="width: 200px;margin-right:20px;"  @on-enter="search" @on-click="search" v-model="inputVal" />
            <Icon type="ios-flask-outline"></Icon>
            <span>过滤</span>
            <span style="padding:0 5px">|</span>
            <Icon type="navicon-round"></Icon>
            <span>更多</span>
          </div>
        </Header>
        <Content
          :style="{background: '#fff', minHeight: scrollHeight}"
          style="padding-left:10px;margin-top:-20px;"
        >
          <Tabs ref="tab" v-model="tabName" @on-click="changeTab">
            <TabPane label="入库单据" name="name1">
              <Table
                :columns="rkdj_columns"
                :data="rkdj_data"
                size="small"
                :loading="inLoading"
                :height="tableHeight"
              ></Table>
              <Page
                :current.sync="inPageNum"
                :total="zkSum"
                :page-size="10"
                @on-change="getProductList"
                size="small"
                show-elevator
                style="text-align:center;margin:20px 0;"
              ></Page>
            </TabPane>
            <TabPane label="出库单据" name="name2">
              <Table
                :columns="ckdj_columns"
                :data="ckdj_data"
                size="small"
                :loading="outLoading"
                :height="tableHeight"
              ></Table>
              <Page
                :current.sync="outPageNum"
                :total="crkSum"
                :page-size="10"
                @on-change="getProductList"
                size="small"
                show-elevator
                style="text-align:center;margin:20px 0;"
              ></Page>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
    <!-- 入库详情页面 -->
    <Modal v-model="rkxqmodal" width="1000">
      <div>
        <div style="float:left;margin:30px  20px;">
          <h3>入库单详情</h3>
          <p style="font-size:11px;">
            单据编号:
            <span>{{djbh}}</span>
          </p>
        </div>
        <Button style="float:right;margin:30px 0 0 0;" :class="djxx.zt">{{djxx.zt}}</Button>
      </div>
      <div style="clear:both;">
        <p class="djtitle">单据信息</p>
        <div style="line-height:40px;width:45%;float:left" class="dj_div">
          <div>
            <span class="jbleft">入库类别：</span>
            <span class="jbright wid">{{djxx.rklb}}</span>
          </div>
          <div>
            <span class="jbleft">入库日期：</span>
            <span class="jbright wid">{{djxx.rkrq}}</span>
          </div>
          <div>
            <span class="jbleft">仓库：</span>
            <span class="jbright wid">{{djxx.ck}}</span>
          </div>
          <div>
            <span class="jbleft">客户名称：</span>
            <span class="jbright wid">{{djxx.khmc}}</span>
          </div>
          <div>
            <span class="jbleft">订单编号：</span>
            <span class="jbright wid">{{djxx.ddbh}}</span>
          </div>
        </div>
        <div style="line-height:40px;width:50%;float:right">
          <div>
            <span class="jbleft">设备数量：</span>
            <span class="jbright wid">{{djxx.sbsl}}</span>
          </div>
          <div>
            <span class="jbleft">审核人：</span>
            <span class="jbright wid">{{djxx.shr}}</span>
          </div>
          <div>
            <span class="jbleft">审核时间：</span>
            <span class="jbright wid">{{djxx.shsj}}</span>
          </div>
        </div>
      </div>
      <div style="clear:both;overflow: hidden;">
        <p class="djtitle">入库设备</p>
         <div style="width:17%;float:left;">
         <Table :columns="device_columns1" ref="rktable" :data="indevice_data1" disabled-hover highlight-row  @on-current-change="rkbhClick" 
         size="small" style="margin:10px 0 0 20px;overflow:auto"></Table>
           <!--  <ul>
            <li  class="li" v-for="(item,index) in rksbxq" :key="index" @click="rkbhClick(index)" style="cursor:pointer;padding:10px;">{{item.val}}</li>
          </ul> -->
        </div>
        <div style="width:83%;float:right;">
          <!--  <p style="margin-left:10px;border-bottom:0.7px solid #e4e7ed">共<span>{{count}}</span>家客户（可筛选查看）</p> -->
          <Table :columns="device_columns" :data="indevice_data" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
        </div>
      </div>
    </Modal>
    <!-- 出库详情页面 -->
    <Modal v-model="ckxqmodal" width="1000">
      <div>
        <div style="float:left;margin:30px  20px;">
          <h3>出库单详情</h3>
          <p style="font-size:11px;">
            单据编号:
            <span>{{djbh}}</span>
          </p>
        </div>
        <Button style="float:right;margin:30px 0 0 0;" :class="djxx.zt">{{djxx.zt}}</Button>
      </div>
      <div style="clear:both;">
        <p class="djtitle">单据信息</p>
        <div style="line-height:40px;width:45%;float:left">
          <div>
            <span class="jbleft">出库类别：</span>
            <span class="jbright wid">{{djxx.cklb}}</span>
          </div>
          <div>
            <span class="jbleft">出库日期：</span>
            <span class="jbright wid">{{djxx.ckrq}}</span>
          </div>
          <div>
            <span class="jbleft">仓库：</span>
            <span class="jbright wid">{{djxx.ck}}</span>
          </div>
          <div>
            <span class="jbleft">客户名称：</span>
            <span class="jbright wid">{{djxx.khmc}}</span>
          </div>
          <div>
            <span class="jbleft">订单编号：</span>
            <span class="jbright wid">{{djxx.ddbh}}</span>
          </div>
        </div>
        <div style="line-height:40px;width:50%;float:right">
          <div>
            <span class="jbleft">设备数量：</span>
            <span class="jbright wid">{{djxx.sbsl}}</span>
          </div>
          <div>
            <span class="jbleft">审核人：</span>
            <span class="jbright wid">{{djxx.shr}}</span>
          </div>
          <div>
            <span class="jbleft">审核时间：</span>
            <span class="jbright wid">{{djxx.shsj}}</span>
          </div>
        </div>
      </div>
      <div style="clear:both;overflow: hidden;">
        <p class="djtitle">出库设备</p>
       <div style="width:17%;float:left;">
         <Table :columns="device_columns1" ref="cktable" :data="outdevice_data1" size="small" disabled-hover highlight-row @on-row-click="ckbhClick"
          style="margin:10px 0 0 20px;overflow:auto"></Table>
           <!--  <ul>
            <li  class="li" v-for="(item,index) in rksbxq" :key="index" @click="rkbhClick(index)" style="cursor:pointer;padding:10px;">{{item.val}}</li>
          </ul> -->
        </div>
        <div style="width:83%;float:right;">
          <!--  <p style="margin-left:10px;border-bottom:0.7px solid #e4e7ed">共<span>{{count}}</span>家客户（可筛选查看）</p> -->
          <Table :columns="device_columns" :data="outdevice_data" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
        </div>
      </div>
    </Modal>
    <!-- 查看明细-设备列表 -->
    <Modal v-model="sblbmodal" width="1000" title="设备列表" class="changetable">
       <Table 
        :columns="sblb_columns"
        :data="sblb_data" size="small" 
        >
      </Table>
      <Page
        :current.sync="devicePageNum"
        :total="sblbSum"
        :page-size="10"
        @on-change="getDevicesList"
        size="small"
        show-elevator
        
        class="page"
        style="text-align:center;margin-top:20px;"
      ></Page>
    </Modal>
  </div>
</template>

<script>
import sblbTale from "../../public-components/sblb_table.vue";
import api from "@/api/axios";
export default {
  name: "deviceQuery",
  components: {
    sblbTale
  },
  data() {
    return {
      zkSum: 1,
      crkSum: 1,
      sblbSum:1,
      menudata: [
      ],
      rkdj_columns: [
        {
          title: "单据编号",
          key: "djbh",
          align:"center"
        },
        {
          title: "入库类别",
          key: "rklb",
          align:"center"
        },
        {
          title: "入库日期",
          key: "rkrq",
          align:"center"
        },
        {
          title: "订单编号",
          key: "ddbh",
          align:"center"
        },
        {
          title: "客户名称",
          key: "khmc",
          align:"center"
        },
        {
          title: "设备数量",
          key: "sbsl",
          align:"center",
        },
        {
          title: "状态",
          key: "zt",
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
                    backgroundColor: params.row.zt === '待审批'?'#FDF6EC':params.row.zt === '已审批'?'#F0F9EC':'#F4F4F5',
                    color: params.row.zt === '待审批'?'#E7A440':params.row.zt === '已审批'?'#78C950':'#7D7F82'
                  },
                },
                params.row.zt
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: "3px",
                    color: "#3896f5 ",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      // 入库
                      this.djbh = params.row.data.allocation_no;
                      this.djxx = {
                        rklb: params.row.rklb,
                        rkrq: params.row.rkrq,
                        ck: params.row.data.wh_name,
                        khmc: params.row.khmc,
                        ddbh: params.row.ddbh,
                        sbsl: params.row.sbsl,
                        shr: params.row.data.auditor_name,
                        shsj: params.row.data.auditor_time,
                        zt:params.row.zt
                      }
                      this.selectedWhid = params.row.data.wh_id;
                      this.indevice_data1 = [];
                      params.row.data.order_no.forEach(no => {
                        this.indevice_data1.push({
                          ddbh: no
                        })
                      })
                      this.getDevices(params.row.data.order_no[0]);
                      this.rkxqmodal = true;
                      this.$nextTick(() => {
                        this.$refs['rktable'].objData[0]._isHighlight = true;
                      })
                      
                    }
                  }
                },
                "查看明细"
              )
            ]);
          }
        }
      ],
      rkdj_data: [
        {
          zt: "待审批"
        }
      ],
      ckdj_columns: [
        {
          title: "单据编号",
          key: "djbh",
          align:"center",
        },
        {
          title: "出库类别",
          key: "cklb",
          align:"center"
        },
        {
          title: "出库日期",
          key: "ckrq",
          align:"center"
        },
        {
          title: "订单编号",
          key: "ddbh",
          align:"center"
        },
        {
          title: "客户名称",
          key: "khmc",
          align:"center"
        },
        {
          title: "设备数量",
          key: "sbsl",
          align:"center",
        },
        {
          title: "状态",
          key: "zt",
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
                    backgroundColor: params.row.zt === '待审批'?'#FDF6EC':params.row.zt === '已审批'?'#F0F9EC':'#F4F4F5',
                    color: params.row.zt === '待审批'?'#E7A440':params.row.zt === '已审批'?'#78C950':'#7D7F82'
                  },
                },
                params.row.zt
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: "3px",
                    color: "#3896f5 ",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      // 出库
                      this.djbh = params.row.data.allocation_no;
                      this.djxx = {
                        cklb: params.row.cklb,
                        ckrq: params.row.ckrq,
                        ck: params.row.data.wh_name,
                        khmc: params.row.khmc,
                        ddbh: params.row.ddbh,
                        sbsl: params.row.sbsl,
                        shr: params.row.data.auditor_name,
                        shsj: params.row.data.auditor_time,
                        zt:params.row.zt
                      }
                      this.outdevice_data1 = [];
                      this.selectedWhid = params.row.data.wh_id;
                      params.row.data.order_no.forEach(no => {
                        this.outdevice_data1.push({
                          ddbh: no
                        })
                      });
                      this.getDevices(params.row.data.order_no[0]);
                      this.ckxqmodal = true;
                      this.$nextTick(() => {
                        this.$refs['cktable'].objData[0]._isHighlight = true;
                      })
                    }
                  }
                },
                "查看明细"
              )
            ]);
          }
        }
      ],
      ckdj_data: [
        {
          zt: "入库"
        }
      ],
      device_columns1: [
        {
          title: "订单编号",
          key: "ddbh"
        },
      ],
      device_columns: [
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
          title: "数量",
          key: "sl"
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                class: "demo-spin-icon-load",
                props: {
                  type: "clipboard",
                  size: 12,
                  // background:"#34a9af5 "
                }
              }),
              h(
                "span",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: "3px",
                    color: "#3896f5 ",
                    cursor:"pointer"
                  },
                  on: {
                    click: () => {
                      // this.show(params.index);
                      this.sblbmodal = true;
                      this.selectedprocode = params.row.chbm;
                      this.getDevicesList(1);
                    }
                  }
                },
                "设备列表"
              )
            ]);
          }
        }
      ],
      indevice_data1: [
        {
          ddbh: ''
        },
      ],
      indevice_data: [
        {
          chbm: "8888888"
        }
      ],
      outdevice_data1:[],
      outdevice_data:[
        {
          chbm:"56"
        }
      ],
      djxx: {
        cklb: "121",
        ckrq: "",
        ck: "",
        khmc: "",
        ddbh: "",
        sbsl: "",
        shr: "",
        shsj: "2019-9-00"
      },
      cpxhpz: [
        {
          mc: "所有类型仓库"
        },
        {
          mc: "成品库"
        },
        {
          mc: "工程物资库"
        },
        {
          mc: "固定资产库"
        }
      ],
      rksbxq: [
        {
          val: "12"
        },
        {
          val: "123224"
        }
      ],
      cksbxq: [
        {
          val: "12"
        },
        {
          val: "123224"
        }
      ],
      tooptipShow: false,
      ckxqmodal: false,
      sblbmodal:false,
      rkxqmodal:false,
      menuitem: "所有仓库",
      sblb_data:[],
      djbh: "00000000000",
      count:"8",
      ck_current_index: '',
      cktype_current_index: 0,
      tabName: 'name1',
      inputVal: '',
      inLoading: false,
      outLoading: false,
      hasloadout: false,
      stausMap: {
        0: '待审批',
        1: '已审批',
        2: '已执行'
      },
      selectedprocode: '',
      selectedWhid:'',
      sblb_columns: [
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
      ],
      sblb_data: [],
      mapStatus: {
        0: '出库中（针对仓库）',
        1:'待收货',
        10: '入库；已收货',
        20: '领用',
        30: '拆除',
        40: '安装',
        50: '丢失',
        60: '上线',
        70: '退货',
      },
      inPageNum:1,
      outPageNum:1,
      devicePageNum:1,
      tableHeight:""
    };
  },
  methods: {
    tooltipClick(side) {
      if(side === 'inside'){
        this.tooptipShow = !this.tooptipShow;
      }else if(side === 'outside'){
        if(this.tooptipShow) this.tooptipShow = false;
      }
    },
    rkdjrowClick() {
      var _self = this;
    },
    ckdjrowClick() {
      alert("出库");
    },
    selectClick(index) {
      var _self = this;
      _self.tooptipShow = false;
      this.cktype_current_index = index;
      this.getMenuList(index);
      this.ck_current_index = '';
      this.getProductList(1);
    },
    getMenuList(index){
      if (index == "0") {
          this.menuitem = "所有仓库";
        } else if (index == "1") {
          this.menuitem = "成品库";
        } else if (index == "2") {
          this.menuitem = "工程程物资库";
        } else if (index == "3") {
          this.menuitem = "固定资产库";
        }
      let request = {
        typeid: 23001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            wh_type: index === 0?undefined:index === 1?0:index === 2?1:3,
            allocation_type:0
          }
        ],
      };
      api.PostXLASSETS(request).then(response => {
        let res = response.data.result;
         this.menudata = [];
          this.zkSum = res.sum;
          for (var i = 0; i < res.data.length; i++) {
            if(!this.menudata.find(data => data.wh_id === res.data[i].wh_id )){
              this.menudata.push(res.data[i]);
            }
          }
        // this.selecttwoClick(this.ck_current_index||0);
      });
    },
    selecttwoClick(index){
      this.ck_current_index = index;
      this.getProductList(1);
      if(this.tabName !== 'name1') this.tabName = 'name1';
    },
    rkbhClick(p){
      if(p.ddbh !== '') this.getDevices(p.ddbh);
    },
    ckbhClick(p){
      if(p.ddbh !== '') this.getDevices(p.ddbh);
    },
    getProductList(p){
      let request = {
        typeid: 23004,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            wh_id: this.menudata&&this.menudata.length>0&&this.ck_current_index !== ''?this.menudata[this.ck_current_index].wh_id:undefined,
            keyword: this.inputVal === ''?undefined:this.inputVal,
            page_num: p,
            page_size: 10,
            allocation_type: this.tabName === 'name1'?1:0
          }
        ],
      };
      if(this.tabName === 'name1'){
        this.inLoading = true;
        this.rkdj_data = [];
      }else{
        this.outLoading = true;
        this.ckdj_data = [];
      }
      
      api.PostXLASSETS(request).then((response)=>{
        let res = response.data.result.data;
        if(this.tabName === 'name1'){
          this.inLoading = true;
          this.rkdj_data = [];
          this.zkSum = res[0].sum;
        }else{
          this.outLoading = true;
          this.ckdj_data = [];
          this.crkSum = res[0].sum;
        }
        
        res[0].warehouse_bill_list.forEach(data => {
          let item = {};
          item.djbh = data.allocation_no;
          item.ddbh = String(data.order_no);
          item.khmc = data.customer_name;
          item.sbsl = data.product_count;
          item.zt = this.stausMap[data.allocation_status];
          item.data = data;
          if(this.tabName === 'name1'){
            item.rklb = '成品入库';
            item.rkrq = data.allocation_ts;
            this.rkdj_data.push(item);
            this.inLoading = false;
          }else{
            item.cklb = '出库发货';
            item.ckrq = data.allocation_ts;
            this.ckdj_data.push(item);
            this.outLoading = false;
          }
        });
      },(error) => {
        if(this.tabName === 'name1'){
          this.inLoading = false;
        }else{
          this.outLoading = false;
        }
      })
    },
    getDevices(order_id){
      let param = {
        typeid: 24002,
        data: [
          {
            order_no: order_id
          }
        ],
      };
      if(this.tabName === 'name1'){
        this.indevice_data=[];
      }else{
        this.outdevice_data=[];
      }
      api.XLORDER(param).then((res)=>{
        res.data.result.data[0].product_list.forEach((data)=>{
          let item = {};
          item.chbm = data.product_code;
            item.chmc = data.product_name;
            item.ggxh = data.product_models;
            item.jldw = data.product_unit;
            item.sl = data.device_count;
          if(this.tabName === 'name1'){
            this.indevice_data.push(item);
          }else{
            this.outdevice_data.push(item);
          }
        })
      })
    },
    getDevicesList(p){
      let request = {
        typeid: 23009,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            wh_id: this.selectedWhid,
            product_code: this.selectedprocode,
            page_num: p,
            page_size: 10
          }
        ],
              
      };
      api.PostXLASSETS(request).then((response)=>{
        let { data } = response.data.result;
        this.sblb_data = [];
        this.sblbSum = data[0].sum;
        data[0].devicelist.forEach((d)=>{
          let crk_item = {};
          crk_item.tm = d.device_address;
          crk_item.chbm = d.product_code;
          crk_item.chmc = d.product_name;
          crk_item.ggxh = d.product_models;
          crk_item.jldw = d.product_unit;
          crk_item.xm = d.box_address;
          crk_item.zt = this.mapStatus[d.device_status];
          crk_item.newtime = d.device_ts;
          this.sblb_data.push(crk_item);
        })
      })
    },
    search(val){
      this.getMenuList(0);
      if(this.$refs['menu'].currentActiveName !== -1) this.$refs['menu'].currentActiveName = -1;
      this.ck_current_index = '';
       this.getProductList(1);
    },
    changeTab(p){
      if(p === 'name2'&&!this.hasloadout){
        this.getProductList(1);
      }
      this.hasloadout = true;
    },
  },
  mounted() {
    this.selectClick(0);
    this.tableHeight = document.body.scrollHeight-300
  },
  computed: {
    scrollHeight(){
      let h = 0;
      // h = (window.screen.height-330)+'px'
       h=(document.body.scrollHeight-185)+'px'
      return h;
    },

    
  },
  watch:{
    tabName(nv){
      this.getProductList(1);
      if(nv === 'name1'){
        this.inPageNum = 1;
      }else{
        this.outPageNum = 1;
      }
    },
    sblbmodal(nv){
      if(!nv) this.devicePageNum = 1;
    }
  }
};
</script>

<style>
@import "../assetmanage.css";
.changetable .ivu-table-body {
    height: 600px;
    overflow: auto;
    /* overflow-x: hidden; */
}
</style>
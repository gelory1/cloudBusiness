<template>
  <div class="device" @click="tooltipClick('outside')">
    <Layout>
      <Sider
        breakpoint="md"
        collapsible
        style="background-color: #ffffff;flex: 0 0 150px;min-width: 500;"
      >
        <Menu width="auto" size="small">
          <div class="tip">
            <!-- <div class="mess">
              <span>1</span>
            </div> -->
            <p class="tooltip" @click.stop="tooltipClick('inside')">
              {{cpxhpz[cktype_current_index].mc}}
              <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
            </p>
            <div class="tooltipslot" v-show="tooptipShow">
              <p v-for="(item,index) in cpxhpz" :key="index" @click="selectClick(index)">{{item.mc}}</p>
              <!-- <p v-for="(item,index) in cpxhpz" @click="selectClick(index)">{{item.wh_type}}</p> -->
            </div>
          </div>
        </Menu>
        <hr
          style="border:0.6px solid #DDDDDD;width:90%;margin:0 auto;margin-top:20px;margin-bottom:5px;"
        />
        <Menu width="auto" class="menu" ref="menu" :open-names="['2']" @on-select="selecttwoClick" >
          <Submenu name="2">
            <template slot="title">
              <Icon type="arrow-down-b"></Icon>
              <span>{{menuitem}}</span>
            </template>
            <MenuItem v-for="(item,index) in menudata" :key="item.wh_id" :name="index">
              {{item.wh_name}}
            </MenuItem>
          </Submenu>
        </Menu>
        <div slot="trigger"></div>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;">
            <Input icon="ios-search" placeholder="请输入内容" style="width: 200px;margin-right:20px;" @on-enter="search" v-model="inputVal"/>
            <span class="f_gl"> 
              <span @click="glkhClick" class="cor">            
                <Icon type="ios-list" />
                <span>过滤</span>
              </span>
                <!-- 过滤 -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="formDevice" :model="formDevice" :label-width="80">
                  <FormItem label="存货编码" prop="chbm">
                    <Input type="text" v-model="formDevice.chbm"></Input>
                    <!-- <Select v-model="formDevice.chbm" placeholder="Select your city">
                      <Option value="item" v-for="(item,index) in khdjg">{{item.val}}</Option>
                    </Select> -->
                  </FormItem>
                  <FormItem label="存货名称" prop="chmc">
                    <Input type="text" v-model="formDevice.chmc"></Input>
                  </FormItem>
                  <FormItem label="规格型号" prop="ggxh">
                    <Input type="text" v-model="formDevice.ggxh" number></Input>
                  </FormItem>
                  <FormItem label="条码" prop="tm">
                    <Input type="text" v-model="formDevice.tm" number></Input>
                  </FormItem>
                  <FormItem label="箱码" prop="xm">
                    <Input type="text" v-model="formDevice.xm" number></Input>
                  </FormItem>
                   <FormItem label="设备所有权" prop="sysyq">
                    <Input type="text" v-model="formDevice.sysyq" number></Input>
                  </FormItem>
                   <FormItem label="状态" prop="zt">
                    <Input type="text" v-model="formDevice.zt" number></Input>
                  </FormItem>
                  <FormItem label="操作时间段">
                    <Row>
                      <Col span="11">
                        <DatePicker type="date" placeholder="Select date" v-model="formDevice.kssj"></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker type="date" placeholder="Select date" v-model="formDevice.jssj"></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Button @click="handleReset('formDevice')" style="margin-left: 8px">重置</Button>
                    <Button type="primary" @click="handleSubmitgl('formDevice')">确定</Button>
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
                <p>敬请期待.....</p>
              </div>
            </span>
          </div>
        </Header>
        <Content
          :style="{background: '#fff', minHeight: '800px'}"
          style="padding-left:20px;margin-top:-20px"
        >
          <Tabs ref="tab" v-model="tabName" @on-click="changeTab">
            <TabPane label="在库设备资产" name="name1">
              <Table
                :columns="jbxx_columns"
                :data="jbxx_data"
                size="small"
                :loading="ckLoading"
              >
              </Table>
              <Page
                :current.sync="pageName1"
                :total="zkSum"
                :page-size="10"
                @on-change="getProductList"
                size="small"
                show-elevator
                class="page"
                style="text-align:center;margin-top:20px;"
              ></Page>
            </TabPane>
            <TabPane label="出入库记录" name="name2">
              <Table 
                :columns="crk_columns"
                :data="crk_data" size="small" 
                @on-row-dblclick="zcrowClick"
                :loading="crkLoading"
                >
              </Table>
              <Page
                :current.sync="pageName2"
                :total="crkSum"
                :page-size="10"
                @on-change="getCrkList"
                size="small"
                show-elevator
                
                class="page"
                style="text-align:center;margin-top:20px;"
              ></Page>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="modal1" width="500" title="设备资产台账">
      <div>
        <div style="float:left;margin-left:20px;">
          <h3>能效集中采集终端</h3>
          <p style="font-size:11px;">
            条码:
            <span>{{jbxx.tm}}</span>
          </p>
        </div>
        <Button style="float:right;margin-right:20px;">领用</Button>
      </div>
      <div class="changestyle">
        <Tabs style="clear:both;" size="small" :animated="false">
          <TabPane label="基本信息">
            <div style="line-height:40px;text-align:center">
              <div style="display:inline-flex">
                <span class="jbleft">条码：</span>
                <span class="jbright">{{jbxx.tm}}</span>
              </div>
              <div style="display:inline-flex">
                <span class="jbleft">存货编号：</span>
                <span class="jbright">{{jbxx.chbh}}</span>
              </div>
              <div style="display:inline-flex">
                <span class="jbleft">存货名称：</span>
                <span class="jbright">{{jbxx.chmc}}</span>
              </div>
              <div style="display:inline-flex">
                <span class="jbleft">计量单位：</span>
                <span class="jbright">{{jbxx.jldw}}</span>
              </div>
              <div style="display:inline-flex">
                <span class="jbleft">箱码：</span>
                <span class="jbright">{{jbxx.xm}}</span>
              </div>
              <div style="display:inline-flex">
                <span class="jbleft">存放仓库：</span>
                <span class="jbright">{{jbxx.cfck}}</span>
              </div>
              <div style="display:inline-flex">
                <span class="jbleft">所有权：</span>
                <span class="jbright">{{jbxx.syq}}</span>
              </div>
              <div style="display:inline-flex">
                <span class="jbleft">折旧（元）：</span>
                <span class="jbright">{{jbxx.zj}}</span>
              </div>
            </div>
          </TabPane>
          <TabPane label="操作记录">
            <div style="margin:30px 150px;">
              <Timeline>
                <TimelineItem v-for="(item,index) in czjldata" :key="index">
                  <p class="content">{{item.content}} 成功！</p>
                  <p class="time">{{item.name}} 操作于 {{item.time}}</p>
                </TimelineItem>
              </Timeline>
            </div>
          </TabPane>
          <TabPane label="运检记录">
            <Table :columns="yjjl_columns" :data="yjjl_data" size="small"></Table>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  </div>
</template>

<script>
var $ = require("jquery");
import api from "@/api/axios";
import sblbTale from "../../public-components/sblb_table.vue";
export default {
  name: "deviceQuery",
  components: {
    sblbTale
  },
  data() {
    return {
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
      mapType:{
        0: '出库',
        1: '入库',
        2: '领用',
        3: '拆除',
        4: '安装',
        5: '丢失',
        6: '上线'
      },
      cktype_current_index: 0,
      crk_current_index: 0,
      ck_current_index: '',
      zkSum: 1,
      crkSum: 1,
      jbxx_columns: [
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
          title: "存放仓库",
          key: "cfck"
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                class: "demo-spin-icon-load",
                props: {
                  type: "clipboard",
                  size: 12
                }
              }),
              h(
                "span",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    backgroundColor: "#3896f5 "
                  },
                  style: {
                    marginLeft: "3px",
                    color: "#3896f5 ",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.selectedProcode = this.jbxx_data[params.index].chbm;
                      this.selectedWhid = this.jbxx_data[params.index].wh_id;
                      this.getCrkList(1);
                      this.tabName = 'name2';
                    }
                  }
                },
                "设备列表"
              )
            ]);
          }
        }
      ],
      jbxx_data: [
        {}
      ],
      yjjl_columns: [
        {
          title: "发生时间",
          key: "fssj"
        },
        {
          title: "事件类型",
          key: "sjlx"
        },
        {
          title: "详细描述",
          key: "xxms"
        },
        {
          title: "处理人",
          key: "clr"
        }
      ],
      crk_columns: [
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
          key: "product_name"
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
          key: "czsj",
          width: 150
        }
      ],
      crk_data: [
      ],
      jbxx: {
        tm: "--",
        chbh: "--",
        chmc: "--",
        jldw: "--",
        xm: "--",
        cfck: "--",
        syq: "--",
        zj: "--"
      },
      yjjl_data: [],
      czjldata: [
      ],
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
      formDevice:{
        chmc:"",
        ggxh:"",
        tm:"",
        xm:"",
        sysyq:"",
        zt:"",
        kssj:"",
        jssj:""
      },
      glShow:false,
      moreShow:false,
      menudata: [],
      modal1: false,
      tm: "1234567",
      tooptipShow: false,
      menuitem: "所有仓库",
      sblb_data: [],
      name: "",
      tabName: 'name1',
      inputVal: '',
      ckLoading: false,
      crkLoading: false,
      selectedProcode:'',
      selectedWhid:'',
      pageName1:1,
      pageName2:1,
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
    zcrowClick(p) {
      this.modal1 = true;
      let request = {
        typeid: 23003,
        data: [
          {
            device_address: p.tm
          }
        ],
      };
      api.PostXLASSETS(request).then(response => {
        let res = response.data.result.data;
        this.jbxx.tm = res[0].device_address;
        this.jbxx.chbh = res[0].product_code;
        this.jbxx.chmc = res[0].assets_name;
        this.jbxx.jldw = res[0].product_unit;
        this.jbxx.xm = res[0].box_address;
        this.jbxx.cfck = res[0].warehouse_name;
        this.jbxx.syq = res[0].ownership;
        this.jbxx.zj = res[0].product_price;
        res[0].operation_log.forEach((log)=>{
          this.czjldata.push(
            {
              time:log.devicelog_ts,
              content:this.mapType[log.devicelog_type],
              name: log.account_id
            }
          )
        })
      })
      
    },
    selectClick(index) {
      this.tooptipShow = false;
      this.cktype_current_index = index;
      this.getMenuList(index);
      if(this.$refs.menu.currentActiveName !== -1) this.$refs.menu.currentActiveName = -1;
      this.ck_current_index = '';
      this.getProductList(1);
    },
    getProductList(p){
      let request = {
        typeid: 23008,
        data: [
          {
            account_id: 520,
            wh_id: this.menudata&&this.menudata.length>0&&this.ck_current_index !== ''?this.menudata[this.ck_current_index].wh_id:undefined,
            keyword: this.inputVal === ''?undefined:this.inputVal,
            page_num: p,
            page_size: 10
          }
        ],
      };
      this.jbxx_data = [];
      this.ckLoading = true;
      api.PostXLASSETS(request).then((response)=>{
        let res = response.data.result.data;
        this.zkSum = res[0].sum;
        res[0].productlist.forEach(data => {
          let jbxx_item = {};
          jbxx_item.chbm = data.product_code;
          jbxx_item.chmc = data.product_name;
          jbxx_item.ggxh = data.product_models;
          jbxx_item.jldw = data.product_unit;
          jbxx_item.sl = data.product_account;
          jbxx_item.cfck = data.wh_name;
          jbxx_item.wh_id = data.wh_id;
          this.jbxx_data.push(jbxx_item);
        });
        this.ckLoading = false;
      },(error) => {
        this.ckLoading = false;
      })
    },
    getCrkList(p){
      var request = {
        typeid: 23009,
        data: [
          {
            account_id: 520,
            wh_id: this.selectedWhid === ''?undefined:this.selectedWhid,
            product_code: this.selectedProcode === ''?undefined:this.selectedProcode,
            keyword: this.inputVal === ''?undefined:this.inputVal,
            page_num: p,
            page_size: 10
          }
        ],
              
      };
      this.crkLoading = true;
      api.PostXLASSETS(request).then(response=>{
        let { data } = response.data.result;
        this.crk_data = [];
        this.crkSum = data[0].sum;
        data[0].devicelist.forEach((d)=>{
          let crk_item = {};
          crk_item.tm = d.device_address;
          crk_item.chbm = d.product_code;
          crk_item.product_name = d.product_name;
          crk_item.ggxh = d.product_models;
          crk_item.jldw = d.product_unit;
          crk_item.xm = d.box_address;
          crk_item.zt = this.mapStatus[d.device_status];
          crk_item.czsj = d.device_ts;
          this.crk_data.push(crk_item);
        })
        this.crkLoading = false;
      },(error) => {
        this.ckLoading = false;
      });
    },
    changeTab(p){
      if(p === 'name2'){
        this.getCrkList(1);
      }
    },
    selecttwoClick(index) {
      this.ck_current_index = index;
      this.getProductList(1);
      if(this.tabName !== 'name1') this.tabName = 'name1';
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
            account_id: 520,
            wh_type: index === 0?undefined:index === 1?0:index === 2?1:3
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
    search(val){
      // if(this.inputVal === '') return;
      this.getMenuList(0);
      if(this.$refs.menu.currentActiveName !== -1) this.$refs.menu.currentActiveName = -1;
      this.ck_current_index = '';
      if(this.tabName === 'name1'){
        this.getProductList(1);
      }else if(this.tabName === 'name2'){
        this.getCrkList(1);
      }   
    },
    closeglClick(){
      this.glShow = false;
      $(".cor").css({ color: "#000000" });
    },
    glkhClick() {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow) {
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
      } else {
        $(".cor1").css({ color: "#000000" });
      }
    },
  },
  mounted() {
    // debugger;
    this.selectClick(0);
  },
  computed: {
    // zkActive:function(){
    //   if(this.menudata&&this.menudata.length>0){
    //     return '2-0';
    //   }
    // }
  },
  watch: {
    tabName(nv){
      if(nv === 'name1'){
        this.selectedWhid = '';
        this.selectedProcode = '';
        this.pageName2 = 1;
      }
    }
  }
  // computed: {
  //   menudata1: function(){
  //     return this.menudata;
  //   }
  // }
};
</script>

<style>
@import "../assetmanage.css";
</style>
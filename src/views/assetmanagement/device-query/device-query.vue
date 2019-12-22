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
            <p class="tooltip" @click.stop="tooltipClick('inside')">
              {{cpxhpz[cktype_current_index].mc}}
              <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
            </p>
            <div class="tooltipslot" v-show="tooptipShow">
              <p v-for="(item,index) in cpxhpz" :key="index" @click="selectClick(index)">{{item.mc}}</p>
            </div>
          </div>
        </Menu>
        <hr
          style="border:0.6px solid #DDDDDD;width:90%;margin:0 auto;margin-top:20px;margin-bottom:5px;"
        />
        <AutoComplete
          v-model="completeValue"
          @on-select="goMenu"
          clearable
          transfer
          placeholder="搜索仓库"
          @keyup.enter.native="searchMenu"
          :style="{width:180 + 'px',marginLeft:10+'px',marginBottom: 5+'px'}">
          <Option v-for="item in completeData" :value="item.wh_name" :key="item.wh_id">{{ item.wh_name }}</Option>
        </AutoComplete>
        <div :style="{height:scrollHeight,overflow:'auto'}" ref="menuContainer">
          <Menu
            width="auto"
            class="menu"
            ref="menu"
            :open-names="['2']"
            @on-select="selecttwoClick"
          >
            <Submenu name="2">
              <template slot="title">
                <Icon type="arrow-down-b"></Icon>
                <span>{{menuitem}}</span>
              </template>
              <MenuItem
                v-for="(item,index) in menudata"
                :key="item.wh_id"
                :name="index"
              >{{item.wh_name}}</MenuItem>
            </Submenu>
          </Menu>
        </div>
        <div slot="trigger"></div>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;">
            <Input
              icon="ios-search"
              placeholder="请输入内容"
              style="width: 200px;margin-right:20px;"
              @on-enter="search"
              @on-click="search"
              v-model="inputVal"
            />
            <span class="f_gl">
              <span @click="glkhClick" class="cor">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>
              <!-- 过滤 -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="filterItem" :model="filterItem" :label-width="80" style="height:400px">
                  <FormItem label="存货编码" prop="chbm">
                    <Input type="text" v-model="filterItem.chbm"></Input>
                  </FormItem>
                  <FormItem label="存货名称" prop="chmc">
                    <Input type="text" v-model="filterItem.chmc"></Input>
                  </FormItem>
                  <!-- <FormItem label="规格型号" prop="ggxh">
                    <Input type="text" v-model="filterItem.ggxh"></Input>
                  </FormItem>-->
                  <FormItem label="条码" prop="tm" v-if="tabName === 'name2'">
                    <Input type="text" v-model="filterItem.tm"></Input>
                  </FormItem>
                  <FormItem label="箱码" prop="xm" v-if="tabName === 'name2'">
                    <Input type="text" v-model="filterItem.xm"></Input>
                  </FormItem>
                  <!-- <FormItem label="设备所有权" prop="sysyq">
                    <Input type="text" v-model="filterItem.sysyq"></Input>
                  </FormItem>-->
                  <FormItem label="状态" prop="zt" v-if="tabName === 'name2'">
                    <Select v-model="filterItem.zt" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in status"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="操作时间段" v-if="tabName === 'name2'">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          placement="left"
                          type="date"
                          :options="startOption"
                          placeholder="Select date"
                          v-model="filterItem.kssj"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          placement="left"
                          type="date"
                          :options="endOption"
                          placeholder="Select date"
                          v-model="filterItem.jssj"
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
                <!-- <Icon type="navicon"></Icon> -->
                <Icon type="navicon-round"></Icon>
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
          :style="{background: '#fff', minHeight: scrollHeight}"
          style="padding-left:10px;margin-top:-20px"
        >
          <Tabs ref="tab" v-model="tabName" @on-click="changeTab">
            <TabPane label="在库设备资产" name="name1">
              <Table
                class="table"
                :columns="jbxx_columns"
                :data="jbxx_data"
                size="small"
                :loading="ckLoading"
                highlight-row
                :height="tableHeight"
                @on-current-change="changeRow"
              ></Table>
              <Page
                :current.sync="pageName1"
                :total="zkSum"
                :page-size="10"
                @on-change="getProductList"
                size="small"
                show-total
                show-elevator
                style="text-align:center;margin:20px 0;"
              ></Page>
            </TabPane>
            <TabPane label="出入库记录" name="name2">
              <Table
                :columns="crk_columns"
                :data="crk_data"
                size="small"
                highlight-row
                :loading="crkLoading"
              ></Table>
              <Page
                :current.sync="pageName2"
                :total="crkSum"
                :page-size="10"
                @on-change="getCrkList"
                size="small"
                show-elevator
                show-total
                style="text-align:center;margin:20px 0;"
              ></Page>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="modal1" width="500" title="设备资产台账" class="tzmodal">
      <div>
        <div style="float:left;margin-left:20px;">
          <h3>能效集中采集终端</h3>
          <p style="font-size:11px;">
            条码:
            <span>{{jbxx.tm}}</span>
          </p>
        </div>
        <!-- <Button style="float:right;margin-right:20px;">领用</Button> -->
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
import sblbTale from "../../public-components/sblb_table.vue";
const status = [
  {
    val: "销售出库",
    index: -1
  },
  {
    val: "出库中（针对仓库）",
    index: 0
  },
  {
    val: "待收货",
    index: 1
  },
  {
    val: "入库；已收货",
    index: 10
  },
  {
    val: "领用",
    index: 20
  },
  {
    val: "拆除",
    index: 30
  },
  {
    val: "安装",
    index: 40
  },
  {
    val: "丢失",
    index: 50
  },
  {
    val: "上线",
    index: 60
  },
  {
    val: "退货",
    index: 70
  }
];
export default {
  name: "deviceQuery",
  components: {
    sblbTale
  },
  data() {
    return {
      status,
      mapStatus: {
        "-1": "销售出库",
        0: "出库中（针对仓库）",
        1: "待收货",
        10: "入库；已收货",
        20: "领用",
        30: "拆除",
        40: "安装",
        50: "丢失",
        60: "上线",
        70: "退货"
      },
      mapType: {
        0: "出库",
        1: "入库",
        2: "领用",
        3: "拆除",
        4: "安装",
        5: "丢失",
        6: "上线"
      },
      cktype_current_index: 0,
      crk_current_index: 0,
      ck_current_index: "",
      zkSum: 1,
      crkSum: 1,
      jbxx_columns: [
        {
          title: "存货编码",
          key: "chbm",
          align: "center"
        },
        {
          title: "存货名称",
          key: "chmc",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.chmc !== null && params.row.chmc !== undefined) {
              if (params.row.chmc.length > 15) {
                texts = params.row.chmc.substring(0, 15) + "...";
              } else {
                texts = params.row.chmc;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.chmc
                )
              ]
            );
          }
        },
        {
          title: "规格型号",
          key: "ggxh",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.ggxh !== null && params.row.ggxh !== undefined) {
              if (params.row.ggxh.length > 20) {
                texts = params.row.ggxh.substring(0, 20) + "...";
              } else {
                texts = params.row.ggxh;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.ggxh
                )
              ]
            );
          }
        },
        {
          title: "计量单位",
          key: "jldw",
          align: "center"
        },
        {
          title: "数量",
          key: "sl",
          width: 80,
          align: "center"
        },
        {
          title: "存放仓库",
          key: "cfck",
          align: "center"
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
                      this.inputVal = params.row.chbm;
                      this.getCrkList(1);
                      this.tabName = "name2";
                    }
                  }
                },
                "设备列表"
              )
            ]);
          }
        }
      ],
      jbxx_data: [{}],
      yjjl_columns: [
        {
          title: "发生时间",
          key: "fssj",
          align: "center"
        },
        {
          title: "事件类型",
          key: "sjlx",
          align: "center"
        },
        {
          title: "详细描述",
          key: "xxms",
          align: "center"
        },
        {
          title: "处理人",
          key: "clr",
          align: "center"
        }
      ],
      crk_columns: [
        {
          title: "条码",
          key: "tm",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.zcrowClick(params.row);
                    }
                  }
                },
                params.row.tm
              )
            ]);
          }
        },
        {
          title: "存货编码",
          key: "chbm",
          align: "center"
        },
        {
          title: "存货名称",
          key: "product_name",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.product_name !== null) {
              if (params.row.product_name.length > 15) {
                texts = params.row.product_name.substring(0, 15) + "...";
              } else {
                texts = params.row.product_name;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.product_name
                )
              ]
            );
          }
        },
        {
          title: "规格型号",
          key: "ggxh",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.ggxh !== null) {
              if (params.row.ggxh.length > 20) {
                texts = params.row.ggxh.substring(0, 20) + "...";
              } else {
                texts = params.row.ggxh;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.ggxh
                )
              ]
            );
          }
        },
        {
          title: "计量单位",
          key: "jldw",
          width: 100,
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
          key: "czsj",
          align: "center",
          width:150
        }
      ],
      crk_data: [],
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
      czjldata: [],
      cpxhpz: [
        {
          mc: "所有类型仓库",
          id: undefined
        },
        {
          mc: "成品库",
          id: 0
        },
        {
          mc: "工程物资库",
          id: 1
        },
        {
          mc: "固定资产库",
          id: 2
        }
      ],
      filterItem: {
        chbm: "",
        chmc: "",
        ggxh: "",
        tm: "",
        xm: "",
        sysyq: "",
        zt: "",
        kssj: "",
        jssj: ""
      },
      startOption:{
        disabledDate:time =>{
          if(this.filterItem.jssj){
            return time.getTime() > new Date(this.filterItem.jssj).getTime()
          }
        }
      },
      endOption:{
        disabledDate:time =>{
          if(this.filterItem.kssj){
            return time.getTime() < new Date(this.filterItem.kssj).getTime()
          }
        }
      },
      glShow: false,
      moreShow: false,
      menudata: [],
      modal1: false,
      tm: "1234567",
      tooptipShow: false,
      menuitem: "所有仓库",
      sblb_data: [],
      name: "",
      tabName: "name1",
      inputVal: "",
      ckLoading: false,
      crkLoading: false,
      selectedProcode: "",
      selectedWhid: "",
      pageName1: 1,
      pageName2: 1,
      filterStatus: false,
      tableHeight: "",
      completeValue: ''
    };
  },
  methods: {
    tooltipClick(side) {
      if (side === "inside") {
        this.tooptipShow = !this.tooptipShow;
      } else if (side === "outside") {
        if (this.tooptipShow) this.tooptipShow = false;
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
        ]
      };
      this.czjldata = [];
      this.$http.PostXLASSETS(request).then(response => {
        this.czjldata = [];
        let res = response.data.result.data;
        this.jbxx.tm = res[0].device_address;
        this.jbxx.chbh = res[0].product_code;
        this.jbxx.chmc = res[0].assets_name;
        this.jbxx.jldw = res[0].product_unit;
        this.jbxx.xm = res[0].box_address;
        this.jbxx.cfck = res[0].warehouse_name;
        this.jbxx.syq = res[0].ownership;
        this.jbxx.zj = res[0].product_price;
        res[0].operation_log.forEach(log => {
          this.czjldata.push({
            time: log.devicelog_ts,
            content: this.mapType[log.devicelog_type],
            name: log.account_name || "仓库管理员"
          });
        });
        this.czjldata.sort((a, b) => {
          return new Date(a.time) - new Date(b.time);
        });
      });
    },
    selectClick(index) {
      this.tooptipShow = false;
      this.cktype_current_index = index;
      this.getMenuList(index);
      if (this.$refs.menu.currentActiveName !== -1)
        this.$refs.menu.currentActiveName = -1;
      this.ck_current_index = "";
      this.getProductList(1);
      if (this.tabName !== "name1") this.tabName = "name1";
    },
    getProductList(p) {
      let request = {
        typeid: 23008,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            wh_type: this.cpxhpz[this.cktype_current_index].id,
            wh_id:
              this.menudata &&
              this.menudata.length > 0 &&
              this.ck_current_index !== ""
                ? this.menudata[this.ck_current_index].wh_id
                : undefined,
            keyword: this.inputVal === "" ? undefined : this.inputVal,
            product_code:
              this.filterItem.chbm === "" ? undefined : this.filterItem.chbm, //存货编码
            product_name:
              this.filterItem.chmc === "" ? undefined : this.filterItem.chmc, //存货名称
            page_num: p,
            page_size: 10
          }
        ]
      };
      if (request.data[0].wh_id) {
        this.inputVal = "";
        request.data[0].keyword = undefined;
      }
      this.jbxx_data = [];
      this.ckLoading = true;
      this.$http.PostXLASSETS(request).then(
        response => {
          this.jbxx_data = [];
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
        },
        error => {
          this.ckLoading = false;
        }
      );
    },
    getCrkList(p) {
      var request = {
        typeid: 23009,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            wh_id: this.selectedWhid === "" ? undefined : this.selectedWhid,
            wh_type: this.cpxhpz[this.cktype_current_index].id,
            product_code:
              this.selectedProcode === ""
                ? this.filterItem.chbm === ""
                  ? undefined
                  : this.filterItem.chbm
                : this.selectedProcode,
            product_name:
              this.filterItem.chmc === "" ? undefined : this.filterItem.chmc, //存货名称
            device_address:
              this.filterItem.tm === "" ? undefined : this.filterItem.tm, //条码
            box_address:
              this.filterItem.xm === "" ? undefined : this.filterItem.xm, //箱码
            device_start_time:
              this.filterItem.kssj === ""
                ? undefined
                : this.filterItem.kssj.getFullYear() +
                  "-" +
                  (this.filterItem.kssj.getMonth() + 1) +
                  "-" +
                  this.filterItem.kssj.getDate() +
                  " 00:00:00", //开始时间
            device_end_time:
              this.filterItem.jssj === ""
                ? undefined
                : this.filterItem.jssj.getFullYear() +
                  "-" +
                  (this.filterItem.jssj.getMonth() + 1) +
                  "-" +
                  this.filterItem.jssj.getDate() +
                  " 23:59:59", //结束名称
            device_status:
              this.filterItem.zt === "" ? undefined : this.filterItem.zt, //状态
            keyword: this.inputVal === ""||this.inputVal === this.selectedProcode ? undefined : this.inputVal,
            page_num: p,
            page_size: 10
          }
        ]
      };
      this.crkLoading = true;
      this.crk_data = [];
      this.$http.PostXLASSETS(request).then(
        response => {
          this.crk_data = [];
          let { data } = response.data.result;
          this.crkSum = data[0].sum;
          data[0].devicelist.forEach(d => {
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
          });
          this.crkLoading = false;
        },
        error => {
          this.crkLoading = false;
        }
      );
    },
    changeTab(p) {
      if (p === "name2") {
        this.getCrkList(1);
      }
    },
    selecttwoClick(index) {
      this.ck_current_index = index;
      this.getProductList(1);
      if (this.tabName !== "name1") this.tabName = "name1";
    },
    getMenuList(index) {
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
            wh_type:
              index === 0 ? undefined : index === 1 ? 0 : index === 2 ? 1 : 3
          }
        ]
      };
      this.menudata = [];
      this.$http.PostXLASSETS(request).then(response => {
        this.menudata = [];
        let res = response.data.result;
        this.zkSum = res.sum;
        for (var i = 0; i < res.data.length; i++) {
          if (!this.menudata.find(data => data.wh_id === res.data[i].wh_id)) {
            this.menudata.push(res.data[i]);
          }
        }

        // this.selecttwoClick(this.ck_current_index||0);
      });
    },
    search(val) {
      // if(this.inputVal === '') return;
      this.inputVal = this.inputVal.replace(/^\s+|\s+$/g, "");
      this.getMenuList(0);
      if (this.$refs.menu.currentActiveName !== -1)
        this.$refs.menu.currentActiveName = -1;
      this.ck_current_index = "";
      if (this.tabName === "name1") {
        this.pageName1 = 1;
        this.getProductList(1);
      } else if (this.tabName === "name2") {
        this.pageName2 = 1;
        this.getCrkList(1);
      }
    },
    closeglClick() {
      this.glShow = false;
      $(".cor").css({ color: "#000000" });
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
        if (this.tabName === "name1") {
          this.getProductList(1);
        } else {
          this.getCrkList(1);
        }
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.filterStatus = true;
          this.glShow = false;
          if (this.tabName === "name1") {
            this.getProductList(1);
          } else {
            this.getCrkList(1);
          }
          if (this.jbxx_data == "") {
            this.zkSum = 1;
          }
          if(this.crk_data == ""){
            this.crkSum = 1
          }    
          this.$Message.success("查询成功！");
        } else {
          this.$Message.error("查询失败，请重试!");
        }
      });
    },
    handleReset(name) {
      this.filterStatus = false;
      for (let key in this.filterItem) {
        this.filterItem[key] = "";
      }
    },
    changeRow(row) {
      this.inputVal = row.chbm;
    },
    goMenu(menu){
      let whId = (this.menudata.find(m => m.wh_name === menu)||{}).wh_id||'';
      this.$refs['menu'].currentActiveName = this.menudata.findIndex(m => m.wh_id === whId)||0;
      this.completeValue = '';
      this.$nextTick(() => {
        this.ck_current_index = this.menudata.findIndex(m => m.wh_id === whId)||0;
        let scroll = this.$refs['menu'].$children[0].$children[this.ck_current_index + 2].$el.offsetTop - 200
        this.$refs['menu'].updateActiveName();
        this.$refs['menu'].updateActiveName();
        this.$refs['menuContainer'].scrollTo(0,scroll);
        this.getProductList(1);
      })
    },
    searchMenu(){
      if(this.completeData.length>0) this.goMenu(this.completeData[0].wh_name);
    }
  },
  mounted() {
    this.selectClick(0);
  },
  computed: {
    scrollHeight() {
      let h = 0;
      // h = (window.screen.height-330)+'px'
      h = document.body.scrollHeight - 185 + "px";
      return h;
    },
    completeData(){
      let data = [];
      if(this.menudata && this.menudata.length>0 && this.completeValue !== ''){
        data = JSON.parse(JSON.stringify(this.menudata)).filter(i => i.wh_name.indexOf(this.completeValue) !== -1);
      }
      return data;
    }
  },
  watch: {
    tabName(nv) {
      if (nv === "name1") {
        this.selectedWhid = "";
        this.selectedProcode = "";
        if(this.inputVal !== ''){
          this.inputVal = '';
          this.getProductList(1);
        }
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
/* @media screen and (max-width: 1366px) {
    .tableHeight {
       max-height:350px;
       overflow:auto

    }
} */
.tzmodal .ivu-modal-footer {
  display: none;
}
</style>
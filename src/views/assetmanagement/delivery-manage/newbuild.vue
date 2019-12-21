<template>
  <div class="newbuild layout">
    <Layout style="background:#ffffff;width:95%;minHeight:800px;">
      <p style="font-size:16px;margin:20px 0 10px 0;">发货要求</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="发起人" prop="name">
          <Input :value="$store.state.user.accountName" placeholder  disabled style="width:325px;" />
        </FormItem>
        <FormItem label="要求发货时间" prop="fhsj">
          <DatePicker
            type="date"
            placeholder
            v-model="formValidate.fhsj"
            style="width:300px;margin-right:10px"
          ></DatePicker>之前
        </FormItem>
        <FormItem label="方案描述" prop="desc">
          <el-input
            type="textarea"
            placeholder="请输入文字对方案进行描述"
            v-model="formValidate.desc"
            :autosize="{minRows: 2,maxRows: 5}"
            maxlength="1000"
            show-word-limit
            style="width:500px;"
          >
          </el-input>
        </FormItem>
        <Row>
          <Col span="7">
            <FormItem label="批次要求" prop="pcyq">
              <Select v-model="formValidate.pcyq" placeholder clearable filterable>
                <Option :value="item" v-for="item in times" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" style="text-align: center;line-height:30px">至</Col>
          <Col span="6">
            <FormItem prop="pcyq1" :label-width="1">
              <Select v-model="formValidate.pcyq1" placeholder clearable filterable>
                <Option :value="item" v-for="item in times" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <!-- <Row>
          <Col span="12">
            <FormItem label="客户" prop="costom">
              <Select v-model="formValidate.costom" placeholder clearable filterable>
                <Option :value="item" v-for="item in custom" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
          <Col span="12">
            <FormItem label="仓库" prop="house">
              <Select v-model="formValidate.house" placeholder clearable filterable>
                <Option :value="item" v-for="item in house" :key="item">{{item}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row> -->
        <content>
          <div class="fa_co" style="border:none;">
            <div class="fa_c">
              <span style="font-size:16px">出库设备</span>
            </div>
            <div style="clear:both;overflow: hidden;">
              <div style="width:17%;float:left;">
                <Table
                  :columns="cksb_columns1"
                  ref="cktable"
                  :data="outcksb_data1"
                  size="small"
                  disabled-hover
                  height="300"
                  highlight-row
                  @on-row-click="ckbhClick"
                  @on-current-change="changeRow"
                  style="margin:20px 0 0 0px;overflow:auto;"
                  class="del"
                ></Table>
                <p class="dd_add" @click="ddmodal = true">
                  <Icon type="plus"></Icon>添加订单
                </p>
              </div>
              <div style="width:83%;float:right;">
                <!-- <p class="ck_p">
                  <span>
                    订单数
                    <b>{{}}</b>个
                  </span>
                  <span style="margin:0px 40px;">
                    设备数
                    <b>{{}}</b>台
                  </span>
                </p>-->
                <!--  <p style="margin-left:10px;border-bottom:0.7px solid #e4e7ed">共<span>{{count}}</span>家客户（可筛选查看）</p> -->
                <div style="display:flex">
                  <div style="flex:1;">
                    <Dropdown
                      trigger="click"
                      placement="bottom"
                      transfer
                      @on-click="changeOrder"
                      v-show="customShow"
                    >
                      {{selectedCustom === '全部'?`共${customList.length-1}家客户（可筛选查看）`:selectedCustom}}
                      <Icon type="arrow-down-b"></Icon>
                      <DropdownMenu slot="list">
                        <DropdownItem
                          v-for="item in customList"
                          :value="item"
                          v-model="selectedCustom"
                          :key="item"
                          :name="item"
                        >{{item}}</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div style="margin:0px 40px;">
                    订单数
                    <span>{{outcksb_data1.length - 1}}</span>个
                  </div>
                  <div style="margin:0px 40px;">
                    设备数
                    <span>{{toatalQuantity}}</span>台
                  </div>
                </div>
                <Table
                  :columns="outdevice_columns"
                  :data="outcksb_data"
                  size="small"
                  style="margin:0px 0 0 0;overflow:auto;min-height:350px;"
                  class="ne_but"
                ></Table>
              </div>
            </div>
          </div>
        </content>
        <FormItem class="form_b">
          <Button type="primary" @click="handleSubmit('formValidate','save')">保存</Button>
          <Button type="primary" @click="handleSubmit('formValidate')" style="margin-left: 20px">提交</Button>
          <Button type="ghost" style="margin-left: 20px" @click="cancleSubmit()">取消</Button>
        </FormItem>
      </Form>
    </Layout>
    <!-- 调整弹框 -->
    <Modal
      v-model="tzmodal"
      width="900"
      class="hz1"
      @on-cancel="changeCountCancel"
      :mask-closable="false"
      :closable="false"
    >
      <p class="tz_p">调整发货</p>
      <p class="tz_p1">
        对涉及型号为
        <span style="color:#4a9af5">{{changeRowData.currentData.product_models}}</span>的订单进行发货调整
      </p>
      <Input
        icon="ios-search"
        placeholder="请输入内容"
        class="right tz_in"
        v-model="changeCountInput"
        @on-enter="changeCount(changeRowData.currentData)"
        @on-click="changeCount(changeRowData.currentData)"
      />
      <Table
        ref="table"
        :columns="tz_columns"
        :data="tz_data"
        :row-class-name="rowClassName"
        style="clear:both;margin-left:10px;"
        @on-selection-change="changeCheck"
      ></Table>
      <div class="tz_i">
        <p class="left" style="color:#e6a23c">
          <Icon type="information-circled" class="tz_ic"></Icon>调整订单中指定规格型号的发货数量直至发货设备总数量变为
          <span style="color:#6fd000">绿色</span>
        </p>
        <p class="tz_ic1 right">
          <span>
            发货设备数
            <b
              :style="{color:(changeRowData.currentData.product_quantity -changeRowData.currentData.repertory>0)? 'red':'#6fd000'}"
            >{{changeRowData.currentData.product_quantity}}</b>台
          </span>
          <br />
          <span>
            库存现量
            <b>{{changeRowData.currentData.repertory}}</b>台
          </span>
        </p>
      </div>
    </Modal>
    <!-- 添加订单 -->
    <Modal v-model="ddmodal" width="900" @on-ok="ok">
      <p class="tz_p">添加订单</p>
      <p class="tz_p1">
        选择
        <span style="color:#4a9af5">已下单</span>或
        <span style="color:#4a9af5">部分到货</span>的订单到发货方案中
      </p>
      <Input
        icon="ios-search"
        placeholder="请输入内容"
        class="right tz_in"
        v-model="addOrderInput"
        @on-enter="getOrderList(1)"
        @on-click="getOrderList(1)"
      />
      <Table
        :columns="dd_columns"
        :data="dd_data"
        @on-selection-change="changeSelect"
        style="clear:both;margin-left:10px;"
      ></Table>
      <Page
        :current.sync="pageNum"
        :total="sum"
        :page-size="10"
        @on-change="getOrderList"
        size="small"
        show-total
        show-elevator
        style="text-align:center;margin:20px 0;"
      ></Page>
    </Modal>
  </div>
</template>

<script>
import silderInput from "../../public-components/silder-input.vue";

const levelMap = {
  1: "A级",
  2: "B级",
  3: "C级",
  4: "D级",
  5: "E级"
};
const orderMap = {
  0: "合同订单",
  1: "备货订单"
};
export default {
  name: "newbuild",
  components: {
    silderInput
  },
  data() {
    return {
      formValidate: {
        name: "",
        fhsj: "",
        desc: "",
        pcyq: "",
        pcyq1: "",
        costom:"",
        house:""
      },
      pageNum: 1,
      sum: 0,
      levelMap,
      orderMap,
      currentRow: {},
      changeRowData: {
        data: {},
        currentData: {}
      },
      changeOkData: {},
      selectOrder: "汇总",
      addOrderInput: "",
      changeCountInput: "",
      selectedCustom: "全部",
      orderDataCache: {},
      cksb_columns1: [
        {
          title: "订单编号",
          key: "ddbh",
          align: "left",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "information-circled"
                },
                style: {
                  color: "#e6a23c",
                  transform: "rotate(180deg)"
                },
                on: {
                  click: () => {}
                }
              }),
              h("span", params.row.ddbh)
            ]);
          }
        },
        {
          title: " ",
          key: "action",
          width: 20,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    float: "right"
                  },
                  on: {
                    click: () => {
                      if (params.row.ddbh === "汇总") return;
                      var _self = this;
                      _self.remove(params.index);
                    }
                  }
                },
                params.row.ddbh !== "汇总" ? "X" : ""
              )
            ]);
          }
        }
      ],
      deliveryBatch:[
          {
            name:"仓库1",
            value:"1"
          },
          {
            name:"仓库2",
            value:"2"
          },
      ],
      cksb_columns: [
        {
          title: "存货编码",
          key: "product_code",
          align: "center"
        },
        {
          title: "存货名称",
          key: "product_name",
          align: "center"
        },
        {
          title: "规格型号",
          key: "product_models",
          align: "center"
        },
        {
          title: "计量单位",
          key: "product_unit",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                  }
                },
                "台"
              )
            ]);
          }
        },
        // {
        //   title:"发货批次",
        //   key:"delivery_batch",
        //   align:"center",      
        //   render:(h,params)=>{
        //       return h('Select',{
        //         props:{
        //           placeholder:"未设置",
        //           size:"small"
        //         }
        //       },
        //       this.deliveryBatch.map((item)=>{
        //           return h('Option',{
        //             props:{
        //               placeholder:"未设置",
        //               value:item.value,
        //               label:item.name
        //             }
        //           })
        //       }))
        //     }
        // },
        {
          title: "数量",
          key: "product_quantity",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color:
                      params.row.product_quantity - params.row.repertory > 0
                        ? "red"
                        : "#495060"
                  }
                },
                params.row.product_quantity
              ),
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                params.row.product_quantity - params.row.repertory > 0
                  ? `（库存：${params.row.repertory}）`
                  : ""
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 120,
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
                  on: {
                    click: () => {
                      this.changeCount(params.row);
                    }
                  }
                },
                "调整"
              )
            ]);
          }
        }
      ],
      outcksb_data1: [
        {
          ddbh: "汇总"
        }
      ],
      tz_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "订单编号",
          key: "ddbh",
          align: "center"
        },
        {
          title: "业务类型",
          key: "ywlx",
          align: "center"
        },
        {
          title: "下单时间",
          key: "xdsj",
          align: "center",
          sortable: true
        },
        {
          title: "客户名称",
          key: "khmc",
          align: "center"
        },
        {
          title: "客户等级",
          key: "khdj",
          align: "center",
          sortable: true
        },
        {
          title: "规格型号",
          key: "ggxh",
          align: "center"
        },
        {
          title: "设备数量",
          key: "sbsl",
          align: "center",
          width: 150,
          sortable: true,
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                size: "small",
                value: params.row.sbsl,
                min: 0,
                max: params.row.max||params.row.sbsl,
                disabled: params.row._checked === false
              },
              on: {
                "on-change": a => {
                  let product_code =
                    params.row.data.product_list[0].product_code;
                  let order_id = params.row.data.order_id;
                  let index = this.outcksb_data1.findIndex(
                    d1 => d1.ddbh === params.row.ddbh
                  );
                  let index2 = (
                    (this.outcksb_data1[index] || {}).product_list || []
                  ).findIndex(d => d.product_code === product_code);
                  this.changeOkData[params.index] = {
                    data: params.row
                  };
                  if (index2 !== -1) {
                    let num = this.outcksb_data1[index].product_list[index2]
                      .issued_count;
                    if (!this.isEdit)
                      this.$set(
                        this.outcksb_data1[index].product_list[index2],
                        "product_quantity",
                        a + num
                      );
                    if (this.isEdit)
                      this.$set(
                        this.outcksb_data1[index].product_list[index2],
                        "quantity_shipped",
                        a
                      );
                    if (!this.changeRowData.data[product_code])
                      this.changeRowData.data[product_code] = {};
                    this.changeRowData.data[product_code][order_id] = a;
                    let {repertory} = this.changeRowData.currentData;
                    this.changeRowData.currentData = this.outcksb_data.find(
                      c =>
                        c.product_code ===
                        this.changeRowData.currentData.product_code
                    );
                    this.changeRowData.currentData.repertory = repertory;
                  }
                }
              }
            });
          }
        }
      ],
      tz_data: [],
      dd_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "订单编号",
          key: "ddbh",
          align: "center"
        },
        {
          title: "业务类型",
          key: "ywlx",
          align: "center"
        },
        {
          title: "下单时间",
          key: "xdsj",
          align: "center",
          // sortable: true
        },
        {
          title: "客户名称",
          key: "khmc",
          align: "center"
        },
        {
          title: "客户等级",
          key: "khdj",
          align: "center",
          // sortable: true
        },
        {
          title: "设备数量",
          key: "sbsl",
          align: "center",
          width: 150,
          // sortable: true,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "red"
                  }
                },
                params.row.data.issued_count > 0 ? "(剩余待发)" : ""
              ),
              h(
                "span",
                {},
                params.row.data.product_quantity - params.row.data.issued_count
              )
            ]);
          }
        }
      ],
      dd_data: [],
      indexStyle: "",
      ruleValidate: {
        fhsj: [
          {
            required: true,
            type: "date",
            message: "请选择时间",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "请输入描述",
            trigger: "blur"
          }
        ]
      },
      tzmodal: false,
      ddmodal: false,
      addAllData: [],
      selectionData: {},
      customShow: false,
      times: [],
      custom:[],
      house:[]
    };
  },
  methods: {
    handleSubmit(name, status) {
      let list = [];
      let s = false;
      this.outcksb_data1.forEach(o => {
        if (o.ddbh !== "汇总" && o.product_list) {
          o.product_list.forEach(p => {
            if (p.product_quantity > p.repertory) {
              this.$Message.error(
                `请依据库存量调整该产品 ${p.product_code}的发货数量！`
              );
              s = true;
              return;
            }
            list.push({
              order_id: o.data.order_id,
              product_code: p.product_code,
              quantity_shipped:
                p.product_quantity - p.issued_count || p.quantity_shipped || 0
            });
          });
        }
      });
      if (s) return; //校验失败跳出
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.outcksb_data.length > 0) {
            let date = new Date(this.formValidate.fhsj);
            let time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00';
            let request = {
              typeid: 23016,
              data: [
                {
                  shipments_time: time,
                  shipments_describe: this.formValidate.desc,
                  shipments_start_batch: this.formValidate.pcyq,
                  shipments_end_batch: this.formValidate.pcyq1,
                  shipments_creator: this.$store.state.user.accountId,
                  product_list: list,
                  shipments_status: status === "save" ? 0 : 1,
                  shipments_id: this.isEdit
                    ? this.$route.query.data.shipments_id
                    : undefined,
                  shipments_no: this.isEdit
                    ? this.$route.query.data.shipments_no
                    : undefined
                }
              ]
            };
            this.$http.SETXLASSETS(request).then(
              response => {
                if (status === "save") {
                  this.$Message.success("保存成功!");
                } else {
                  this.$Message.success("提交成功!");
                  this.$store.dispatch("getworkBench", {
                    accountId: this.$store.state.user.accountId,
                    this: this
                  });
                }
                this.$router.push({
                  path: "/assetmanage/delivery-manage"
                });
              },
              error => {
                if (error.data.code === 0) {
                  if (status === "save") {
                    this.$Message.success("保存成功!");
                  } else {
                    this.$Message.success("提交成功!");
                    this.$store.dispatch("getworkBench", {
                      accountId: this.$store.state.user.accountId,
                      this: this
                    });
                  }
                  this.$router.push({
                    path: "/assetmanage/delivery-manage"
                  });
                }else if(error.data.message){
                  this.$Message.error(error.data.message + ',请稍后重试！');
                }
              }
            );
          } else {
            this.$Message.info("请添加设备");
          }
        } else {
          this.$Message.error("请按规定填写表格！");
        }
      });
    },
    cancleSubmit() {
      this.$router.push({
        path: "/assetmanage/delivery-manage"
      });
    },
    ckbhClick() {},
    rowClassName(row, index) {
      // if (index === this.indexStyle) {
      //     return 'demo-table-info-row';
      //     this.tz_data[index]._checked = true
      // }
      // this.tz_data[index]._checked = false
      // return '';
    },
    remove(index) {
      for(let key in this.selectionData){
        this.selectionData[key] = this.selectionData[key].filter(s => s.ddbh !== this.outcksb_data1[index].ddbh);
        this.getOrderList(1);
      }
      this.outcksb_data1.splice(index, 1);
      this.$nextTick(() => {
        this.$refs["cktable"].objData[0]._isHighlight = true;
        this.changeRow(this.outcksb_data1[0]);
      })
    },
    getOrderList(p) {
      let request = {
        typeid: 23017,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            page_num: p==='orderInit'?undefined:p,
            page_size: p==='orderInit'?undefined:10,
            product_code: "",
            order_list: p==='orderInit'?JSON.parse(this.$route.query.order):undefined,
            keyword: this.addOrderInput
          }
        ]
      };
      if(p !== 'orderInit'){
        this.dd_data = [];
        this.sum = 0;
      }
      this.$http.PostXLASSETS(request).then(response => {
        let { data } = response.data.result;
        if(p === 'orderInit'){
          data.forEach(d => {
            let item = {};
            item.data = d;
            item.ddbh = d.order_no;
            item.ywlx = this.orderMap[d.order_type];
            item.xdsj = d.order_time;
            item.khmc = d.customer_name;
            item.khdj = this.levelMap[d.customer_level];
            item.sbsl = d.quantity;
            item.product_list = d.product_list;
            this.outcksb_data1.push(item);
          })
          this.$refs["cktable"].objData[0]._isHighlight = true;
          this.changeRow(this.outcksb_data1[0]);
          return;
        }
        this.dd_data = [];
        this.sum = data[0].sum;
        data[0].order_list.forEach(d => {
          let item = {};
          item.data = d;
          item.ddbh = d.order_no;
          item.ywlx = this.orderMap[d.order_type];
          item.xdsj = d.order_time;
          item.khmc = d.customer_name;
          item.khdj = this.levelMap[d.customer_level];
          item.sbsl = d.quantity;
          item.product_list = d.product_list;
          if ((this.selectionData[p] || []).find(d => d.ddbh === item.ddbh)) {
            item._checked = true;
          }
          if ((this.selectionData.edit || []).find(d => d.ddbh === item.ddbh)) {
            item._checked = true;
            if (!this.selectionData[p]) {
              this.selectionData[p] = [];
            }
            this.selectionData[p].push(
              (this.selectionData.edit || []).find(d => d.ddbh === item.ddbh)
            );
            let index = this.selectionData.edit.findIndex(
              d => d.ddbh === item.ddbh
            );
            this.selectionData.edit[index] = {};
          }
          this.dd_data.push(item);
        });
      });
    },
    changeSelect(data) {
      // this.selectionData[this.pageNum] = data;
      let arr = [];
      data.forEach(d => {
        if (
          !(this.selectionData[this.pageNum] || []).find(s => s.ddbh === d.ddbh)
        ) {
          if (!this.selectionData[this.pageNum])
            this.selectionData[this.pageNum] = [];
          arr.push(d);
        } else {
          arr.push(
            (this.selectionData[this.pageNum] || []).find(
              s => s.ddbh === d.ddbh
            )
          );
        }
      });
      this.$set(this.selectionData, this.pageNum + "", arr);
    },
    ok() {
      let data = [
        {
          ddbh: "汇总"
        }
      ];
      for (let key in this.selectionData) {
        this.selectionData[key].forEach(s => {
          if (s.ddbh) data.push(s);
        });
      }
      this.outcksb_data1 = data;
      this.$nextTick(() => {
        this.$refs["cktable"].objData[0]._isHighlight = true;
        this.changeRow(this.outcksb_data1[0]);
      });
    },
    changeRow(data) {
      this.customShow = true;
      this.currentRow = JSON.parse(JSON.stringify(data));
    },
    changeCount(data) {
      let { product_code, product_quantity, issued_count } = data;
      this.tzmodal = true;
      this.changeRowData.currentData = data;
      let request = {
        typeid: 23017,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            order_list: data.ids,
            product_code: product_code,
            keyword: this.changeCountInput
          }
        ]
      };
      this.tz_data = [];
      this.$http.PostXLASSETS(request).then(response => {
        this.tz_data = [];
        let { data } = response.data.result;
        data.forEach(d => {
          let item = {};
          item.data = d;
          item.ddbh = d.order_no;
          item.ywlx = this.orderMap[d.order_type];
          item.xdsj = d.order_time;
          item.khmc = d.customer_name;
          item.khdj = this.levelMap[d.customer_level];
          item.max = d.product_quantity - d.issued_count;
          item._checked = false;
          if (
            this.changeRowData.data[product_code] &&
            this.changeRowData.data[product_code][d.order_id] !== undefined
          ) {
            item.sbsl = this.changeRowData.data[product_code][d.order_id];
          } else {
            item.sbsl =
              d.product_list[0].product_quantity -
              d.product_list[0].issued_count;
          }
          item.ggxh = this.changeRowData.currentData.product_models;
          if(d.product_list[0].repertory !== undefined) this.changeRowData.currentData.repertory =
            d.product_list[0].repertory;
          this.tz_data.push(item);
        });
      });
    },
    changeCountCancel() {
      for (let key in this.changeOkData) {
        let params = this.changeOkData[key].data;
        let product_code = params.data.product_list[0].product_code;
        let order_id = params.data.order_id;
        let index = this.outcksb_data1.findIndex(d1 => d1.ddbh === params.ddbh);
        let index2 = (
          (this.outcksb_data1[index] || {}).product_list || []
        ).findIndex(d => d.product_code === product_code);
        if (index2 !== -1) {
          this.$set(
            this.outcksb_data1[index].product_list[index2],
            "product_quantity",
            params.sbsl + params.data.product_list[0].issued_count
          );
          (this.changeRowData.data[product_code] || {})[order_id] = params.sbsl; // params.data.product_list[0].product_quantity - params.data.product_list[0].issued_count;
          this.changeRowData.currentData = this.outcksb_data.find(
            c => c.product_code === this.changeRowData.currentData.product_code
          );
        }
      }
    },
    changeOrder(name) {
      this.selectedCustom = name;
      if (Object.keys(this.orderDataCache).length === 0)
        this.orderDataCache = JSON.parse(JSON.stringify(this.outcksb_data1));
      if (name === "全部") {
        this.outcksb_data1 = JSON.parse(JSON.stringify(this.orderDataCache));
      } else {
        this.outcksb_data1 = this.outcksb_data1.filter(
          o => o.khmc === name || o.ddbh === "汇总"
        );
      }
      // for(let key in this.$refs['cktable'].objData){
      //   if(name === this.$refs['cktable'].objData[key].ddbh){
      //     this.$refs['cktable'].objData[key]._isHighlight = true;
      //     this.currentRow = this.$refs['cktable'].objData[key];
      //   }else{
      //     this.$refs['cktable'].objData[key]._isHighlight = false;
      //   }
      // }
    },
    editInit() {
      let request = {
        typeid: 23020,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            shipments_id: (this.$route.query || {}).shipments_id
          }
        ]
      };
      this.$http.PostXLASSETS(request).then(response => {
        let { data } = response.data.result;
        this.formValidate.fhsj = data[0].shipments_time;
        this.formValidate.desc = data[0].shipments_describe;
        this.formValidate.pcyq = data[0].shipments_start_batch;
        this.formValidate.pcyq1 = data[0].shipments_end_batch;
        data[0].product_list.forEach(p => {
          let item = {};
          item.ddbh = p.order_no;
          if (this.outcksb_data1.find(o => o.ddbh === p.order_no)) {
            let obj = this.outcksb_data1.find(o => o.ddbh === p.order_no);
            obj.product_list.push(p);
          } else {
            item.data = JSON.parse(JSON.stringify(data[0]));
            item.data.order_id = p.order_id;
            item.product_list = [];
            item.product_list.push(p);
            this.outcksb_data1.push(item);
            if (!this.selectionData.edit) this.selectionData.edit = [];
            this.selectionData.edit.push(item);
          }
          if (!this.changeRowData.data[p.product_code])
            this.changeRowData.data[p.product_code] = {};
          this.changeRowData.data[p.product_code][p.order_id] =
            p.quantity_shipped;
          this.$refs["cktable"].objData[0]._isHighlight = true;
          this.changeRow(this.outcksb_data1[0]);
        });
      });
    },
    getTimes() {
      let request = {
        typeid: 27011
      };
      this.times = [];
      this.$http.XLSELECT(request).then(response => {
        this.times = response.data.result.data[0].patchList;
        if (this.isEdit) {
          this.editInit();
        }
      });
    },
    changeCheck(selection){
      this.tz_data.forEach((t,i) => {
        let {product_code} = this.changeRowData.currentData;
        if((this.changeRowData.data[product_code]||{})[t.data.order_id] !== undefined){
          t.sbsl = (this.changeRowData.data[product_code]||{})[t.data.order_id];
        }
        if(selection.find(s =>s.ddbh === t.ddbh)&&t._checked === false){
          t._checked = true;
        }else if(!selection.find(s =>s.ddbh === t.ddbh)&&t._checked === true){
          t._checked = false;
        }
      })
    }
  },
  mounted() {
    if(this.$route.query.order){
      this.getOrderList('orderInit');
    }
    this.getOrderList(1);
    this.getTimes();
  },
  computed: {
    outcksb_data() {
      let data = [];
      if (
        this.outcksb_data1 &&
        this.outcksb_data1.length > 0 &&
        this.currentRow &&
        this.currentRow.ddbh
      ) {
        if (this.currentRow.ddbh === "汇总") {
          this.outcksb_data1.forEach(d => {
            if (d.product_list && d.product_list.length > 0) {
              d.product_list.forEach(p => {
                if (data.find(o => o.product_code === p.product_code)) {
                  let index = data.findIndex(
                    o => o.product_code === p.product_code
                  );
                  data[index].product_quantity +=
                    p.product_quantity - p.issued_count || p.quantity_shipped || 0;
                  (data[index].ids || []).push(d.data.order_id);
                } else {
                  let item = JSON.parse(JSON.stringify(p)) || {};
                  item.ids = [];
                  item.ids.push(d.data.order_id);
                  item.product_quantity =
                    item.product_quantity - item.issued_count ||
                    p.quantity_shipped || 0;
                  data.push(item);
                }
              });
            }
          });
          this.addAllData = data;
        } else {
          data = JSON.parse(
            JSON.stringify(
              (
                this.outcksb_data1.find(d => d.ddbh === this.currentRow.ddbh) ||
                {}
              ).product_list || []
            )
          );
          data.forEach(d => {
            d.product_quantity =
              d.product_quantity - d.issued_count || d.quantity_shipped || 0;
          });
        }
      }
      return data;
    },
    outdevice_columns() {
      let columns = this.cksb_columns;
      if (this.currentRow && this.currentRow.ddbh) {
        if (this.currentRow.ddbh !== "汇总") {
          columns = columns.filter(c => c.key !== "action");
        } else {
          columns = this.cksb_columns;
        }
      }
      return columns;
    },
    toatalQuantity() {
      let num = 0;
      if (this.outcksb_data1 && this.outcksb_data1.length > 0) {
        this.outcksb_data1.forEach(o => {
          if (o.ddbh !== "汇总" && o.product_list) {
            o.product_list.forEach(p => {
              num += p.product_quantity - p.issued_count || p.quantity_shipped || 0;
            });
          }
        });
      }
      return num;
    },
    isEdit() {
      return !!this.$route.query.data;
    },
    editData() {
      return this.$route.query.data;
    },
    customList() {
      let customList = ["全部"];
      if (this.outcksb_data1 && this.outcksb_data1.length > 0) {
        this.outcksb_data1.forEach(o => {
          if (o.ddbh !== "汇总") {
            let customer_name = o.khmc || "--";
            if (customList.indexOf(customer_name) === -1) {
              customList.push(customer_name);
            }
          }
        });
      }
      return customList;
    }
  },
  watch: {
    ddmodal(nv) {
      if (!nv) {
        this.pageNum = 1;
        this.addOrderInput = "";
        this.getOrderList(1);
      }
    },
    tzmodal() {
      this.changeOkData = {};
    }
  }
};
</script>

<style>
@import "../assetmanage.css";
@import "../../customermanage/customer.css";
.del .ivu-btn-error {
  color: #8d8d8d;
  background-color: transparent;
  border-color: transparent;
}
.hz1 .ivu-table .demo-table-info-row td {
  /* background-color: #2db7f5; */
  color: #60a9f4;
}
.del .ivu-table-cell {
  padding-left: 8px;
  padding-right: 0px;
}
.ivu-select-single .ivu-select-selection .ivu-select-placeholder{
 color:orange
}
</style>
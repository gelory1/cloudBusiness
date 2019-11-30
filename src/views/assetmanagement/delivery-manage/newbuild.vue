<template>
  <div class="newbuild layout">
    <Layout style="background:#ffffff;width:95%;minHeight:800px;">
      <p style="font-size:16px;margin:20px 0 10px 0;">发货要求</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="发起人" prop="name">
          <Input v-model="formValidate.name" placeholder disabled style="width:325px;"></Input>
        </FormItem>
        <FormItem label="要求发货时间" prop="fhsj">
          <DatePicker type="date" placeholder v-model="formValidate.fhsj" style="width:300px;"></DatePicker>之前
        </FormItem>
        <FormItem label="方案描述" prop="desc">
          <Input
            v-model="formValidate.desc"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="Enter something..."
            style="width:500px;"
          ></Input>
        </FormItem>
        <Row>
          <Col span="7">
            <FormItem label="批次要求" prop="pcyq">
              <Select v-model="formValidate.pcyq" placeholder>
                <Option value="one">one</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="1" style="text-align: center">至</Col>
          <Col span="6">
            <FormItem prop="pcyq1" :label-width="1">
              <Select v-model="formValidate.pcyq1" placeholder>
                <Option value="one">one</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <content>
          <div class="fa_co" style="border:none;margin-top:20px;">
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
                  style="margin:20px 0 0 0px;overflow:auto"
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
                <p class="ck_p">
                  <span>南京----选中的订单编号前面有叹号显示这一部分</span>
                  <span style="margin:0px 40px;">
                    <Icon type="information-circled" class="tz_ic"></Icon>收货地址：
                    <span style="color:#4a9af5">（未设置）</span>
                  </span>
                </p>
                <Table
                  :columns="cksb_columns"
                  :data="outcksb_data"
                  size="small"
                  style="margin:0px 0 0 0;overflow:auto"
                  class="ne_but"
                ></Table>
              </div>
            </div>
          </div>
        </content>
        <FormItem style="margin:30px 0 0 -70px">
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button type="ghost" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Layout>
    <!-- 调整弹框 -->
    <Modal v-model="tzmodal" width="900" class="hz1">
      <p class="tz_p">调整发货</p>
      <p class="tz_p1">
        对涉及型号为
        <span style="color:#4a9af5">{{}}</span>的订单进行发货调整
      </p>
      <Input icon="ios-search" placeholder="请输入内容" class="right tz_in" />
      <Table :columns="tz_columns" :data="tz_data" :row-class-name="rowClassName" style="clear:both;margin-left:10px;"></Table>
      <div class="tz_i">
        <p class="left" style="color:#e6a23c">
          <Icon type="information-circled" class="tz_ic"></Icon>调整订单中指定规格型号的发货数量直至发货设备总数量变为
          <span style="color:#6fd000">绿色</span>
        </p>
        <p class="tz_ic1 right">
          <span>
            发货设备数
            <b style="color:red">{{}}</b>台
          </span>
          <br />
          <span>
            库存现量
            <b>{{}}</b>台
          </span>
        </p>
      </div>
    </Modal>
    <!-- 添加订单 -->
    <Modal v-model="ddmodal" width="900">
      <p class="tz_p">添加订单</p>
      <p class="tz_p1">
        选择
        <span style="color:#4a9af5">已下单</span>或
        <span style="color:#4a9af5">部分到货</span>的订单到发货方案中
      </p>
      <Input icon="ios-search" placeholder="请输入内容" class="right tz_in" />
      <Table :columns="dd_columns" :data="dd_data" style="clear:both;margin-left:10px;"></Table>
    </Modal>
  </div>
</template>

<script>
import silderInput from "../../public-components/silder-input.vue";
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
        pcyq1: ""
      },
      cksb_columns1: [
        {
          title: "订单编号",
          key: "ddbh",
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
          width: 150,
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
                      this.remove(params.index);
                    }
                  }
                },
                "X"
              )
            ]);
          }
        }
      ],
      cksb_columns: [
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
          title: "数量",
          key: "sl",
          align: "center"
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
                      this.tzmodal = true;
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
          ddbh: "111111"
        },
        {
          ddbh: "222222"
        },
        {
          ddbh: "333333"
        }
      ],
      outcksb_data: [
        {
          sl: "55"
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
          key: "sbsj",
          align: "center",
          width: 150,
          sortable: true,
          render: (h, params) => {
            return h("div", [
              h(silderInput, {
                props: {
                  // job_id: params.row.id
                },
                on: {}
              })
            ]);
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
          title: "设备数量",
          key: "sbsj",
          align: "center",
          width: 150,
          sortable: true,
          render: (h, params) => {
            return h("div", [
              h(silderInput, {
                props: {
                  // job_id: params.row.id
                },
                on: {}
              })
            ]);
          }
        }
      ],
      dd_data: [],
      indexStyle:"",
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The name cannot be empty",
            trigger: "blur"
          }
        ],
        fhsj: [
          {
            required: true,
            type: "date",
            message: "Please select the date",
            trigger: "change"
          }
        ],
        desc: [
          {
            required: true,
            message: "Please enter a personal introduction",
            trigger: "blur"
          }
        ]
      },
      tzmodal: false,
      ddmodal: false
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    ckbhClick() {},
    rowClassName (row, index) {
        // if (index === this.indexStyle) {
        //     return 'demo-table-info-row';
        //     this.tz_data[index]._checked = true
        // } 
        // this.tz_data[index]._checked = false
        // return '';
    },
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
.hz1 .ivu-table .demo-table-info-row td{
        /* background-color: #2db7f5; */
        color: #60A9F4;
}
</style>
<template>
  <div class="edit layout">
    <Layout class style="width:95%;min-height:800px;padding-left:20px;background:#fff">
      <p class="div_p">订单信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="8">
            <FormItem label="申请人" prop="name" :label-width="90">
              <Input class :value="$store.state.user.accountName" disabled placeholder />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="业务类型" prop="type" class="con-right">
              <Input class="col-m" value="备货订单" disabled placeholder />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="销售类型" prop="saleType" class="con-right">
              <Input class="col-m" value="渠道" disabled placeholder />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="申请公司" prop="customer" :label-width="90">
              <Select v-model="formValidate.customer.index" placeholder filterable clearable>
                <Option
                  v-for="(item,index) in customs"
                  :value="item.index"
                  :key="index"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="仓库" prop="store" :label-width="90">
              <Select v-model="formValidate.store.index" placeholder filterable clearable>
                <Option
                  v-for="(item) in stores"
                  :value="item.index"
                  :key="item.index"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="收货地址" prop="adress" :label-width="90">
              <Select v-model="formValidate.adress.index" placeholder filterable clearable>
                <Option
                  v-for="(item) in adresses"
                  :value="(item||{}).index"
                  :key="(item||{}).index"
                >
                  <span
                    v-if="item.status === 1"
                    :style="{color: formValidate.adress.index === item.index?'white':'#3896f5'}"
                  >（工程库默认）</span>
                  {{item.value}}
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <div>
          <div>
            <p class="div_p">设备清单</p>
          </div>
          <div
            class="dd_but"
            style="display:flex;justify-content:space-between;margin:0 0px 10px 10px;"
          >
            <Button @click="addDeviceClick">添加设备</Button>
          </div>
          <Table
            ref="selection"
            :columns="devices_columns"
            :data="formValidate.devices_list"
            style="margin-left:10px;"
          ></Table>
          <div class="dd_div">
            <section>
              <span class="dd_span">货款总计（元）</span>
              <span>{{totalPrice.toLocaleString()}}</span>
            </section>
            <section>
              <span class="dd_span">大写</span>
              <span>{{upperTotalPrice}}</span>
            </section>
          </div>
        </div>
        <FormItem style="width:300px;margin:200px auto;margin-bottom:20px;">
          <Button type="primary" @click="onSubmit('formValidate')" :loading="subLoading">提交</Button>
          <Button type="ghost" style="margin-left: 18px" @click="onCancel" :disabled="subLoading">取消</Button>
        </FormItem>
      </Form>
    </Layout>
    <!-- 添加设备 -->
    <Modal v-model="addsbmodal" width="800" @on-ok="ok">
      <p style="font-size:18px;">添加设备</p>
      <Input
        placeholder="请输入内容"
        style="width: 200px;float:right;padding-top:15px;margin-right:10px;"
        v-model="inputVal"
        icon="ios-search"
        @on-enter="getAddset"
        @on-click="getAddset"
      />
      <p class="sb_p">
        选择需要备货的
        <span>设备类型</span>添加到
        <span>备货清单中</span>
      </p>
      <Table
        :columns="addsb_columns"
        :data="addsb_data"
        style="margin:0 10px;"
        height="500"
        @on-selection-change="selectDevices"
      ></Table>
      <Page
        :current.sync="pageNum"
        :total="sum"
        :page-size="10"
        show-total
        size="small"
        @on-change="addDevices"
        show-elevator
        style="text-align:center;margin-top:20px;"
      ></Page>
    </Modal>
  </div>
</template>

<script>
import silderInput from "../public-components/silder-input.vue";
export default {
  name: "create",
  components: {
    silderInput
  },
  data() {
    return {
      formValidate: {
        name: "",
        orderType: "",
        customer: {
          index: "",
          value: ""
        },
        store: {
          index: "",
          value: ""
        },
        devices_list: [],
        adress: {
          index: "",
          value: ""
        }
      },
      pageNum: 1,
      sum: 0,
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入申请公司",
            trigger: "blur"
          }
        ],
        level: [
          {
            required: true,
            message: "请选择客户等级"
          }
        ],
        store: [
          {
            required: true,
            message: "请选择客户行业"
            // trigger: "blur"
          }
        ],
        city: [
          {
            required: true,
            message: "请选择城市",
            type: "object"
            // trigger: "blur"
          }
        ],
        orderType: [
          {
            required: true,
            message: "请输入客户简称",
            trigger: "blur"
          }
        ],
        registered_capital: [
          {
            required: true,
            message: "请输入注册资金",
            trigger: "blur"
          }
        ],
        bond_amount: [
          {
            required: true,
            message: "请输入保证金",
            trigger: "blur"
          }
        ]
      },
      devices_columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
          align: "center"
        },
        {
          title: "存货编码",
          key: "productCode",
          align: "center"
        },
        {
          title: "存货名称",
          key: "productName",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.productName !== null) {
              if (params.row.productName.length > 20) {
                texts = params.row.productName.substring(0, 20) + "...";
              } else {
                texts = params.row.productName;
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
                  params.row.productName
                )
              ]
            );
          }
        },
        {
          title: "规格型号",
          key: "spec",
          align: "center"
        },
        {
          title: "主计量",
          key: "unit",
          align: "center"
        },
        {
          title: "发货数量",
          key: "num",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                size: "small",
                value: params.row.num,
                min: 0
              },
              on: {
                "on-change": a => {
                  params.row.num = a;
                  params.row.totalPrice = a * params.row.price;
                  this.$set(this.formValidate.devices_list, params.index, params.row);
                }
              }
            });
          }
        },
        {
          title: "单价",
          key: "price"
        },
        {
          title: "总价",
          key: "totalPrice"
        },
        {
          title: "税率",
          key: "tax"
        },
        {
          title:'操作',
          width: '200',
          key: 'action',
          align: "center",
          render:(h,params) => {
            return h('Poptip',{
                props:{
                  title:'是否确定删除？',
                  confirm:true
                },
                on:{
                  'on-ok':() =>{
                    this.formValidate.devices_list = this.formValidate.devices_list.filter(d =>d.productCode !==params.row.productCode);
                    this.$Message.info('已删除！');
                  }
                }
              },[
                h('Button',{
                  props:{
                    size: 'small'
                  }
                },'删除')
              ]
            )
          }
        }
      ],
      addsb_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "存货编码",
          key: "product_code",
          align: "center"
        },
        {
          title: "存货名称",
          key: "product_name",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.product_name !== null) {
              if (params.row.product_name.length > 20) {
                texts = params.row.product_name.substring(0, 20) + "...";
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
          key: "product_models",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.product_models !== null) {
              if (params.row.product_models.length > 20) {
                texts = params.row.product_models.substring(0, 20) + "...";
              } else {
                texts = params.row.product_models;
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
                  params.row.product_models
                )
              ]
            );
          }
        },
        {
          title: "主计量",
          key: "product_unit",
          align: "center"
        },
        {
          title: "发货数量",
          key: "num",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("InputNumber", {
                props: {
                  size: "small",
                  min: 0,
                  value: params.row.num
                },
                on: {
                  "on-change": a => {
                    this.addStore[params.index] = params.row;
                    this.addStore[params.index].num = a;
                    this.addStore.page = this.pageNum;
                    if(!this.addData[this.pageNum]){
                       this.addData[this.pageNum] = [];
                    }
                    this.addData[this.pageNum].push(params.row);
                  }
                }
              })
            ]);
          }
        }
      ],
      addsb_data: [],
      addData: {},
      addStore: {},
      customs: [],
      cahceData: [],
      addsbmodal: false,
      inputVal: "",
      selData: [],
      subLoading: false
    };
  },
  methods: {
    getCmonpanys() {
      let request = {
        "typeid": 23015,
        "data":[{
            "account_id": this.$store.state.user.accountId
        }]
      };
      if (this.cahceData.length > 0) return;
      this.$http.PostXLASSETS(request).then(response => {
        this.cahceData = JSON.parse(JSON.stringify(response.data.result.data));
        response.data.result.data.forEach(data => {
          this.customs.push({
            index: data.agent_id,
            value: data.agent_name
          });
        });
        this.$set(this.formValidate.customer, "index", this.customs[0].index);
        this.$set(this.formValidate.customer, "value", this.customs[0].value);
      });
    },
    addDeviceClick() {
      this.addsbmodal = true;
      this.addDevices(1);
    },
    getAddset() {
      this.addDevices(1);
    },
    addDevices(p) {
      if (this.addStore.page && this.addData[this.addStore.page]) {
        for (let key in this.addStore) {
          let index = this.addData[this.addStore.page].findIndex(
            d => d.product_code === this.addStore[key].product_code
          );
          if (index >= 0) {
            this.addData[this.addStore.page][index] = this.addStore[key];
          }
        }
      }
      this.addStore = {};
      let request = {
        typeid: 23012,
        data: [
          {
            keyword: this.inputVal === "" ? undefined : this.inputVal,
            page_size: 10,
            page_num: p
          }
        ]
      };
      this.addsb_data = [];
      this.$http.PostXLASSETS(request).then(response => {
        let { data } = response.data.result;
        this.sum = data[0].sum;
        data[0].product_list.forEach(data => {
          let _checked = false;
          let num = 0;
          if (
            this.formValidate.devices_list &&
            this.formValidate.devices_list.length > 0 &&
            this.formValidate.devices_list.find(d => d.productCode === data.product_code)
          ) {
            _checked = true;
            num =this.formValidate.devices_list.find(
              d => d.productCode === data.product_code
            ).num;
          }
          if (
            this.addData[p] &&
            this.addData[p].length > 0 &&
            this.addData[p].find(d => d.product_code === data.product_code)
          ) {
            _checked = true;
            num = this.addData[p].find(
              d => d.product_code === data.product_code
            ).num;
          }
          this.addsb_data.push({
            product_code: data.product_code,
            product_models: data.product_models,
            product_name: data.product_name,
            product_price: data.product_price,
            product_unit: data.product_unit,
            num,
            _checked
          });
        });
      });
    },
    selectDevices(selection) {
      this.addData[this.pageNum] = selection;
      for (let key in this.addStore) {
        this.addStore[key]._checked = true;
        let index = selection.findIndex(
          d => d.product_code === this.addStore[key].product_code
        );
        if (index >= 0) {
          this.addStore[key]._checked = true;
          this.addData[this.pageNum][index] = this.addStore[key];
        }
      }
    },
    ok() {
      for (let key in this.addStore) {
        let index = (this.addData[this.pageNum] || []).findIndex(
          d => d.product_code === this.addStore[key].product_code
        );
        if (index >= 0) {
          this.addData[this.pageNum][index] = this.addStore[key];
        }
      }
      let data = [];
      for (let key in this.addData) {
        data = data.concat(this.addData[key]);
      }
      data.forEach(d => {
        if (
          !this.formValidate.devices_list.find(
            item => item.productCode === d.product_code
          )
        ) {
          this.formValidate.devices_list.push({
            productCode: d.product_code,
            productName: d.product_name,
            spec: d.product_models,
            unit: d.product_unit,
            num: d.num,
            price: d.product_price,
            tax: "6%",
            totalPrice: d.product_price * d.num
          });
        } else {
          let obj = this.formValidate.devices_list.find(
            item => item.productCode === d.product_code
          );
          obj.num = d.num;
          obj.totalPrice = d.product_price * obj.num;
        }
      });
    },
    onSubmit(name) {
      if (this.formValidate.store.index != "") {
        if (this.formValidate.devices_list && this.formValidate.devices_list.length > 0) {
        } else {
          this.$Message.error("无添加设备!");
          return;
        }
      } else {
        this.$Message.error("请填写完整的信息！");
        return;
      }
      let productList = [];
      this.formValidate.devices_list.forEach(data => {
        if (data.num > 0)
          productList.push({
            productCode: data.productCode,
            productName: data.productName,
            productModels: data.spec,
            quantity: data.num,
            price: data.price + "",
            unit: data.unit
          });
      });
      if(productList.length === 0){
        this.$Message.error("设备数量不能为0!");
        return;
      }
      let myDate = new Date();
      let date =
        myDate.getFullYear() +
        "-" +
        (myDate.getMonth() + 1) +
        "-" +
        myDate.getDate() +
        " " +
        myDate.getHours() +
        ":" +
        myDate.getMinutes() +
        ":" +
        myDate.getSeconds();
      let request = {
        typeid: 24006,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            orderTime: date,
            orderAmount: this.totalPrice + "",
            whId: this.formValidate.store.index,
            addressName: this.formValidate.adress.value,
            addressId: this.formValidate.adress.index,
            agentId: this.formValidate.customer.index,
            saleType: 2,
            orderType: 1,
            orderNo: "",
            productList
          }
        ]
      };
      this.subLoading = true;
      this.$http.SETORDER(request).then(
        response => {
          if (response.data.code !== 0) return;
          this.$Message.success("添加成功！");
          this.formValidate = {
            name: "",
            orderType: "",
            customer: {
              index: "",
              value: ""
            },
            store: {
              index: "",
              value: ""
            },
            devices_list: [],
            adress: {
              index: "",
              value: ""
            }
          };
          this.$set(this.formValidate.customer, "index", this.customs[0].index);
          this.$set(this.formValidate.customer, "value", this.customs[0].value);
          this.subLoading = false;
          this.$router.push("/ordermanage/ordermanage");
        },
        error => {
          this.subLoading = false;
          if (error.data.code === 0) {
            this.$Message.success("添加成功！");
            this.formValidate = {
              name: "",
              orderType: "",
              customer: {
                index: "",
                value: ""
              },
              store: {
                index: "",
                value: ""
              },
              devices_list: [],
              adress: {
                index: "",
                value: ""
              }
            };
            this.$set(
              this.formValidate.customer,
              "index",
              this.customs[0].index
            );
            this.$set(
              this.formValidate.customer,
              "value",
              this.customs[0].value
            );
            this.$router.push("/ordermanage/ordermanage");
          } else if (error.data.message) {
            this.$Message.error(error.data.message);
          }
        }
      );
    },
    onCancel() {
      this.formValidate = {
        name: "",
        orderType: "",
        customer: {
          index: "",
          value: ""
        },
        store: {
          index: "",
          value: ""
        },
        devices_list: [],
        adress: {
          index: "",
          value: ""
        }
      };
      this.$set(this.formValidate.customer, "index", this.customs[0].index);
      this.$set(this.formValidate.customer, "value", this.customs[0].value);
      this.$router.push("/ordermanage/ordermanage");
    },
  },
  computed: {
    stores() {
      let stores = [];
      if (
        this.formValidate.customer.index &&
        this.formValidate.customer.index !== ""
      ) {
        let customer =
          this.cahceData.find(
            d => d.agent_id === this.formValidate.customer.index
          ) || {};
        if (customer.warehouseList && customer.warehouseList.length > 0) {
          customer.warehouseList.forEach(w => {
            stores.push({
              index: w.wh_id,
              value: w.wh_name
            });
          });
        }
        this.$set(this.formValidate.store, "index", stores[0].index);
        this.$set(this.formValidate.store, "value", stores[0].value);
      }
      return stores;
    },
    adresses() {
      let adresses = [];
      if (
        this.formValidate.customer.index &&
        this.formValidate.customer.index !== "" &&
        this.formValidate.store.index &&
        this.formValidate.store.index !== "" &&
        this.formValidate.adress
      ) {
        let cusomer =
          this.cahceData.find(
            d => d.agent_id === this.formValidate.customer.index
          ) || {};
        let store =
          cusomer.warehouseList.find(
            w => w.wh_id === this.formValidate.store.index
          ) || {};
        if (store.addressList && store.addressList.length > 0) {
          store.addressList.forEach(a => {
            adresses.push({
              index: a.address_id,
              value: a.address_detail,
              status: a.address_status
            });
          });
        }
        let selectAddress = adresses.find(a => a.status === 1) || adresses[0];
        this.$set(
          this.formValidate.adress,
          "index",
          (selectAddress || {}).index || ""
        );
        this.$set(
          this.formValidate.adress,
          "value",
          (selectAddress || {}).value || ""
        );
      }
      return adresses;
    },
    totalPrice() {
      let price = 0;
      if (
        this.formValidate.devices_list &&
        this.formValidate.devices_list.length > 0
      ) {
        this.formValidate.devices_list.forEach(data => {
          price += data.totalPrice;
        });
      }
      return price;
    },
    upperTotalPrice() {
      return this.$util.NumberToChinese(Number(this.totalPrice));
    }
  },
  mounted() {
    this.getCmonpanys();
    this.addDevices(1);
  },
  watch: {
    addsbmodal(nv) {
      if (!nv) {
        this.addData = {};
        this.pageNum = 1;
      }
    },
    $route() {
      this.addDevices(1);
    }
  }
};
</script>

<style>
@import "../customermanage/customer.css";
.dd_div {
  float: right;
  margin-top: 20px;
}
.dd_div section {
  margin-right: 30px;
  font-weight: bold;
}
.dd_span {
  margin-right: 30px;
  display: inline-block;
  font-weight: initial;
  width: 100px;
  color: #8d8d8d;
  line-height: 25px;
}
.dd_but .ivu-btn {
  border-color: #3896f5;
  color: #3896f5;
  background: #f6faff;
}
.sb_p {
  font-size: 16px;
  margin: 20px 10px 10px 10px;
}
.sb_p span {
  color: #3896f5;
}
</style>
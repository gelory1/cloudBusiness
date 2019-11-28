<template>
  <div class="edit layout">
    <Layout class="layout" style="width:95%;min-height:800px">
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
            <FormItem label="客户名称" prop="customer" :label-width="90">
              <Select v-model="formValidate.customer.index" placeholder>
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
              <Select v-model="formValidate.store.index" placeholder>
                <Option v-for="(item) in stores" :value="item.index" :key="item.index">{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="收货地址" prop="adress" :label-width="90">
              <Select v-model="formValidate.adress.index" placeholder>
                <Option v-for="(item) in adresses" :value="item.index" :key="item.index"><span v-if="item.status === 1" :style="{color: formValidate.adress.index === item.index?'white':'#3896f5'}">（工程库默认）</span> {{item.value}}</Option>
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
            <Input placeholder="请输入内容" style="width: 200px" v-model="inputVal" icon="ios-search" />
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
              <span>{{totalPrice}}</span>
            </section>
            <section>
              <span class="dd_span">大写</span>
              <span>{{upperTotalPrice}}</span>
            </section>
          </div>
        </div>
      </Form>
      <div style="margin-left:10px;">
        <Button type="primary" @click="onSubmit">提交</Button>
        <Button @click="onCancel">取消</Button>
      </div>
    </Layout>
    <!-- 添加设备 -->
    <Modal v-model="addsbmodal" width="800" @on-ok="ok">
      <p style="font-size:18px;">添加设备</p>
      <p class="sb_p">
        选择需要备货的
        <span>设备类型 </span>添加到
        <span>备货清单中</span>
      </p>
      <Table :columns="addsb_columns" :data="addsb_data" style="margin:0 10px;" height="500" @on-selection-change="selectDevices"></Table>
      <Page
       :current.sync="pageNum"
       :total="sum"
       :page-size="10"
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
            index: '',
            value: '' 
        },
        store: {
            index:'',
            value:''
        },
        devices_list: [
        ],
        adress: {
            index:'',
            value: ''
        }
      },
      pageNum:1,
      sum:0,
      ruleValidate: {
        name: [
          {
            required: true,
            message: "请输入客户名称",
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
          align: "center"
        },
        {
          title: "存货编码",
          key: "productCode"
        },
        {
          title: "存货名称",
          key: "productName"
        },
        {
          title: "规格型号",
          key: "spec"
        },
        {
          title: "主计量",
          key: "unit"
        },
        {
          title: "发货数量",
          key: "num",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h(
              "InputNumber",
              {
                props: {
                  size: "small",
                  value: params.row.num
                },
                on: {
                  'on-change': a => {
                        this.formValidate.devices_list[params.index].num = a;
                        this.formValidate.devices_list[params.index].totalPrice = a * params.row.price;
                  }
                }
              },
              1
            );
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
          align: "center"
        },
        {
          title: "规格型号",
          key: "product_models",
          align: "center"
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
              h('InputNumber', {
                props: {
                  size:'small',
                  min: 0,
                  value: params.row.num
                },
                on: {
                    'on-change': a => {
                        this.addsb_data[params.index].num = a;
                        this.addsb_data[params.index]._checked = true;
                        if(!this.addData[this.pageNum]||!this.addData[this.pageNum].find(data => data.product_code === params.row.product_code)){
                            if(!this.addData[this.pageNum]) this.addData[this.pageNum] = [];
                            this.addData[this.pageNum].push(params.row);
                        }else{
                            let index = this.addData[this.pageNum].findIndex(data => data.product_code === params.row.product_code);
                            this.addData[this.pageNum][index].num = a;
                        }
                    }
                }
              })
            ]);
          }
        }
      ],
      addsb_data: [],
      addData: {},
      contactIndex: 0,
      ticketIndex: 0,
      formAddlxr: {
        productCode: "",
        contact_id: "",
        productName: "",
        spec: "",
        unit: "",
        price: "",
        totalPrice: ""
      },
      ruleAddlxr: {
        productCode: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        spec: [
          {
            required: true,
            message: "请输入职位",
            trigger: "blur"
          }
        ],
        unit: [
          {
            required: true,
            message: "请输入电话",
            trigger: "blur"
          }
        ],
        totalPrice: [
          { type: "totalPrice", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        productName: [
          { required: true, message: "请选择性别", trigger: "change" }
        ]
      },
      addlxrmodal: false,
      customs:[],
      cahceData:[],
      addsbmodal: false,
      inputVal:''
    };
  },
  methods: {
    cancel() {
      // this.$Message.info("Clicked cancel");
    },
    saveContact() {
      let request1 = {
        typeid: 25008,
        data: [
          {
            customerNo: ((this.data || {}).data || {}).customer_no,
            contactId: this.formAddlxr.contact_id,
            contactName: this.formAddlxr.productCode,
            productName: this.formAddlxr.productName === "男" ? 0 : 1,
            positionName: this.formAddlxr.spec,
            unit: this.formAddlxr.unit,
            vcharnumber: this.formAddlxr.price,
            eMail: this.formAddlxr.totalPrice
          }
        ]
      };
      let request2 = {
        typeid: 25004,
        data: {
          customerNo: ((this.data || {}).data || {}).customer_no,
          contactList: [
            {
              contactName: this.formAddlxr.productCode,
              productName: this.formAddlxr.productName === "男" ? 0 : 1,
              positionName: this.formAddlxr.spec,
              unit: this.formAddlxr.unit,
              vcharNumber: this.formAddlxr.price,
              eMail: this.formAddlxr.totalPrice
            }
          ]
        }
      };
      if (this.isNewCreate) {
        if (this.contactStatus === "edit") {
          for (let key in this.formValidate.devices_list[this.contactIndex]) {
            this.$set(
              this.formValidate.devices_list[this.contactIndex],
              key,
              this.formAddlxr[key]
            );
          }
          this.newLocalData.contact.data.contactList[
            this.contactIndex
          ] = JSON.parse(JSON.stringify(request2.data.contactList[0]));
        } else {
          this.formValidate.devices_list.push(this.formAddlxr);
          if (!this.newLocalData.contact) {
            this.newLocalData.contact = request2;
          } else {
            this.newLocalData.contact.data.contactList.push(
              request2.data.contactList[0]
            );
          }
        }
        return;
      }
      if (this.contactStatus === "edit") {
        api.UPDATECUSTOMER(request1).then(response => {
          if (response.data.code === 0) {
            let index = this.formValidate.devices_list.findIndex(
              data => data.contact_id === this.formAddlxr.contact_id
            );
            for (let key in this.formValidate.devices_list[index]) {
              this.$set(
                this.formValidate.devices_list[index],
                key,
                this.formAddlxr[key]
              );
            }
            this.addlxrmodal = false;
          }
        });
      } else {
        api.SETCUSTOMER(request2).then(response => {
          if (response.data.code === 0) {
            this.formValidate.devices_list.push(this.formAddlxr);
            this.addlxrmodal = false;
          }
        });
      }
    },
    getCmonpanys(){
        let request = {
            "typeid":23015,
            "data":[{
                "account_id": 520//this.$store.state.user.accountId
            }]
        }
        if(this.cahceData.length>0) return;
        this.$http.PostXLASSETS(request).then(response => {
            this.cahceData = JSON.parse(JSON.stringify(response.data.result.data));
            response.data.result.data.forEach(data => {
                this.customs.push({
                    index:data.agent_id,
                    value:data.agent_name
                })
            })
            this.$set(this.formValidate.customer,'index',this.customs[0].index);
            this.$set(this.formValidate.customer,'value',this.customs[0].value);
        })
    },
    addDeviceClick(){
        this.addsbmodal = true;
        this.addDevices(1);
    },
    addDevices(p){
        let request = {
            "typeid":23012,
            "data":[{
                "keyword": this.inputVal === ''?undefined:this.inputVal,
                "page_size": 10,
                "page_num": p
            }]
        }
        this.addsb_data = [];
        this.$http.PostXLASSETS(request).then(response => {
            let { data } = response.data.result;
            this.sum = data[0].sum;
            data[0].product_list.forEach(data => {
                let _checked = false;
                let num = 0;
                if(this.addData[p]&&this.addData[p].length>0&&this.addData[p].find(d => d.product_code === data.product_code)){
                    _checked = true;
                    num = (this.addData[p].find(d => d.product_code === data.product_code)).num;
                }
                this.addsb_data.push({
                    product_code:data.product_code,
                    product_models:data.product_models,
                    product_name:data.product_name,
                    product_price:data.product_price,
                    product_unit:data.product_unit,
                    num,
                    _checked
                })
            })
        })
    },
    selectDevices(selection){
        this.addData[this.pageNum] = selection;
    },
    ok(){
        let data = [];
        for(let key in this.addData){
            data = data.concat(this.addData[key]);
        }
        data.forEach(d => {
            this.formValidate.devices_list.push({
                productCode:d.product_code,
                productName:d.product_name,
                spec:d.product_models,
                unit:d.product_unit,
                num:d.num,
                price:d.product_price,
                tax: '17%',
                totalPrice: d.product_price * d.num,
            })
        })
    },
    onSubmit(){
        let productList = [];
        this.formValidate.devices_list.forEach(data => {
            productList.push({
                productCode: data.productCode,
                quantity: data.num,
                price: data.price,
                unit: data.unit,
            })
        })
        let request = {
            "typeid": 24004,
            "data": [
                {
                    "account_id": this.$store.state.user.accountId,
                    "orderTime": new Date(),
                    "agent_id": this.formValidate.customer.index,
                    productList
                }
            ]
        }
        this.$http.SETORDER(request).then(response =>{
            console.log(response);
        })
    },
    onCancel(){
        this.formValidate = {
            name: "",
            orderType: "",
            customer: {
                index: '',
                value: '' 
            },
            store: {
                index:'',
                value:''
            },
            devices_list: [
            ],
            adress: {
                index:'',
                value: ''
            }
        },
        this.$set(this.formValidate.customer,'index',this.customs[0].index);
        this.$set(this.formValidate.customer,'value',this.customs[0].value);
        this.$router.push('/ordermanage/ordermanage');
    }
  },
  computed: {
        stores(){
            let stores = [];
            if(this.formValidate.customer.index&&this.formValidate.customer.index !== ''){
                let customer = this.cahceData.find(d => d.agent_id === this.formValidate.customer.index)||{};
                if(customer.warehouseList&&customer.warehouseList.length>0){
                    customer.warehouseList.forEach(w => {
                        stores.push({
                            index: w.wh_id,
                            value: w.wh_name
                        })
                    })
                }
                this.$set(this.formValidate.store,'index',stores[0].index);
                this.$set(this.formValidate.store,'value',stores[0].value);
            }
            return stores;
        },
        adresses(){
            let adresses = [];
            if(this.formValidate.customer.index&&this.formValidate.customer.index !== ''&&this.formValidate.store.index&&this.formValidate.store.index !== ''){
                let cusomer = this.cahceData.find(d => d.agent_id === this.formValidate.customer.index)||{};
                let store = cusomer.warehouseList.find(w => w.wh_id === this.formValidate.store.index) || {};
                if(store.addressList&&store.addressList.length>0){
                    store.addressList.forEach(a => {
                        adresses.push({
                            index: a.address_id,
                            value: a.address_detail,
                            status: a.address_status,
                        })
                    })
                }
                let selectAddress = adresses.find(a => a.status === 1);
                this.$set(this.formValidate.adress,'index',selectAddress.index);
                this.$set(this.formValidate.adress,'value',selectAddress.value);
            }
            return adresses;
        },
        totalPrice(){
            let price = 0;
            if(this.formValidate.devices_list&&this.formValidate.devices_list.length>0){
                this.formValidate.devices_list.forEach(data => {
                    price += data.totalPrice;
                })
            }
            return price;
        },
        upperTotalPrice(){
            return this.$util.NumberToChinese(Number(this.totalPrice));
        }
  },
  mounted() {
        this.getCmonpanys();
        this.addDevices(1);
  },
  watch: {
      addsbmodal(nv){
          if(!nv){
              this.addData = {};
          }
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
.sb_p{
  font-size:16px;
  margin:20px 10px 10px 10px;
}
.sb_p span{
  color:#3896f5
}
</style>
<template>
  <div class="edit">
    <Layout class="layout">
      <p class="div_p">订单信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="8">
            <FormItem label="申请人" prop="name" :label-width="90">
              <Input class v-model="formValidate.name" placeholder="" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="业务类型" prop="orderType" class="con-right">
              <Input class="col-m" v-model="formValidate.orderType" placeholder="" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="销售类型" prop="orderType" class="con-right">
              <Input class="col-m" v-model="formValidate.saleType" placeholder="" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="客户名称" prop="customer" :label-width="90">
              <Select v-model="formValidate.customer.index" placeholder="">
                <Option v-for="(item,index) in customs" :value="item.index" :key="index">{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <FormItem label="仓库" prop="store" :label-width="90">
              <Select v-model="formValidate.store.index" placeholder="">
                <Option  v-for="(item,index) in stores" :value="item.index" :key="index">{{item.val}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="16">
            <FormItem label="收货地址" prop="adress" :label-width="90">
              <Select v-model="formValidate.adress.id" placeholder="">
                <Option v-for="(item,index) in adresses" :value="item.id" :key="index">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <div>
          <div>
            <p class="div_p">设备清单</p>
          </div>
          <div style="display:flex;justify-content:space-between;margin:10px">
              <Button>添加设备</Button>
              <Input placeholder="请输入内容" style="width: 300px" icon="ios-search"/>
          </div>
          <Table ref="selection" :columns="devices_columns" :data="formValidate.devices_list"></Table>
          <div style="margin:10px">
              <div>货款总计（元）</div>
              <div>大写</div>
          </div>
        </div>
      </Form>
      <div>
            <Button type="primary">提交</Button>
            <Button>取消</Button>
      </div>
    </Layout>
    <Modal v-model="addlxrmodal" @on-ok="saveContact()" @on-cancel="cancel">
      <p style="margin:10px  0 20px 0;font-size:16px">添加联系人</p>
      <Form ref="formAddlxr" :model="formAddlxr" :rules="ruleAddlxr" :label-width="120">
        <FormItem label="姓名" prop="productCode">
          <Input class="col-n" v-model="formAddlxr.productCode" placeholder="" />
        </FormItem>
        <FormItem label="性别" prop="productName">
          <RadioGroup v-model="formAddlxr.productName">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="职位名称" prop="spec">
          <Input class="col-n" v-model="formAddlxr.spec" placeholder="" />
        </FormItem>
        <FormItem label="电话" prop="unit">
          <Input class="col-n" v-model="formAddlxr.unit" placeholder="" />
        </FormItem>
        <FormItem label="微信" prop="price">
          <Input class="col-n" v-model="formAddlxr.price" placeholder="" />
        </FormItem>
        <FormItem label="邮箱" prop="totalPrice">
          <Input class="col-n" v-model="formAddlxr.totalPrice" placeholder="" />
        </FormItem>

        <!-- <FormItem>
          <Button type="primary" @click="saveContact()">确认并添加</Button>
          <Button type="info" style="margin-left: 8px">保存并继续添加</Button>
          <Button type="ghost" style="margin-left: 8px">取消</Button>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>

<script>
const customs = [
  {
    value:'客户',
    index:1
  },
  {
    value:'合作伙伴',
    index:2
  },
  {
    value:'其他',
    index:3
  },
];
const stores = [
  {
    val: '公共事业及管理组织',
    index:1
  },
  {
    val: '工业',
    index:2
  },
  {
    val: '商业住宿餐饮',
    index:3
  },
  {
    val: '金融房地产及居民服务',
    index:4
  },
  {
    val: '运输仓储邮政',
    index:5
  },
  {
    val: '信息计算机和软件',
    index:6
  },
  {
    val: '农林牧渔水利',
    index:7
  },
  {
    val: '建筑业',
    index:8
  },
  {
    val: '军工保密',
    index:9
  },
  {
    val: '其他',
    index:10
  },
];

export default {
  name: "create",
  data() {
    return {
      formValidate: {
        name: "",
        orderType: "",
        customer: customs[0],
        store: stores[0],
        devices_list: [
            {
                num:1
            }
        ],
        adress: '',
      },
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
            message: "请选择客户等级",
          }
        ],
        store: [
          {
            required: true,
            message: "请选择客户行业",
            // trigger: "blur"
          }
        ],
        city: [
          {
            required: true,
            message: "请选择城市",
            type:'object'
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
          title: '发货数量',
          key: 'num',
          width: 150,
          align: 'center',
          render: (h, params) => {
                return h('el-input-number', {
                        props: {
                            size: 'small'
                        },
                        on: {
                            change: () => {
                                
                            }
                        },
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
        },
      ],
      contactIndex:0,
      ticketIndex:0,
      formAddlxr: {
        productCode: "",
        contact_id: "",
        productName: "",
        spec:"",
        unit:"",
        price:"",
        totalPrice: ''
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
        ],
      },
      addlxrmodal: false,
      customs,
      stores,
      adresses:[]
    };
  },
  methods: {
    cancel() {
      // this.$Message.info("Clicked cancel");
    },
    saveContact(){
      let request1 = {
        "typeid": 25008,
        "data": [
          {
            "customerNo": ((this.data||{}).data||{}).customer_no,
            "contactId": this.formAddlxr.contact_id,
            "contactName": this.formAddlxr.productCode,
            "productName": this.formAddlxr.productName === '男'?0:1,
            "positionName": this.formAddlxr.spec,
            "unit": this.formAddlxr.unit,
            "vcharnumber": this.formAddlxr.price,
            "eMail": this.formAddlxr.totalPrice
          }
        ]
      };
      let request2 = {
        "typeid": 25004,
        "data": {
          "customerNo": ((this.data||{}).data||{}).customer_no,
          contactList: [
            {
              "contactName": this.formAddlxr.productCode,
              "productName": this.formAddlxr.productName === '男'?0:1,
              "positionName": this.formAddlxr.spec,
              "unit": this.formAddlxr.unit,
              "vcharNumber": this.formAddlxr.price,
              "eMail": this.formAddlxr.totalPrice
            }
          ]
        }
      };
      if(this.isNewCreate){
        if(this.contactStatus === 'edit'){
          for(let key in this.formValidate.devices_list[this.contactIndex]){
            this.$set(this.formValidate.devices_list[this.contactIndex],key,this.formAddlxr[key]);
          }
          this.newLocalData.contact.data.contactList[this.contactIndex] = JSON.parse(JSON.stringify(request2.data.contactList[0]));
        }else{
          this.formValidate.devices_list.push(this.formAddlxr);
          if(!this.newLocalData.contact){
            this.newLocalData.contact = request2;
          }else{
            this.newLocalData.contact.data.contactList.push(
              request2.data.contactList[0]
            )
          }
        }
        return;
      }
      if(this.contactStatus === 'edit'){
        api.UPDATECUSTOMER(request1).then(response => {
          if(response.data.code === 0){
            let index = this.formValidate.devices_list.findIndex(data => data.contact_id === this.formAddlxr.contact_id);
            for(let key in this.formValidate.devices_list[index]){
              this.$set(this.formValidate.devices_list[index],key,this.formAddlxr[key]);
            }
            this.addlxrmodal = false;
          }
        })
      }else{
        api.SETCUSTOMER(request2).then(response => {
          if(response.data.code === 0){
            this.formValidate.devices_list.push(this.formAddlxr);
            this.addlxrmodal = false;
          }
        })
      }
    },
  },
  mounted(){

  },
  computed:{
    isCustom(){
      return this.formValidate.customer.index === 1;
    },
    isFriend(){
      return this.formValidate.customer.index === 2;
    },
  },
  watch: {
    
  }
};
</script>

<style>
</style>
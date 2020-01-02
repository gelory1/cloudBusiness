<template>
  <div class="edit">
    <Layout class="layout" style="min-height:850px">
      <p class="div_p">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <div style="width:90%">
          <Row>
            <Col span="12">
              <FormItem label="客户名称" prop="name" :label-width="90">
                <Input v-model="formValidate.name" placeholder />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="客户简称" prop="customer_abbreviation" class="con-right">
                <Input
                  style="width:350px;"
                  v-model="formValidate.customer_abbreviation"
                  placeholder
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="6" style="position:relative">
              <span style="color:red;position:absolute;left:20px;top:8px;">*</span>
              <FormItem label="客户性质" prop="nature" :label-width="90">
                <Select v-model="formValidate.nature" placeholder clearable filterable>
                  <Option
                    v-for="(item,index) in natures"
                    :value="item.index"
                    :key="index"
                  >{{item.value}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="客户等级" prop="level">
                <Select v-model="formValidate.level" placeholder clearable filterable>
                  <Option
                    v-for="(item,index) in levels"
                    :value="item.index"
                    :key="index"
                  >{{item.val}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="省份/城市" prop="city" class="con-right">
                <el-cascader clearable v-model="formValidate.city" :options="regions" filterable show-all-levels :props="{ value: 'id', label: 'name'}" size="small" style="width:350px;" ></el-cascader>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="行业" prop="industry" :label-width="90">
                <!-- <Input v-model="formValidate.hy" placeholder="Enter your name"></Input> -->
                <Select v-model="formValidate.industry" clearable filterable placeholder>
                  <Option
                    v-for="(item,index) in industrys"
                    :value="item.index"
                    :key="index"
                  >{{item.val}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12" v-if="isFriend">
              <FormItem label="注册资金" prop="registered_capital" class="con-right">
                <Input style="width:313px" v-model="formValidate.registered_capital" placeholder />人民币
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="法定代表人" prop="charge_person" :label-width="90">
                <Input v-model="formValidate.charge_person" placeholder />
              </FormItem>
            </Col>

            <Col span="12" v-if="isFriend">
              <FormItem label="保证金" prop="bond_amount" class="con-right">
                <Input style="width:313px" v-model="formValidate.bond_amount" placeholder />人民币
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="通信地址" prop="mail_address" :label-width="90">
                <Input v-model="formValidate.mail_address" placeholder />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="邮政编码" prop="post_code" class="con-right">
                <Input style="width:350px" v-model="formValidate.post_code" placeholder />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12" v-if="isFriend">
              <FormItem label="协议编号" prop="protocolNumber" :label-width="90">
                <Input v-model="formValidate.protocolNumber" placeholde />
              </FormItem>
            </Col>
            <Col span="12" v-if="isFriend">
              <FormItem label="授权资质" prop="empower_city" class="con-right">
                <el-cascader clearable v-model="formValidate.empower_city" :options="regions" filterable show-all-levels :props="{ value: 'id', label: 'name',multiple: true}" size="small" style="width:350px;"></el-cascader>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="销售负责人" prop="salesman" :label-width="90">
                 <Cascader ref="cascader" v-model="formValidate.salesman" :data="salesList" @on-change="changeCompony" filterable :load-data="getSales" style="width:350px;"></Cascader>
                <!-- <el-cascader clearable v-model="formValidate.salesman" :options="salesList" filterable @expand-change="changeCompony" :props="{ value: 'id', label: 'name'}" size="small" style="width:350px;"></el-cascader> -->
              </FormItem>
            </Col>
            <Col span="12" v-if="isFriend">
            <FormItem label="授权期限" class="con-right"  style="position:relative;">
              <span style="color:red;position:absolute;left:-70px;top:2px;">*</span>
                <Row>
                  <Col span="11">
                  
                  <FormItem prop="sqstartTime">
                    <DatePicker
                      placement="bottom"
                      type="date"
                      :options="startOption1"
                      v-model="formValidate.sqstartTime"
                      format="yyyy-MM-dd"
                    ></DatePicker>
                  </FormItem>  
                  </Col>
                  <Col span="2" style="text-align: center">-</Col>
                  <Col span="11">
                  <FormItem prop="sqendTime" class="con-right">
                    <DatePicker
                      placement="bottom"
                      type="date"
                      :options="endOption1"
                      v-model="formValidate.sqendTime"
                      style="width:155px"
                      format="yyyy-MM-dd"
                    ></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <div class="select2" v-if="file.name !== ''">
                <section style="width:90%;float:left;margin-bottom:10px">
                  <p class="sele2">合作协议（附件）</p>
                  <div>
                    <div class="fj1">
                      <section class="fj_img">
                        <img :src="file.img" alt style="width:20px;height:20px;margin:20px 40px" />
                      </section>
                      <section class="fj_sec1" style="margin:10px 0">
                        <p>{{file.name}}</p>
                        <p class="fj_p1">
                          <span>{{file.size}}</span> 来自
                          <span>{{file.uploadMan}}</span> |
                          <span>{{file.date}}</span>
                        </p>
                      </section>
                        <Button style="margin-left:10px" @click="deleteFile">删除</Button>
                    </div>
                  </div>
                </section>
              </div>
              <p style="font-size:12px;color:#495060;margin-left:-10px;float:left;" v-if="!uploadLoading&&file.name === ''&&isFriend">合作协议（附件）</p>
              <Upload ref="upload" action="/public/api/xlcontract/uploadFile" :on-success="uploadSuccess" :show-upload-list="false" :before-upload="beforeUpload" :data="postData" :headers="{user:'x',key:'x'}">
                <Button type="text" icon="plus" style="color:#4a9af5;margin:-7px 0 0 -10px;;" v-show="!uploadLoading&&file.name === ''&&isFriend">添加附件</Button>
              </Upload>
              <!-- <p v-if="uploadLoading">上传中...</p> -->
            </Col>
          </Row>
        </div>
        <Row v-if="isCustom">
          <Col class="changeinput">
            <FormItem label="关联平台账户" prop="glzh" :label-width="90" style="color: #409eff;">
              <Tag
                closable
                color="blue"
                v-show="formValidate.platformuser_list.length>0"
                v-for="(item,index) in formValidate.platformuser_list"
                :key="index"
                @on-close="deletePlatForm(index)"
              >({{item.platform_id}}){{item.platform_name}}</Tag>
              <P
                v-show="formValidate.platformuser_list.length===0"
                style="color:#495060;display:inline"
              >暂未关联账户平台</P>
              <Button type="ghost" class="butt" @click="platFormShow()">+</Button>
            </FormItem>
          </Col>
        </Row>
        <!-- middle-->
        <div>
          <div>
            <p class="div_p">联系人</p>
            <Button type="primary" @click="newContact()">+ 添加联系人</Button>
          </div>
          <Table ref="selection" :columns="addlxr_columns" :data="formValidate.contacts_list"></Table>
        </div>
        <!-- footer-->
        <footer>
          <p class="div_p">开票信息</p>
          <Button type="primary" @click="newTicket()">+ 添加开票信息</Button>
          <div class="kpxx" v-for="(item,index) in formValidate.ticket_list" :key="index">
            <div class="kpxx_head">
              <Checkbox class="con-left check" v-model="checkbox"></Checkbox>
              <p class="con-left">{{item.ticket_customer}}</p>
              <p>{{item.dutyparagraph}}</p>
              <div style="float:right;margin-right:11px">
                <Button type="primary" size="small" @click="editTicket(index)">编辑</Button>
                <Button type="error" size="small" @click="deleteTicket(index)">删除</Button>
              </div>
            </div>
            <div class="kpxx_con">
              <div class="kpxx_sec">
                <section>
                  <p>客户名称：</p>
                  <p>{{item.ticket_unit}}</p>
                </section>
                <section>
                  <p>税号：</p>
                  <p>{{item.dutyparagraph}}</p>
                </section>
                <section>
                  <p>电话：</p>
                  <p>{{item.phone}}</p>
                </section>
              </div>
              <div class="kpxx_sec">
                <section style="clear:both">
                  <p>开户银行：</p>
                  <p>{{item.bank_name}}</p>
                </section>
                <section>
                  <p>银行账户：</p>
                  <p>{{item.bank_account}}</p>
                </section>
                <section>
                  <p>开票地址：</p>
                  <p>{{item.ticket_address}}</p>
                </section>
              </div>
              <div class="kpxx_sec">
                <section>
                  <p>邮寄信息：</p>
                  <p>{{item.post_info}}</p>
                  <p>
                    <span class="kpxx_span">{{item.ticket_contacts}}</span>
                  </p>
                </section>
              </div>
              <div style="clear:both"></div>
            </div>
          </div>
        </footer>
        <FormItem class="form_but">
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button type="ghost" @click="gohandleCancel('formValidate')" style="margin-left: 20px">取消</Button>
        </FormItem>
      </Form>
    </Layout>
    <!-- 添加联系人 -->
    <Modal v-model="addlxrmodal" class="aa">
      <p style="margin:10px  0 20px 0;font-size:16px">添加联系人</p>
      <Form ref="formAddlxr" :model="formAddlxr" :rules="ruleAddlxr" :label-width="120">
        <FormItem label="姓名" prop="contact_name">
          <Input class="col-n" v-model="formAddlxr.contact_name" placeholder />
        </FormItem>
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="formAddlxr.sex">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="职位名称" prop="position_name">
          <Input class="col-n" v-model="formAddlxr.position_name" placeholder />
        </FormItem>
        <FormItem label="电话" prop="phone">
          <Input class="col-n" v-model="formAddlxr.phone" placeholder />
        </FormItem>
        <FormItem label="微信" prop="vchar_number">
          <Input class="col-n" v-model="formAddlxr.vchar_number" placeholder />
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input class="col-n" v-model="formAddlxr.email" placeholder />
        </FormItem>

        <FormItem class="for">
          <Button type="primary" @click="saveContact('formAddlxr')">确认</Button>
          <Button type="ghost" style="margin-left:15px" @click="cancel">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <!-- 添加开票信息 -->
    <Modal v-model="addkpxxmodal" width="800" @on-ok="saveTicket()" @on-cancel="handleCancel()" class="aa">
      <p style="margin:10px  0 20px 0;font-size:16px">添加开票信息</p>
      <Form
        ref="formAddkpxx"
        :model="formAddkpxx"
        :rules="ruleAddkpxx"
        :label-width="110"
        style="margin-right:40px"
      >
        <Row>
          <Col span="12">
            <FormItem label="客户名称" prop="ticket_unit">
              <Input v-model="formAddkpxx.ticket_unit" placeholder />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="税号" prop="dutyparagraph">
              <Input v-model="formAddkpxx.dutyparagraph" placeholder />
            </FormItem>
          </Col>
        </Row>
        <hr style="width:105%;border:1px dashed #e4e7ed;margin-bottom:25px;">
        <p style="color:#8d8d8d;margin:-10px 0 10px 40px"><Icon type="information-circled"></Icon><span> 专用发票必须填写以下信息才为有效凭证</span></p>
        <Row>
          <Col span="12">
            <FormItem label="开票地址" prop="ticket_address">
              <Input v-model="formAddkpxx.ticket_address" placeholder />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="电话" prop="phone">
              <Input v-model="formAddkpxx.phone" placeholder @on-keyup="inputChange" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开户行" prop="bank_name">
              <Input v-model="formAddkpxx.bank_name" placeholder />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="银行账号" prop="bank_account">
              <Input v-model="formAddkpxx.bank_account" placeholder @on-keyup="inputChange" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="邮寄地址" prop="post_info">
              <Input v-model="formAddkpxx.post_info" placeholder />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="联系人及电话" prop="ticket_contacts">
              <Input v-model="formAddkpxx.ticket_contacts" placeholder />
            </FormItem>
          </Col>
        </Row>
        <FormItem style="margin:40px 0">
          <Button type="primary" @click="saveTicket('formAddkpxx')">确认并添加</Button>
          <Button @click="handleCancel('formAddkpxx')" style="margin-left: 8px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="addPlatShow" @on-ok="savePlat()">
      <p style="margin:10px  0 20px 0;font-size:16px">添加账户平台信息</p>
      <Form :model="plat" :label-width="120">
        <Row>
          <Col span="20">
            <FormItem label="账户平台选项">
              <Select v-model="plat.platform_id" clearable filterable placeholder>
                <Option
                  v-for="(item,index) in plat.list"
                  :value="item.platform_id"
                  :key="index"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="账户：">
              <Input v-model="plat.platform_id" placeholder />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="名称：">
              <Input v-model="plat.platform_name" placeholder />
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import api from "@/api/axios";
let $ = require("jquery");

export default {
  name: "edit",
  data() {
    // 校验邮政编码
    const validatePost = (rule, value, callback) => {
      if (this.formValidate.post_code !== "") {
        var expression = /^[0-9]{6}$/;
        if (expression.test(value) == false) {
          callback(new Error("邮政编码为6为数字"));
        }
      }
      callback();
    };
    // 校验电话号码
    const validatePhone = (rule, value, callback) => {
      if (this.formAddlxr.phone !== "" || this.formAddkpxx.phone) {
        var mPhone = /^1(3|4|5|7|8)\d{9}$/;
        var phone = /^(0[0-9]{2,3}(\-)?)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
        // var zj = /^(\d{3,4}-)\d{7,8}/;
        if (mPhone.test(value) == false && phone.test(value) === false) {
          callback(new Error("请输入正确的电话号码"));
        }
      } else {
        callback(new Error("请输入电话号码"));
      }
      callback();
    };
    //税号正则
    const dutyparagraph = (rule, value, callback) => {
      if (
        this.formAddkpxx.dutyparagraph !== "" ||
        this.formAddkpxx.bank_account !== ""
      ) {
        var expression = /^[A-Z0-9]{15}$|^[A-Z0-9]{17}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;
        if (expression.test(value) == false) {
          callback(new Error("请出入正确的税号！"));
        }
      } else {
        callback(new Error("该字段不能为空"));
      }
      callback();
    };
    return {
      options1:[],
      options2:[],
      formValidate: {
        name: "",
        customer_abbreviation: "",
        nature: '',
        level:"",
        industry: '',
        registered_capital: 0,
        charge_person: "",
        bond_amount: "",
        mail_address: "",
        post_code: "",
        salesman: '',
        platformuser_list: [],
        contacts_list: [],
        ticket_list: [],
        city: '',
        empower_city: [],
        protocolNumber: "",
        sqstartTime: "",
        sqendTime:"",
        company:""
      },
      startOption1: {
        disabledDate: time => {
          if (this.formValidate.sqendTime) {
            return (
              time.getTime() > new Date(this.formValidate.sqendTime).getTime()
            );
          }
        }
      },
      endOption1: {
        disabledDate: time => {
          if (this.formValidate.sqstartTime) {
            return (
              time.getTime() < new Date(this.formValidate.sqstartTime).getTime()
            );
          }
        }
      },
      ruleValidate: {
        sqstartTime: [
          { required: true, type: 'date', message: '请选择授权期限', trigger: 'change' }
        ],
        sqendTime: [
          { required: true, type: 'date', message: '请选择授权期限', trigger: 'change' }
        ],
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
            type: "number",
            trigger: "change"
          }
        ],
        nature: [
          {
            required: true,
            message: "请选择客户性质",
            type: "number",
            trigger: "change"
          }
        ],
        city: [
          {
            required: true,
            message: "请选择城市",
            type: "array",
            trigger: "change"
          }
        ],
        salesman: [
          {
            required: true,
            message: "请选择销售负责人",
            type: "array",
            trigger: "change"
          }
        ],
        empower_city: [
          {
            required: true,
            message: "请选择城市",
            type: "array",
            trigger: "change"
          }
        ],
        customer_abbreviation: [
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
        ],
        post_code: [
          {
            // message: "邮政编码为6位数字",
            trigger: "blur",
            validator: validatePost
          }
        ],
        protocolNumber: [
          {
            required: true,
            message: "请输入协议编号",
            trigger: "blur"
          }
        ]
      },
      addlxr_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "姓名",
          key: "contact_name"
        },
        {
          title: "性别",
          key: "sex"
        },
        {
          title: "职位名称",
          key: "position_name"
        },
        {
          title: "电话",
          key: "phone"
        },
        {
          title: "微信",
          key: "vchar_number"
        },
        {
          title: "邮箱",
          key: "email"
        },
        {
          title: "编辑",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.formAddlxr = {
                        contact_name: params.row.contact_name,
                        contact_id: params.row.contact_id,
                        sex: params.row.sex,
                        position_name: params.row.position_name,
                        phone: params.row.phone,
                        vchar_number: params.row.vchar_number,
                        email: params.row.email
                      };
                      this.contactIndex = params.index;
                      this.addlxrmodal = true;
                      this.contactStatus = "edit";
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.deleteContract(params.index);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      contactIndex: 0,
      ticketIndex: 0,
      kpxx: {
      },
      formAddlxr: {
        contact_name: "",
        contact_id: "",
        sex: "",
        position_name: "",
        phone: "",
        vchar_number: "",
        email: ""
      },
      ruleAddlxr: {
        contact_name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        position_name: [
          {
            required: true,
            message: "请输入职位",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            // message: "请输入电话",
            trigger: "blur",
            validator: validatePhone
          }
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }]
      },
      formAddkpxx: {
        ticket_customer: "",
        ticket_unit: "",
        dutyparagraph: "",
        ticket_address: "",
        phone: "",
        bank_name: "",
        bank_account: "",
        post_info: "",
        ticket_contacts: "",
        ticket_id: ""
      },
      ruleAddkpxx: {
        ticket_unit: [
          {
            required: true,
            message: "请输入客户名称",
            trigger: "blur"
          }
        ],
        dutyparagraph: [
          {
            required: true,
            message: "请输入正确的税号(15 17 18 20位字母或数字)",
            trigger: "blur",
            validator: dutyparagraph
          }
        ]
      },
      khdjj: [],
      cityj: [],
      townj: [],
      hyj: [],
      sqzzj: [],
      xsfzrj: [],
      checkbox: "",
      addlxrmodal: false,
      addkpxxmodal: false,
      levels: this.$option.customer.levels,
      industrys: this.$option.customer.industrys,
      addPlatShow: false,
      plat: {
        platform_id: "",
        platform_name: "",
        platform_user_type: 1,
        list: [
          {
            platform_name: "default",
            platform_id: "default",
            platform_user_type: 1,
            value: "default"
          }
        ]
      },
      ticketStatus: "new",
      contactStatus: "new",
      customer_id: "",
      dd:"",
      ddArea:"",
      sqCascader:"",
      sqArea:"",
      newLocalData: {},
      provinces_county: [],
      salesList: [],
      manageCompany:'',
      uploadLoading:false,
      file:{
        name:'',
        size:'',
        date:'',
        uploadMan:'',
        address:'',
        id:'',
        img:''
      },
      postData:{
        accountId:'',
        customerNo:''
      },
      deleteStatus: false,
      uploadStatus: false
    };
  },
  methods: {
    changeCompony(value){
      // this.formValidate.salesman = [];
    },
    inputChange() {
      this.formAddkpxx.bank_account = this.formAddkpxx.bank_account.replace(
        /[^\d]/g,
        ""
      );
      this.formAddkpxx.phone = this.formAddkpxx.phone.replace(/[^\d]/g, "");
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            this.formValidate.level == "" ||
            this.formValidate.city.length < 1 ||
            (this.formValidate.nature === 2&&(this.formValidate.empower_city||[]).length < 1) ||
            this.formValidate.nature == ""
          ) {
            this.$Message.error("请将信息补充完整后再提交");
          } else {
            this.editCustomer();
          }
        } else {
          this.$Message.error("请将信息补充完整后再提交");
        }
      });
    },
    gohandleCancel() {
      this.$router.go(-1);
    },
    editCustomer() {
      let startTime = '',endTime = '';
      if(this.formValidate.sqstartTime){
        startTime = this.formValidate.sqstartTime.getFullYear()+'-' + (this.formValidate.sqstartTime.getMonth() + 1) +'-' + this.formValidate.sqstartTime.getDate();
      }
      if(this.formValidate.sqendTime){
        endTime = this.formValidate.sqendTime.getFullYear()+'-' + (this.formValidate.sqendTime.getMonth() + 1) +'-' + this.formValidate.sqendTime.getDate();
      }
      let empowerList = [];
      this.formValidate.empower_city.forEach((e,index) => {
        if(typeof(e) === 'object'){
          empowerList.push({
            empowerProvince:e[0],
            empowerCity:e[1],
            empowerArea:e[2]
          })
        }else{
          if(empowerList.length === 0){
            empowerList.push({
              empowerProvince:-1,
              empowerCity:-1,
              empowerArea:-1
            })
          }
          if(index === 1){
            empowerList[0].empowerPrivince = e;
          }else if(index === 2){
            empowerList[0].empowerCity = e;
          }else if(index === 3){
            empowerList[0].empowerArea = e;
          }
        }
      })
      let request = {
        typeid: this.isNewCreate ? 25002 : 25006,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            customerNo: this.isNewCreate
              ? undefined
              : ((this.data || {}).data || {}).customer_no,
            customerName: this.formValidate.name,
            customerLevel: this.formValidate.level,
            customerNature: this.formValidate.nature,
            province: this.formValidate.city[0],
            city: this.formValidate.city[1]?this.formValidate.city[1]:0,
            area: this.formValidate.city[2]?this.formValidate.city[2]:0,
            empowerList:empowerList.length === 0?undefined:empowerList,
            manageCompany: Number(this.formValidate.salesman[0]),
            saleNo: Number(this.formValidate.salesman[1]?this.formValidate.salesman[1]:-1),
            industry: this.formValidate.industry === ''?0:this.formValidate.industry,
            mailAddress: this.formValidate.mail_address,
            bondAmount: Number(this.formValidate.bond_amount),
            registeredCapital: Number(this.formValidate.registered_capital),
            customerAbbreviation: this.formValidate.customer_abbreviation,
            chargePerson: this.formValidate.charge_person,
            postCode: this.formValidate.post_code,
            protocolNumber: this.formValidate.protocolNumber,
            empowerProvince:0,
            empowerCity:0,
            empowerStartTime: startTime===''?undefined:startTime,
            empowerEndTime: endTime===''?undefined:endTime,
          }
        ]
      };
      if (this.isNewCreate) {
        api.SETCUSTOMER(request).then(response => {
            this.customer_id = response.data.result.data.customerNo;
            this.ticketStatus = "new";
            this.contactStatus = "new";
            (
              (this.newLocalData.contact || {}).data || {}
            ).customerNo = this.customer_id;
            (
              (this.newLocalData.ticket || {}).data || {}
            ).customerNo = this.customer_id;
            (
              (this.newLocalData.plat || {}).data || {}
            ).customerNo = this.customer_id;
            if (
              this.newLocalData.contact &&
              this.newLocalData.contact.data.contactList.length > 0
            )
              api.SETCUSTOMER(this.newLocalData.contact);
            if (
              this.newLocalData.ticket &&
              this.newLocalData.ticket.data.ticketList.length > 0
            )
              api.SETCUSTOMER(this.newLocalData.ticket);
            if (
              this.newLocalData.plat &&
              this.newLocalData.plat.data.platFormList.length > 0
            )
              api.SETCUSTOMER(this.newLocalData.plat);
            if(this.file.name !== ''){
              this.postData.accountId = this.$store.state.user.accountId;
              this.postData.customerNo = this.customer_id;
              this.$refs.upload.post(this.file.file);
            }else{
              this.$Message.success("客户信息更新成功！");
              this.$router.push("/customermanage/customermanage");  
            }
        });
      } else {
        api
          .UPDATECUSTOMER(request)
          .then(response => {
            if(this.deleteStatus){
              this.delete();
            }else{
              if(this.file.name !== ''&&this.uploadStatus){
                this.postData.accountId = this.$store.state.user.accountId;
                this.postData.customerNo = ((this.data||{}).data||{}).customer_no;
                this.$refs.upload.post(this.file.file);
              }else{
                this.$Message.success("客户信息更新成功！");
                this.$router.push("/customermanage/customermanage");  
              }
            }
          })
          .catch(e => {});
      }
    },
    uploadSuccess(){
      this.$Message.success("客户信息更新成功！");
      this.$router.push("/customermanage/customermanage");
    },
    saveTicket(name) {
      let status = false;
      this.$refs[name].validate((valid) => {
          if (valid) {
              this.$Message.success('Success!');
              this.addkpxxmodal = false
          } else {
              this.$Message.error('请按照规定填写！');
              status = true;
          }
      });
      if(status) return;
      let request1 = {
        typeid: 25007,
        data: [
          {
            customerNo: ((this.data || {}).data || {}).customer_no,
            ticketId: this.formAddkpxx.ticket_id,
            ticketUnit: this.formAddkpxx.ticket_unit,
            ticketAddress: this.formAddkpxx.ticket_address,
            phone: this.formAddkpxx.phone,
            bankName: this.formAddkpxx.bank_name,
            bankAccount: this.formAddkpxx.bank_account,
            postInfo: this.formAddkpxx.post_info,
            dutyparagraph: this.formAddkpxx.dutyparagraph,
            ticketContacts: this.formAddkpxx.ticket_contacts
          }
        ]
      };
      let request2 = {
        typeid: 25003,
        data: {
          customerNo: ((this.data || {}).data || {}).customer_no,
          ticketList: [
            {
              ticketUnit: this.formAddkpxx.ticket_unit,
              ticketAddress: this.formAddkpxx.ticket_address,
              phone: this.formAddkpxx.phone,
              bankName: this.formAddkpxx.bank_name,
              bankAccount: this.formAddkpxx.bank_account,
              postInfo: this.formAddkpxx.post_info,
              dutyparagraph: this.formAddkpxx.dutyparagraph,
              ticketContacts: this.formAddkpxx.ticket_contacts
            }
          ]
        }
      };
      if (this.isNewCreate) {
        if (!this.newLocalData.ticket) {
          this.newLocalData.ticket = request2;
          this.formValidate.ticket_list.push(this.formAddkpxx);
        } else {
          if (this.ticketStatus === "edit") {
            for (let key in this.formValidate.ticket_list[this.ticketIndex]) {
              this.$set(
                this.formValidate.ticket_list[this.ticketIndex],
                key,
                this.formAddkpxx[key]
              );
            }
            this.newLocalData.ticket.data.ticketList[
              this.ticketIndex
            ] = JSON.parse(JSON.stringify(request2.data.ticketList[0]));
          } else {
            this.formValidate.ticket_list.push(this.formAddkpxx);
            this.newLocalData.ticket.data.ticketList.push(
              request2.data.ticketList[0]
            );
          }
        }
        return;
      }
      if (this.ticketStatus === "edit") {
        api.UPDATECUSTOMER(request1).then(response => {
          if (response.data.code === 0) {
            let index = this.formValidate.ticket_list.findIndex(
              data => data.ticket_id === this.formAddkpxx.ticket_id
            );
            for (let key in this.formValidate.ticket_list[index]) {
              this.$set(
                this.formValidate.ticket_list[index],
                key,
                this.formAddkpxx[key]
              );
            }
            this.saveTicketSuccess();
          }
        });
      } else {
        api.SETCUSTOMER(request2).then(response => {
          if (response.data.code === 0) {
            this.formValidate.ticket_list.push(this.formAddkpxx);
            this.saveTicketSuccess();
          }
        });
      }
    },
    saveTicketSuccess() {
      this.addkpxxmodal = false;
      this.ticketStatus = "new";
    },
    handleCancel(name) {
      // this.$Message.error("已取消");
      this.addkpxxmodal = false
    },
    ok() {
      this.saveTicket();
    },
    cancel() {
      this.addlxrmodal = false;
    },
    getSales(item,callback) {
      let request = {
        typeid: 27008,
        data: [
          {
            companyID: parseInt(item.value)
          }
        ]
      };
      if(this.salesList.length === 0){
          this.companys.forEach(p => {
            let item = {
              value:p.id + '',
              label:p.name,
              children:[],
              loading:false
            }
            this.salesList.push(item);
          })
        }
      // this.salesList = [];
      item.loading = true;
      api.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        let children = [];
        res.forEach(r => {
          children.push({
            value:r.id+'',
            label:r.name
          })
        })
        item.children = children;
        this.$nextTick(()=>{
          let salesman = ((this.data || {}).data || {}).saleId;
          let arr = [item.value + '',salesman + ''];
          this.formValidate.salesman = arr;
        })
        item.loading = false;
         callback();
      },error => {
        if(this.salesList.find(p => p.value === this.manageCompany)){
          item.children = [];
          this.formValidate.salesman = [];
        }
        if(item.label&&item.children.length === 0){
          this.$Message.error('该运营下没有销售人员可选，请重新选择！');
        }
        item.loading = false;
         callback();
      });
    },
    init() {
      let data = this.data || {};
      this.customer_id = "";
      this.formValidate.name = data.name || "";
      this.formValidate.customer_abbreviation =
        ((data || {}).data || {}).customer_abbreviation || "";
      this.formValidate.nature = ((data || {}).data || {}).customer_nature;
      this.formValidate.industry = ((data || {}).data || {}).industry;
      this.formValidate.level = ((data || {}).data || {}).customer_level;
      this.formValidate.registered_capital = (
        ((data || {}).data || {}).registered_capital || 0
      ).toString();
      this.formValidate.charge_person =
        ((data || {}).data || {}).charge_person || "";
      this.formValidate.bond_amount = (
        ((data || {}).data || {}).bond_amount || 0
      ).toString();
      this.formValidate.mail_address =
        ((data || {}).data || {}).mail_address || "";
      this.formValidate.post_code = ((data || {}).data || {}).post_code || "";
      this.formValidate.protocolNumber =
        ((data || {}).data || {}).protocolNumber || "";
      this.formValidate.platformuser_list = JSON.parse(
        JSON.stringify(((data || {}).data || {}).platformuser_list || [])
      );
      this.formValidate.contacts_list = JSON.parse(
        JSON.stringify(((data || {}).data || {}).contacts_list || [])
      );
      if (this.formValidate.contacts_list.length > 0) {
        this.formValidate.contacts_list.forEach(data => {
          data.sex = data.sex === 0 ? "男" : "女";
        });
      }
      this.formValidate.ticket_list = JSON.parse(
        JSON.stringify(((data || {}).data || {}).ticket_list || [])
      );
      let city = [];
      if(((data || {}).data || {}).province) city.push(((data || {}).data || {}).province);
      if(((data || {}).data || {}).city) city.push(((data || {}).data || {}).city);
      if(((data || {}).data || {}).area) city.push(((data || {}).data || {}).area);
      if(city.length > 0)this.formValidate.city = city;
      let empowerCity = [];
      if(((data || {}).data || {}).areaList&&((data || {}).data || {}).areaList.length>0){
        if(((data || {}).data || {}).areaList.length === 1){
          empowerCity.push(((data || {}).data || {}).areaList[0].empowerProvince);
          empowerCity.push(((data || {}).data || {}).areaList[0].empowerCity);
          if(((data || {}).data || {}).areaList[0].empowerArea) empowerCity.push(((data || {}).data || {}).areaList[0].empowerArea);
        }else{
          ((data || {}).data || {}).areaList.forEach(a => {
              let arr = [];
              arr.push(a.empowerProvince);
              arr.push(a.empowerCity);
              if(a.empowerArea) arr.push(a.empowerArea);
              empowerCity.push(arr);
          })
        }
      }
      this.formValidate.empower_city = empowerCity;
      this.manageCompany = ((data || {}).data || {}).manage_company;
      this.getSales({value:this.manageCompany},()=>{});
      if(((data || {}).data || {}).enclosure){
        this.file.name = ((data || {}).data || {}).enclosure.fileName;
        this.file.size = ((data || {}).data || {}).enclosure.fileSize;
        this.file.size = this.file.size >= 1024?((this.file.size/1024).toFixed(2) + ' KB'): this.file.size >= 1024*1024?((this.file.size/(1024*1024)).toFixed(2) + ' MB'):(this.file.size + ' B');
        this.file.uploadMan = ((data || {}).data || {}).enclosure.accountName;
        this.file.date = ((data || {}).data || {}).enclosure.uploadTime;
        this.file.address = ((data || {}).data || {}).enclosure.enclosureAddress;
        this.file.id = (((data || {}).data || {}).enclosure||{}).enclosureId;
        let fileArr = this.file.name.split('.');
        let fileType = fileArr[fileArr.length-1];
        this.file.img = require('../../images/upload/wenjian.png');
        if(/^pdf$/.test(fileType)){
          this.file.img = require('../../images/upload/pdf.png');
        }else if(/^(txt|doc(x)?)$/.test(fileType)){
          this.file.img = require('../../images/upload/docx.png');
        }else if(/^(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(fileType)){
          this.file.img = require('../../images/upload/jpg.png');
        }else if(/^xl(s|t|am)$/.test(fileType)){
          this.file.img = require('../../images/upload/excel.png');
        };
      }
      this.formValidate.sqstartTime = ((data || {}).data || {}).empowerStartTime;
      this.formValidate.sqendTime = ((data || {}).data || {}).empowerEndTime;
    },
    newContact() {
      this.contactStatus = "new";
      this.formAddlxr = {
        contact_name: "",
        contact_id: "",
        sex: "",
        position_name: "",
        phone: "",
        vchar_number: "",
        email: ""
      };
      this.addlxrmodal = true;
    },
    saveContact(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let request1 = {
            typeid: 25008,
            data: [
              {
                customerNo: ((this.data || {}).data || {}).customer_no,
                contactId: this.formAddlxr.contact_id,
                contactName: this.formAddlxr.contact_name,
                sex: this.formAddlxr.sex === "男" ? 0 : 1,
                positionName: this.formAddlxr.position_name,
                phone: this.formAddlxr.phone,
                vcharnumber: this.formAddlxr.vchar_number,
                eMail: this.formAddlxr.email
              }
            ]
          };
          let request2 = {
            typeid: 25004,
            data: {
              customerNo: ((this.data || {}).data || {}).customer_no,
              contactList: [
                {
                  contactName: this.formAddlxr.contact_name,
                  sex: this.formAddlxr.sex === "男" ? 0 : 1,
                  positionName: this.formAddlxr.position_name,
                  phone: this.formAddlxr.phone,
                  vcharNumber: this.formAddlxr.vchar_number,
                  eMail: this.formAddlxr.email
                }
              ]
            }
          };
          if (this.isNewCreate) {
            if (this.contactStatus === "edit") {
              for (let key in this.formValidate.contacts_list[
                this.contactIndex
              ]) {
                this.$set(
                  this.formValidate.contacts_list[this.contactIndex],
                  key,
                  this.formAddlxr[key]
                );
              }
              this.newLocalData.contact.data.contactList[
                this.contactIndex
              ] = JSON.parse(JSON.stringify(request2.data.contactList[0]));
            } else {
              this.formValidate.contacts_list.push(this.formAddlxr);
              if (!this.newLocalData.contact) {
                this.newLocalData.contact = request2;
              } else {
                this.newLocalData.contact.data.contactList.push(
                  request2.data.contactList[0]
                );
              }
            }
            this.addlxrmodal = false;
            this.$Message.success("添加成功!");
            return;
          }
          if (this.contactStatus === "edit") {
            api.UPDATECUSTOMER(request1).then(response => {
              if (response.data.code === 0) {
                let index = this.formValidate.contacts_list.findIndex(
                  data => data.contact_id === this.formAddlxr.contact_id
                );
                for (let key in this.formValidate.contacts_list[index]) {
                  this.$set(
                    this.formValidate.contacts_list[index],
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
                this.formAddlxr.contact_id =
                  ((response.data.result.data || {}).contractIdList || [])[0] ||
                  "";
                this.formValidate.contacts_list.push(this.formAddlxr);
                this.addlxrmodal = false;
                this.$Message.success("添加成功!");
              }
            });
          }
        } else {
          this.$Message.error("请填写正确的信息！");
        }
      });
    },
    newTicket() {
      this.ticketStatus = "new";
      this.formAddkpxx = {
        ticket_customer: "",
        ticket_unit: "",
        dutyparagraph: "",
        ticket_address: "",
        phone: "",
        bank_name: "",
        bank_account: "",
        post_info: "",
        ticket_contacts: "",
        ticket_id: ""
      };
      this.addkpxxmodal = true;
    },
    editTicket(index) {
      let {
        ticket_customer,
        dutyparagraph,
        ticket_address,
        phone,
        bank_name,
        bank_account,
        post_info,
        ticket_contacts,
        ticket_id,
        ticket_unit
      } = this.formValidate.ticket_list[index];
      this.formAddkpxx = {
        ticket_customer,
        dutyparagraph,
        ticket_address,
        phone,
        bank_name,
        bank_account,
        post_info,
        ticket_contacts,
        ticket_id,
        ticket_unit
      };
      this.addkpxxmodal = true;
      this.ticketStatus = "edit";
      this.ticketIndex = index;
    },
    deleteTicket(index) {
      let request = {
        typeid: 25011,
        data: {
          customerNo: ((this.data || {}).data || {}).customer_no,
          ticketId: [this.formValidate.ticket_list[index].ticket_id]
        }
      };
      if (this.isNewCreate) {
        this.formValidate.ticket_list = this.formValidate.ticket_list.filter(
          (t, i) => i !== index
        );
        this.newLocalData.ticket.data.ticketList = this.newLocalData.ticket.data.ticketList.filter(
          (d, i) => i !== index
        );
        return;
      }
      api.DELETECUSTOMER(request).then(response => {
        if (response.data.code === 0) {
          this.formValidate.ticket_list = this.formValidate.ticket_list.filter(
            (t, i) => i !== index
          );
        }
      });
    },
    deletePlatForm(index) {
      let request = {
        typeid: 25013,
        data: {
          customerNo: ((this.data || {}).data || {}).customer_no,
          platFormId: [this.formValidate.platformuser_list[index].platform_id]
        }
      };
      if (this.isNewCreate) {
        this.formValidate.platformuser_list = this.formValidate.platformuser_list.filter(
          (item, i) => i !== index
        );
        this.newLocalData.plat.data.platFormList = this.newLocalData.plat.data.platFormList.filter(
          (d, i) => i !== index
        );
        return;
      }
      api.DELETECUSTOMER(request).then(response => {
        if (response.data.code === 0) {
          this.$Message.error("已删除！");
          this.formValidate.platformuser_list = this.formValidate.platformuser_list.filter(
            (item, i) => i !== index
          );
        }
      });
    },
    deleteContract(index) {
      let request = {
        typeid: 25012,
        data: {
          customerNo: ((this.data || {}).data || {}).customer_no,
          contactId: [this.formValidate.contacts_list[index].contact_id]
        }
      };
      if (this.isNewCreate) {
        this.formValidate.contacts_list = this.formValidate.contacts_list.filter(
          (d, i) => i !== index
        );
        this.newLocalData.contact.data.contactList = this.newLocalData.contact.data.contactList.filter(
          (d, i) => i !== index
        );
        this.$Message.error("已删除！");
        return;
      }
      api.DELETECUSTOMER(request).then(response => {
        if (response.data.code === 0) {
          this.$Message.error("已删除！");
          this.formValidate.contacts_list = this.formValidate.contacts_list.filter(
            (d, i) => i !== index
          );
        }
      });
    },
    platFormShow() {
      this.addPlatShow = true;
      let request = {
        typeid: 27006
      };
      this.plat.list = [];
      api.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.res = res;
        res.forEach(data => {
          if (!this.plat.list.find(d => d.platform_id === data.platId))
            this.plat.list.push({
              platform_name: data.name,
              platform_id: data.platId,
              platform_user_type: data.userType,
              value: `(${data.platId})${data.name}`
            });
        });
        this.plat.list = this.plat.list.filter(
          data =>
            !this.formValidate.platformuser_list.find(
              d => d.platform_id === data.platform_id
            )
        );
        this.plat.platform_id = (this.plat.list[0] || {}).platform_id;
        this.plat.platform_name = (this.plat.list[0] || {}).platform_name;
        this.plat.platform_user_type = (
          this.plat.list[0] || {}
        ).platform_user_type;
      });
    },
    savePlat() {
      let request = {
        typeid: 25005,
        data: {
          customerNo: ((this.data || {}).data || {}).customer_no,
          platFormList: [
            {
              platFormId: this.plat.platform_id,
              platFormName: this.plat.platform_name,
              platFormUserType: this.plat.platform_user_type
            }
          ]
        }
      };
      if (this.isNewCreate) {
        this.formValidate.platformuser_list.push({
          platform_id: this.plat.platform_id,
          platform_name: this.plat.platform_name,
          platform_user_type: this.plat.platform_user_type
        });
        if (!this.newLocalData.plat) {
          this.newLocalData.plat = request;
        } else {
          this.newLocalData.plat.data.platFormList.push(
            request.data.platFormList[0]
          );
        }
        return;
      }
      api.SETCUSTOMER(request).then(response => {
        if (response.data.code === 0) {
          this.$Message.success("关联成功！");
          this.formValidate.platformuser_list.push({
            platform_id: this.plat.platform_id,
            platform_name: this.plat.platform_name,
            platform_user_type: this.plat.platform_user_type
          });
        }
      });
    },
    beforeUpload(file){
      this.$Message.success('上传成功！');
      this.file.name = file.name;
      this.file.size = file.size >= 1024?((file.size/1024).toFixed(2) + ' KB'): file.size >= 1024*1024?((file.size/(1024*1024)).toFixed(2) + ' MB'):(file.size + ' B');
      this.file.date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
      this.file.uploadMan = this.$store.state.user.accountName;
      this.file.file = file;
      let fileArr = file.name.split('.');
      let fileType = fileArr[fileArr.length-1];
      this.file.img = require('../../images/upload/wenjian.png');
      if(/^pdf$/.test(fileType)){
        this.file.img = require('../../images/upload/pdf.png');
      }else if(/^(txt|doc(x)?)$/.test(fileType)){
        this.file.img = require('../../images/upload/docx.png');
      }else if(/^(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(fileType)){
        this.file.img = require('../../images/upload/jpg.png');
      }else if(/^xl(s|t|am)$/.test(fileType)){
        this.file.img = require('../../images/upload/excel.png');
      };
      this.uploadStatus = true;
      return false;
    },
    delete(){
      let request = {
        "typeid": 26016,
        "data": [
          {
            "enclosureId": (((this.data || {}).data || {}).enclosure||{}).enclosureId + ','
          }
        ]
      };
      this.$http.DELETECONTRACT(request).then(res => {
        if(this.file.name !== ''){
          this.postData.accountId = this.$store.state.user.accountId;
          this.postData.customerNo = ((this.data||{}).data||{}).customer_no;
          this.$refs.upload.post(this.file.file);
        }else{
          this.$Message.success("客户信息更新成功！");
          this.$router.push("/customermanage/customermanage");  
        }
      })
    },
    deleteFile(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        if(this.isNewCreate){
          
        }else{
          this.deleteStatus = true;
        }
        this.$Message.success('删除成功！');
        for(let key in this.file){
          this.file[key] = '';
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  mounted() {
    this.formValidate = {
      name: "",
      customer_abbreviation: "",
      nature: '',
      level:"",
      industry: '',
      registered_capital: 0,
      charge_person: "",
      bond_amount: "",
      mail_address: "",
      post_code: "",
      salesman: [],
      platformuser_list: [],
      contacts_list: [],
      ticket_list: [],
      city: [],
      empower_city: [],
      protocolNumber: "",
      sqstartTime: "",
      sqendTime:"",
      company:""
    }
    this.init();
  },
  computed: {
    data() {
      if (Object.keys(this.$store.state.user.customerInfo).length > 0) {
        return this.$store.state.user.customerInfo;
      }
      return JSON.parse(localStorage.getItem("customInfo")) || {};
    },
    regions() {
      return JSON.parse(localStorage.getItem("regions")) || [];
    },
    companys() {
      return JSON.parse(localStorage.getItem("companys")) || {};
    },
    isNewCreate() {
      return (
        Object.keys(JSON.parse(localStorage.getItem("customInfo")) || {})
          .length === 0 && this.customer_id === ""
      );
    },
    isCustom() {
      return this.formValidate.nature === 1;
    },
    isFriend() {
      return this.formValidate.nature === 2;
    },
    isCooperative(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '合作伙伴');
      }
    },
    isSaleManage(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '业务管控');
      }
    },
    isSaleMan(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '销售人员');
      }
    },
    natures(){
      let natureArr = [];
      if(this.isCooperative){
        natureArr = this.$option.customer.natures.filter(i =>i.index === 3);
      }else if(this.isSaleMan){
        natureArr = this.$option.customer.natures.filter(i =>i.index === 1);
      }else{
        natureArr = this.$option.customer.natures;
      }
      return natureArr;
    },
  },
  watch: {
    $route: function() {
      this.init();
    },
    "plat.platform_id": function(nv) {
      let selectedplatObj =
        this.plat.list.find(data => data.platform_id === nv) || {};
      this.plat.platform_name = selectedplatObj.platform_name;
      this.plat.platform_user_type = selectedplatObj.platform_user_type;
    },
    'formValidate.salesman'(nv){
      if(nv.length === 1){
        this.$refs['cascader'].visible = true;
        let index = this.$refs['cascader'].data.findIndex(d => d.value === nv[0]);
        let top = index * 30;
        this.$nextTick(() => {
          $('.ivu-cascader-menu')[0].scrollTo(0,top);
        })
      }
    }
  }
};
</script>

<style>
@import "./customer.css";
.aa .ivu-modal-footer {
    display: none;
  }
</style>
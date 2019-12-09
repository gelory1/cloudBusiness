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
            <Col span="6">
              <FormItem label="客户性质" prop="nature" :label-width="90">
                <Select v-model="formValidate.nature.index" placeholder clearable filterable>
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
                <Select v-model="formValidate.level.index" placeholder clearable filterable>
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
                <Select
                  v-model="formValidate.province.id"
                  placeholder="请选择"
                  style="width:174px;"
                  clearable
                  filterable
                >
                  <Option
                    v-for="(item,index) in provinces"
                    :value="item.id"
                    :key="index"
                  >{{item.name}}</Option>
                </Select>
                <Select
                  v-model="formValidate.city.id"
                  placeholder="请选择"
                  clearable
                  filterable
                  style="width:173px;"
                >
                  <Option v-for="(item,index) in citys" :value="item.id" :key="index">{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="行业" prop="industry" :label-width="90">
                <!-- <Input v-model="formValidate.hy" placeholder="Enter your name"></Input> -->
                <Select v-model="formValidate.industry.index" clearable filterable placeholder>
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
            <Col span="12"  v-if="isFriend">
              <FormItem label="协议编号" prop="protocolNumber" :label-width="90">
                <Input v-model="formValidate.protocolNumber" placeholde />
              </FormItem>
            </Col>
            <Col span="12" v-if="isFriend">
              <FormItem label="授权资质" prop="sqzz" class="con-right">
                <Select v-model="formValidate.empower_province.id" placeholder clearable filterable style="width:174px;">
                  <Option
                    v-for="(item,index) in provinces"
                    :value="item.id"
                    :key="index"
                  >{{item.name}}</Option>
                </Select>
                <Select
                  v-model="formValidate.empower_city.id"
                  placeholder
                  clearable
                  filterable
                  style="width:173px;"
                >
                  <Option
                    v-for="(item,index) in empower_citys"
                    :value="item.id"
                    :key="index"
                  >{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="销售负责人" prop="salesman" :label-width="90">
                <Input v-model="formValidate.salesman" placeholder="Enter your name" readonly />
              </FormItem>
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
                <section>
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
          <Button type="ghost" @click="handleCancel('formValidate')" style="margin-left: 20px">取消</Button>
        </FormItem>
      </Form>
    </Layout>
    <!-- 添加联系人 -->
    <Modal v-model="addlxrmodal" @on-ok="saveContact()" @on-cancel="cancel">
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

        <!-- <FormItem>
          <Button type="primary" @click="saveContact()">确认并添加</Button>
          <Button type="info" style="margin-left: 8px">保存并继续添加</Button>
          <Button type="ghost" style="margin-left: 8px">取消</Button>
        </FormItem>-->
      </Form>
    </Modal>
    <!-- 添加开票信息 -->
    <Modal v-model="addkpxxmodal" width="800" @on-ok="saveTicket()" @on-cancel="handleCancel()">
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
        <Row>
          <Col span="12">
            <FormItem label="开票地址" prop="ticket_address">
              <Input v-model="formAddkpxx.ticket_address" placeholder />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="电话" prop="phone">
              <Input v-model="formAddkpxx.phone" placeholder @on-keyup="inputChange"/>
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
              <Input v-model="formAddkpxx.bank_account" placeholder @on-keyup="inputChange"/>
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
        <!-- <FormItem style="margin:40px 0">
          <Button type="primary" @click="saveTicket()">确认并添加</Button>
          <Button @click="handleCancel('formAddkpxx')" style="margin-left: 8px">取消</Button>
        </FormItem>-->
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
const natures = [
  {
    value: "直销客户",
    index: 1
  },
  {
    value: "合作伙伴",
    index: 2
  },
  {
    value: "伙伴客户",
    index: 3
  }
];
const levels = [
  {
    val: "A级",
    index: 1
  },
  {
    val: "B级",
    index: 2
  },
  {
    val: "C级",
    index: 3
  },
  {
    val: "D级",
    index: 4
  },
  {
    val: "E级",
    index: 5
  }
];
const industrys = [
  {
    val: "公共事业及管理组织",
    index: 1
  },
  {
    val: "工业",
    index: 2
  },
  {
    val: "商业住宿餐饮",
    index: 3
  },
  {
    val: "金融房地产及居民服务",
    index: 4
  },
  {
    val: "运输仓储邮政",
    index: 5
  },
  {
    val: "信息计算机和软件",
    index: 6
  },
  {
    val: "农林牧渔水利",
    index: 7
  },
  {
    val: "建筑业",
    index: 8
  },
  {
    val: "军工保密",
    index: 9
  },
  {
    val: "其他",
    index: 10
  }
];

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
        var expression = /^1(3|4|5|7|8)\d{9}$/;
        if (expression.test(value) == false) {
          callback(new Error("请输入正确的电话号码"));
        }
      } else {
        callback(new Error("请输入电话号码"));
      }
      callback();
    };
    // 纯数字正则
    // const validateNum = (rule, value, callback) => {
    //   if (
    //     this.formAddkpxx.dutyparagraph !== "" ||
    //     this.formAddkpxx.bank_account !== ""
    //   ) {
    //     var expression = /^[0-9]*$/;
    //     if (expression.test(value) == false) {
    //       callback(new Error("该字段为数字"));
    //     }
    //   } else {
    //     callback(new Error("该字段不能为空"));
    //   }
    //   callback();
    // };
    return {
      formValidate: {
        name: "",
        customer_abbreviation: "",
        nature: natures[0],
        level: levels[0],
        industry: industrys[0],
        registered_capital: 0,
        charge_person: "",
        bond_amount: "",
        mail_address: "",
        post_code: "",
        salesman: "",
        platformuser_list: [],
        contacts_list: [],
        ticket_list: [],
        province: {},
        city: {},
        empower_province: "",
        empower_city: "",
        protocolNumber: ""
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
            message: "请选择客户等级"
          }
        ],
        industry: [
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
      addlxr_data: [
        {
          dh: "1563819"
        }
      ],
      kpxx: {
        mc: "贾诩",
        sh: "3241424324",
        dh: "23443242424",
        khyh: "中国银行",
        yhzh: "2341222312432424",
        kpdz: "南京雨花台",
        yjdz: "南京江宁",
        yjr: "司马懿",
        yjdh: "21657890987"
      },
      khxzf: [
        {
          val: "213"
        },
        {
          val: "55"
        }
      ],
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
            message: "请输入税号",
            trigger: "blur",
            // validator: validateNum
          }
        ],
        ticket_address: [
          {
            required: true,
            message: "请输入开票地址",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhone
          }
        ],
        bank_name: [
          {
            required: true,
            message: "请输入开户行",
            trigger: "blur"
          }
        ],
        bank_account: [
          {
            required: true,
            message: "请输入银行账号",
            trigger: "blur",
            // validator: validateNum
          }
        ],
        post_info: [
          {
            required: true,
            message: "请输入邮寄地址",
            trigger: "blur"
          }
        ],
        ticket_contacts: [
          {
            required: true,
            message: "请输入联系人及电话",
            trigger: "blur"
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
      natures: natures,
      levels: levels,
      industrys: industrys,
      citys: [],
      empower_citys: [],
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
      newLocalData: {}
    };
  },
  methods: {
    inputChange() {
      this.formAddkpxx.bank_account = this.formAddkpxx.bank_account.replace(/[^\d]/g, '')
      this.formAddkpxx.phone = this.formAddkpxx.phone.replace(/[^\d]/g, '')
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // this.$Message.success("Success!");
          this.editCustomer();
        } else {
          this.$Message.error("请将信息补充完整后再提交");
        }
      });
    },
    editCustomer() {
      let request = {
        typeid: this.isNewCreate ? 25002 : 25006,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            customerNo: this.isNewCreate
              ? undefined
              : ((this.data || {}).data || {}).customer_no,
            customerName: this.formValidate.name,
            customerLevel: this.formValidate.level.index,
            customerNature: this.formValidate.nature.index,
            province: this.formValidate.province.id,
            city: this.formValidate.city.id,
            empowerProvince: this.formValidate.empower_province.id,
            empowerCity: this.formValidate.empower_city.id,
            manageCompany: 2,
            industry: this.formValidate.industry.index,
            mailAddress: this.formValidate.mail_address,
            bondAmount: Number(this.formValidate.bond_amount),
            registeredCapital: Number(this.formValidate.registered_capital),
            customerAbbreviation: this.formValidate.customer_abbreviation,
            chargePerson: this.formValidate.charge_person,
            postCode: this.formValidate.post_code,
            protocolNumber: this.formValidate.protocolNumber
          }
        ]
      };
      if (this.isNewCreate) {
        api.SETCUSTOMER(request).then(response => {
          if (response.data.code === 0) {
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
            this.$Message.success("客户信息更新成功！");
            this.$router.push("/customermanage/customermanage");
          }
        });
      } else {
        api.UPDATECUSTOMER(request).then(response => {
          if (response.data.code === 0) {
            this.$Message.success("客户信息更新成功！");
            this.$router.push("/customermanage/customermanage");
          }
        });
      }
    },
    saveTicket() {
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
      this.$Message.error("已取消");
    },
    ok() {
      this.saveTicket();
    },
    cancel() {
      // this.$Message.info("Clicked cancel");
    },
    getCitys() {
      let request = {
        typeid: 27003,
        data: [
          {
            province: this.formValidate.province.id
          }
        ]
      };
      this.citys = [];
      // this.formValidate.city = {};
      api.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.citys = res;
        this.formValidate.city = JSON.parse(
          JSON.stringify(
            res.find(c => c.id === ((this.data || {}).data || {}).city) ||
              res[0]
          )
        );
      });
    },
    getEmpowerCitys() {
      let request = {
        typeid: 27003,
        data: [
          {
            province: this.formValidate.empower_province.id
          }
        ]
      };
      this.empower_citys = [];
      // this.formValidate.empower_city = {};
      api.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.empower_citys = res;
        this.formValidate.empower_city = JSON.parse(
          JSON.stringify(
            res.find(c => c.id === ((this.data || {}).data || {}).city) ||
              res[0]
          )
        );
      });
    },
    init() {
      let data = this.data || {};
      this.customer_id = "";
      this.formValidate.name = data.name || "";
      this.formValidate.customer_abbreviation =
        ((data || {}).data || {}).customer_abbreviation || "";
      this.formValidate.nature = JSON.parse(
        JSON.stringify(
          this.natures.find(n => n.value === data.nature) || this.natures[0]
        )
      );
      this.formValidate.industry = JSON.parse(
        JSON.stringify(
          this.industrys.find(
            n => n.val === ((data || {}).data || {}).industry || {}
          )
        )
      );
      this.formValidate.level = JSON.parse(
        JSON.stringify(
          this.levels.find(n => n.val === ((data || {}).data || {}).level || {})
        )
      );
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
      this.formValidate.salesman = data.salesman || "";
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
      this.formValidate.province = JSON.parse(
        JSON.stringify(
          this.provinces.find(
            p => p.id === ((data || {}).data || {}).province
          ) || this.provinces[0]
        )
      );
      this.formValidate.empower_province = JSON.parse(
        JSON.stringify(
          this.provinces.find(
            p => p.id === ((data || {}).data || {}).empower_province
          ) || this.provinces[0]
        )
      );
      this.getCitys();
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
    saveContact() {
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
          for (let key in this.formValidate.contacts_list[this.contactIndex]) {
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
            this.formValidate.contacts_list.push(this.formAddlxr);
            this.addlxrmodal = false;
          }
        });
      }
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
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    data() {
      return JSON.parse(localStorage.getItem('customInfo'))||{};
    },
    provinces() {
      return JSON.parse(localStorage.getItem('provinces'))||{};
    },
    isNewCreate() {
      return (
        Object.keys(JSON.parse(localStorage.getItem('customInfo'))||{}).length === 0 &&
        this.customer_id === ""
      );
    },
    isCustom() {
      return this.formValidate.nature.index === 1;
    },
    isFriend() {
      return this.formValidate.nature.index === 2;
    }
  },
  watch: {
    "formValidate.province.id": function() {
      // this.formValidate.province.id = (this.provinces.find(p => p.name === this.formValidate.province.name)||{}).id;
      this.getCitys();
      if(this.formValidate.province.id == ''){
        this.formValidate.city.id =''
      }
    },
    "formValidate.empower_province.id": function() {
      // this.formValidate.empower_province.id = (this.provinces.find(p => p.name === this.formValidate.empower_province.name)||{}).id;
      this.getEmpowerCitys();
    },
    // 'formValidate.level.index':function(){
    //   this.formValidate.level.index = (this.levels.find(p => p.val === this.formValidate.level.val)||{}).index;
    // },
    // 'formValidate.nature.index':function(){
    //   this.formValidate.nature.index = (this.natures.find(p => p.value === this.formValidate.nature.value)||{}).index;
    // },
    // 'formValidate.industry.index':function(){
    //   this.formValidate.industry.index = (this.industrys.find(p => p.val === this.formValidate.industry.val)||{}).index;
    // },
    $route: function() {
      this.init();
    },
    "plat.platform_id": function(nv) {
      let selectedplatObj =
        this.plat.list.find(data => data.platform_id === nv) || {};
      this.plat.platform_name = selectedplatObj.platform_name;
      this.plat.platform_user_type = selectedplatObj.platform_user_type;
    }
  }
};
</script>

<style>
@import "./customer.css";
</style>
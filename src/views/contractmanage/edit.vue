<template>
  <div class="htedit">
    <Layout class="layout">
      <header class="header_mid" style="border:none;margin-top:30px;">
        <h2>{{data.customerName}}</h2>
        <p>{{data.contractNo}}</p>
        <div class="ht_img">
          <section>
            <img src="../../images/htgl/当前状态.png" alt />
            <div>
              <span style="color:#e6a23c">{{data.contractStatus}}</span>
              <br />
              <span class="cor">当前状态</span>
            </div>
          </section>
          <section>
            <img src="../../images/htgl/开始时间.png" alt />
            <div>
              <span>{{data.data.signTime}}</span>
              <br />
              <span class="cor">合同开始时间</span>
            </div>
          </section>
          <section>
            <img src="../../images/htgl/到期时间.png" alt />
            <div>
              <span>{{data.data.dueTime}}</span>
              <br />
              <span class="cor">合同到期时间</span>
            </div>
          </section>
          <section>
            <img src="../../images/htgl/暂无.png" alt />
            <div>
              <span>{{data.data.upTime}}</span>
              <br />
              <span class="cor">上线时间</span>
            </div>
          </section>
          <section>
            <img src="../../images/htgl/安装点数.png" alt />
            <div>
              <span>{{data.data.installPoint}}</span>
              <br />
              <span class="cor">安装点数</span>
            </div>
          </section>
        </div>
      </header>
      <content style="margin-top:30px">
        <Tabs value="name1">
          <TabPane label="签约信息" name="name1">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <Row>
                <Col span="14">
                  <FormItem label="客户名称" prop="khmc" :label-width="90">
                    <Input v-model="data.data.customerName" placeholder disabled></Input>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem label="合同内容" prop="htnr" :label-width="100" style="margin-left:50px">
                    <Input class="col-m" v-model="contractContentMap[data.data.contractContent]" placeholder disabled></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="14">
                  <FormItem label="合同主体" prop="htzt" :label-width="90">
                    <Input v-model="subjectName[data.data.contractSubject]" placeholder disabled></Input>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem label="签约时间" :label-width="100" prop="qysj"  style="margin-left:50px">
                    <Input class="col-m" v-model="data.data.signTime" placeholder disabled></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="14">
                  <FormItem label="运营公司" prop="yygs" :label-width="90">
                    <Input v-model="data.manageCompany" placeholder disabled></Input>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem label="签约点数" prop="qyds" :label-width="100" style="margin-left:50px">
                    <Input class="col-m" v-model="data.data.signPoint" placeholder  disabled></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="7">
                  <FormItem label="省份/城市" prop="city" :label-width="90">
                    <Select v-model="formValidate.province" placeholder class="col-f" disabled>
                      <Option :value="data.data.customerProvince">{{data.data.customerProvince_cn}}</Option>
                    </Select>
                    <Select v-model="formValidate.city" placeholder class="col-f" disabled>
                      <Option :value="data.data.customerCity">{{data.data.customerCity_cn}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="签约用户数" prop="qyyhs" class="con-right">
                    <Slider class="col-m" v-model="formValidate.signUserAmount" show-input></Slider>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem label="合同年限" prop="htnx" :label-width="100" style="margin-left:50px">
                    <Input class="col-m" v-model="data.data.contractYears" placeholder disabled></Input>
                  </FormItem>
                </Col>
              </Row>
                <Row>
                <Col span="7">
                  <FormItem label="销售人员" prop="xsry" :label-width="90">
                    <Input class="col-a" v-model="data.saleManName" placeholder disabled></Input>
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="销售方式" prop="xsfs"  class="con-right">
                    <Input class="col-m" v-model="data.saleType" placeholder disabled></Input>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem label="赠送服务时间" prop="zssj" :label-width="100" style="margin-left:50px">
                    <Input class="col-m" v-model="data.data.giftTime" placeholder disabled></Input>
                  </FormItem>
                </Col>
              </Row>
            <Row>
                <Col span="7">
                  <FormItem label="项目经理" prop="xmjl" :label-width="90">
                    <Input v-model="formValidate.projectManager" placeholder></Input>
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="付款周期" prop="fkzq" class="con-right">
                    <Input class="col-m" v-model="data.data.paymentCycle" placeholder  disabled></Input>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem label="合同总费用" prop="htzfy" :label-width="100" style="margin-left:50px" disabled>
                    <Input style="width:135px;" v-model="data.data.contractAmount" placeholder disabled></Input>元人民币
                  </FormItem>
                </Col>
              </Row>
                <Row>
                <Col span="14">
                  <FormItem label="实施地点" prop="ssdd" :label-width="90">
                    <Input  v-model="data.data.implementation" placeholder disabled></Input>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem label="联系人及电话" prop="rjdh" style="margin-left:50px;" :label-width="100">
                    <Input class="col-m" v-model="data.data.contractInfo" placeholder disabled></Input>
                  </FormItem>
                </Col>
              </Row>
                <Col span="12" class="changeinput">
                  <FormItem label="关联平台账户" prop="glzh" :label-width="90" style="color: #409eff;">
                    <span class="bg_p" v-for="(item,index) in data.data.platformuserList" :key="index" style="margin:5px">({{item.platform_id}}){{item.platform_name}}</span>
                  </FormItem>
                </Col>
              </Row>
              <FormItem class="form_but" style="clear:both">
                <Button type="primary" @click="handleSubmit()">提交</Button>
                <Button
                  type="ghost"
                  @click="handleCancel()"
                  style="margin-left: 8px"
                >取消</Button>
              </FormItem>
            </Form>
          </TabPane>
          <TabPane label="财务信息" name="name2">
            <p class="det_p">
              <span class="det_span">
                合同总金额
                <span style="color:#000000;">{{data.data.contractAmount}}</span>元
              </span>
              <span>
                剩余款数
                <span style="color:red">{{remainingMoney}}</span>元
              </span>
            </p>
            <div v-for="(item,index) in paymentList" :key="index">
              <div class="zq_div">
                <section style="width:55%;float:left" @click="showPayment(index)">
                  <p class="zq_p">
                    <span v-if="showObj[index] == true">
                      <Icon type="arrow-down-b"></Icon>
                    </span>
                    <span v-if="showObj[index] == false">
                      <Icon type="arrow-right-b"></Icon>
                    </span>
                    <span class="zq_c">账期{{index+1}}（付{{index+1}}年年费）</span>
                  </p>
                  <p style="margin-left:10px;">
                    <span>
                      <Icon type="ios-calendar-outline"></Icon>
                    </span>
                    <span>{{item.paymentTime}}-{{item.dueTime}}</span>
                  </p>
                </section>
                <section class="zq_c zq_se" style="color:#797979;">
                  <p class="zq_p">本期应付（元）</p>
                  <p>{{item.paymentAmount}}</p>
                </section>
                <section class="zq_c zq_se" style="color:#797979;">
                  <p class="zq_p">本期实付（元）</p>
                  <p>{{item.currentAmount}}</p>
                </section>
                <section class="zq_c zq_se" style="color:#797979;">
                  <p class="zq_p" v-if="item.currentTicketAmount > 0">已开票（元）</p>
                  <div style="display:flex;justify-content: center;">
                    <p class="cor_span" style="margin-right:10px" v-if="item.currentTicketAmount>0">{{item.currentTicketAmount}}</p>
                    <!-- <p class="cor_span">
                      <Button size="small" @click="fpmodal = true" v-if="item.ticketButton">开发票</Button>
                    </p> -->
                  </div>
                  
                </section>
              </div>
              <div class="zq_div2" v-show="showObj[index]&&item.paybackList.length>0">
                <section class="zq_se2">
                  <div>ID</div>
                  <div>支付时间</div>
                  <div>确认时间</div>
                  <div>支付金额（元）</div>
                </section>
                <div v-for="(p,i) in item.paybackList" :key="i" class="payList">
                  <section>
                    <div>{{p.paybackId}}</div>
                    <div>{{p.paybackTime}}</div>
                    <div>{{p.paybackSureTime}}</div>
                    <div>{{p.paybackAmount}}</div>
                  </section>
                </div>
                
              </div>
            </div>
          </TabPane>
          <TabPane label="订单信息" name="name3">
            <p class="ddxx_p">
              <span>订单编号：</span>
              <span class="ddxx_span" v-if="data.data.orderNo ===''||!data.data.orderNo">暂无订单信息</span>
              <a v-else @click="goOrderDetail">{{data.data.orderNo}}</a>
            </p>
          </TabPane>
          <TabPane label="附件" name="name4">
            <p class="con-left">共 {{fjIndex}} 个附件</p>
            <p class="fj_add"><Icon type="plus"></Icon> 添加附件</p>
            <div style="clear:both;margin-top:30px;">
              <div v-for="(item,index) in fj" class="fj">
                <section class="fj_img">
                  <img src alt />
                </section>
                <section class="fj_sec">
                  <p>{{item.wjm}}</p>
                  <p class="fj_p">
                    <span>{{item.size}}</span> 来自
                    <span>{{item.where}}</span> |
                    <span>{{item.time}}</span>
                  </p>
                </section>
              </div>
            </div>
            <!-- 添加附件 -->
            <div style="clear:both;margin-top:30px;">
              <div v-for="(item,index) in fj" class="fj">
                <section class="fj_img">
                  <img src alt />
                </section>
                <section class="fj_sec">
                  <p>{{item.wjm}}</p>
                  <p class="fj_p">
                    <span>{{item.size}}</span> 来自
                    <span>{{item.where}}</span> |
                    <span>{{item.time}}</span>
                  </p>
                </section>
                <div style="float:right;color:#4a9af5">
                  <span>查看</span>
                  <span>删除</span>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="更新记录" name="name5">
            <Table ref="currentRowTable" :columns="update_columns" :data="data.data.updateList"></Table>
          </TabPane>
        </Tabs>
      </content>
    </Layout>
  </div>
</template>

<script>
const subjectName = {
  1:'电能云',
  2:'智慧能源',
  3:'维智泰',
  4:'耀邦达',
  5:'股份公司',
  6:'志达',
  7:'康源',
  8:'新联能源',
  100:'其他',
};
const contractContentMap = {
  1: '配用电',
  2: '环保设施智能监测系统',
  3: '中央空调',
  4: '油烟监测',
  5: '工地扬尘',
  6: '园区抄表',
  7: '综合能源',
  100: '其他',
}
export default {
  name: "htedit",
  data() {
    return {
      htxq: {
        mc: "和回家看哈哈",
        bh: "9999999999",
        zt: "签约中。。。。",
        kssj: "2090-9-9",
        dqsj: "9068-7-7",
        sxsj: "675-7-6",
        azds: "0"
      },
      formValidate: {
        city:0,
        province:0,
        signUserAmount:0,
        projectManager: ''
      },
      fj: [
        {
          wjm: "文件名fj.wjm",
          size: "3242",
          where: "dsfs",
          time: "2342-89"
        },
        {
          wjm: "文件名fj.wjm",
          size: "3242",
          where: "dsfs",
          time: "2342-89"
        }
      ],
      update_columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "更新时间",
          key: "updateTime"
        },
        {
          title: "更新者",
          key: "accountName"
        },
        {
          title: "更新内容",
          key: "updateContent"
        }
      ],
      fjIndex:"5",
      cityq: [],
      townq: [],
      xmjlq:[],
      signUserAmount:0,
      ruleValidate: {},
      subjectName,
      showObj:{},
      companys:[],
      projectmen:[],
      contractContentMap
    };
  },
  methods: {
    goOrderDetail(){
      this.$router.push({path: "/ordermanage/orderManage",query:{orderNo:this.data.data.orderNo}})
    },
    showPayment(index){
      this.$set(this.showObj,index,!this.showObj[index]);
    },
    handleSubmit(){
      let request = {
        "typeid": 26005,
        "data": [
            {
              "customerNo":this.data.data.customerNo,
              "account_id":this.$store.state.user.accountId,
              "contractNo": this.data.data.contractNo,
              "signUserCount": this.formValidate.signUserAmount,
              // "saleManName": "李四",
              "saleManName": this.formValidate.projectManager,
              // "platFormList": this.data.data.platformuserList
            }
        ]
      };
      this.$http.UPDATECONTRACT(request).then(response => {
        let data = JSON.parse(JSON.stringify(this.data));
        data.data.signUserAmount = this.formValidate.signUserAmount;
        data.data.projectManager = this.formValidate.projectManager;
        this.$store.commit('selectedContract',data);
        this.$Message.success('编辑成功！');
        this.$router.push({ path: "/contractmanage/detail"});
      })
    },
    handleCancel(){
      this.$router.push({ path: "/contractmanage/detail"});
    }
  },
  beforeCreate(){
    if(Object.keys(JSON.parse(localStorage.getItem('contractInfo'))||{}).length === 0) this.$router.push({path:'/contractmanage/contractmanage'});
  }, 
  mounted() {
    this.formValidate.signUserAmount = this.data.data.signUserAmount;
    this.formValidate.province = this.data.data.customerProvince;
    this.formValidate.city = this.data.data.customerCity;
    this.formValidate.platList = JSON.parse(JSON.stringify(this.data.data.platformuserList));
    this.formValidate.projectManager = this.data.data.projectManager;
  },
  computed: {
    data(){
      return JSON.parse(localStorage.getItem('contractInfo'))||{};
    },
    paymentList(){
      if(this.$route.query.paymentList&&this.$route.query.paymentList.length>0){
        this.$route.query.paymentList.forEach((p,index) => {
          this.$set(this.showObj,index,false);
        })
      }
      return this.$route.query.paymentList;
    },
    remainingMoney(){
      return this.$route.query.remainingMoney;
    }
  },
  watch:{
    
  }
};
</script>

<style>
@import "../customermanage/customer.css";
@import "./contract.css";
@import "../assetmanagement/assetmanage.css";
.ivu-slider-wrap{
    display:none;
}
.ivu-slider-input .ivu-input-number {
    float:left;
    margin-top: 0px;
    width: 200px;
}
.ivu-input-number-handler-wrap{
    opacity: 100;
}
</style>
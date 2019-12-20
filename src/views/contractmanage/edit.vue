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
                    <Slider class="col-m" :max="100000000000" v-model="formValidate.signUserAmount" show-input></Slider>
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
                    <Input class="col-a" v-model="data.saleName" placeholder disabled></Input>
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
                    <Input v-model="formValidate.projectManager"  :maxlength="10"  placeholder="请输入10字以内的姓名"></Input>
                  </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="付款周期" prop="fkzq" class="con-right">
                    <Input class="col-m" v-model="data.data.paymentList.length" placeholder disabled></Input>
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
                <span style="color:#000000;">{{thousandNum(data.data.contractAmount)||0}}</span>元
              </span>
              <span>
                剩余款数
                <span style="color:red">{{thousandNum(remainingMoney)||0}}</span>元
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
                  <p>{{thousandNum(item.paymentAmount)||0}}</p>
                </section>
                <section class="zq_c zq_se" style="color:#797979;">
                  <p class="zq_p">本期实付（元）</p>
                  <p>{{thousandNum(item.currentAmount)||0}}</p>
                </section>
                <section class="zq_c zq_se" style="color:#797979;">
                  <p class="zq_p" v-if="item.currentTicketAmount > 0">已开票（元）</p>
                  <div style="display:flex;justify-content: center;">
                    <p class="cor_span" style="margin-right:10px" v-if="item.currentTicketAmount>0">{{thousandNum(item.currentTicketAmount)}}</p>
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
          <TabPane :label="`附件(${fj.length||0})`" name="name4">
            <p class="con-left">共 {{fj.length}} 个附件</p>
            <p class="fj_add">
              <Upload action="/public/api/xlcontract/uploadFile" :show-upload-list="false" :before-upload="beforeUpload" :data="postData" :headers="{user:'x',key:'x'}" :on-success="getfiles" :on-error="uploadFail">
                <Icon type="plus"></Icon>添加附件
                <p v-if="uploadLoading">上传中....</p>
              </Upload>
            </p>
            <!-- <div style="clear:both;margin-top:30px;">
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
            </div> -->
            <!-- 添加附件 -->
            <div style="clear:both;margin-top:30px;">
              <div v-for="(item,index) in fj" :key="index" class="fj">
                <section class="fj_img">
                  <img :src="item.img" alt style="width:30px;height:30px;margin:10px 30px" />
                </section>
                <section class="fj_sec">
                  <a :href="item.url">{{item.fileName}}</a>
                  <p class="fj_p">
                    <span>{{item.size}}</span> 来自
                    <span>{{item.where}}</span> |
                    <span>{{item.time}}</span>
                  </p>
                </section>
                <div style="float:right;color:#4a9af5">
                  <a :href="` https://view.officeapps.live.com/op/view.aspx?src=${encodeURI(item.url)}`" target="_blank" rel="nofollow">查看</a>
                  <span @click="deleteFj(item.data.enclosureId)" style="cursor:pointer">删除</span>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="更新记录" name="name5">
            <Table ref="currentRowTable" :columns="update_columns" :data="data.data.updateList"></Table>
          </TabPane>
        </Tabs>
        <Modal v-model="orderDetailOpen" width="1000">
          <orderDetail :orderNO="selectedOrder"></orderDetail>
        </Modal>
        
      </content>
    </Layout>
  </div>
</template>

<script>
import orderDetail from '../ordermanage/order-detail';
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
  components:{
    orderDetail
  },
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
      cityq: [],
      townq: [],
      xmjlq:[],
      signUserAmount:0,
      ruleValidate: {
        xmjl: [{
          validator: (rule,value,callback)=> {
            if(this.formValidate.projectManager&&this.formValidate.projectManager.length>20){
              return callback(new Error("该字段应少于20个字符"));
            }else{
              callback();
            }
          },trigger : 'change'
        }]
      },
      subjectName,
      showObj:{},
      companys:[],
      projectmen:[],
      contractContentMap,
      fj:[],
      uploadLoading:false,
      selectedOrder:'',
      orderDetailOpen:false
    };
  },
  methods: {
    goOrderDetail(){
      this.selectedOrder = this.data.data.orderNo;
      this.orderDetailOpen = true;
    },
    showPayment(index){
      this.$set(this.showObj,index,!this.showObj[index]);
    },
    handleSubmit(){
      if(this.formValidate.signUserAmount === this.data.data.signUserAmount&&this.formValidate.projectManager === this.data.data.projectManager){
        this.$Message.error('未对原始信息内容进行更改');
        this.$router.push({ path: "/contractmanage/detail"});
        return;
      }
      let request = {
        "typeid": 26005,
        "data": [
            {
              "customerNo":this.data.data.customerNo,
              "account_id":this.$store.state.user.accountId,
              "contractNo": this.data.data.contractNo,
              "signUserCount": this.formValidate.signUserAmount,
              // "saleManName": "李四",
              "saleManName": this.formValidate.projectManager||'',
              // "platFormList": this.data.data.platformuserList
            }
        ]
      };
      let status = true;
      this.$refs['formValidate'].validate(valid => {
        if(!valid){
          this.$Message.error('请按规定编辑相关信息！');
          status = false;
        }
      });
      if(!status) return;
      this.$http.UPDATECONTRACT(request).then(response => {
        //更新记录
        let req = {
          typeid: 26017,
          data: [
            {
              "contractNo": this.data.data.contractNo,
            }
          ]
        }
        this.$http.XLCONTRACT(req).then(response => {
          let data = JSON.parse(JSON.stringify(this.data));
          data.data.signUserAmount = this.formValidate.signUserAmount;
          data.data.projectManager = this.formValidate.projectManager;
          data.data.updateList = response.data.result.data.updateList;
          this.$store.commit('selectedContract',data);
          localStorage.setItem("contractInfo", JSON.stringify(data));
          this.$Message.success('编辑成功！');
          this.$router.push({ path: "/contractmanage/detail"});
          for(var i = 0;i<data.data.updateList.length;i++){
            if(data.data.updateList[i].updateContent == ''){
            data.data.updateList[i].updateContent = "本次未修改"
          }
          }
        })
        
      })
    },
    handleCancel(){
      this.$router.push({ path: "/contractmanage/detail"});
    },
    deleteFj(id){
      let request = {
        "typeid": 26016,
        "data": [
          {
            "enclosureId": id + ','
          }
        ]
      };
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
          this.$http.DELETECONTRACT(request).then(res => {
          this.$Message.success('删除成功！');
          this.getfiles();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    uploadFail(){
      this.uploadLoading = false;
      this.$Message.error('上传失败，请重试！');
    },
    beforeUpload(){
      this.uploadLoading = true;
    },
    getfiles(res){
      this.uploadLoading = false;
      if(res&&res.code !== 0){
        this.uploadFail();
        return;
      }
      let request = {
        typeid: 26015,
        data: [
          {
            contractNo: this.data.data.contractNo||''
          }
        ]
      };
      this.fj = [];
      this.$http.XLCONTRACT(request).then(response => {
        response.data.result.data.fileList.forEach(data => {
          let item = {};
          let arr = data.enclosureAddress.split('/');
          item.wjm = arr[arr.length-1];
          item.fileName = data.fileName;
          item.size = data.fileSize >= 1024?((data.fileSize/1024).toFixed(2) + ' KB'): data.fileSize >= 1024*1024?((data.fileSize/(1024*1024)).toFixed(2) + ' MB'):(data.fileSize + ' B');
          item.where = data.accountName;
          item.time = data.uploadTime;
          item.url = data.enclosureAddress;
          item.data = data;
          let fileArr = item.wjm.split('.');
          let fileType = fileArr[fileArr.length-1];
          item.img = require('../../images/upload/wenjian.png');
          if(/^pdf$/.test(fileType)){
            item.img = require('../../images/upload/pdf.png');
          }else if(/^(txt|doc(x)?)$/.test(fileType)){
            item.img = require('../../images/upload/docx.png');
          }else if(/^(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(fileType)){
            item.img = require('../../images/upload/jpg.png');
          }else if(/^xl(s|t|am)$/.test(fileType)){
            item.img = require('../../images/upload/excel.png');
          };
          item.data = data;
          this.fj.push(item);
        });
      });
    },
    thousandNum(num){
      if(num){
        //将num中的$,去掉，将num变成一个纯粹的数据格式字符串
        num = num.toString().replace(/\$|\,/g,'');
        //如果num不是数字，则将num置0，并返回
        if(''==num || isNaN(num)){return 'Not a Number ! ';}
        //如果num是负数，则获取她的符号
        var sign = num.indexOf("-")> 0 ? '-' : '';
        //如果存在小数点，则获取数字的小数部分
        var cents = num.indexOf(".")> 0 ? num.substr(num.indexOf(".")) : '';
        cents = cents.length>1 ? cents : '' ;//注意：这里如果是使用change方法不断的调用，小数是输入不了的
        //获取数字的整数数部分
        num = num.indexOf(".")>0 ? num.substring(0,(num.indexOf("."))) : num ;
        //如果没有小数点，整数部分不能以0开头
        if('' == cents){ if(num.length>1 && '0' == num.substr(0,1)){return 'Not a Number ! ';}}
        //如果有小数点，且整数的部分的长度大于1，则整数部分不能以0开头
        else{if(num.length>1 && '0' == num.substr(0,1)){return 'Not a Number ! ';}}
        //针对整数部分进行格式化处理，这是此方法的核心，也是稍难理解的一个地方，逆向的来思考或者采用简单的事例来实现就容易多了
        /*
          也可以这样想象，现在有一串数字字符串在你面前，如果让你给他家千分位的逗号的话，你是怎么来思考和操作的?
          字符串长度为0/1/2/3时都不用添加
          字符串长度大于3的时候，从右往左数，有三位字符就加一个逗号，然后继续往前数，直到不到往前数少于三位字符为止
         */
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        {
            num = num.substring(0,num.length-(4*i+3))+','+num.substring(num.length-(4*i+3));
        }
        //将数据（符号、整数部分、小数部分）整体组合返回
        return (sign + num + cents); 
      }
    },
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
    this.getfiles();
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
    },
    postData(){
      let post = {};
      if(this.data&&this.data.data&&this.data.data.contractNo){
        post.contractNo = this.data.data.contractNo;
        post.accountId = this.$store.state.user.accountId;
      }
      return post;
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
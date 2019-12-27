<template>
  <div class="detail">
    <Layout class="layout" style="min-height:800px;">
      <div class="header_top">
        <div class="con-left" @click="goback">
          <Icon type="ios-arrow-left"></Icon>
          <span>返回</span>
        </div>
        <Button type="ghost" size="small" style="float:right;width:80px;" @click="bjbuttClick">编辑</Button>
      </div>
      <header class="header_mid" style="border:none">
        <h2 style="position:relative">
          {{data.customerName}}
          <span
            style="position: relative;top: -15px;left: -2px;display: inline-block;border: 1px solid #54A3F6;font-size: 12px;
            padding: 0 5px;color: #54A3F6;border-radius: 4px;font-weight:100"
          >{{data.contractNature}}</span>
        </h2>
        <p>{{data.contractNo}}</p>
        <div class="ht_img">
          <section>
            <img src="../../images/htgl/当前状态.png" alt />
            <div>
              <span style="color:#e6a23c">{{data.contractStatus}}</span>
              <br />
              <span class="cor_s">当前状态</span>
            </div>
          </section>
          <section>
            <img src="../../images/htgl/开始时间.png" alt />
            <div>
              <span>{{data.data.signTime}}</span>
              <br />
              <span class="cor_s">合同开始时间</span>
            </div>
          </section>
          <section>
            <img src="../../images/htgl/到期时间.png" alt />
            <div>
              <span>{{data.data.dueTime}}</span>
              <br />
              <span class="cor_s">合同到期时间</span>
            </div>
          </section>
          <section>
            <img src="../../images/htgl/暂无.png" alt />
            <div>
              <span>{{data.data.upTime||'暂无'}}</span>
              <br />
              <span class="cor_s">上线时间</span>
            </div>
          </section>
          <section>
            <img src="../../images/htgl/安装点数.png" alt />
            <div>
              <span>{{data.data.installPoint}}</span>
              <br />
              <span class="cor_s">安装点数</span>
            </div>
          </section>
        </div>
      </header>
      <content style="margin-top:30px">
        <Tabs value="name1">
          <TabPane label="签约信息" name="name1">
            <div class="select select_h">
              <section>
                <p>客户名称：</p>
                <p>{{data.data.customerName}}</p>
              </section>
              <section>
                <p>合同主体：</p>
                <p>{{data.data.contractSubjectName}}</p>
              </section>
              <section>
                <p>合同内容：</p>
                <p>{{contractContentMap[data.data.contractContent]}}</p>
              </section>
              <section>
                <p>签约时间：</p>
                <p>{{data.data.signTime}}</p>
              </section>
              <section>
                <p>签约点数：</p>
                <p>
                  <span>{{kcmxSum}}</span>(
                  <span class="cor_span" @click="kcmxmodal = true">查看勘查明细</span>)
                </p>
              </section>
            </div>
            <div class="select select_h">
              <section>
                <p>运营公司：</p>
                <p>{{data.manageCompany}}</p>
              </section>
              <section>
                <p>省份/城市：</p>
                <p>{{data.city}}</p>
              </section>
              <section>
                <p>合同年限：</p>
                <p>{{data.data.contractYears}}年</p>
              </section>
              <section>
                <p>赠送服务时间：</p>
                <p>{{data.data.giftTime}}个月</p>
              </section>
              <section>
                <p>合同总费用：</p>
                <p>{{thousandNum(data.data.contractAmount)}}元人民币</p>
              </section>
            </div>
            <div class="select select_h">
              <section>
                <p>签约用户数：</p>
                <p>{{data.data.signUserAmount}}</p>
              </section>
              <section>
                <p>销售人员：</p>
                <p>{{data.saleName}}</p>
              </section>
              <section>
                <p>销售方式：</p>
                <p>{{data.saleType}}</p>
              </section>
              <section>
                <p>项目经理：</p>
                <p>{{data.data.projectManager}}</p>
              </section>
              <section>
                <p>付款周期：</p>
                <p>{{data.data.paymentCycle||''}}</p>
              </section>
            </div>
            <div class="select select_h">
              <section>
                <p>关联平台账户</p>
                <span
                  class="bg_p"
                  v-for="(item,index) in data.data.platformuserList"
                  :key="index"
                  style="margin:5px"
                >({{item.platform_id}}){{item.platform_name}}</span>
              </section>
              <section>
                <p>实施地点</p>
                <p>{{data.data.implementation}}</p>
              </section>
              <section>
                <p>合同类型</p>
                <p>{{data.contractType}}</p>
              </section>
              <section>
                <p>联系人及电话：</p>
                <p>{{data.data.contractInfo}}</p>
              </section>
              <section>
                <p>归档时间：</p>
                <p>{{data.archiveTime}}</p>
              </section>
            </div>
          </TabPane>
          <TabPane label="财务信息" name="name2">
            <p class="det_p">
              <span class="det_span">
                合同总金额
                <span style="color:#000000;">{{thousandNum(data.data.contractAmount)}}</span>元
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
                    <span class="zq_c">账期{{index+1}}（付{{(data.data.paymentCycle||'').split('+')[index]}}年费用）</span>
                  </p>
                  <p style="margin-left:10px;">
                    <span>
                      <Icon type="ios-calendar-outline"></Icon>
                    </span>
                    <span>{{item.paymentTime}}<span style="margin:0 15px;">-</span>{{item.dueTime}}</span>
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
                    <p
                      class="cor_span"
                      style="margin-right:10px"
                      v-if="item.currentTicketAmount>0"
                    >{{thousandNum(item.currentTicketAmount)||0}}</p>
                    <!-- <p class="cor_span">
                      <Button size="small" @click="fpmodal = true" v-if="item.ticketButton">开发票</Button>
                    </p> -->
                  </div>
                </section>
              </div>
              <div class="zq_div2" v-show="showObj[index]&&item.paybackList.length>0">
                <section class="zq_se2" style="word-spacing:-5px">
                  <div style="width:30%">ID</div>
                  <div style="width:17%">付款方式</div>
                  <div style="width:17%">支付时间</div>
                  <div style="width:17%">确认时间</div>
                  <div style="width:17%">支付金额（元）</div>
                </section>
                <div v-for="(p,i) in item.paybackList" :key="i" class="payList">
                  <section style="word-spacing:-5px;">
                    <div style="width:30%">{{p.paybackId}}</div>
                    <div style="width:17%">{{paybackWayMap[p.paybackWay]}}</div>
                    <div style="width:17%">{{p.paybackTime}}</div>
                    <div style="width:17%">{{p.paybackSureTime}}</div>
                    <div style="width:17%">{{thousandNum(p.paybackAmount)}}</div>
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
            <p class="con-left">共 {{fj.length||0}} 个附件</p>
            <p class="fj_add" v-if="this.$store.state.app.authority.find(a => a.id === 802)">
              <Upload action="/public/api/xlcontract/uploadFile" :show-upload-list="false" :before-upload="beforeUpload" :data="postData" :headers="{user:'x',key:'x'}" :on-success="getfiles" :on-error="uploadFail">
                <Icon type="plus"></Icon>添加附件
                <p v-if="uploadLoading">上传中....</p>
              </Upload>
            </p>
            <div style="clear:both">
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
              </div>
            </div>
          </TabPane>
          <TabPane label="更新记录" name="name5" v-if="!isCooperative">
            <Table ref="currentRowTable" :columns="update_columns" :data="data.data.updateList"></Table>
          </TabPane>
        </Tabs>
      </content>
    </Layout>
    <!-- 查看勘察明细弹框 -->
    <Modal v-model="kcmxmodal" width="800" class="close_unable">
      <p style="margin:5px 0 10px 0;font-size:18px">勘察明细</p>
      <p style="font-size:16px;margin:20px 5px;">设备清单</p>
      <Table :columns="kcmx_columns" :data="kcmx_data"></Table>
      <p style="font-size:16px;margin:20px 5px;">采集点位数量</p>
      <p class="kc_p">
        采集点位数量（含基站）
        <span style>{{kcmxSum}}</span>
      </p>
    </Modal>
    <!-- 发票 -->
    <Modal v-model="fpmodal" width="800">
      <footer style="font-size:14px">
        <p class="header_p head">开票信息</p>
        <p class="header_p1">请选择发票类型：</p>
        <RadioGroup v-model="ticketType" style="margin:0px 0px 30px 20px;"  @on-change="radioClick"> 
          <Radio label="ordinary">
            <span class="ord">普通发票</span>
          </Radio>
          <Radio label="increment">
            <span class="inc">增值税专票</span>
          </Radio>
        </RadioGroup>
        <p class="header_p1">请选择需要执行的开票信息：</p>
        <div v-if="kpxxLength">未查询到开票信息</div>
        <div class="kpxx" v-for="(kpxx,index) in kpxx" :key="index" style="margin-bottom:20px;">
          <Checkbox style="margin-left:10px;margin-top:5px" v-model="checkbox[index]"></Checkbox>
          <div class="kpxx_head">
            <p>{{kpxx.mc}}</p>
            <p>{{kpxx.sh}}</p>
            <p
              style="width:20%;float:right"
              class="headP"
              @click="shrinkClick(index)"
              v-show="sqShow"
            >
              <span>收起</span>
              <span>
                <Icon type="ios-arrow-up"></Icon>
              </span>
            </p>
            <p
              style="width:20%;float:right"
              class="headP"
              @click="shrinkClick(index)"
              v-show="zkShow"
            >
              <span>展开</span>
              <span>
                <Icon type="ios-arrow-down"></Icon>
              </span>
            </p>
          </div>
          <div class="kpxx_con" v-show="kpxx.zt">
            <div class="kpxx_sec">
              <section>
                <p>客户名称：</p>
                <p>{{kpxx.mc}}</p>
              </section>
              <section>
                <p>税号：</p>
                <p>{{kpxx.sh}}</p>
              </section>
              <section>
                <p>电话：</p>
                <p>{{kpxx.dh}}</p>
              </section>
            </div>
            <div class="kpxx_sec">
              <section>
                <p>开户银行：</p>
                <p>{{kpxx.khyh}}</p>
              </section>
              <section>
                <p>银行账户：</p>
                <p>{{kpxx.yhzh}}</p>
              </section>
              <section>
                <p>开票地址：</p>
                <p>{{kpxx.kpdz}}</p>
              </section>
            </div>
            <div class="kpxx_sec">
              <section>
                <p>邮寄信息：</p>
                <p>{{kpxx.yjdz}}</p>
                <p>
                  <span class="kpxx_span">{{kpxx.rjdh}}</span>
                </p>
              </section>
            </div>
            <div style="clear:both"></div>
          </div>
        </div>
        <span>发票金额（元）：</span>
    <div class="acc_div">
      <section class="acc_sec" @click="accountClick"><span>10000</span><Icon type="chevron-down" v-if="this.selectAccountShow == false" style="float:right;padding:3px;"></Icon><Icon v-if="this.selectAccountShow == true" type="chevron-up" style="float:right;padding:3px;"></Icon></section>
      <div  class="acc_div1" v-show="selectAccountShow">
      <section v-for="item in account" style="margin-bottom:5px;">
        <Checkbox v-model="item.single"></Checkbox><span>{{item.zq}}</span></span>&#x3000;&#x3000;&#x3000;
               <span>实付：<span>{{item.money}}</span></span>
      </section>
      </div>
    </div>
      </footer>
    </Modal>
    <Modal v-model="orderDetailOpen" width="1000">
        <orderDetail :orderNO="selectedOrder"></orderDetail>
      </Modal>
  </div>
</template>

<script>
import orderDetail from '../ordermanage/order-detail';
export default {
  name: "detail",
  components:{
    orderDetail
  },
  data() {
    return {
      account:[{
        zq:"账期1",
        money:"123",
        single:false
      },
      {
        zq:"账期2",
        money:"6663",
        single:false
      }],
      single:false,
      ticketType:"",
      subjectName:this.$option.contract.subjectNameMap,
      paybackWayMap: this.$option.contract.paybackWayMap,
      zq: {
      },
      fj: [],
      update_columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "更新时间",
          key: "updateTime",
          align: "center"
        },
        {
          title: "更新者",
          key: "accountName",
          align: "center"
        },
        {
          title: "更新内容",
          key: "updateContent",
          align: "center"
        }
      ],
      kcmx_columns: [
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
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
          title: "主计量",
          key: "zjl",
          align: "center"
        },
        {
          title: "数量",
          key: "num",
          align: "center"
        }
      ],
      kcmx_data: [
      ],
      kpxx: [],
      fjIndex: "4",
      htzje: "32324324",
      syks: "43242",
      kcmxmodal: false,
      fpmodal: false,
      cjdwsl: "78",
      sqShow: false,
      zkShow: true,
      showObj: {},
      checkbox: [],
      contractContentMap:this.$option.contract.contentMap,
      orderDetailOpen: false,
      selectedOrder: '',
      selectAccountShow:false,
      uploadLoading:false
    };
  },
  methods: {
    goback() {
      // this.$router.go(-1);
      this.$router.push({
        path:'/contractmanage'
      })    
    },
    accountClick(){
      this.selectAccountShow = !this.selectAccountShow
    },
    shrinkClick(index) {
      this.kpxx[index].zt = !this.kpxx[index].zt;
      this.sqShow = !this.zkShow;
    },
    instance(type) {
      const title = "提示";
      const content =
        "<p>客户档案开票信息不完整，请先完善客户档案开票信息再试！</p>";
      switch (type) {
        case "info":
          this.$Modal.info({
            title: title,
            content: content
          });
          break;
      }
    },
    bjbuttClick() {
      if(!this.$store.state.app.authority.find(a => a.id === 802)){
        this.$Message.error('权限不足！');
        return;
      }
      this.$router.push({
        path: "/contractmanage/edit",
        query: {
          paymentList: this.paymentList,
          remainingMoney: this.remainingMoney,
          fj:this.fj
        }
      });
    },
    showPayment(index) {
      this.$set(this.showObj, index, !this.showObj[index]);
    },
    goOrderDetail() {
      this.selectedOrder = this.data.data.orderNo;
      this.orderDetailOpen = true;
    },
    getkcmx() {
      let request = {
        typeid: 26008,
        data: [
          {
            contractNo: this.data.data.contractNo
          }
        ]
      };
      this.kcmx_data = [];
      this.$http.XLCONTRACT(request).then(response => {
        response.data.result.data.productList.forEach((data, index) => {
          let item = {};
          item.chbm = data.productCode;
          item.chmc = data.productName;
          item.ggxh = data.productModel;
          item.zjl = data.unit;
          item.num = data.count;
          item.index = index + 1;
          this.kcmx_data.push(item);
        });
      });
    },
    getTicket() {
      let request = {
        typeid: 26009,
        data: [
          {
            customerNo: this.data.data.customerNo || ""
          }
        ]
      };
      this.kpxx = [];
      this.$http.XLCONTRACT(request).then(response => {
        response.data.result.data.customerTicketList.forEach(data => {
          let item = {};
          item.mc = data.customerName;
          item.dh = data.phone;
          item.sh = data.dutyParagraph;
          item.khyh = data.bankName;
          item.yhzh = data.bankAccount;
          item.kpdz = data.ticketAddress;
          item.yjdz = data.postInfo;
          item.rjdh = data.ticketContacts;
          item.zt = false;
          this.kpxx.push(item);
        });
      });
    },
    radioClick(val){
     if(val == "ordinary"){
       $(".ord").css({"color":"#4a9af5"})
       $(".inc").css({"color":"#000000"})
     }else{
       $(".inc").css({"color":"#4a9af5"})
       $(".ord").css({"color":"#000000"})
     }
    },
    getfiles(res){
      if(res&&res.code !== 0){
        this.uploadFail();
        return;
      }
      this.uploadLoading = false;
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
    uploadFail(){
      this.uploadLoading = false;
      this.$Message.error('上传失败，请重试！');
    },
    getHref(url){
      return url;
    },
    beforeUpload(){
      this.uploadLoading = true;
    }
  },
  beforeCreate() {
    if (
      Object.keys(JSON.parse(localStorage.getItem("contractInfo")) || {})
        .length === 0
    )
      this.$router.push({ path: "/contractmanage/contractmanage" });
  },
  mounted() {
    this.getkcmx();
    this.getTicket();
    this.getfiles();
  },
  watch: {
    fpmodal(nv) {
      if (nv) this.getTicket();
    },
    $route(){
      this.getkcmx();
      this.getTicket();
      this.getfiles();
    }
  },
  computed: {
    data() {
      if (Object.keys(this.$store.state.user.contractInfo).length > 0) {
        return this.$store.state.user.contractInfo;
      }
      return JSON.parse(localStorage.getItem("contractInfo")) || {};
    },
    kcmxSum() {
      let sum = 0;
      if (this.kcmx_data && this.kcmx_data.length > 0) {
        this.kcmx_data.forEach(data => {
          sum += data.num;
        });
      }
      return sum;
    },
    paymentList() {
      let list = [];
      if (
        this.data &&
        this.data.data &&
        this.data.data.paymentList &&
        this.data.data.paymentList.length > 0
      ) {
        this.data.data.paymentList.forEach((p, index) => {
          let item = {};
          item.dueTime = p.dueTime;
          item.paymentAmount = Number(p.paymentAmount);
          item.paymentId = p.paymentId;
          item.paymentStatus = p.paymentStatus;
          item.paymentTime = p.paymentTime;
          item.paymentWay = p.paymentWay;
          item.currentAmount = 0;
          //计算回款信息
          let allAmount = 0;
          let backAmount = 0;
          let payIndex = "";
          let payEndIndex = "";
          let computeAmountStart = "";
          let computeAmountEnd = "";
          for (let i = 1; i <= index; i++) {
            backAmount +=
              this.data.data.paymentList[index - 1].paymentAmount || 0;
          }
          if (
            this.data.data.paybackList &&
            this.data.data.paybackList.length > 0
          ) {
            this.data.data.paybackList.forEach((b, i) => {
              allAmount += Number(b.paybackAmount);
              if (allAmount > backAmount && payIndex === "") {
                payIndex = i;
                computeAmountStart =
                  allAmount - backAmount - item.paymentAmount > 0
                    ? item.paymentAmount
                    : allAmount - backAmount;
              }
              if (
                allAmount - backAmount - item.paymentAmount >= 0 &&
                payEndIndex === ""
              ) {
                payEndIndex = i;
                computeAmountEnd =
                  Number(b.paybackAmount) -
                    item.paymentAmount +
                    (allAmount - Number(b.paybackAmount) - backAmount) >
                  0
                    ? item.paymentAmount -
                      (allAmount - Number(b.paybackAmount) - backAmount)
                    : Number(b.paybackAmount);
              }
            });
            if (payEndIndex === "")
              payEndIndex = this.data.data.paybackList.length - 1;
          }
          if (allAmount - backAmount > 0) {
            item.currentAmount =
              allAmount - backAmount - item.paymentAmount > 0
                ? item.paymentAmount
                : allAmount - backAmount > 0
                ? allAmount - backAmount
                : 0;
          }
          if (payIndex === "") {
            item.paybackList = [];
          } else {
            item.paybackList = JSON.parse(
              JSON.stringify(
                (this.data.data.paybackList || []).filter(
                  (a, i) => i >= payIndex && i <= payEndIndex
                )
              )
            );
          }
          (item.paybackList[0] || {}).paybackAmount = computeAmountStart;
          if (item.paybackList.length > 1 && computeAmountEnd !== "")
            (
              item.paybackList[item.paybackList.length - 1] || {}
            ).paybackAmount = computeAmountEnd;
          //计算发票信息
          let allTicketAmount = 0;
          if (
            this.data.data.ticketList &&
            this.data.data.ticketList.length > 0
          ) {
            this.data.data.ticketList.forEach(t => {
              allTicketAmount += Number(t.ticketAmount);
            });
          }
          let ticketAmount = 0;
          for (let i = 0; i < index; i++) {
            ticketAmount +=
              this.data.data.paymentList[index].currentTicketAmount || 0;
          }
          if (allTicketAmount - ticketAmount > 0) {
            item.currentTicketAmount =
              allTicketAmount - ticketAmount - item.paymentAmount > 0
                ? item.paymentAmount
                : allTicketAmount - ticketAmount > 0
                ? allTicketAmount - ticketAmount
                : 0;
          }
          item.ticketButton = item.currentTicketAmount !== item.paymentAmount;
          list.push(item);
          this.$set(this.showObj, index, false);
        });
      }
      return list;
    },
    remainingMoney() {
      let m = 0;
      let payment = 0;
      let payback = 0;
      if (
        this.data &&
        this.data.data &&
        this.data.data.paymentList &&
        this.data.data.paymentList.length > 0
      ) {
        this.data.data.paymentList.forEach(p => {
          payment += p.paymentAmount;
        });
      }
      if (
        this.data &&
        this.data.data &&
        this.data.data.paybackList &&
        this.data.data.paybackList.length > 0
      ) {
        this.data.data.paybackList.forEach(p => {
          payback += p.paybackAmount;
        });
      }
      m = payment - payback > 0 ? payment - payback : 0;
      return m;
    },
    kpxxLength() {
      return this.kpxx.length === 0;
    },
    postData(){
      let post = {};
      if(this.data&&this.data.data&&this.data.data.contractNo){
        post.contractNo = this.data.data.contractNo;
        post.accountId = this.$store.state.user.accountId;
      }
      return post;
    },
    isFinance(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '财务');
      }
    },
    isCooperative(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '合作伙伴');
      }
    }
  }
};
</script>

<style>
@import "../assetmanagement/assetmanage.css";
@import "../customermanage/customer.css";
@import "./contract.css";
.cc .ivu-btn{
  background: white;
  color:orange;
  width:200px;
  text-align:left
}
.close_unable .ivu-modal-footer{
  display: none;
}
</style>
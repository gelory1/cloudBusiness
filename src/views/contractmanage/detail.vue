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
              <span>{{data.data.upTime}}</span>
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
                <p>{{subjectName[data.data.contractSubject]}}</p>
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
                  <span>{{data.data.signPoint}}</span>(
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
                <p>{{data.data.contractAmount}}元人民币</p>
              </section>
            </div>
            <div class="select select_h">
              <section>
                <p>签约用户数：</p>
                <p>{{data.data.signUserAmount}}</p>
              </section>
              <section>
                <p>销售人员：</p>
                <p>{{data.saleManName}}</p>
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
                <p>{{data.data.paymentCycle}}期</p>
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
                    <p
                      class="cor_span"
                      style="margin-right:10px"
                      v-if="item.currentTicketAmount>0"
                    >{{item.currentTicketAmount}}</p>
                    <p class="cor_span">
                      <Button size="small" @click="fpmodal = true" v-if="item.ticketButton">开发票</Button>
                    </p>
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
            <p class="con-left">共 {{fj.length||0}} 个附件</p>
            <p class="fj_add">
              <Upload action="/public/api/xlcontract/uploadFile" :data="postData" show-upload-list @on-success="getfiles" @on-error="$Message.error('上传失败，请重试！')" @on-preview="goFileDetail">
                <Icon type="plus"></Icon>添加附件
              </Upload>
            </p>
            <div style="clear:both">
              <div v-for="(item,index) in fj" :key="index" class="fj">
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
          </TabPane>
          <TabPane label="更新记录" name="name5">
            <Table ref="currentRowTable" :columns="update_columns" :data="data.data.updateList"></Table>
          </TabPane>
        </Tabs>
      </content>
    </Layout>
    <!-- 查看勘察明细弹框 -->
    <Modal v-model="kcmxmodal" width="800">
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
      </footer>
    </Modal>
    <Modal v-model="orderDetailOpen" width="1000">
        <orderDetail :orderNO="selectedOrder"></orderDetail>
      </Modal>
  </div>
</template>

<script>
import orderDetail from '../ordermanage/order-detail';
const subjectName = {
  1: "电能云",
  2: "智慧能源",
  3: "维智泰",
  4: "耀邦达",
  5: "股份公司",
  6: "志达",
  7: "康源",
  8: "新联能源",
  100: "其他"
};
const contractContentMap = {
  1: "配用电",
  2: "环保设施智能监测系统",
  3: "中央空调",
  4: "油烟监测",
  5: "工地扬尘",
  6: "园区抄表",
  7: "综合能源",
  100: "其他"
};
export default {
  name: "detail",
  components:{
    orderDetail
  },
  data() {
    return {
      subjectName,
      zq: {
        time: "54654-56464",
        bqyf: "3242",
        bqsf: "3424",
        ykp: "1323",
        ID: "432424234",
        zfsj: "2333-98",
        qrsj: "342-44",
        zfje: "342"
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
          align: "center",
        },
        {
          title: "更新者",
          key: "accountName",
          align: "center",
        },
        {
          title: "更新内容",
          key: "updateContent",
          align: "center",
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
        {
          chbm: "214-343",
          chmc: "343",
          ggxh: "44",
          zjl: "个",
          num: "233"
        }
      ],
      kpxx: [],
      fjIndex: "4",
      htzje: "32324324",
      syks: "43242",
      kcmxmodal: false,
      fpmodal: false,
      cjdwsl: "78",
      zqShow: true,
      sqShow: false,
      zkShow: true,
      showObj: {},
      checkbox: [],
      contractContentMap,
      orderDetailOpen: false,
      selectedOrder: ''
    };
  },
  methods: {
    goback() {
      this.$router.go(-1);
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
      this.$router.push({
        path: "/contractmanage/edit",
        query: {
          paymentList: this.paymentList,
          remainingMoney: this.remainingMoney
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
            customerNo: this.data.data.customerNo||''
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
    getfiles(){
      let request = {
        typeid: 26015,
        data: [
          {
            customerNo: this.data.data.customerNo||''
          }
        ]
      };
      this.fj = [];
      this.$http.XLCONTRACT(request).then(response => {
        response.data.result.data.fileList.forEach(data => {
          let item = {};
          // item.wjm = data.customerName;
          // item.size = data.phone;
          // item.where = data.dutyParagraph;
          // item.time = data.bankName;
          this.fj.push(item);
        });
      });
    },
    goFileDetail(file){
      console.log(file.response);
    }
  },
  beforeCreate() {
    if (Object.keys(JSON.parse(localStorage.getItem('contractInfo'))||{}).length === 0)
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
    }
  },
  computed: {
    data() {
      if(Object.keys(this.$store.state.user.contractInfo).length>0){
        return this.$store.state.user.contractInfo;
      }
      return JSON.parse(localStorage.getItem('contractInfo'))||{};
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
            backAmount += this.data.data.paymentList[index -1].paymentAmount || 0;
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
                  Number(b.paybackAmount)  - item.paymentAmount + (allAmount - Number(b.paybackAmount) - backAmount) > 0
                    ? item.paymentAmount - (allAmount - Number(b.paybackAmount) - backAmount)
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
          if(payIndex === ''){
            item.paybackList = [];
          }else{
            item.paybackList = JSON.parse(JSON.stringify((this.data.data.paybackList || []).filter(
              (a, i) => i >= payIndex && i <= payEndIndex
            )));
          }
          (item.paybackList[0]||{}).paybackAmount = computeAmountStart;
          if(item.paybackList.length >1&&computeAmountEnd!=='') (item.paybackList[
            item.paybackList.length - 1
          ]||{}).paybackAmount = computeAmountEnd;
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
      }
      return post;
    }
  }
};
</script>

<style>
@import "../assetmanagement/assetmanage.css";
@import "../customermanage/customer.css";
@import "./contract.css";
</style>
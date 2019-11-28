<template>
  <div class="workbench">
    <layout class="layout">
      <div>
        <div class="gz_left left bor" style="min-height:800px;">
          <Input icon="ios-search" placeholder="请输入。。。。" class="gz_input"></Input>
          <Tabs value="name1" v-model="tabName" >
            <TabPane label="待办工作" name="name1">
              <Table
                :columns="gz_columns"
                :data="gz_data"
                @on-selection-change="gzselClick"
              ></Table>
            </TabPane>
            <TabPane label="已办工作" name="name2">
              <Table
                :columns="yb_columns"
                :data="yb_data"
                @on-selection-change="gzselClick"
              ></Table>
            </TabPane>
            <TabPane label="我发起的" name="name3">
              <Table :columns="fq_columns" :data="fq_data"></Table>
            </TabPane>
          </Tabs>
          <p class="gzadd" @click="newgzClick">
            <img src="../../images/workbench/add.png" alt />
          </p>
        </div>
        <div class="gz_right right">
          <div class="left gz_rig bor">
            <Select v-model="bhlmodel" size="small" style="width:100px">
                <Option value="by">本月备货量</Option>
                <Option value="sgy">上个月备货量</Option>
            </Select>
            <p class="bh_p"><big>3000</big><i> 台</i><span>&#x3000;+<b>10.5%</b></span></p>
          </div>
          <div class="right gz_rig bor">
            <Select v-model="kclmodel" size="small" style="width:100px">
                <Option value="bd">本地库存量</Option>
                <Option value="ck">仓库库存量</Option>
            </Select>
            <p class="bh_p"><big>3000</big><i> 台</i></p>
          </div>
          <div style="clear: both;">
          </div>
          <div class="gz_div bor" style="height:340px">
            <Select v-model="zzmodel" size="small" style="width:150px">
                <Option value="sy">上月订单追踪</Option>
                <Option value="sgy">近3个月订单追踪</Option>
            </Select>
            <highchartsRing></highchartsRing>
          </div>
          <div class="gz_div bor" style="height:340px">
            <Select v-model="yxmodel" size="small" style="width:150px">
                <Option value="ndyx">年度有效用户</Option>
                <Option value="ndyx1">.....</Option>
            </Select>
            <highchartsLine></highchartsLine>
          </div>
        </div>
      </div>
    </layout>
    <!-- 支付方式弹框 -->
    <Modal v-model="zfmodal" class="aa">
      <p class="zf_p">支付</p>
      <p class="zf_p1">请选择支付方式：</p>
      <div class="zffs" @click="selectedPayStyle">
        <div class="zf_img" index="0" :style="{borderColor:borderColor[0]}">
          <img index="0" src="../../images/workbench/zfb.png" alt />
        </div>
        <div class="zf_img" index="1" :style="{borderColor:borderColor[1]}">
          <img index="1" src="../../images/workbench/wx.png" alt />
        </div>
        <div class="zf_img" index="2" :style="{borderColor:borderColor[2]}">
          <img index="2" src="../../images/workbench/xx.png" alt />
        </div>
      </div>
      <Button class="zf_butt" type="primary" @click="nextzfClick" :disabled="disabled">下一步</Button>
      
    </Modal>
    </Modal>
    <!-- 支付确认-单条/多条 -->
    <Modal v-model="zfqrmodal" class="aa">
      <p class="zf_p" v-show="dtzfShow">支付-确认</p>
      <p class="zf_p" v-show="morezfShow">支付-确认(批量操作)</p>
      <div class="zf_div">
        <p>
          <Icon type="ios-information-outline"></Icon>
          <span>正在使用线下支付，请确认支付金额后点击【确认已支付】</span>
        </p>
        <p>
          <span class="marl">收款方：</span>
          <span>{{zf.skf}}</span>
          <span class="zf_sk">
            应付
            <b>{{zf.yf}}</b>元
          </span>
        </p>
        <!-- --------------------单条展示 --------------------->
        <section v-show="dtzfShow">
          <p>
            <span class="marl">
              合同编号：
              <span class="underline">{{zf.htbh}}</span>
            </span>
          </p>
          <p>
            <span class="marl">对应账期：</span>
            <span>{{zf.dyzq}}</span>
          </p>
        </section>
        <!---------------------- 多条展示 ---------------------->
        <section v-show="morezfShow">
          <p class="marl">多个合同：</p>
          <div class="dg_div">
            <p>
              <span>合同编号</span>
              <span>账期</span>
              <span>应付</span>
            </p>
            <p v-for="item in morezf">
              <span class="underline">{{item.htbh}}</span>
              <span>{{item.dyzq}}</span>
              <span>{{item.yf}}</span>
            </p>
          </div>
        </section>
      </div>
      <Upload multiple type="drag" action="//jsonplaceholder.typicode.com/posts/" class="upload">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>上传付款凭证</p>
          <p>(格式：JPG、PNG、JPEG)</p>
        </div>
      </Upload>
      <Button class="zf_butt" type="primary" @click="sureClick">确认已支付</Button>
    </Modal>
    <!-- 新建工作待办 -->
    <Modal v-model="newgzmodal" class="aa" width="800">
      <p class="zf_p">新建工作待办</p>
      <Form :model="newgzForm" :rules="newgzRules" :label-width="90">
        <FormItem label="任务类型" prop="rwlx">
          <Select v-model="newgzForm.rwlx" placeholder class="col-v">
            <Option :value="item.index" v-for="(item,index) in rwlxs" :key="index">{{item.val}}</Option>
          </Select>
        </FormItem>
        <FormItem label="任务内容" prop="rwnr">
          <button class="but_change" @click="addcolClick">添加行</button>
          <button class="but_change">批量导入</button>
          <Table :columns="add_columns" :data="add_data" class="gztable"></Table>
        </FormItem>
        <FormItem label="负责人" prop="fzr">
          <Select v-model="newgzForm.fzr" placeholder="请选择(默认不选为认领模式)" class="col-v">
            <Option value="item" v-for="(item,index) in fzr" :key="index">{{item.val}}</Option>
          </Select>
        </FormItem>
        <FormItem label="要求完成时间">
          <DatePicker type="date" placeholder v-model="newgzForm.wcsj" class="col-v"></DatePicker>
        </FormItem>
        <Button class="zf_butt" type="primary" style="margin-left:320px;" @click="addWork">完成</Button>
      </Form>
    </Modal>
    <!-- 回款核准 -->
    <Modal v-model="hkhzmodal" class="aa" width="1000" :style="{top:5 +'px'}">
      <p class="zf_p">回款核准</p>
      <div>
        <header class="zf_div zf_head">
          <p>
            <Icon type="ios-information-outline"></Icon>
            <span>请选择 合同 > 账期实付 与收款金额关联</span>
          </p>
          <p>
            <span class="marl">付款方：</span>
            <span>{{hkhz.skf}}</span>
            <span class="zf_sk">
              <b>{{hkhz.yf}}</b>元
            </span>
          </p>
          <p class="hk_span">
            <span>
              到款时间：
              <span>{{hkhz.dksj}}</span>
            </span>
          </p>
        </header>
        <section class="hk_s">
          <div class="hk_d">
            <Input icon="ios-search" placeholder="请输入内容" style="width: 200px;"></Input>
            <span class="cor">
              <Icon type="ios-list" />
              <span>过滤</span>
            </span>
          </div>
        </section>
        <section>
          <div class="hz1">
            <Table :row-class-name="rowClassName" :columns="hz1_columns" :data="hz1_data" @on-row-click="hz1Click" height="400"></Table>
            <Page
              :total="sum"
              :page-size="10"
              @on-change="getRebackAppr"
              size="small"
              show-elevator
              style="text-align:center;margin-top:20px;"
            ></Page>
          </div>
          <div class="hz2"><Table :row-class-name="rowClassName1" :columns="hz2_columns" :data="hz2_data" @on-row-click="hz2Click"></Table></div>
        </section>
      </div>
      <Button class="zf_butt" type="primary" style="margin-left:450px;" @click="surehrClick">确认核入</Button>
    </Modal>
    <!-- 财务-到款确认 -->
    <Modal v-model="dkqrmodal" class="aa">
      <p class="zf_p">到款确认</p>
      <div class="hk">
        <div class="hk_div">
          <img src="../../images/workbench/rmb.png" alt />
          <p>
            <b class="b">{{ensurePayBack.payAmount}}</b>
            <span style="color:#2e8ff4">元</span>
          </p>
        </div>
        <div class="kh_div">
          <p>
            <span>客户名称：</span>
            <i>{{ensurePayBack.payUnitName}}</i>
          </p>
          <p>
            <span>当前状态：</span>
            <i>{{typeMap[ensurePayBack.workBenchType]}}</i>
          </p>
          <p>
            <span>合同编号：</span>
            <i>{{ensurePayBack.contractNo}}</i>
          </p>
          <p>
            <span>对应账期：</span>
            <i style="font-weight:bold">{{ensurePayBack.paymentPeriod}}</i>
          </p>
          <p>
            <span>交易人员：</span>
            <i>{{ensurePayBack.trader}}</i>
          </p>
          <p>
            <span>交易时间：</span>
            <i>{{ensurePayBack.transactionTime}}</i>
          </p>
          <p>
            <span>付款凭证：</span>
            <img src alt class="fk_img" />
          </p>
        </div>
      </div>
      <RadioGroup v-model="sfdz" vertical class="radio" @on-change="radioClick">
        <Radio label="ydz">
          <span class="green">已在财务系统核准，确认已到账</span>
        </Radio>
        <Radio label="wdz">
          <span class="red">已在财务系统核准，款未到帐</span>
        </Radio>
      </RadioGroup>
      <Button class="kh_but" type="primary" @click="ensurePayBackSub">提交</Button>
    </Modal>
  </div>
</template>

<script>
import highchartsRing from './highcharts-ring.vue'
import highchartsLine from './highcharts-line.vue'
import { error } from 'highcharts'

const typeMap = {
  1:' 审批提醒',
  2:' 签署提醒',
  3:'支付提醒',
  4:'（财务）到款确认',
  5:'下单提醒',
  6:'发货提醒',
  7:'收货提醒',
  8:'上线审批',
  9:'上线通知',
  10: '回款核准',
  11: '开票提醒',
}
const rwlxs = [
  {
    val: '审批提醒',
    index: 1
  },
  {
    val: '签署提醒',
    index: 2
  },
  {
    val: '支付提醒',
    index: 3
  },
  {
    val: '（财务）到款确认',
    index: 4
  },
  {
    val: '下单提醒',
    index: 5
  },
  {
    val: '发货提醒',
    index: 6
  },
  {
    val: '收货提醒',
    index: 7
  },
  {
    val: '上线审批',
    index: 8
  },
  {
    val: '上线通知',
    index: 9
  },
  {
    val: '回款核准',
    index: 10
  },
  {
    val: '开票提醒',
    index: 11
  },
]
const statusMap = {
  1:'待办',
  2:'已办'
}
const yb_columns = [
  {
    title: "工作内容",
    key: "gznr",
  },
  {
    title: "类型",
    key: "type",
    width: '100',
    align: 'center'
  },
  {
    title: "负责人",
    key: "fzr",
    width: '100',
    align: 'center'
  },
  {
    title: "日期",
    key: "duetime",
    width: '150',
    align: 'center'
  }
];
export default {
  name: "work-bench",
  components:{
    highchartsRing,
    highchartsLine,
  },
  data() {
    return {
      typeMap,
      statusMap,
      rwlxs,
      newgzForm: {
        rwlx: "",
        fzr: "",
        wcsj: ""
      },
      fzr: [
      ],
      gz_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "工作内容",
          key: "gznr",
          render: (h, params) => {
              return h('div', [
                  h('a', {
                      props: {
                          href: '',
                      },
                      on: {
                          click: () => {
                              this.dbgzTableClick(params);
                              if(params.row.data.workBenchType === 3){
                                this.gz_data[params.index]._checked = true;
                                // this.gzselClick([params.row]);
                                this.checkedData = [params.row]; //暂时只能一条一条支付
                                this.checkIndex = this.checkedData.length;
                              }
                            }
                        }
                  },params.row.gznr)
              ]);
          }
        },
        {
          title: "类型",
          key: "type",
          width: '100',
          align: 'center'
        },
        {
          title: "负责人",
          key: "fzr",
          width: '100',
          align: 'center'
        },
        {
          title: "截至日期",
          key: "jztime",
          width: '100',
          align: 'center'
        }
      ],
      yb_columns,
      gz_data: [
        ],
      fq_columns: [
        {
          title: "工作内容",
          key: "gznr"
        },
        {
          title: "类型",
          key: "type",
          width: '100',
          align: 'center'
        },
        {
          title: "负责人",
          key: "fzr",
          width: '100',
          align: 'center'
        },
        {
          title: "状态",
          key: "zt",
          width: '100',
          align: 'center',
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: params.row.zt === 2?"#898A8D":"orange",
                    marginLeft: "-10px"
                  }
                },
                this.statusMap[params.row.zt]
              )
            ]);
          }
        }
      ],
      fq_data: [
      ],
      add_columns: [
        {
          title: "到款时间",
          key: "dksj",
          render: (h, params) => {
              return h('div', [
                  h('datePicker', {
                      props: {
                          "value": params.row.dksj,
                      },
                      on:{
                        'on-change': (value) => {
                          this.add.dksj = value;
                          this.add_data_save[params.index].dksj = value;
                        }
                      }
                  }),
              ]);
          }
        },
        {
          title: "金额（元）",
          key: "je",
          render: (h, params) => {
              return h('Input', {
                      props: {
                          "placeholder":"请输入......",
                          "value": params.row.je,
                          "size":'small',
                          "type":"text"
                      },
                      on:{
                        'input': (val) => {
                          this.add.je = val;
                        },
                        'on-blur': () => {
                          this.add_data_save[params.index].je = this.add.je;
                        }
                      }
                  })
          }
        },
        {
          title: "付款方",
          key: "fkf",
          render: (h, params) => {
              return h('div', [
                  h('Input', {
                      props: {
                          "placeholder":"请输入......",
                          "value": params.row.fkf,
                          "type":"text"
                      },
                      on:{
                        'input': (value) => {
                          this.add.fkf = value;
                        },
                        'on-blur': () => {
                          this.add_data_save[params.index].fkf = this.add.fkf;
                        }
                      }
                  }),
              ]);
          }
        }
      ],
      add_data: [
      ],
      add_data_save:[],
      add:{

      },
      zf: {
        skf: "曹操",
        htbh: "456789",
        dyzq: "账期56789",
        yf: "23456"
      },
      morezf: [
        {
          skf: "曹操",
          htbh: "456789",
          dyzq: "账期56789",
          yf: "23456"
        },
        {
          skf: "曹操",
          htbh: "456789",
          dyzq: "账期56789",
          yf: "23456"
        }
      ],
      hkhz: {
        skf: "5678",
        yf: "56789",
        dksj: "2020-5-90"
      },
      newgzRules: {
        rwlx: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        // rwnr: [
        //   {
        //     required: true
        //   }
        // ]
      },
      hz1_columns: [
          {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "合同编号",
          key: "htbh"
        },
        {
          title: "合同名称",
          key: "htmc",
        }],
      hz1_data: [],
      hz2_columns: [{
            title: '账期',
            key: 'id'
        },
        {
            title: '应付（元）',
            key: 'paymentAmount'
        },
        {
            title: '实付（元）',
            key: 'paybackAmount'
        }],
      hz2_data: [],
      zfmodal: false,
      newgzmodal: false,
      zfqrmodal: false,
      zt: "待处理",
      morezfShow: false,
      dtzfShow: false,
      hkhzmodal: false,
      dkqrmodal: false,
      checkIndex: 0,
      sfdz: "",
      zffsIndex:"",
      disabled:true,
      indexStyle:"",
      indexStyle1:"",
      bhlmodel:"by",
      kclmodel:"bd",
      zzmodel:"sy",
      yxmodel:"ndyx",
      newsShow:true,
      title:"支付提醒",
      content:"ZHHB-FW20190918002合同已签署完毕，请尽快支付。",
      tabName:'name1',
      obj:{},
      sum:0,
      workBenchData:{},
      yb_data:[],
      button1:'',
      borderColor:['#e4e7ed','#e4e7ed','#e4e7ed'],
      checkedData:[],
      ensurePayBack:{
        contractNo: "",
        lastWorkbenchId: "",
        payAmount: "",
        transactionTime: "",
        payUnitName: "",
        paymentPeriod: "",
        receiveSide: "",
        trader: "",
        workBenchStatus:'',
        ensure:"",
        workBenchId:""
      }
    };
  },
  methods: {
    getWorkbench(){
      let request = {
          "typeid": 28001,
          "data": [
            {
              "workBenchStatus": this.tabName === 'name1'?1:this.tabName === 'name2'?2:3,
              "accountId": 520, //this.$store.state.user.accountId
            }
          ]
      }
      this.gz_data = [];
      this.fq_data = [];
      this.yb_data = [];
      if(this.tabName === 'name1') this.$notify.closeAll();
      this.$http.XLWORKBENCH(request).then(response => {
        let { data } = response.data.result;
        data.forEach(d => {
          let item = {};
          switch (d.workBenchType) {
            case 10:
              item.gznr = this.tabName === 'name1'?`回款待核准，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})，请戳这里`:`回款待核准，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})`;
              break;
            case 4:
              item.gznr = this.tabName === 'name1'?`到账待确认，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})，请戳这里`:`到账待确认，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})`;
              break;
            case 3:
              item.gznr = this.tabName === 'name1'?`${d.workBenchContentObj.contractNo}合同已签署完毕，请尽快支付。线上支付请戳这里`:`${d.workBenchContentObj.contractNo}合同已签署完毕。`;
              break;
          }
          item.type = this.typeMap[d.workBenchType];
          item.fzr = d.accountName;
          item.jztime = d.dueTimeDescribe;
          item.duetime = d.dueTime;
          item._checked = d.false;
          item.zt = d.workBenchStatus;
          item.data = d;
          if(this.tabName === 'name1'){
            this.gz_data.push(item);
          }else if(this.tabName === 'name3'){
            this.fq_data.push(item);
          }else{
            this.yb_data.push(item);
          }
        });
        if(this.tabName === 'name1'){
          data.reverse().forEach(d => {
            var _this = this;
            let message = '';
            switch (d.workBenchType) {
              case 10:
                message = `回款待核准，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})，点击直接处理`;
                break;
              case 4:
                message = `到账待确认，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})，点击直接处理`;
                break;
              case 3:
                message = `${d.workBenchContentObj.contractNo}合同已签署完毕，请尽快支付。点击直接处理`;
                break;
            }
            this.$notify({
                title: this.typeMap[d.workBenchType],
                message: message,
                offset: 10,
                duration: 0,
                onClick: function(){
                  this.close();
                  let item = {
                    data:d
                  }
                  _this.dbgzTableClick({row:item});
                  if(item.data.workBenchType === 3){
                    // this.gzselClick([item]);
                    _this.checkedData = [item]; //暂时只能一条一条支付
                    _this.checkIndex = _this.checkedData.length;
                  }
                }
              });
          })
        }
      })
    },
    getRebackAppr(p){
      let request = {
        "typeid": 26010,
        "data": [
          {
              "customerName": '致远互联',//this.workBenchData.workBenchContentObj.payUnitName,
              "page_size": 10,
              "page_num": p
          }
        ]
      }
      this.hz1_data = [];
      this.$http.XLCONTRACT(request).then(response => {
        let { data } = response.data.result;
        this.sum = data.sum;
        data.contractList.forEach(d => {
          this.hz1_data.push({
            htbh:d.contractNo,
            htmc:d.customerName,
            paymentList:d.paymentList,
            _checked:false
          })
      })
      this.hz1Click(this.hz1_data[0],0);
    })
    },
    rowClassName (row, index) {
        if (index === this.indexStyle) {
            return 'demo-table-info-row';
            this.hz1_data[index]._checked = true
        } 
        this.hz1_data[index]._checked = false
        return '';
    },
    rowClassName1(row,index){
      if (index === this.indexStyle1) {
            return 'demo-table-error-row';
        } 
        return '';
    },
    dbgzTableClick(params){
      if(params.row.data.workBenchType === 3){
          this.zfmodal = true;
        }else if(params.row.data.workBenchType === 10){
          this.hkhzmodal = true;
          this.hkhz = {
            skf: params.row.data.workBenchContentObj.payUnitName,
            yf: params.row.data.workBenchContentObj.payAmount,
            dksj: params.row.data.workBenchContentObj.payTime
          }
          this.workBenchData = params.row.data;
          this.getRebackAppr(1);
        }else if(params.row.data.workBenchType === 4){
          this.dkqrmodal = true;
          this.ensurePayBack = {
            contractNo: params.row.data.workBenchContentObj.contractNo,
            lastWorkbenchId: params.row.data.workBenchContentObj.lastWorkbenchId,
            payAmount: params.row.data.workBenchContentObj.payAmount,
            transactionTime: params.row.data.workBenchContentObj.transactionTime,
            payUnitName: params.row.data.workBenchContentObj.payUnitName,
            paymentPeriod: params.row.data.workBenchContentObj.paymentPeriod,
            receiveSide: params.row.data.workBenchContentObj.receiveSide,
            trader: params.row.data.workBenchContentObj.trader,
            workBenchType: params.row.data.workBenchType,
            ensure:'',
            workBenchId: params.row.data.workbenchId
          }
        }else if(params.row.data.workBenchType === 5){
          alert("敬请期待......")
        }
    },
    surehrClick(){
      console.log(this.workBenchData);
      let request = {
        "typeid": 26004,
        "data": [
          {
            "account_id": 1009, //this.$store.state.user.accountId,
            "contractNo": this.hz1_data[this.indexStyle].htbh,
            "paybackAmount": (parseFloat(this.workBenchData.workBenchContentObj.payAmount)||0).toFixed(2),
            "paybackTime": this.workBenchData.workBenchContentObj.payTime,
            "workbenchId": this.workBenchData.workbenchId,
            "paymentId": this.hz2_data[this.indexStyle1]
          }
        ]
      }
      this.$http.SETCONTRACT(request).then(response => {
        this.hkhzmodal = false;
        this.getWorkbench();
        this.$Message.success('成功！');
      })
    },
    newgzClick() {
      this.newgzmodal = true;
    },
    addcolClick(){
      this.add = {};
      this.add_data.push(this.add);
      this.add_data_save.push({});
    },
    nextzfClick() {
      this.zfmodal = false;
      this.zf.skf = this.checkedData[0].data.workBenchContentObj.receiveSide;
      this.zf.htbh = this.checkedData[0].data.workBenchContentObj.contractNo;
      this.zf.dyzq = this.checkedData[0].data.workBenchContentObj.paymentPeriod;
      this.zf.yf = 0;
      this.checkedData.forEach(data => {
        this.zf.yf += Number(data.data.workBenchContentObj.payAmount);
      })

      //暂时只支持一条一条进行支付
      // if (this.checkIndex <= 1 ) {
        this.dtzfShow = true;
        this.zfqrmodal = true;
        this.morezfShow = !this.dtzfShow;
      // } else if (this.checkIndex > 1) {
      //   this.morezfShow = true;
      //   this.zfqrmodal = true;
      //   this.dtzfShow = !this.morezfShow;
      // }
    },
    closeClick(){
      this.newsShow = false
    },
    gzselClick(data) {
      // this.checkedData = data;//暂时只按照一条一条进行支付
      this.checkIndex = data.length;
    },
    sureClick() {
      let request = {
        "typeid": 28004,
        "data": [
          {
            "workBenchId": this.checkedData[0].data.workbenchId,//只对一条记录进行支付
            // "photoUrl": "http://10.0.17.213:8068/url/img.png"
          }
        ]
      }
      this.$http.UPDATEWORKBENCH(request).then(response => {
        this.getWorkbench();
      },error => {
        if(error.data.code === 0){
          this.getWorkbench();
          this.$Message.success('成功！');
        }
      })
      this.zfqrmodal = false;
      this.zfmodal = false;
    },
    hz1Click(val,index){
      this.indexStyle = index
      this.hz1_data[index]._checked = true
      this.hz2_data = val.paymentList||[];
    },
    hz2Click(val,index){
      this.indexStyle1 = index
    },
    radioClick(val) {
      console.log(val)
      if (val == "ydz") {
        $(".green").css({ color: "green" });
        $(".red").css({ color: "black" });
        this.ensurePayBack.ensure = true;
      } else if (val == "wdz") {
        $(".red").css({ color: "red" });
        $(".green").css({ color: "black" });
        this.ensurePayBack.ensure = false;
      }else if(val === ''){
        $(".green").css({ color: "black" });
        $(".red").css({ color: "black" });
        this.ensurePayBack.ensure = '';
      }
    },
    addWork(){
      this.add_data = this.add_data_save;
      console.log(this.newgzForm.wcsj);
      let request = {
        "typeid": 28002,
        "data": [
            {
                "workBenchType": 10,
                "accountId": 1351,
                "chargePerson": 520,
                "dueTime": "2019-10-22 19:35:33",
                "workBenchContentList": [
                    {
                        "payTime": 520,
                        "payUnitName": "南京致远互联2",
                        "payAmount": 50000
                    },
                    {
                        "payTime": 520,
                        "payUnitName": "南京致远互联",
                        "payAmount": 10000
                    }
                ]
            }
        ]
      };
      // this.$http.SETWORKBENCH(request).then(response => {

      // })
    },
    selectedPayStyle(e){
      let index = e.target.getAttribute("index");
      this.borderColor.forEach((item,i) => {
        if(i === Number(index)){
          this.$set(this.borderColor,i,'red');
          this.zffsIndex = i;
          this.disabled = false;
        }else{
          this.$set(this.borderColor,i,'#e4e7ed');
        }
      });
    },
    ensurePayBackSub(){
      if(this.ensurePayBack.ensure === ''){
        this.$Message.error('请先选择到账状态！');
        return;
      }
      let request = {
        "typeid": 28005,
        "data": [
            {
              "workBenchId": this.ensurePayBack.workBenchId,
              "lastWorkbenchId": this.ensurePayBack.ensure === false?this.ensurePayBack.lastWorkbenchId:undefined,
            }
        ]
      }
      this.$http.UPDATEWORKBENCH(request).then(() => {
        this.sfdz = '';
        this.radioClick(this.sfdz);
        this.getWorkbench();
        this.dkqrmodal = false;
      },error => {
        if(error.data.code === 103||error.data.code === 0){
          this.sfdz = '';
          this.radioClick(this.sfdz);
          this.getWorkbench();
          this.dkqrmodal = false;
        }
      })
    }
  },
  mounted() {
    this.getWorkbench();
  },
  watch:{
    tabName(){
      this.getWorkbench();
    }
  },
  beforeDestroy(){
    this.$notify.closeAll();
  }
};
</script>

<style>
@import "./workbench.css";
.aa .ivu-modal-footer {
  display: none;
}
.hz1 .ivu-table .demo-table-info-row td{
        /* background-color: #2db7f5; */
        color: #60A9F4;
}
.hz2 .ivu-table .demo-table-error-row td{
        background-color: #65B1FF;
        color: #ffffff;
}

</style>
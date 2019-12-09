<template>
  <div class="workbench">
    <layout class="layout">
      <div>
        <div class="gz_left left bor" style="min-height:800px;">
          <!-- <Input icon="ios-search" placeholder="请输入。。。。" class="gz_input"></Input> -->
          <Tabs value="name1" v-model="tabName" >
            <TabPane :label="label" name="name1">
              <Table
                :columns="gz_columns"
                :data="gz_data"
                @on-selection-change="gzselClick"
                :loading="loading"
              ></Table>
            </TabPane>
            <TabPane label="已办工作" name="name2">
              <Table
                :columns="yb_columns"
                :data="yb_data"
                :loading="loading"
                @on-selection-change="gzselClick"
              ></Table>
            </TabPane>
            <TabPane label="我发起的" name="name3">
              <Table :columns="fq_columns" :data="fq_data" :loading="loading"></Table>
            </TabPane>
          </Tabs>
          <p class="gzadd" @click="newgzClick">
            <img src="../../images/workbench/add.png" alt />
          </p>
          <Input class="gz_input" icon="ios-search" v-model="inputVal" placeholder="请输入内容" style="margin-top:6px" @on-enter="getWorkbench" @on-click="getWorkbench"/>
        </div>
        <div class="gz_right right">
          <div class="left gz_rig bor">
            <Select v-model="bhlmodel" size="small" clearable filterable style="width:100px">
                <Option value="by">本月备货量</Option>
                <Option value="sgy">上个月备货量</Option>
            </Select>
            <p class="bh_p"><big>3000</big><i> 台</i><span>&#x3000;+<b>10.5%</b></span></p>
          </div>
          <div class="right gz_rig bor">
            <Select v-model="kclmodel" size="small" clearable filterable style="width:100px">
                <Option value="bd">本地库存量</Option>
                <Option value="ck">仓库库存量</Option>
            </Select>
            <p class="bh_p"><big>3000</big><i> 台</i></p>
          </div>
          <div style="clear: both;">
          </div>
          <div class="gz_div bor" style="height:340px">
            <Select v-model="zzmodel" size="small" clearable filterable style="width:150px">
                <Option value="sy">上月订单追踪</Option>
                <Option value="sgy">近3个月订单追踪</Option>
            </Select>
            <highchartsRing></highchartsRing>
          </div>
          <div class="gz_div bor" style="height:340px">
            <Select v-model="yxmodel" size="small" clearable filterable style="width:150px">
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
      <Button class="zf_butt" type="primary" @click="nextzfClick" :disabled="disabled&&buttonDisabled">下一步</Button>
      
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
      <Upload multiple type="drag" action="/" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" class="upload">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>上传付款凭证</p>
          <p>(格式：JPG、PNG、JPEG)</p>
        </div>
      </Upload>
      <Button class="zf_butt" type="primary" @click="sureClick" :disabled="buttonDisabled">确认已支付</Button>
    </Modal>
    <!-- 新建工作待办 -->
    <Modal v-model="newgzmodal" class="aa" width="800">
      <p class="zf_p">新建工作待办</p>
      <Form :model="newgzForm" :rules="newgzRules" :label-width="100">
        <FormItem label="任务类型" prop="rwlx">
          <Select v-model="newgzForm.rwlx" placeholder class="col-v" clearable filterable>
            <Option :value="item.index" v-for="(item,index) in rwlxs" :key="index">{{item.val}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="rwnr">
          <div style="margin-left:-70px;display:flex">
            <span style="color:red;font-size:16px;padding-top:2px;padding-right:2px">
            * 
            </span>
            <span style="margin-right:15px">
               任务内容 
            </span>
            <Button class="but_change" @click="addcolClick">添加行</button>
            <el-upload action="/" :on-change="importExcel" :auto-upload="false" :show-file-list="false">
              <Button class="but_change" type="ghost" icon="ios-cloud-upload-outline">批量导入</Button>
            </el-upload>
            <span style="white-space: normal;color:#bbbec4">请上传excel文件,表格中三列名称分别为:到款时间,金额,付款方</span>(<a href="http://www.chinadny.com:9010/front/userfiles/xlcloud/paybackAmount.xls">点击下载模板</a>)
          </div>
          <Table :columns="add_columns" :data="newgzForm.add_data" class="gztable"></Table>
        </FormItem>
        <FormItem label="负责人" prop="fzr">
          <Select v-model="newgzForm.company" clearable filterable style="width:250px;">
            <Option :value="item.id" v-for="(item,index) in companys" :key="index">{{item.name}}</Option>
          </Select>
          <Select v-model="newgzForm.fzr" placeholder="请选择(默认不选为认领模式)"  clearable filterable style="width:190px;">
            <Option :value="item.id" v-for="(item,index) in fzr" :key="index">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="要求完成时间" prop="wcsj">
          <DatePicker type="date" placeholder format="yyyy-MM-dd" @on-change="getDate" class="col-v"></DatePicker>
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
            <Input icon="ios-search" placeholder="请输入内容" style="width: 200px;" v-model="customName" @on-enter="getRebackAppr(1)" @on-click="getRebackAppr(1)"/>
          </div>
        </section>
        <section>
          <div class="hz1">
            <Table :row-class-name="rowClassName" :columns="hz1_columns" :loading="hz1Loading" :data="hz1_data" @on-row-click="hz1Click" height="400"></Table>
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
      <Button class="zf_butt" type="primary" style="margin-left:450px;" @click="surehrClick" :disabled="buttonDisabled">确认核入</Button>
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
            <img src="../../images/workbench/payback.png" alt :class="{fk_img:true,active:isActive}" @click="isActive = !isActive"  />
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
      <Button class="kh_but" type="primary" @click="ensurePayBackSub" :disabled="buttonDisabled">提交</Button>
    </Modal>
    <!-- 发货方案审批 -->
    <Modal v-model="refusemodal" width="1200" class="aa">
       <p style="font-size:18px;margin:10px 0 20px 0">发货方案审批</p>
        <div style="margin:0 20px;">
           <header class="fa_mid">
        <Button type="ghost" class="right fa_b">{{deliveryMap[deliveryData.status]}}</Button>
        <h2>发货方案详情</h2>

        <div class="fa_div">
          <p>
            <span class="gray">方案编号：</span>
            {{deliveryData.schemeNo}}
          </p>
          <p>
            <span class="gray">发起时间：</span>
            {{deliveryData.time}}
          </p>
          <p>
            <span class="gray">发起人：</span>
            {{deliveryData.manageMan}}
          </p>
          <p>
            <span class="gray">期望发货时间：</span>
            {{deliveryData.deliveryTime}}
             之前
          </p>
        </div>
        <div class="fa_div1">
          <p class="left">方案描述：</p>
          <div class="left">
            <p>{{deliveryData.des}}</p>
          </div>
        </div>
      </header>
      <content>
        <div class="fa_p" style="margin-top:50px;">
          <p class="left">批次要求： 
            {{deliveryData.shipments_start_batch}} - {{deliveryData.shipments_end_batch}}
            </p>
          <p>
            <span>
              金额
              <b>{{deliveryData.amount||0}}</b>元
            </span>
            <span>
              订单数
              <b>{{orderData.length - 1}}</b>个
            </span>
            <span>
              设备数
              <b>{{productNum}}</b>台
            </span>
          </p>
        </div>
        <div class="fa_co">
          <div class="fa_c">
            <span style="font-size:16px">出库设备</span>
            <p class="right">
              <span>整体完成度</span>
              <Progress class="pro" :percent="25"></Progress>
            </p>
          </div>
          <div style="clear:both;overflow: hidden;">
            <div style="width:17%;float:left;">
              <Table
                :columns="orderColumns"
                ref="cktable"
                :data="orderData"
                size="small"
                disabled-hover
                highlight-row
                @on-current-change="changeRow"
                style="margin:20px 0 0 0px;overflow:auto"
              ></Table>
            </div>
            <div style="width:83%;float:right;">
              <div>
                <p class="ck_p">
                  <Dropdown trigger="click" placement="top" transfer @on-click="changeOrder">
                    {{selectedCustom === '全部'?`共${customList.length-1}家客户（可筛选查看）`:selectedCustom}}
                    <Icon type="arrow-down-b"></Icon>
                    <DropdownMenu slot="list">
                      <DropdownItem v-for="item in customList" :value="item" v-model="selectedCustom" :key="item" :name="item">{{item}}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </p>
              </div>
              <Table
                :columns="device_columns"
                :data="device_data"
                size="small"
                style="margin:0px 0 0 0;overflow:auto"
              ></Table>
            </div>
          </div>
        </div>
        <div class="agree_but">
        <Button type="primary" :disabled="buttonDisabled" @click="agreeDelivery">同意</Button>
        <Button type="ghost" @click="refuseShow = true" :disabled="buttonDisabled">拒绝</Button>
        <div v-show="refuseShow" class="refuse">
          <p>拒绝理由<span style="float:right;cursor:pointer;color:#8d8d8d" @click="refuseShow = false">x</span></p>
          <Input v-model="textarea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写审批拒绝理由"></Input>
          <section>
            <Button type="primary" @click="refuseSure">确定</Button>
            <Button @click="refuseShow = false">取消</Button>
          </section>
        </div>
        </div>
      </content>
        </div>
    </Modal>
  </div>
</template>

<script>
import highchartsRing from './highcharts-ring.vue';
import highchartsLine from './highcharts-line.vue';
import { error } from 'highcharts';
import XLSX from 'xlsx';

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
  12: '发货方案审批'
}
const rwlxs = [
  // {
  //   val: '审批提醒',
  //   index: 1
  // },
  // {
  //   val: '签署提醒',
  //   index: 2
  // },
  // {
  //   val: '支付提醒',
  //   index: 3
  // },
  // {
  //   val: '（财务）到款确认',
  //   index: 4
  // },
  // {
  //   val: '下单提醒',
  //   index: 5
  // },
  // {
  //   val: '发货提醒',
  //   index: 6
  // },
  // {
  //   val: '收货提醒',
  //   index: 7
  // },
  // {
  //   val: '上线审批',
  //   index: 8
  // },
  // {
  //   val: '上线通知',
  //   index: 9
  // },
  {
    val: '回款核准',
    index: 10
  },
  // {
  //   val: '开票提醒',
  //   index: 11
  // },
  // {
  //   val: '发货方案审批',
  //   index: 12
  // },
]
const statusMap = {
  1:'待办',
  2:'已办'
}
const deliveryMap = {
  1:"草稿",
  2:"审批中",
  3:"已通过",
  4:"被驳回",
};
export default {
  name: "work-bench",
  components:{
    highchartsRing,
    highchartsLine,
  },
  data() {
    return {
      textarea:"",
      refuseShow:false,
      typeMap,
      statusMap,
      rwlxs,
      deliveryMap,
      inputVal: '',
      customName: '',
      loading: false,
      hz1Loading: false,
      isActive: false,
      newgzForm: {
        rwlx: 10,
        fzr: "",
        wcsj: "",
        company:'',
        add_data: []
      },
      companys:[],
      fzr: [],
      gz_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: '序号',
          width: 60,
          align: "center",
          key:'index'
        },
        {
          title: "工作内容",
          key: "gznr",
          align: "center",
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
      yb_columns:[
        {
          title: "工作内容",
          key: "gznr",
          align:"center",
          render: (h, params) => {
            return h('div', [
                h('a', {
                    props: {
                        href: '',
                    },
                    on: {
                        click: () => {
                            this.dbgzTableClick(params);
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
          title: "日期",
          key: "duetime",
          width: '150',
          align: 'center'
        }
      ],
      gz_data: [
        ],
      fq_columns: [
        {
          title: "工作内容",
          key: "gznr",
          align: "center",
          render: (h, params) => {
            return h('div', [
                h('a', {
                    props: {
                        href: '',
                    },
                    on: {
                        click: () => {
                            this.dbgzTableClick(params);
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
          align: "center",
          render: (h, params) => {
              return h('div', [
                  h('DatePicker', {
                      props: {
                          "value": params.row.dksj,
                          "format":"yyyy-MM-dd"
                      },
                      on:{
                        'on-change': (value) => {
                          this.addStore[params.index].dksj = value;
                        }
                      }
                  }),
              ]);
          }
        },
        {
          title: "金额（元）",
          key: "je",
          align: "center",
          render: (h, params) => {
              return h('Input', {
                      props: {
                          "placeholder":"请输入金额",
                          "value": params.row.je,
                          "size":'small',
                          "type":"number"
                      },
                      on:{
                        'input': (value) => {
                          this.addStore[params.index].je = value;
                        },
                        //  'on-keyup':()=>{
                        //    debugger
                        //   //  alert(this.newgzForm.add_data.je)
                        //    alert(value)
                        //    this.addStore[params.index].je = this.addStore[params.index].je.replace(/[^\d]/g, '')
                        // }
                      },
                  })
          }
        },
        {
          title: "付款方",
          key: "fkf",
          align: "center",
          render: (h, params) => {
              return h('div', [
                  h('Input', {
                      props: {
                          "placeholder":"请输入付款方",
                          "value": params.row.fkf,
                          "size":'small',
                          "type":"text"
                      },
                      on:{
                        'input': (value) => {
                          this.addStore[params.index].fkf = value;
                        }
                      }
                  }),
              ]);
          }
        },
        {
          title:'操作',
          width: '100',
          key: 'action',
          align: "center",
          render:(h,params) => {
            return h('Button',{
                props: {
                    type: 'error',
                    size: 'small'
                },
                on: {
                    click: () => {
                        this.addRemove(params.index);
                    }
                }
            }, '删除')
          }
        }
      ],
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
        rwnr: [
          {
            // required: true,
            // message:'请输入所有内容'
          }
        ],
        wcsj: [
          {
            required: true,
            message:'不能为空'
          }
        ]
      },
      hz1_columns: [
          {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "合同编号",
          key: "htbh",
          align: "center",
        },
        {
          title: "合同名称",
          key: "htmc",
          align: "left",
          width: 200,
        }],
      hz1_data: [],
      hz2_columns: [{
            title: '账期',
            key: 'id',
            align: "center",
        },
        {
            title: '应付（元）',
            key: 'paymentAmount',
            align: "center",
        },
        {
            title: '实付（元）',
            key: 'paybackAmount',
            align: "center",
        }],
        orderColumns: [
        {
          title: "订单编号",
          key: "orderNo"
        }
      ],
      device_columns: [
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
          title: "计量单位",
          key: "product_unit",
          align: "center"
        },
        {
          title: "数量",
          key: "quantity_shipped",
          align: "center"
        }
      ],
      orderData: [
        {
          orderNo:'汇总'
        }
      ],
      currentRow:{},
      hz2_data: [],
      zfmodal: false,
      newgzmodal: false,
      zfqrmodal: false,
      zt: "待处理",
      morezfShow: false,
      dtzfShow: false,
      hkhzmodal: false,
      dkqrmodal: false,
      refusemodal:false,
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
      },
      addStore:[],
      noticeStatus:true,
      label:(h) =>{
        return h('div', [
            h('span', '待办工作'),
            h('Badge', {
              props: {
                  count: this.$store.state.app.workBenchData.length
              }
            })
        ])
      },
      deliveryData:{
        schemeNo:'',
        time:'',
        manageMan:'',
        deliveryTime:'',
        des:'',
        shipments_end_batch:'',
        shipments_start_batch:'',
        orderList: []
      },
      selectedCustom: '全部',
      orderDataCache: []
    };
  },
  methods: {
    changeRow(data) {
      this.currentRow = JSON.parse(JSON.stringify(data));
    },
    updateDelivery(no){
      let request = {
        "typeid": 28007,
        "data": [
          {
            "workBenchId": this.deliveryData.workBenchId,
            "shipmentsId": this.deliveryData.shipmentsId,
            "operationNo":no,
            "returnReason": no === 2?undefined:this.textarea
          }
        ]
      };
      this.$http.UPDATEWORKBENCH(request).then(response => {
        this.$Message.success(`已${no === 2?'同意':'驳回'}该申请！`);
        this.textarea = '';
        this.refusemodal = false;
        this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
      },error => {
        if(error.data.code === 0){
          this.$Message.success(`已${no === 2?'同意':'驳回'}该申请！`);
          this.textarea = '';
          this.refusemodal = false;
          this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
        }
      })
    },
    refuseSure(){
      this.refuseShow = false;
      this.updateDelivery(3);
    },
    agreeDelivery(){
      this.updateDelivery(2);
    },
    getWorkbench(){
      if(this.$route.query.notice&&typeof(this.$route.query.notice) === 'object'&&this.noticeStatus){
        let item = this.$route.query.notice;
        this.dbgzTableClick({row:item});
        if(item.data.workBenchType === 3){
          // this.gzselClick([item]);
          this.checkedData = [item]; //暂时只能一条一条支付
          this.checkIndex = this.checkedData.length;
        }
        this.parse(this.$store.state.app.workBenchData,false);
        this.noticeStatus = false;
        return;
      }
      let request = {
          "typeid": 28001,
          "data": [
            {
              "workBenchStatus": this.tabName === 'name1'?1:this.tabName === 'name2'?2:3,
              "accountId": this.$store.state.user.accountId,
              "keyword": this.inputVal
            }
          ]
      }
      this.loading = true;
      this.gz_data = [];
      this.fq_data = [];
      this.yb_data = [];
      if(this.tabName === 'name1'&&this.$store.state.app.workBenchData.length>0){
        this.parse(this.$store.state.app.workBenchData,false);
        return;
      }
      if(this.tabName === 'name1') this.$notify.closeAll();
      this.$http.XLWORKBENCH(request).then(response => {
        let { data } = response.data.result;
        this.parse(data,true);
      },error=>{
        this.loading = false;
      })
    },
    parse(data,status){
      data.forEach((d,i) => {
          let item = {};
          switch (d.workBenchType) {
            case 1:
              item.gznr = this.tabName === 'name1'?`审批提醒，您有一个待审批的工作，请戳这里查看详情`:`审批提醒，您有一个待审批的工作`;
              break;
            case 10:
              item.gznr = this.tabName === 'name1'?`回款待核准，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})，请戳这里`:`回款待核准，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})`;
              break;
            case 4:
              item.gznr = this.tabName === 'name1'?`到账待确认，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})，请戳这里`:`到账待确认，金额：${d.workBenchContentObj.payAmount}(付款方：${d.workBenchContentObj.payUnitName})`;
              break;
            case 3:
              item.gznr = this.tabName === 'name1'?`${d.workBenchContentObj.contractNo}合同已签署完毕，请尽快支付。线上支付请戳这里`:`${d.workBenchContentObj.contractNo}合同已签署完毕。`;
              break;
            case 12:
              item.gznr = this.tabName === 'name1'?`发货方案审批提醒，您有一个待审批的发货方案，请尽快审批。审批请戳这里`:`发货方案审批提醒，您有一个待审批的发货方案，请尽快审批。`;
              break;
          }
          item.type = this.typeMap[d.workBenchType];
          item.fzr = d.accountId === -1?'待认领':(d.accountName||'');
          item.jztime = d.dueTimeDescribe;
          item.duetime = d.dueTime;
          item._checked = d.false;
          item.zt = d.workBenchStatus;
          item.index = i+1;
          item.data = d;
          if(this.tabName === 'name1'){
            this.gz_data.push(item);
          }else if(this.tabName === 'name3'){
            this.fq_data.push(item);
          }else{
            this.yb_data.push(item);
          }
        });
        if(this.gz_data&&this.gz_data.length>0){
          this.$store.commit('setWorkBenchData',data);
        }
        if(status) this.showNotice();
        this.loading = false;
    },
    showNotice(){
      if(this.gz_data&&this.gz_data.length > 0){
        
          this.gz_data.forEach((d,i) => {
            var _this = this;
            let message = '';
            switch (d.data.workBenchType) {
              case 1:
                message = `审批提醒，您有一个待审批的工作，点击直接处理`;
                break;
              case 10:
                message = `回款待核准，金额：${d.data.workBenchContentObj.payAmount}(付款方：${d.data.workBenchContentObj.payUnitName})，点击直接处理`;
                break;
              case 4:
                message = `到账待确认，金额：${d.data.workBenchContentObj.payAmount}(付款方：${d.data.workBenchContentObj.payUnitName})，点击直接处理`;
                break;
              case 3:
                message = `${d.data.workBenchContentObj.contractNo}合同已签署完毕，请尽快支付。点击直接处理`;
                break;
              case 12:
                message = `发货方案审批提醒，您有一个待审批的发货方案，请尽快审批。审批请戳这里`;
              break;
            }
            // if(this.gz_data.length >= 6){
            //   this.$notify({
            //     title: this.typeMap[d.data.workBenchType],
            //     message: message,
            //     offset: 100,
            //     duration: 60000,
            //     openData: () => {
            //       this.$notify.close();
            //       let item = {
            //         data:d.data
            //       }
            //       if(this.$route.path !== '/home'){
            //         this.$router.push({path:'/home',query:{notice:item}});
            //       }
            //       this.dbgzTableClick({row:item});
            //       if(item.data.workBenchType === 3){
            //         // this.gzselClick([item]);
            //         this.checkedData = [item]; //暂时只能一条一条支付
            //         this.checkIndex = this.checkedData.length;
            //       }
            //     },
            //     onClick:function() {
            //       this.close();
            //       this.openData();
            //     }
            //   });
            // }else{
            //   setTimeout(() => {
            //     this.$notify({
            //       title:this.typeMap[d.data.workBenchType],
            //       message:message,
            //       offset: 100,
            //       duration: 60000,
            //       openData: () => {
            //         let item = {
            //           data:d.data
            //         }
            //         if(this.$route.path !== '/home'){
            //           this.$router.push({path:'/home',query:{notice:item}});
            //         }
            //         this.dbgzTableClick({row:item});
            //         if(item.data.workBenchType === 3){
            //           // this.gzselClick([item]);
            //           this.checkedData = [item]; //暂时只能一条一条支付
            //           this.checkIndex = this.checkedData.length;
            //         }
            //       },
            //       onClick:function() {
            //         this.close();
            //         this.openData();
            //       }
            //     })
            //   }, 0);
            // }
          })
      }
    },
    getRebackAppr(p){
      let request = {
        "typeid": 26010,
        "data": [
          {
              "customerName": this.customName,
              "page_size": 10,
              "page_num": p
          }
        ]
      }
      this.hz1_data = [];
      this.hz1Loading = true;
      this.$http.XLCONTRACT(request).then(response => {
        this.hz1Loading = false;
        let { data } = response.data.result;
        this.sum = data.sum;
        data.contractList.forEach(d => {
          let paymentList = JSON.parse(JSON.stringify(d.paymentList))||[];
          let allBack = 0;
          let backAmount = 0;
          (d.paybackList||[]).forEach(p => {
            allBack += p.paybackAmount;
          })
          paymentList.forEach(p => {
            if(allBack - backAmount - p.paymentAmount>0){
              p.paybackAmount = p.paymentAmount;
            }else{
              p.paybackAmount = allBack - backAmount;
            }
            backAmount += p.paybackAmount;
          })
          this.hz1_data.push({
            htbh:d.contractNo,
            htmc:d.customerName,
            paymentList:paymentList,
            _checked:false
          })
        })
        this.hz2_data = [];
        if(this.hz1_data.length>0) this.hz1Click(this.hz1_data[0],0);
      },error => {
        this.hz1Loading = false;
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
        }else if(params.row.data.workBenchType === 1){
          this.$alert(`您有一个合同待审批，合同号为 ${ params.row.data.workBenchContentObj.contractNo }`, '审批提醒', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }else if(params.row.data.workBenchType === 5){
          alert("敬请期待......")
        }else if(params.row.data.workBenchType === 12){
          this.refusemodal = true;
          this.getDelivery(params.row.data);
        }
    },
    surehrClick(){
      if(!this.hz1_data[this.indexStyle]||!this.hz2_data[this.indexStyle1]){
        this.$Message.error('请选择相应合同及账期后再核入！');
        return;
      }
      for(let i =0;i<this.indexStyle1;i++){
        if(this.hz2_data[i].paybackAmount<this.hz2_data[i].paymentAmount){
          this.$Message.error('请先选择未付清的账期核入！');
          return;
        }
      }
      let request = {
        "typeid": 26004,
        "data": [
          {
            "account_id": this.$store.state.user.accountId,
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
        this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
        this.$Message.success('成功！');
      })
    },
    newgzClick() {
      this.newgzmodal = true;
    },
    addcolClick(){
      if(this.addStore.length>0){
        this.newgzForm.add_data = JSON.parse(JSON.stringify(this.addStore));
      }
      this.newgzForm.add_data.push({
        dksj:'',
        je:'',
        fkf:''
      });
      this.addStore.push({
        dksj:'',
        je:'',
        fkf:''
      });
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
        this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
      },error => {
        if(error.data.code === 0){
          this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
          this.$Message.success('成功！');
        }
      })
      this.zfqrmodal = false;
      this.zfmodal = false;
    },
    hz1Click(val,index){
      this.indexStyle = index;
      this.hz1_data[index]._checked = true
      this.hz2_data = val.paymentList||[];
    },
    hz2Click(val,index){
      this.indexStyle1 = index
    },
    radioClick(val) {
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
    editSave(store){
      let {index,key,value} = store;
      this.newgzForm.add_data[index][key] = value;
    },
    addRemove(index){
      this.addStore = this.addStore.filter((d,i) => i!== index);
      this.newgzForm.add_data = JSON.parse(JSON.stringify(this.addStore));
    },
    addWork(){
      this.newgzForm.add_data = JSON.parse(JSON.stringify(this.addStore));
      if(this.newgzForm.wcsj === ''){
        this.$Message.error('请选择完成时间！');
        return;
      }else if(this.newgzForm.add_data.length === 0){
        this.$Message.error('请添加任务内容！');
        return;
      }
      let workBenchContentList = [];
      this.newgzForm.add_data.forEach(d => {
        if(d.dksj === ''){
          this.$Message.error('请选择到款时间！');
          return;
        }else if(d.fkf === ''){
          this.$Message.error('请输入付款方！');
          return;
        }else if(d.je === ''||isNaN(Number(d.je))){
          this.$Message.error('请输入正确金额！');
          return;
        }
        workBenchContentList.push({
          payTime: d.dksj,
          payUnitName: d.fkf,
          payAmount: d.je,
        })
      })
      let request = {
        "typeid": 28002,
        "data": [
            {
              "workBenchType": this.newgzForm.rwlx,
              "accountId": this.$store.state.user.accountId,
              "chargePerson": this.newgzForm.fzr === ''?-1:this.newgzForm.fzr,
              "dueTime": this.newgzForm.wcsj,
              "workBenchContentList": workBenchContentList
            }
        ]
      };
      this.$http.SETWORKBENCH(request).then(response => {
        this.newgzmodal = false;
        this.$Message.success('新增成功！');
        this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
      })
    },
    getDate(value){
      this.newgzForm.wcsj = value;
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
        this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
        this.dkqrmodal = false;
      },error => {
        if(error.data.code === 103||error.data.code === 0){
          this.sfdz = '';
          this.radioClick(this.sfdz);
          this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
          this.dkqrmodal = false;
        }
      })
    },
    importExcel(file){
      const types = file.name.split('.')[1]
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
      if (!fileType) {
        this.$Message.error('格式错误，请重新导入！');
        return;
      }
      this.$Message.info('导入成功，处理中...');
      this.file2Xce(file).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          tabJson[0].sheet.forEach((d) => {
            this.addStore.push({
              dksj:d.到款时间,
              je:d.金额,
              fkf:d.付款方,
            })
            this.newgzForm.add_data = JSON.parse(JSON.stringify(this.addStore));
          })
        }
      })
    },
    file2Xce(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        reader.onload = function(e) {
          const data = e.target.result
          this.wb = XLSX.read(data, {
            type: 'binary'
          })
          const result = []
          this.wb.SheetNames.forEach((sheetName) => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName])
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
      })
    },
    getManagecompanys(){
      let request = {
        typeid:27001
      }
      this.$http.XLSELECT(request).then(response => {
        this.companys = response.data.result.data;
      })
    },
    getManagers(no){
      let request = {
        "typeid": 27008,
          "data":[
            {
              "companyID":no
            }
          ]
      }
      this.$http.XLSELECT(request).then(response => {
        this.fzr = response.data.result.data;
      })
    },
    getDelivery(workData){
      let request = {
        "typeid": 23020,
        "data": [
            {
              "account_id": this.$store.state.user.accountId,
              "shipments_id": (workData||{}).workBenchContentObj.shipmentsId
            }
        ]
      };
      this.$http.PostXLASSETS(request).then(response => {
        let { data } = response.data.result;
        this.deliveryData.schemeNo = data[0].shipments_no;
        this.deliveryData.time = data[0].shipments_time;
        this.deliveryData.manageMan = data[0].user_name;
        this.deliveryData.deliveryTime = data[0].shipments_creationtime;
        this.deliveryData.des = data[0].shipments_describe;
        this.deliveryData.shipments_start_batch = data[0].shipments_start_batch;
        this.deliveryData.shipments_end_batch = data[0].shipments_end_batch;
        this.deliveryData.status = data[0].shipments_status;
        this.deliveryData.amount = (workData||{}).workBenchContentObj.shipmentsAmount;
        this.deliveryData.workBenchId = workData.workbenchId;
        this.deliveryData.shipmentsId = (workData||{}).workBenchContentObj.shipmentsId;
        data[0].product_list.forEach(p => {
          if(!this.deliveryData.orderList.find(o => o.order_id === p.order_id)){
            this.deliveryData.orderList.push({
              orderNo: p.order_no,
              order_id: p.order_id,
              productList: [p],
              customer_name:p.customer_name||'--'
            })
          }else{
            let obj = this.deliveryData.orderList.find(o => o.order_id === p.order_id);
            obj.productList.push(p);
          }
        })
        this.orderData = this.orderData.concat(this.deliveryData.orderList);
        this.$refs['cktable'].objData[0]._isHighlight = true;
        this.currentRow = this.orderData[0];
      })
    },
    changeOrder(name){
      this.selectedCustom = name;
      if(Object.keys(this.orderDataCache).length === 0) this.orderDataCache = JSON.parse(JSON.stringify(this.orderData));
      this.orderData = JSON.parse(JSON.stringify(this.orderDataCache));
      if(name !== '全部'){
        this.orderData = this.orderData.filter(o => o.customer_name === name||o.orderNo === '汇总');
      }
      this.$refs['cktable'].objData[0]._isHighlight = true;
      this.currentRow = this.orderData[0];
    }
  },
  mounted() {
    this.getWorkbench();
    this.getManagecompanys();
  },
  watch:{
    tabName(){
      this.getWorkbench();
    },
    newgzmodal(nv){
      if(!nv){
        this.newgzForm = {
          rwlx: 10,
          fzr: "",
          wcsj: "",
          add_data: []
        };
        this.addStore = [];
      }
    },
    'newgzForm.company'(nv){
      if(nv !== ''){
        this.getManagers(nv);
      }
    },
    hkhzmodal(nv){
      if(!nv){
        this.customName = '';
      }
    },
    '$store.state.app.workBenchData.length'(){
      this.getWorkbench();
    }
  },
  computed:{
    device_data(){
      let data = [];
      if(this.orderData&&this.orderData.length>0&&this.currentRow&&this.currentRow.orderNo){
        if(this.currentRow.orderNo === '汇总'){
          this.orderData.forEach(d => {
            if(d.productList&&d.productList.length>0){
              d.productList.forEach(p => {
                if(data.find(o => o.product_code === p.product_code)){
                  let index = data.findIndex(o => o.product_code === p.product_code);
                  data[index].quantity_shipped += p.quantity_shipped
                }else{
                  data.push(JSON.parse(JSON.stringify(p))||{});
                }
              })
            }
          });
        }else{
          data = (this.orderData.find(d => d.orderNo === this.currentRow.orderNo)||{}).productList||[];
        }
      }
      return data;
    },
    productNum(){
      let num = 0;
      if(this.orderData&&this.orderData.length>0){
        this.orderData.forEach(o => {
          if(o.ddbh!=='汇总'&&o.productList){
            o.productList.forEach(p => {
              num += p.quantity_shipped;
            })
          }
        })
      }
      return num;
    },
    customList(){
      let customList = ['全部'];
      if(this.orderDataCache&&this.orderDataCache.length>0){
        this.orderDataCache.forEach(o => {
          if(o.orderNo === '汇总') return;
          if(customList.indexOf(o.customer_name) === -1){
            customList.push(o.customer_name);
          }
        })
        return customList;
      }
      if(this.orderData&&this.orderData.length>0){
        this.orderData.forEach(o => {
          if(o.orderNo === '汇总') return;
          if(customList.indexOf(o.customer_name) === -1){
            customList.push(o.customer_name);
          }
        })
      }
      return customList;
    },
    buttonDisabled(){
      return this.tabName !== 'name1';
    }
  }
};
</script>

<style>
@import "./workbench.css";
@import "../assetmanagement/assetmanage.css";
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
input[type="number"]{
        -moz-appearance: textfield;
    }
</style>
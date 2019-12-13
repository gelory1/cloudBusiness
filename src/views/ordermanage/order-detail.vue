<template>
    <div>
        <div style="postion:relative">
            <div style="margin:30px  20px;">
                <h3>订单详情</h3>
                <p style="font-size:11px;">
                单据编号:
                <span>{{(selectedOrder.data||{}).order_no}}</span>
                </p>
            </div>
            <Button :style="`position:absolute;margin-top:30px;right:30px;top:30px;background-color:${(statusColorMap[selectedOrder.status]||{}).backgroundColor};
                color:${(statusColorMap[selectedOrder.status]||{}).color}`">
                {{selectedOrder.status}}
            </Button>
            <!-- <Poptip ref="popTip" trigger="hover" content="去支付" placement="bottom" style="position:absolute;right:30px;top:30px;text-align:center;" v-show="selectedOrder.status === '待支付'">
                <Button :style="`margin-top:30px;background-color:${(statusColorMap[selectedOrder.status]||{}).backgroundColor};
                color:${(statusColorMap[selectedOrder.status]||{}).color}`">
                {{selectedOrder.status}}
                </Button>
            </Poptip>
           -->
            <div style="position:relative;">
                <div :style="{
                height: 28 + 'px',
                position:'absolute',
                zIndex:0,
                backgroundColor:'#49D790',
                color:'white',
                borderRadius: 20+'px',
                display:'flex',
                padding: 5+'px',
                width: `${length}%`}">
                    <div :style="{textAlign:'center',width:'100%' }" v-for="(item,index) in statuses" v-show="index < selectedIndex" :key="index">{{item.value}}</div>
                </div>
                <div style="display:flex;padding:5px;background-color:#F2F2F2;border-radius:20px">
                    <div v-for="(item,index) in statuses" :style="{width:`${(100/statuses.length)}%`,textAlign:'center'}" :key="index">{{item.value}}</div>
                </div>
                <div style="display:flex;padding:5px;;border-radius:20px;">
                    <div :style="{textAlign:'center',width:`${(100/statuses.length)}%` }" v-for="(item,index) in (selectedOrder.data||{}).order_log" :key="index">{{item.orderlog_time}}</div>
                </div>
            </div>
        </div>
        <div style="clear:both;">
            <p class="djtitle">单据信息</p>
            <div style="line-height:40px;width:40%;float:left">
            <div>
                <span class="jbleft">业务类型：</span>
                <span class="jbright">{{selectedOrder.type}}</span>
            </div>
            <div>
                <span class="jbleft">下单时间：</span>
                <span class="jbright">{{selectedOrder.time}}</span>
            </div>
            <div>
                <span class="jbleft">销售类型：</span>
                <span class="jbright">{{selectedOrder.salesType}}</span>
            </div>
            <div>
                <span class="jbleft">客户名称：</span>
                <span class="jbright">{{selectedOrder.customName}}</span>
            </div>
            </div>
            <div style="line-height:40px;width:50%;float:right">
            <div>
                <span class="jbleft">合同编号：</span>
                <span class="jbright">{{selectedOrder.contractNO}}</span>
            </div>
            <div>
                <span class="jbleft">合同主体：</span>
                <span class="jbright">{{subjectName[selectedOrder.contract_subject]}}</span>
            </div>
            <div>
                <span class="jbleft">设备数量：</span>
                <span style="color:#8D8D8D">{{selectedOrder.count}}
                <span>（<small style="color:green">本次交货：{{(selectedOrder.data||{}).issued_count}}</small>，<small style="color:red">剩余待发：{{selectedOrder.count - (selectedOrder.data||{}).issued_count}}</small>）</span>
                </span>
            </div>
            <div>
                <span class="jbleft">收货地址：</span>
                <span style="color:#8D8D8D">{{(selectedOrder.data||{}).address_name}}</span>
            </div>
            </div>
        </div>
        <div style="clear:both;overflow: hidden;">
        <p class="djtitle">设备清单</p>
        <Tabs v-model="deviceTabName">
            <TabPane label="全部" name="name1">
                <Table :columns="device_columns" :data="device_data" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
            </TabPane>
            <TabPane :label="`已到货（${(selectedOrder.data||{}).issued_count||0}）`" name="name2">
                <Table :columns="device_columns" :data="device_data1" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
            </TabPane>
            <TabPane :label="`待发货（${selectedOrder.count - (selectedOrder.data||{}).issued_count||0}）`" name='name3'>
                <Table :columns="device_columns" :data="device_data2" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
            </TabPane>
        </Tabs>
      </div>
    </div>
</template>
<script>
const statusColorMap = {
  '审批中':{
    backgroundColor: '#FDF6EC',
    color: '#E7A440'
  },
  '待支付':{
    backgroundColor: '#F0F9EC',
    color: '#78C950'
  },
  '已下单': {
    backgroundColor: '#F4F4F5',
    color: '#7D7F82'
  },
  '已发货':{
    backgroundColor: '#EEEEFF',
    color: '#7272D0'
  },
  '已到货':{
    backgroundColor: '#EBF5FE',
    color: '#54A3F6'
  },
  '被驳回':{
    backgroundColor: '#F4F4F5',
    color: '#7D7F82'
  }
};
const statusMap3 = {
  3:'下单',4: '出库',5:'到货'
};
const statusMap = {
  0:'审批中',1: '待支付',2:'已下单',3:'已发货',4:'已到货',5:'被驳回'
};
const statusMap2 = {
  0:'申请',1: '审批',2:'支付',3:'下单',4:'出库',5:'到货'
};
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
const businessMap = {
  0: '合同订单',
  1: '备货订单'
};
const saleMap = {
  0: '直销',
  1: '渠道',
  2: '其他'
};
export default {
    name:'orderDetail',
    props:['orderNO'],
    data() {
        return {
            statusColorMap,
            statusMap,
            statusMap2,
            statusMap3,
            subjectName,
            businessMap,
            saleMap,
            deviceTabName: 'name1',
            device_data: [],
            selectedOrder: {
                data:{}
            },
            device_columns: [
                {
                title: "序号",
                key: "index",
                width:80,
                align:"center"
                },
                {
                title: "存货编码",
                key: "no",
                align:"center"
                },
                {
                title: "存货名称",
                key: "name",
                align:"center",
                render: (h, params) => {
                    let texts = ''
                    if (params.row.name !== null) {
                        if (params.row.name.length > 15) {
                            texts = params.row.name.substring(0, 15) + '...'
                        } else {
                            texts = params.row.name
                        }
                    }
                    return h('Tooltip', {
                        props: {
                            placement: 'top'
                        }
                    }, [
                            texts,
                            h('span', {
                            slot: 'content',
                            style: {
                                whiteSpace: 'normal',
                                wordBreak: 'break-all'
                            }
                            }, params.row.name)
                        ])
                    }
                },
                {
                title: "规格型号",
                key: "spec",
                width: 200,
                align:"center",
                render: (h, params) => {
                    let texts = ''
                    if (params.row.spec !== null) {
                        if (params.row.spec.length > 20) {
                            texts = params.row.spec.substring(0, 20) + '...'
                        } else {
                            texts = params.row.spec
                        }
                    }
                    return h('Tooltip', {
                        props: {
                            placement: 'top'
                        }
                    }, [
                        texts,
                        h('span', {
                        slot: 'content',
                        style: {
                            whiteSpace: 'normal',
                            wordBreak: 'break-all'
                        }
                        }, params.row.spec)
                    ])
                    }
                },
                {
                title: "计量单位",
                key: "unit",
                align:"center"
                },
                {
                title: "数量",
                key: "count",
                align:"center"
                }
            ],
        }
    },
    mounted(){
        // this.getDetail();
    },
    methods:{
        getDetail(){
            const param = {
                typeid: 24001,
                data: [
                {
                    account_id: this.$store.state.user.accountId,
                    order_no: this.orderNO,
                    order_type: [0,1],
                    page_num: 1,
                    page_size: 10
                }],
            };
            this.$http.XLORDER(param).then((res)=>{
                let data = res.data.result.data[0].orderlist[0]||{};
                this.selectedOrder = {};
                this.selectedOrder.orderNO = data.order_no;
                this.selectedOrder.type = this.businessMap[data.order_type];
                this.selectedOrder.time = data.order_time;
                this.selectedOrder.salesType = this.saleMap[data.sale_type];
                this.selectedOrder.customName = data.customer_name;
                this.selectedOrder.contractNO = data.contract_no;
                this.selectedOrder.contract_subject = data.contract_subject;
                this.selectedOrder.count = data.product_count;
                this.selectedOrder.status = this.statusMap[data.order_status];
                this.selectedOrder.cellClassName = {
                    status:`button${data.order_status}`
                };
                this.selectedOrder.data = data;
                this.device_data = [];
                this.selectedOrder.status = this.statusMap[data.order_status];
                data.product_list.forEach((p,i) => {
                    let item = {};
                    item.index = i+1;
                    item.name = p.product_name;
                    item.no = p.product_code;
                    item.spec = p.product_models;
                    item.count = p.device_count;
                    item.unit = p.product_unit;
                    item.data = p;
                    this.device_data.push(item);
                });
            })
        }
    },
    computed: {
        statuses(){
            let statuses = [];
            if(this.selectedOrder){
                if(this.selectedOrder.type === '合同订单'){
                for(let key in this.statusMap3){
                    statuses.push({
                        index: key,
                        value: this.statusMap3[key]
                    })
                }
                }else{
                for(let key in this.statusMap2){
                    statuses.push({
                        index: key,
                        value: this.statusMap2[key]
                    })
                }
                }
            }
            return statuses;
        },
        length(){
            let length = 0;
            length = this.selectedIndex*100/this.statuses.length;
            return length;
        },
        device_data1(){
            let data = [];
            if(this.device_data&&this.device_data.length>0){
                data = this.device_data.filter(d => d.data.issued_count !== 0);
                data.forEach(d => {
                    d.count = d.data.issued_count;
                })
            }
            return data;
            },
        device_data2(){
            let data = [];
            if(this.device_data&&this.device_data.length>0){
                data = this.device_data.filter(d => d.data.device_count - d.data.issued_count !== 0);
                data.forEach(d => {
                    d.count = d.data.device_count - d.data.issued_count;
                })
            }
            return data;
        },
        selectedIndex(){
            let index = 0;
            if(this.selectedOrder){
                if(this.selectedOrder.type === '合同订单'){
                    index = ((this.selectedOrder||{}).data||{}).order_status - 1;
                    if(index > 3) index = 3;
                    if(index < 1) index = 1;
                }else{
                    index = ((this.selectedOrder||{}).data||{}).order_status + 1;
                    if(index > 6) index = 6;
                    if(index < 1) index = 1;
                }
            }
            return index;
        },
    },
    watch: {
        orderNO(){
            this.getDetail();
        }
    }
}
</script>
<style scoped>

</style>
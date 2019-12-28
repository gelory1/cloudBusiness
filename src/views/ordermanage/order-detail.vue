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
                color:${(statusColorMap[selectedOrder.status]||{}).color}`" v-show="selectedOrder.status !== '待支付'">
                {{selectedOrder.status}}
            </Button>
            <Poptip ref="popTip" trigger="hover" content="去支付" placement="bottom" style="position:absolute;right:30px;top:30px;text-align:center;" v-show="selectedOrder.status === '待支付'">
                <Button :style="`margin-top:30px;background-color:${(statusColorMap[selectedOrder.status]||{}).backgroundColor};
                color:${(statusColorMap[selectedOrder.status]||{}).color}`">
                {{selectedOrder.status}}
                </Button>
            </Poptip>
          
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
            <div v-if="selectedOrder.type ==='合同订单'">
                <span class="jbleft">客户名称：</span>
                <span class="jbright">{{selectedOrder.customName}}</span>
            </div>
            </div>
            <div style="line-height:40px;width:50%;float:right">
            <div v-if="selectedOrder.type !=='合同订单'">
                <span class="jbleft">客户名称：</span>
                <span class="jbright">{{selectedOrder.customName}}</span>
            </div>
            <div v-if="selectedOrder.type==='合同订单'">
                <span class="jbleft">合同编号：</span>
                <span class="jbright">{{selectedOrder.contractNO}}</span>
            </div>
            <div v-if="selectedOrder.type==='合同订单'">
                <span class="jbleft">合同主体：</span>
                <span class="jbright">{{subjectName[selectedOrder.contract_subject]}}</span>
            </div>
            <div>
                <span class="jbleft">设备数量：</span>
                <span style="color:#8D8D8D">{{selectedOrder.count}}
                <span>（<small style="color:green">本次交货：{{selectedOrder.issued_count}}</small>，<small style="color:red">剩余待发：{{selectedOrder.count - selectedOrder.issued_count}}</small>）</span>
                </span>
            </div>
            <div>
                <span class="jbleft">收货地址：</span>
                <span style="color:#8D8D8D">{{selectedOrder.address_detail}}</span>
            </div>
            </div>
        </div>
        <div style="margin-left:40px;"  v-if="this.selectedOrder.type == '备货订单'">
            <section style="width:90%;float:left;">
                <p style="color:#8d8d8d;margin-top:10px;">备货申请协议（附件）：</p>
                <div v-if="selectedOrder.file.id">
                  <div class="fj1">
                    <section class="fj_img">
                      <img :src="selectedOrder.file.img" alt style="width:20px;height:20px;margin:20px 40px" />
                    </section>
                    <section class="fj_sec1" style="margin-top:15px">
                      <a :href="selectedOrder.file.address" :download="selectedOrder.file.name"><p>{{selectedOrder.file.name}}</p></a>
                      <p class="fj_p1">
                        <span>{{selectedOrder.file.size}}</span> 来自
                        <span>{{selectedOrder.file.uploadMan}}</span> |
                        <span>{{selectedOrder.file.date}}</span>
                      </p>
                    </section>
                  </div>
                </div>
                <p v-else>暂无</p>
            </section>
        </div>
        <div style="clear:both;overflow: hidden;">
        <p class="djtitle">设备清单</p>
        <Tabs v-model="deviceTabName">
            <TabPane label="全部" name="name1">
                <Table :columns="device_columns" :data="device_data" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
            </TabPane>
            <TabPane :label="`已到货（${selectedOrder.issued_count||0}）`" name="name2">
                <Table :columns="device_columns" :data="device_data1" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
            </TabPane>
            <TabPane :label="`待发货（${selectedOrder.count - selectedOrder.issued_count||0}）`" name='name3'>
                <Table :columns="device_columns" :data="device_data2" size="small" style="margin:10px 0 0 0;overflow:auto"></Table>
            </TabPane>
        </Tabs>
        <div class="dd_div" style="float:right;margin:15px 30px 0 0;font-size:13px;" v-if="this.selectedOrder.type == '备货订单'">
            <section>
              <span class="dd_span" style="width:100px;display:inline-block">货款总计（元）</span>
              <span style="color:#000000;font-weight:bold">{{(selectedOrder.order_little_amount||0).toLocaleString()}}</span>
            </section>
            <section>
              <span class="dd_span" style="width:100px;display:inline-block">大写</span>
              <span style="color:#000000;font-weight:bold">{{upperAmount}}</span>
            </section>
          </div>
      </div>
    </div>
</template>
<script>
let $ = require("jquery");
export default {
    name:'orderDetail',
    props:['orderNO'],
    data() {
        return {
            statusColorMap:this.$option.order.statusColorMap,
            statusMap:this.$option.order.statusMap,
            statusMap2:this.$option.order.statusMap2,
            statusMap3:this.$option.order.statusMap3,
            subjectName:this.$option.contract.subjectNameMap,
            businessMap:this.$option.order.typeMap,
            saleMap:this.$option.contract.salesTypeMap,
            deviceTabName: 'name1',
            device_data: [],
            selectedOrder: {
                data:{},
                file:{}
            },
            columns: [
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
                },
                {
                    title: "单价（元）",
                    key: "price",
                    align:"center"
                },
                {
                    title: "总价（元）",
                    key: "totalPrice",
                    align:"center"
                },
                {
                    title: "税率",
                    key: "tax",
                    align:"center"
                },
            ],
        }
    },
    mounted(){
        $('.ivu-poptip-body-content-inner').css('color','#2d8cf0');
        $('.ivu-poptip-body-content-inner').css('cursor','pointer');
        $('.ivu-poptip-body').on('click',() => {
            // $('.ivu-poptip-body').css('display','none');
            let request = {
                "typeid": 28009,
                "data": [
                    {
                        "orderNo": this.orderNO,
                        "orderAmount": this.selectedOrder.data.order_little_amount,
                        "accountId": this.$store.state.user.accountId
                    }	
                ]
            }
            this.$http.SETWORKBENCH(request).then(res => {
                if(res.data.result.data.length>0){
                    this.$notify({
                        title: '支付提醒',
                        message: `${this.orderNO}备货订单已签署完毕，请尽快支付。点击直接处理`,
                        duration: 60000,
                        offset: 100,
                        openData: () => {
                            this.$Message.info('处理中...');
                            let d = this.$store.state.app.workBenchData.find(d => d.workbenchId === res.data.result.data[0][0])||{};
                            let item = {
                                data: d
                            };
                            this.$router.push({path: '/home', query: {notice: item}});
                        },
                        onClick: function () {
                            this.close();
                            this.openData();
                        }
                    });
                }else{
                    this.$store.dispatch('getworkBench',{accountId:this.$store.state.user.accountId,this:this});
                }
            })
        });
    },
    methods:{
        getDetail(){
            const param = {
                typeid: 24008,
                data: [
                {
                    order_no: this.orderNO,
                }],
            };
            this.$http.XLORDER(param).then((res)=>{
                let data = res.data.result.data[0]||{};
                this.selectedOrder = {};
                this.selectedOrder.orderNO = data.order_no;
                this.selectedOrder.type = this.businessMap[data.order_type];
                this.selectedOrder.time = data.order_time;
                this.selectedOrder.order_big_amount = data.order_big_amount;
                this.selectedOrder.order_little_amount = data.order_little_amount;
                this.selectedOrder.salesType = this.saleMap[data.sale_type];
                this.selectedOrder.customName = data.agent_name;
                this.selectedOrder.contractNO = data.contract_no;
                this.selectedOrder.contract_subject = data.contract_subject;
                this.selectedOrder.address_detail = data.address_detail;
                this.selectedOrder.status = this.statusMap[data.order_status];
                if(data.order_enclosure&&data.order_enclosure.length>0){
                    let file_size = data.order_enclosure[0].file_size;
                    let fileArr = data.order_enclosure[0].file_name.split('.');
                    let fileType = fileArr[fileArr.length-1];
                    let img = require('../../images/upload/wenjian.png');
                    if(/^pdf$/.test(fileType)){
                        img = require('../../images/upload/pdf.png');
                    }else if(/^(txt|doc(x)?)$/.test(fileType)){
                        img = require('../../images/upload/docx.png');
                    }else if(/^(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/.test(fileType)){
                        img = require('../../images/upload/jpg.png');
                    }else if(/^xl(s|t|am)$/.test(fileType)){
                        img = require('../../images/upload/excel.png');
                    };
                    this.selectedOrder.file = {
                        name:this.selectedOrder.orderNO + ' ' + this.selectedOrder.customName + '-'+ '申请备货协议',
                        size:file_size >= 1024?((file_size/1024).toFixed(2) + ' KB'): file_size >= 1024*1024?((file_size/(1024*1024)).toFixed(2) + ' MB'):(file_size + ' B'),
                        uploadMan:data.order_enclosure[0].account_name,
                        date:data.order_enclosure[0].upload_time,
                        address:data.order_enclosure[0].enclosure_address,
                        id:data.order_enclosure[0].enclosure_id,
                        img:img,
                    }
                }
                this.selectedOrder.cellClassName = {
                    status:`button${data.order_status}`
                };
                this.selectedOrder.data = data;
                this.device_data = [];
                let allNum = 0;
                let num = 0;
                data.productList.forEach((p,i) => {
                    allNum += p.product_quantity;
                    num += p.issued_count;
                    let item = {};
                    item.index = i+1;
                    item.name = p.product_name;
                    item.no = p.product_code;
                    item.spec = p.product_models;
                    item.count = p.product_quantity;
                    item.issued_count = p.issued_count;
                    item.unit = p.product_unit;
                    item.data = p;
                    if(this.selectedOrder.type === '备货订单'){
                        item.price = p.product_price||0;
                        item.totalPrice = item.price*item.count;
                        item.tax = '6%';
                    }
                    this.device_data.push(item);
                });
                this.selectedOrder.count = allNum;
                this.selectedOrder.issued_count = num;
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
                data = this.device_data.filter(d => d.issued_count !== 0);
                data.forEach(d => {
                    d.count = d.issued_count;
                    if(this.selectedOrder.type === '备货订单'){
                        d.totalPrice = d.price*d.count;
                    }
                })
            }
            return data;
            },
        device_data2(){
            let data = [];
            if(this.device_data&&this.device_data.length>0){
                data = this.device_data.filter(d => d.count - d.issued_count !== 0);
                data.forEach(d => {
                    d.count = d.count - d.issued_count;
                    if(this.selectedOrder.type === '备货订单'){
                        d.totalPrice = d.price*d.count;
                    }
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
        upperAmount(){
            return this.$util.NumberToChinese(Number(this.selectedOrder.order_little_amount)||0);
        },
        device_columns(){
            let columns = [];
            if(this.selectedOrder.type === '合同订单'){
                columns = this.columns.filter(c => c.key !== 'price'&&c.key !== 'totalPrice'&&c.key !== 'tax');
            }else{
                columns = this.columns;
            }
            return columns;
        }
    },
    watch: {
        orderNO(){
            this.getDetail();
        }
    }
}
</script>
<style scoped>
@import "../contractmanage/contract.css";
@import "../customermanage/customer.css";
</style>
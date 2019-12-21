<template>
  <div class="fh_detial layout">
    <Layout style="background:#ffffff;width:95%;minHeight:800px;">
      <div class="header_top" @click="goBack">
        <Icon type="ios-arrow-left"></Icon>
        <span>返回</span>
      </div>
      <header class="fa_mid">
        <Button v-if="$route.query.zt == '草稿'" type="ghost" class="right fa_b1" @click="editClick">编辑</Button>
        <Button type="ghost" class="right fa_b">{{$route.query.zt}}</Button>
        <h2>发货方案详情</h2>

        <div class="fa_div">
          <p>
            <span class="gray">方案编号：</span>
            {{detailData.schemeNo}}
          </p>
          <p>
            <span class="gray">发起时间：</span>
            {{detailData.time}}
          </p>
          <p>
            <span class="gray">发起人：</span>
            {{detailData.manageMan}}
          </p>
          <p>
            <span class="gray">期望发货时间：</span>
            {{detailData.deliveryTime.split(' ')[0]}} 之前
          </p>
        </div>
        <div class="fa_div1">
          <p class="left">方案描述：</p>
          <div class="left">
            <p>{{detailData.des}}</p>
          </div>
        </div>
      </header>
      <content>
        <div class="fa_p">
          <p class="left">批次要求： {{detailData.shipments_start_batch}} - {{detailData.shipments_end_batch}}</p>
          <p>
            <span>
              金额
              <b>{{($route.query||{}).jexj||0}}</b>元
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
                style="margin:20px 0 0 0px;overflow:auto;min-height:400px;"
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
                style="margin:0px 0 0 0;overflow:auto;min-height:400px"
              ></Table>
            </div>
          </div>
        </div>
      </content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: "detail",
  data() {
    return {
      detailData:{
        schemeNo:'',
        time:'',
        manageMan:'',
        deliveryTime:'',
        des:'',
        shipments_end_batch:'',
        shipments_start_batch:'',
        orderList: []
      },
      orderColumns: [
        {
          title: "订单编号",
          key: "orderNo"
        }
      ],
      deliveryBatch:[
          {
            name:"仓库1",
            value:"1"
          },
          {
            name:"仓库2",
            value:"2"
          },
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
          title:"发货批次",
          key:"delivery_batch",
          align:"center",      
          render:(h,params)=>{
              return h('Select',{
                props:{
                  placeholder:"未设置",
                  size:"small"
                },
                style:{
                  // position:'relative'
                }
              },
              this.deliveryBatch.map((item)=>{
                  return h('Option',{
                    props:{
                      placeholder:"未设置",
                      value:item.value,
                      label:item.name
                    }
                  })
              }))
            }
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
      selectedCustom: '全部',
      orderDataCache:{}
    };
  },
  methods: {
    editClick(){
      if(this.authority.find(a => a.id === 1006)){
        this.$router.push({
          name: "delivery_detail2",
          query: this.detailData
        });
      }else{
        this.$Message.error('权限不足！');
      }
    },
    changeRow(data) {
      this.currentRow = JSON.parse(JSON.stringify(data));
    },
    goBack() {
      var _self = this;
      _self.$router.go(-1);
    },
    getDetail(){
      let request = {
        "typeid": 23020,
        "data": [
            {
              "account_id": this.$store.state.user.accountId,
              "shipments_id": (this.$route.query||{}).shipments_id
            }
        ]
      };
      this.orderData =[
        {
          orderNo:'汇总'
        }
      ];
      this.$http.PostXLASSETS(request).then(response => {
        this.orderData =[
          {
            orderNo:'汇总'
          }
        ];
        let { data } = response.data.result;
        this.detailData.schemeNo = data[0].shipments_no;
        this.detailData.time = data[0].shipments_creationtime;
        this.detailData.manageMan = data[0].user_name;
        this.detailData.deliveryTime = data[0].shipments_time;
        this.detailData.des = data[0].shipments_describe;
        this.detailData.shipments_start_batch = data[0].shipments_start_batch;
        this.detailData.shipments_end_batch = data[0].shipments_end_batch;
        this.detailData.shipments_id = request.data[0].shipments_id;
        this.detailData.data = data[0];
        data[0].product_list.forEach(p => {
          if(!this.detailData.orderList.find(o => o.order_id === p.order_id)){
            this.detailData.orderList.push({
              orderNo: p.order_no,
              order_id: p.order_id,
              productList: [p],
              customer_name:p.customer_name||'--'
            })
          }else{
            let obj = this.detailData.orderList.find(o => o.order_id === p.order_id);
            obj.productList.push(p);
          }
        })
        this.orderData = this.orderData.concat(this.detailData.orderList);
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
      // for(let key in this.$refs['cktable'].objData){
      //   if(name === this.$refs['cktable'].objData[key].orderNo){
      //     this.$refs['cktable'].objData[key]._isHighlight = true;
      //     this.currentRow = this.$refs['cktable'].objData[key];
      //   }else{
      //     this.$refs['cktable'].objData[key]._isHighlight = false;
      //   }
      // }
    }
  },
  mounted() {
    this.getDetail();
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
    authority(){
      return this.$store.state.app.authority;
    }
  },
  watch:{
    '$route'(){
      this.detailData = {
        schemeNo:'',
        time:'',
        manageMan:'',
        deliveryTime:'',
        des:'',
        shipments_end_batch:'',
        shipments_start_batch:'',
        orderList: []
      };
      this.getDetail();
    }
  }
};
</script>

<style>
@import "../assetmanage.css";
@import "../../customermanage/customer.css";
.ivu-select-single .ivu-select-selection .ivu-select-placeholder{
 color:orange
}
</style>
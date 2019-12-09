<template>
  <div class="delivery">
    <Layout>
      <Menu width="auto" size="small" style="padding-top:30px;">
        <div class="fh_but">
          <Button type="ghost">发货方案查询</Button>
        </div>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;">
            <Input
              icon="ios-search"
              placeholder="请输入内容"
              v-model="inputVal"
              @on-enter="getDeliveryList(1)"
              @on-click="getDeliveryList(1)"
              style="width: 200px;margin-right:20px;"
            />
            <span class="f_gl">
              <span class="cor">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>

              <!-- 过滤页面... -->
            </span>
            <span style="padding:0 5px">|</span>
            <span class="f-more">
              <span class="cor1">
                <Icon type="navicon-round"></Icon>
                <span>更多</span>
              </span>
              <!-- 更多页面... -->
            </span>
          </div>
          <Button type="primary" size="large" icon="ios-plus-empty" class="addBut" @click="addClick">新建发货方案</Button>
        </Header>
      </Menu>
      <Content :style="{background: '#fff', minHeight: '800px'}" style="padding-left:20px;margin-top:-10px;">
        <Tabs ref="tab" v-model="tabName" @on-change="changeTab">
          <TabPane
            v-for="(item,index) in fhStatus"
            :label="item.type"
            :name="item.name"
            :key="item.type"
          >
            <Table
              :columns="fh_columns"
              :data="fh_data"
              size="small"
              :loading="loading"
              @on-row-dblclick="editClick"
            ></Table>
            <Page
              :total="sum"
              :current.sync="pageNum"
              :page-size="10"
              size="small"
              @on-change="getDeliveryList"
              show-elevator
              style="text-align:center;margin-top:20px;margin-bottom:200px"
            ></Page>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  </div>
</template>

<script>
const fhStatus = [
  {
    type: "全部",
    name: "name1",
    index: 0
  },
  {
    type: "草稿",
    name: "name2",
    index: 1
  },
  {
    type: "审批中",
    name: "name3",
    index: 2
  },
  {
    type: "已通过",
    name: "name4",
    index: 3
  },
  {
    type: "被驳回",
    name: "name5",
    index: 4
  }
];
export default {
  name: "deliveryManage",
  data() {
    return {
      fhStatus,
      inputVal: "",
      sum:0,
      pageNum:1,
      loading: false,
      fh_columns: [
        {
          type: "selection",
          align: "center",
          width: 80
        },
        {
          key: "fabh",
          title: "方案编号",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  props: {},
                  on: {
                    click: () => {
                      let data = {...params.row};
                      data.shipments_id = data.data.shipments_id;
                      this.$router.push({
                        name: "delivery_detail",
                        query: data
                      });
                    }
                  }
                },
                params.row.fabh
              )
            ]);
          }
        },
        {
          key: "fqr",
          title: "发起人",
          align: "center"
        },
        {
          key: "fqsj",
          title: "发起时间",
          align: "center"
        },
        {
          key: "fqms",
          title: "方案描述",
          align: "center"
        },
        {
          key: "ddsl",
          title: "订单数量",
          align: "center"
        },
        {
          key: "sbsl",
          title: "设备数量",
          align: "center"
        },
        {
          key: "jexj",
          title: "金额小计（元）",
          align: "center"
        },
        {
          key: "zt",
          title: "状态",
          align: "center"
        }
      ],
      fh_data: [],
      tabName: "name1"
    };
  },
  methods: {
    editClick(item) {
      if(item.data.shipments_status === 0||item.data.shipments_status === 3){
        item.shipments_id = item.data.shipments_id;
        this.$router.push({
          name: "delivery_detail2",
          query: item
        });
      }else{
        this.$Message.error('当前状态不支持编辑！');
      }
    },
    addClick() {
      this.$router.push({
        path: "/assetmanage/delivery-manage/newbuild"
      });
    },
    getDeliveryList(p) {
      let index = this.fhStatus.find(f => f.name === this.tabName).index -1;
      let request = {
        "typeid": 23019,
        "data": [
            {
              "account_id": this.$store.state.user.accountId,
              "page_num": p,
              "page_size": 10,
              "keyword": this.inputVal,
              "shipments_status": index === -1?undefined:index
            }
        ]
      };
      this.fh_data = [];
      this.loading = true;
      this.$http.PostXLASSETS(request).then(response => {
        this.loading = false;
        this.fh_data = [];
        let { data } = response.data.result;
        this.sum = data[0].sum;
        data[0].shipments_list.forEach(s => {
          this.fh_data.push({
            fabh: s.shipments_no,
            fqr: s.user_name,
            fqsj: s.shipments_creation_time,
            fqms: s.shipments_describe,
            ddsl: s.order_quantity,
            sbsl: s.product_sum,
            jexj: s.total_money,
            zt: (this.fhStatus.find(f => f.index === s.shipments_status+1)||{}).type,
            data:s
          })
        });
      },error => {
        this.loading = false;
        this.fh_data = [];
      })
    },
    changeTab(){
      this.pageNum = 1;
      this.getDeliveryList(1);
    }
  },
  mounted() {
    this.getDeliveryList(1);
  },
  watch:{
    tabName(){
      this.changeTab();
    }
  }
};
</script>

<style>
@import "../assetmanage.css";
.ivu-layout-header{
    line-height:80px
}
</style>
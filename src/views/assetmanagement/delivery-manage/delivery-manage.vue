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
              @on-enter="getCustomList(1)"
              @on-click="getCustomList(1)"
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
          <Button type="ghost" icon="ios-plus-empty" class="addBut" @click="addClick">新建发货方案</Button>
        </Header>
      </Menu>
      <Content :style="{background: '#fff', minHeight: '800px'}" style="padding-left:20px">
        <Tabs ref="tab" v-model="tabName">
          <TabPane
            v-for="(item,index) in fhStatus"
            :label="item.type"
            :name="item.name"
            :key="item.type"
          >
            <Table
              :columns="fh_columns"
              :data="fh_data[index]"
              size="small"
              :loading="loading"
              @on-row-dblclick="editClick"
            ></Table>
            <Page
              :page-size="10"
              size="small"
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
                      this.$router.push({
                        path: "/assetmanage/delivery-manage/detail"
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
      fh_data: {
        0: [
          {
            fabh: "3"
          }
        ],
        1: [],
        2: [],
        3: [],
        4: []
      },
      tabName: "name1"
    };
  },
  methods: {
    editClick() {
    //草稿状态下才能进入编辑
      this.$router.push({
        path: "/assetmanage/delivery-manage/editbuild"
      });
    },
    addClick() {
      this.$router.push({
        path: "/assetmanage/delivery-manage/newbuild"
      });
    },
    getCustomList(p) {}
  },
  mounted() {
    this.getCustomList(1);
  }
};
</script>

<style>
@import "../assetmanage.css";
</style>
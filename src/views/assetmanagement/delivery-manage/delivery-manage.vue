<template>
  <div class="delivery" @click="tooltipClick('outside')">
    <Layout>
      <Menu width="auto" size="small" style="height:70px;">
        <div class="fh_but">
          <Button type="ghost" style="margin-top:15px;margin-left:5px;">发货方案查询</Button>
        </div>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;" @click.stop="tooltipClick('inside')">
            <Input
              icon="ios-search"
              placeholder="请输入内容"
              v-model="inputVal"
              @on-enter="getDeliveryList(1)"
              @on-click="getDeliveryList(1)"
              style="width: 200px;margin-right:20px;"
            />
            <span class="f_gl">
              <span class="cor" @click="glkhClick">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>

              <!-- 过滤页面... -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="filterItem" :model="filterItem" :label-width="100">
                  <FormItem label="客户名称" prop="customerName">
                    <Input type="text" v-model="filterItem.customerName" />
                  </FormItem>
                  <FormItem label="发起时间段">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          placeholder="开始日期"
                          v-model="filterItem.startTime"
                          :options="startOption"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          placeholder="结束日期"
                          v-model="filterItem.endTime"
                          :options="endOption"
                        ></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="订单数量级">
                    <Row>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.orderstart" style="width:100%"></InputNumber>
                      </Col>
                      <Col span="2" style="text-align: center">至</Col>
                      <Col span="11">
                        <InputNumber :min="filterItem.orderstart" v-model="filterItem.orderend" style="width:100%"></InputNumber>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="设备数量级" prop>
                    <Row>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.setstart" style="width:100%"></InputNumber>
                      </Col>
                      <Col span="2" style="text-align: center">至</Col>
                      <Col span="11">
                        <InputNumber :min="filterItem.setstart" v-model="filterItem.setend" style="width:100%"></InputNumber>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="金额范围" prop>
                    <Row>
                      <Col span="11">
                        <InputNumber :min="0" v-model="filterItem.moneystart" style="width:100%"></InputNumber>
                      </Col>
                      <Col span="2" style="text-align: center">至</Col>
                      <Col span="11">
                        <InputNumber :min="filterItem.moneystart" v-model="filterItem.moneyend" style="width:100%"></InputNumber>
                      </Col>
                    </Row>
                  </FormItem>
                  <!-- <FormItem label="完成度">
                    <Row>
                      <Col span="11">
                        <Input type="text" v-model="filterItem.prostart" />
                      </Col>
                      <Col span="2" style="text-align: center">至</Col>
                      <Col span="11">
                        <Input type="text" v-model="filterItem.proend" />
                      </Col>
                    </Row>
                  </FormItem> -->
                  <FormItem>
                    <Button @click="handleResetht('filterItem')" style="margin-left: 8px">重置</Button>
                    <Button type="primary" @click="handleSubmitht('filterItem')">确定</Button>
                  </FormItem>
                </Form>
              </div>
            </span>
            <span style="padding:0 5px">|</span>
            <span class="f-more">
              <span class="cor1" @click="moreClick">
                <Icon type="navicon-round"></Icon>
                <span>更多</span>
              </span>
              <!-- 更多页面... -->
              <div v-show="moreShow" class="more">
                <p>敬请期待......</p>
              </div>
            </span>
          </div>
          <div></div>
        </Header>
         <Button
          type="primary"
          icon="ios-plus-empty"
          class="addBut1"
          @click="addClick"
        >新建发货方案</Button>
      </Menu>
      <Content
        :style="{background: '#fff', minHeight: scrollHeight}"
        style="padding:0 20px;margin-top:0px;"
      >
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
              show-total
              @on-change="getDeliveryList"
              show-elevator
              style="text-align:center;margin:20px 0 40px  0;"
            ></Page>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  </div>
</template>

<script>
export default {
  name: 'deliveryManage',
  data () {
    return {
      fhStatus: this.$option.asset.deliveryStatus,
      statusColorMap: this.$option.asset.deliveryStatusColorMap,
      inputVal: '',
      sum: 0,
      pageNum: 1,
      loading: false,
      glShow: false,
      moreShow: false,
      filterStatus: false,
      filterItem: {
        customerName: '',
        startTime: '',
        endTime: '',
        orderstart: 0,
        orderend: 0,
        setstart: 0,
        setend: 0,
        moneystart: 0,
        moneyend: 0,
        prostart: '',
        proend: ''
      },
      startOption: {
        disabledDate: time => {
          if (this.filterItem.endTime) {
            return time.getTime() > new Date(this.filterItem.endTime).getTime();
          }
        }
      },
      endOption: {
        disabledDate: time => {
          if (this.filterItem.startTime) {
            return (
              time.getTime() < new Date(this.filterItem.startTime).getTime()
            );
          }
        }
      },
      fh_columns: [
        {
          type: 'selection',
          align: 'center',
          width: 80
        },
        {
          key: 'fabh',
          title: '方案编号',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'a',
                {
                  props: {},
                  on: {
                    click: () => {
                      let data = { ...params.row };
                      data.shipments_id = data.data.shipments_id;
                      if (this.authority.find(a => a.id === 1004)) {
                        this.$router.push({
                          name: 'delivery_detail',
                          query: data
                        });
                      } else {
                        this.$Message.error('权限不足！');
                      }
                    }
                  }
                },
                params.row.fabh
              )
            ]);
          }
        },
        {
          key: 'fqr',
          title: '发起人',
          align: 'center'
        },
        {
          key: 'fqsj',
          title: '发起时间',
          align: 'center'
        },
        {
          key: 'fqms',
          title: '方案描述',
          align: 'center',
          render: (h, params) => {
            let texts = '';
            if (params.row.fqms !== null) {
              if ((params.row.fqms || '').length > 20) {
                texts = params.row.fqms.substring(0, 20) + '...';
              } else {
                texts = params.row.fqms;
              }
            }
            return h('Tooltip', {
              props: {
                transfer: true
              }
            }, [
              texts,
              h('span', {
                slot: 'content',
                style: {
                  whiteSpace: 'normal',
                  wordBreak: 'break-all'
                }
              }, params.row.fqms)
            ]);
          }
        },
        {
          key: 'ddsl',
          title: '订单数量',
          align: 'center'
        },
        {
          key: 'sbsl',
          title: '设备数量',
          align: 'center'
        },
        {
          key: 'jexj',
          title: '金额小计（元）',
          align: 'center'
        },
        {
          key: 'zt',
          title: '状态',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                    backgroundColor: params.row.zt
                      ? this.statusColorMap[params.row.zt]
                        .backgroundColor
                      : 'white',
                    color: params.row.zt
                      ? this.statusColorMap[params.row.zt].color
                      : '#7D7F82'
                  }
                },
                params.row.zt
              )
            ]);
          }
        }
      ],
      fh_data: [],
      tabName: 'name1',
      filterStatus: false,
      tableHeight: ''
    };
  },
  methods: {
    handleSubmitht (name) {
      let status = true;
      for (let key in this.filterItem) {
        if (this.filterItem[key] !== '' && this.filterItem[key] !== 0) {
          status = false;
        }
      }
      if (status) {
        this.filterStatus = false;
        $('.cor').css({ color: '#000000' });
        this.glShow = false;
        this.getDeliveryList(1);
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.filterStatus = true;
          this.glShow = false;
          this.getDeliveryList(1);
        } else {
          this.$Message.error('Fail!');
        }
      });
    },
    handleResetht () {
      this.filterStatus = false;
      for (let key in this.filterItem) {
        if (key === 'orderstart' || key === 'orderend' || key === 'setstart' || key === 'setend' || key === 'moneystart' || key === 'moneyend') {
          this.filterItem[key] = 0;
        } else {
          this.filterItem[key] = '';
        }
      }
    },
    tooltipClick (side) {
      if (side === 'inside') {
        this.tooptipShow = !this.tooptipShow;
      } else if (side === 'outside') {
        if (this.tooptipShow) this.tooptipShow = false;
      }
    },
    editClick (item) {
      if (
        item.data.shipments_status === 0 ||
        item.data.shipments_status === 3
      ) {
        item.shipments_id = item.data.shipments_id;
        if (this.authority.find(a => a.id === 1006)) {
          this.$router.push({
            name: 'delivery_detail2',
            query: item
          });
        } else {
          this.$Message.error('权限不足！');
        }
      } else {
        this.$Message.error('当前状态不支持编辑！');
      }
    },
    addClick () {
      if (this.authority.find(a => a.id === 1005)) {
        this.$router.push({
          path: '/assetmanage/delivery-manage/newbuild'
        });
      } else {
        this.$Message.error('权限不足！');
      }
    },
    getDeliveryList (p) {
      let index = this.fhStatus.find(f => f.name === this.tabName).index - 1;
      let request = {
        typeid: 23019,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            page_num: p,
            page_size: 10,
            keyword: this.inputVal,
            shipments_status: index === -1 ? undefined : index,
            agent_name: this.filterItem.customerName === '' ? undefined : ('%' + this.filterItem.customerName),
            shipments_start_time: this.filterItem.startTime === '' ? undefined : this.filterItem.startTime.getFullYear() + '-' +
              (this.filterItem.startTime.getMonth() + 1) + '-' + this.filterItem.startTime.getDate() + ' 00:00:00',
            shipments_end_time: this.filterItem.endTime === '' ? undefined : this.filterItem.endTime.getFullYear() + '-' +
              (this.filterItem.endTime.getMonth() + 1) + '-' + this.filterItem.endTime.getDate() + ' 23:59:59',
            order_count_start: this.filterItem.orderend === 0 ? undefined : this.filterItem.orderstart,
            order_count_end: this.filterItem.orderend === 0 ? undefined : this.filterItem.orderend,
            product_count_start: this.filterItem.setend === 0 ? undefined : this.filterItem.setstart,
            product_count_end: this.filterItem.setend === 0 ? undefined : this.filterItem.setend,
            money_start: this.filterItem.moneyend === 0 ? undefined : String(this.filterItem.moneystart),
            money_end: this.filterItem.moneyend === 0 ? undefined : String(this.filterItem.moneyend)
          }
        ]
      };
      this.fh_data = [];
      this.loading = true;
      this.sum = 0;
      this.$http.PostXLASSETS(request).then(
        response => {
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
              zt: (
                this.fhStatus.find(f => f.index === s.shipments_status + 1) ||
                {}
              ).type,
              data: s
            });
          });
        },
        error => {
          this.loading = false;
          this.fh_data = [];
        }
      );
    },
    changeTab () {
      this.pageNum = 1;
      this.getDeliveryList(1);
    },
    glkhClick () {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow || this.filterStatus) {
        $('.cor').css({ color: '#4a9af5' });
        $('.cor1').css({ color: '#000000' });
      } else {
        $('.cor').css({ color: '#000000' });
      }
    },
    moreClick () {
      this.moreShow = !this.moreShow;
      this.glShow = false;
      if (this.moreShow) {
        $('.cor1').css({ color: '#4a9af5' });
        $('.cor').css({ color: '#000000' });
      }
    },
    closeglClick () {
      this.glShow = false;
      if (!this.filterStatus) $('.cor').css({ color: '#000000' });
    }
  },
  mounted () {
    this.getDeliveryList(1);
  },
  computed: {
    scrollHeight () {
      let h = 0;
      h = document.body.scrollHeight - 185 + 'px';
      return h;
    },
    authority () {
      return this.$store.state.app.authority;
    }
  },
  watch: {
    tabName () {
      this.changeTab();
    },
    'filterItem.orderstart' (nv) {
      if (this.filterItem.orderend < nv) {
        this.filterItem.orderend = nv;
      }
    },
    'filterItem.setstart' (nv) {
      if (this.filterItem.setend < nv) {
        this.filterItem.setend = nv;
      }
    },
    'filterItem.moneystart' (nv) {
      if (this.filterItem.moneyend < nv) {
        this.filterItem.moneyend = nv;
      }
    }
  }
};
</script>

<style>
@import "../assetmanage.css";
</style>
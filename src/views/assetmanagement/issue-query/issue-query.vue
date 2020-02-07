<template>
  <div class="issue" @click="tooltipClick('outside')">
    <Layout>
      <Sider
        breakpoint="md"
        collapsible
        style="background-color: #ffffff;flex: 0 0 150px;min-width: 500;"
      >
        <Menu width="auto" size="small">
          <div class="tip">
            <p class="tooltip" @click.stop="tooltipClick('inside')">
              {{cpxhpz[cktype_current_index].name}}
              <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
            </p>
            <div class="tooltipslot" v-show="tooptipShow">
              <p v-for="(item,index) in cpxhpz" @click="selectClick(index)" :key="index">{{item.name}}</p>
            </div>
          </div>
        </Menu>
        <hr
          style="border:0.6px solid #DDDDDD;width:90%;margin:0 auto;margin-top:20px;margin-bottom:5px"
        />
        <AutoComplete
          v-model="completeValue"
          @on-select="goMenu"
          clearable
          transfer
          placeholder="搜索仓库"
          @keyup.enter.native="searchMenu"
          :style="{width:180 + 'px',marginLeft:10+'px',marginBottom: 5+'px'}"
        >
          <Option
            v-for="item in completeData"
            :value="item.wh_name"
            :key="item.wh_id"
          >{{ item.wh_name }}</Option>
        </AutoComplete>
        <div :style="{height:scrollHeight,overflow:'auto'}" ref="menuContainer">
          <Menu
            width="auto"
            class="menu"
            ref="menu"
            :open-names="['2']"
            @on-select="selecttwoClick"
          >
            <Submenu name="2">
              <template slot="title">
                <Icon type="arrow-down-b"></Icon>
                <span>{{menuitem}}</span>
              </template>
              <MenuItem
                v-for="(item,index) in menudata"
                :name="index"
                :key="item.wh_id"
              >{{item.wh_name}}</MenuItem>
            </Submenu>
          </Menu>
        </div>
        <div slot="trigger"></div>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;">
            <Input
              icon="ios-search"
              placeholder="请输入内容"
              style="width: 200px;margin-right:20px;"
              @on-enter="search"
              @on-click="search"
              v-model="inputVal"
            />
            <span class="f_gl">
              <span @click="glkhClick" class="cor">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>

              <!-- 过滤 -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="cusfilterItem" :model="cusfilterItem" :label-width="80">
                  <FormItem label="单据编号" prop="djbh">
                    <Input type="text" v-model="cusfilterItem.djbh" placeholder="请输入单据编号" />
                  </FormItem>
                  <FormItem label="订单编号" prop="ddbh">
                    <Input type="text" v-model="cusfilterItem.ddbh" placeholder="请输入订单编号" />
                  </FormItem>
                  <FormItem label="客户名称" prop="khmc">
                    <Input type="text" v-model="cusfilterItem.khmc" placeholder="请输入客户名称" />
                  </FormItem>
                  <FormItem label="出库类别" prop="cklb" v-if="this.tabName == 'name2'">
                    <Select v-model="cusfilterItem.cklb" clearable filterable>
                      <Option
                        :value="item"
                        v-for="item in ['出库发货']"
                        :key="item"
                      >{{item}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="入库类别" prop="rklb" v-if="this.tabName == 'name1'">
                    <Select v-model="cusfilterItem.rklb" clearable filterable>
                      <Option
                        :value="item"
                        v-for="item in ['成品入库']"
                        :key="item"
                      >{{item}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="规格型号" prop="ggxh">
                    <Input type="text" v-model="cusfilterItem.ggxh" placeholder="请输入规格型号" />
                  </FormItem>
                  <FormItem label="合同编号" prop="htbh">
                    <Input type="text" v-model="cusfilterItem.htbh" placeholder="请输入合同编号" />
                  </FormItem>
                  <FormItem label="状态" prop="zt">
                    <Select v-model="cusfilterItem.zt" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in status"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="发起时间段">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placeholder="开始日期"
                          v-model="cusfilterItem.startTime"
                          placement="bottom-end"
                          :options="startOption"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placeholder="结束日期"
                          v-model="cusfilterItem.endTime"
                           placement="bottom-end"
                          :options="endOption"
                        ></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Button @click="handleReset('cusfilterItem')" style="margin-left: 8px">重置</Button>
                    <Button type="primary" @click="handleSubmitgl('cusfilterItem')">确定</Button>
                  </FormItem>
                </Form>
              </div>
            </span>
            <span style="padding:0 5px">|</span>
            <span class="f-more">
              <span @click="moreClick" class="cor1">
                <Icon type="navicon-round"></Icon>
                <span>更多</span>
              </span>
              <!-- 更多 -->
              <div v-show="moreShow" class="more">
                <p>敬请期待......</p>
              </div>
            </span>
          </div>
        </Header>
        <Content
          :style="{background: '#fff', minHeight: scrollHeight}"
          style="padding:0 10px;margin-top:-20px;"
        >
          <Tabs ref="tab" v-model="tabName" @on-click="changeTab">
            <TabPane label="入库单据" name="name1">
              <Table
                :columns="rkdj_columns"
                :data="rkdj_data"
                size="small"
                :loading="inLoading"
              ></Table>
              <Page
                :current.sync="inPageNum"
                :total="zkSum"
                :page-size="10"
                @on-change="getProductList"
                size="small"
                show-total
                show-elevator
                style="text-align:center;margin:20px 0;"
              ></Page>
            </TabPane>
            <TabPane label="出库单据" name="name2">
              <Table
                :columns="ckdj_columns"
                :data="ckdj_data"
                size="small"
                :loading="outLoading"
              ></Table>
              <Page
                :current.sync="outPageNum"
                :total="crkSum"
                :page-size="10"
                @on-change="getProductList"
                size="small"
                show-total
                show-elevator
                style="text-align:center;margin:20px 0;"
              ></Page>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
    <!-- 入库详情页面 -->
    <Modal v-model="rkxqmodal" width="1000" class-name="vertical-center-modal">
      <div>
        <div style="float:left;margin:30px  20px;">
          <h3>入库单详情</h3>
          <p style="font-size:11px;">
            单据编号:
            <span>{{djbh}}</span>
          </p>
        </div>
        <Button style="float:right;margin:30px 0 0 0;" :class="djxx.zt">{{djxx.zt}}</Button>
      </div>
      <div style="clear:both;">
        <p class="djtitle">单据信息</p>
        <div style="line-height:40px;width:45%;float:left" class="dj_div">
          <div>
            <span class="jbleft">入库类别：</span>
            <span class="jbright wid">{{djxx.rklb}}</span>
          </div>
          <div>
            <span class="jbleft">入库日期：</span>
            <span class="jbright wid">{{djxx.rkrq}}</span>
          </div>
          <div>
            <span class="jbleft">仓库：</span>
            <span class="jbright wid">{{djxx.ck}}</span>
          </div>
          <div>
            <span class="jbleft">客户名称：</span>
            <span class="jbright wid">{{djxx.khmc}}</span>
          </div>
          <Tooltip>
            <div slot="content">
              <p v-for="(item,index) in djxx.ddbh.split(',')" :key="index">{{item}}</p>
            </div>
            <div style="width:350px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:#8D8D8D;">
              <span class="jbleft">订单编号：</span>
                <span
                  class="wid"
                >{{djxx.ddbh}}</span>
            </div>
          </Tooltip>
        </div>
        <div style="line-height:40px;width:50%;float:right">
          <div>
            <span class="jbleft">设备数量：</span>
            <span class="jbright wid">{{djxx.sbsl}}</span>
          </div>
          <div>
            <span class="jbleft">审核人：</span>
            <span class="jbright wid">{{djxx.shr}}</span>
          </div>
          <div>
            <span class="jbleft">审核时间：</span>
            <span class="jbright wid">{{djxx.shsj}}</span>
          </div>
          <div>
            <span class="jbleft">收货地址：</span>
            <span class="wid shdz">{{djxx.address}}</span>
          </div>
          <div>
            <span class="jbleft">调拨单号：</span>
            <span class="wid shdz">{{djxx.ioBillId}}</span>
          </div>
        </div>
      </div>
      <div style="clear:both;overflow: hidden;margin-top:20px;">
        <Tabs v-model="tabDeviceName1">
          <TabPane label="入库设备" name="name1">
            <div style="width:17%;float:left;">
              <Table
                :columns="device_columns1"
                ref="rktable"
                :data="indevice_data1"
                disabled-hover
                highlight-row
                @on-current-change="rkbhClick"
                size="small"
                style="margin:10px 0 0 20px;overflow:auto;min-height:200px;"
              ></Table>
            </div>
            <div style="width:83%;float:right;">
              <Table
                :columns="device_columns"
                :data="indevice_data"
                size="small"
                style="margin:10px 0 0 0;overflow:auto;min-height:200px;"
              ></Table>
            </div>
          </TabPane>
          <TabPane label="设备列表" name="name2">
            <Table :columns="sblb_columns" :data="sblb_data" size="small" height="200"></Table>
            <Page
              :current.sync="devicePageNum"
              :total="sblbSum"
              :page-size="10"
              @on-change="getDevicesList"
              size="small"
              show-total
              show-elevator
              style="text-align:center;margin-top:20px;"
            ></Page>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
    <!-- 出库详情页面 -->
    <Modal v-model="ckxqmodal" width="1000" class-name="vertical-center-modal">
      <div>
        <div style="float:left;margin:30px  20px;">
          <h3>出库单详情</h3>
          <p style="font-size:11px;">
            单据编号:
            <span>{{djbh}}</span>
          </p>
        </div>
        <Button style="float:right;margin:30px 0 0 0;" :class="djxx.zt">{{djxx.zt}}</Button>
      </div>
      <div style="clear:both;">
        <p class="djtitle">单据信息</p>
        <div style="line-height:40px;width:45%;float:left">
          <div>
            <span class="jbleft">出库类别：</span>
            <span class="jbright wid">{{djxx.cklb}}</span>
          </div>
          <div>
            <span class="jbleft">出库日期：</span>
            <span class="jbright wid">{{djxx.ckrq}}</span>
          </div>
          <div>
            <span class="jbleft">仓库：</span>
            <span class="jbright wid">{{djxx.ck}}</span>
          </div>
          <div>
            <span class="jbleft">客户名称：</span>
            <span class="jbright wid">{{djxx.khmc}}</span>
          </div>
          <!-- <div>
            <span class="jbleft">订单编号：</span>
            <span class="jbright wid">{{djxx.ddbh}}</span>
          </div>-->
        </div>
        <div style="line-height:40px;width:50%;float:right">
          <div>
            <span class="jbleft">设备数量：</span>
            <span class="jbright wid">{{djxx.sbsl}}</span>
          </div>
          <div>
            <span class="jbleft">审核人：</span>
            <span class="jbright wid">{{djxx.shr}}</span>
          </div>
          <div>
            <span class="jbleft">审核时间：</span>
            <span class="jbright wid">{{djxx.shsj}}</span>
          </div>
          <div>
            <span class="jbleft">调拨单号：</span>
            <span class="wid shdz">{{djxx.ioBillId}}</span>
          </div>
        </div>
        <Tooltip>
            <div slot="content">
              <p v-for="(item,index) in djxx.ddbh.split(',')" :key="index">{{item}}</p>
            </div>
            <div style="width:700px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:#8D8D8D;padding-top:10px">
              <span class="jbleft">订单编号：</span>
                <span
                  class="wid"
                >{{djxx.ddbh}}</span>
            </div>
          </Tooltip>
      </div>
      <div style="clear:both;overflow: hidden;margin-top:20px;">
        <Tabs v-model="tabDeviceName2">
          <TabPane label="出库设备" name="name1">
            <div style="width:17%;float:left;">
              <Table
                :columns="device_columns1"
                ref="cktable"
                :data="outdevice_data1"
                size="small"
                disabled-hover
                highlight-row
                @on-row-click="ckbhClick"
                style="margin:10px 0 0 20px;overflow:auto;min-height:200px;"
              ></Table>
            </div>
            <div style="width:83%;float:right;">
              <!--  <p style="margin-left:10px;border-bottom:0.7px solid #e4e7ed">共<span>{{count}}</span>家客户（可筛选查看）</p> -->
              <Table
                :columns="device_columns"
                :data="outdevice_data"
                size="small"
                style="margin:10px 0 0 0;overflow:auto;min-height:200px;"
              ></Table>
            </div>
          </TabPane>
          <TabPane label="设备列表" name="name2">
            <Table :columns="sblb_columns" :data="sblb_data" size="small" height="200"></Table>
            <Page
              :current.sync="devicePageNum"
              :total="sblbSum"
              :page-size="10"
              @on-change="getDevicesList"
              size="small"
              show-elevator
              style="text-align:center;margin-top:20px;"
            ></Page>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  </div>
</template>

<script>
import sblbTale from "../../public-components/sblb_table.vue";
export default {
  name: "deviceQuery",
  components: {
    sblbTale
  },
  data() {
    return {
      status:[
        {
          index: 0,
          val: '未审批'
        },
        {
          index: 1,
          val: '已审批'
        }
      ],
      zkSum: 0,
      crkSum: 0,
      sblbSum: 0,
      menudata: [],
      rkdj_columns: [
        {
          title: "单据编号",
          key: "djbh",
          align: "center"
        },
        {
          title: "入库类别",
          key: "rklb",
          align: "center"
        },
        {
          title: "入库日期",
          key: "rkrq",
          align: "center"
        },
        {
          title: "订单编号",
          key: "ddbh",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.ddbh !== null && params.row.ddbh !== undefined) {
              if (params.row.ddbh.length > 25) {
                texts = params.row.ddbh.substring(0, 25) + "...";
              } else {
                texts = params.row.ddbh;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.ddbh
                )
              ]
            );
          }
        },
        {
          title: "客户名称",
          key: "khmc",
          align: "center"
        },
        {
          title: "设备数量",
          key: "sbsl",
          align: "center"
        },
        {
          title: "状态",
          key: "zt",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    // type: "",
                    size: "small"
                  },
                  style: {
                    backgroundColor:
                      params.row.zt === "待审批"
                        ? "#FDF6EC"
                        : params.row.zt === "已审批"
                        ? "#F0F9EC"
                        : "#F4F4F5",
                    color:
                      params.row.zt === "待审批"
                        ? "#E7A440"
                        : params.row.zt === "已审批"
                        ? "#78C950"
                        : "#7D7F82"
                  }
                },
                params.row.zt
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: "3px",
                    color: "#3896f5 ",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      // 入库
                      this.djbh = params.row.data.allocation_no;
                      this.djxx = {
                        rklb: params.row.rklb,
                        rkrq: params.row.rkrq,
                        ck: params.row.data.wh_name,
                        khmc: params.row.khmc,
                        ddbh: params.row.ddbh,
                        sbsl: params.row.sbsl,
                        shr: params.row.data.auditor_name,
                        shsj: params.row.data.auditor_time,
                        zt: params.row.zt,
                        allocation_id: params.row.data.allocation_id,
                        address: params.row.data.delivery_address,
                        ioBillId: params.row.data.ioBillId
                      };
                      this.selectedWhid = params.row.data.wh_id;
                      this.indevice_data1 = [];
                      params.row.data.order_no.forEach(no => {
                        this.indevice_data1.push({
                          ddbh: no
                        });
                      });
                      this.getDevices(params.row.data.order_no[0]);
                      this.rkxqmodal = true;
                      this.tabDeviceName1 = "name1";
                      this.devicePageNum = 1;
                      this.getDevicesList(1);
                      this.$nextTick(() => {
                        this.$refs["rktable"].objData[0]._isHighlight = true;
                      });
                    }
                  }
                },
                "查看明细"
              )
            ]);
          }
        }
      ],
      rkdj_data: [
        {
          zt: "待审批"
        }
      ],
      ckdj_columns: [
        {
          title: "单据编号",
          key: "djbh",
          align: "center"
        },
        {
          title: "出库类别",
          key: "cklb",
          align: "center"
        },
        {
          title: "出库日期",
          key: "ckrq",
          align: "center"
        },
        {
          title: "订单编号",
          key: "ddbh",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.ddbh !== null && params.row.ddbh !== undefined) {
              if (params.row.ddbh.length > 25) {
                texts = params.row.ddbh.substring(0, 25) + "...";
              } else {
                texts = params.row.ddbh;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.ddbh
                )
              ]
            );
          }
        },
        {
          title: "客户名称",
          key: "khmc",
          align: "center"
        },
        {
          title: "设备数量",
          key: "sbsl",
          align: "center"
        },
        {
          title: "状态",
          key: "zt",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    // type: "",
                    size: "small"
                  },
                  style: {
                    backgroundColor:
                      params.row.zt === "待审批"
                        ? "#FDF6EC"
                        : params.row.zt === "已审批"
                        ? "#F0F9EC"
                        : "#F4F4F5",
                    color:
                      params.row.zt === "待审批"
                        ? "#E7A440"
                        : params.row.zt === "已审批"
                        ? "#78C950"
                        : "#7D7F82"
                  }
                },
                params.row.zt
              )
            ]);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: "3px",
                    color: "#3896f5 ",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      // 出库
                      this.djbh = params.row.data.allocation_no;
                      this.djxx = {
                        cklb: params.row.cklb,
                        ckrq: params.row.ckrq,
                        ck: params.row.data.wh_name,
                        khmc: params.row.khmc,
                        ddbh: params.row.ddbh,
                        sbsl: params.row.sbsl,
                        shr: params.row.data.auditor_name,
                        shsj: params.row.data.auditor_time,
                        zt: params.row.zt,
                        allocation_id: params.row.data.allocation_id,
                        ioBillId: params.row.data.ioBillId
                        // adress: params.row.data.adress,
                      };
                      this.outdevice_data1 = [];
                      this.selectedWhid = params.row.data.wh_id;
                      params.row.data.order_no.forEach(no => {
                        this.outdevice_data1.push({
                          ddbh: no
                        });
                      });
                      this.getDevices(params.row.data.order_no[0]);
                      this.ckxqmodal = true;
                      this.tabDeviceName2 = "name1";
                      this.devicePageNum = 1;
                      this.getDevicesList(1);
                      this.$nextTick(() => {
                        this.$refs["cktable"].objData[0]._isHighlight = true;
                      });
                    }
                  }
                },
                "查看明细"
              )
            ]);
          }
        }
      ],
      ckdj_data: [
        {
          zt: "入库"
        }
      ],
      device_columns1: [
        {
          title: "订单编号",
          key: "ddbh"
        }
      ],
      device_columns: [
        {
          title: "存货编码",
          key: "chbm",
          align: "center"
        },
        {
          title: "存货名称",
          key: "chmc",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.chmc !== null && params.row.chmc !== undefined) {
              if (params.row.chmc.length > 20) {
                texts = params.row.chmc.substring(0, 20) + "...";
              } else {
                texts = params.row.chmc;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.chmc
                )
              ]
            );
          }
        },
        {
          title: "规格型号",
          key: "ggxh",
          align: "center",
          render: (h, params) => {
            let texts = "";
            if (params.row.ggxh !== null && params.row.ggxh !== undefined) {
              if (params.row.ggxh.length > 25) {
                texts = params.row.ggxh.substring(0, 25) + "...";
              } else {
                texts = params.row.ggxh;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.ggxh
                )
              ]
            );
          }
        },
        {
          title: "计量单位",
          key: "jldw",
          align: "center",
        },
        // {
        //   title:"发货批次",
        //   key:"delivery_batch",
        //   align:"center",      
        //   render:(h,params)=>{
        //       return h('Select',{
        //         props:{
        //           placeholder:"未设置",
        //           size:"small"
        //         }
        //       },
        //       this.deliveryBatch.map((item)=>{
        //           return h('Option',{
        //             props:{
        //               value:item.value,
        //               label:item.name
        //             }
        //           })
        //       }))
        //     }
        // },
        {
          title: "数量",
          key: "sl",
          align: "center"
        }
      ],
      indevice_data1: [
        {
          ddbh: ""
        }
      ],
      indevice_data: [
        {
          chbm: "8888888"
        }
      ],
      outdevice_data1: [],
      outdevice_data: [
        {
          chbm: "56"
        }
      ],
      djxx: {
        cklb: "121",
        ckrq: "",
        ck: "",
        khmc: "",
        ddbh: "",
        sbsl: "",
        shr: "",
        shsj: "2019-9-00",
        adress: "",
        ioBillId: ''
      },
      cpxhpz: this.$option.asset.query,
      rksbxq: [
        {
          val: "12"
        },
        {
          val: "123224"
        }
      ],
      cksbxq: [
        {
          val: "12"
        },
        {
          val: "123224"
        }
      ],
      tooptipShow: false,
      ckxqmodal: false,
      rkxqmodal: false,
      menuitem: "所有仓库",
      sblb_data: [],
      djbh: "00000000000",
      count: "8",
      ck_current_index: "",
      cktype_current_index: 0,
      tabName: "name1",
      inputVal: "",
      inLoading: false,
      outLoading: false,
      hasloadout: false,
      glShow: false,
      moreShow: false,
      filterStatus: false,
      stausMap: {
        0: "待审批",
        1: "已审批",
        2: "已执行"
      },
      selectedprocode: "",
      selectedWhid: "",
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
      sblb_columns: [
        {
          title: "条码",
          key: "tm"
        },
        {
          title: "存货编码",
          key: "chbm"
        },
        {
          title: "存货名称",
          key: "chmc"
        },
        {
          title: "规格型号",
          key: "ggxh"
        },
        {
          title: "计量单位",
          key: "jldw"
        },
        {
          title: "箱码",
          key: "xm"
        },
        {
          title: "状态",
          key: "zt"
        },
        {
          title: "最新操作时间",
          key: "newtime",
          width: 150
        }
      ],
      sblb_data: [],
      mapStatus: this.$option.asset.deviceStatusMap,
      cusfilterItem: {
        djbh: "",
        // ddbh: "",
        khmc: "",
        cklb: "",
        rklb:"",
        ggxh: "",
        htbh: "",
        zt: "",
        startTime: "",
        endTime: ""
      },
      startOption: {
        disabledDate: time => {
          if (this.cusfilterItem.endTime) {
            return (
              time.getTime() > new Date(this.cusfilterItem.endTime).getTime()
            );
          }
        }
      },
      endOption: {
        disabledDate: time => {
          if (this.cusfilterItem.startTime) {
            return (
              time.getTime() < new Date(this.cusfilterItem.startTime).getTime()
            );
          }
        }
      },
      inPageNum: 1,
      outPageNum: 1,
      devicePageNum: 1,
      tableHeight: "",
      tabDeviceName2: "name1",
      tabDeviceName1: "name1",
      filterStatus: false,
      completeValue: ""
    };
  },
  methods: {
    tooltipClick(side) {
      if (side === "inside") {
        this.tooptipShow = !this.tooptipShow;
      } else if (side === "outside") {
        if (this.tooptipShow) this.tooptipShow = false;
      }
    },
    rkdjrowClick() {
      var _self = this;
    },
    ckdjrowClick() {
      alert("出库");
    },
    selectClick(index) {
      var _self = this;
      _self.tooptipShow = false;
      this.cktype_current_index = index;
      this.getMenuList(index);
      this.ck_current_index = "";
      this.getProductList(1);
    },
    getMenuList(index) {
      if (index == "0") {
        this.menuitem = "所有仓库";
      } else if (index == "1") {
        this.menuitem = "成品库";
      } else if (index == "2") {
        this.menuitem = "工程程物资库";
      } else if (index == "3") {
        this.menuitem = "固定资产库";
      }
      let request = {
        typeid: 23001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            wh_type:
              index === 0 ? undefined : index === 1 ? 0 : index === 2 ? 1 : 3,
            allocation_type: 0
          }
        ]
      };
      this.menudata = [];
      this.$http.PostXLASSETS(request).then(response => {
        this.menudata = [];
        let res = response.data.result;
        this.zkSum = res.sum;
        for (var i = 0; i < res.data.length; i++) {
          if (!this.menudata.find(data => data.wh_id === res.data[i].wh_id)) {
            this.menudata.push(res.data[i]);
          }
        }
        // this.selecttwoClick(this.ck_current_index||0);
      });
    },
    selecttwoClick(index) {
      this.ck_current_index = index;
      this.getProductList(1);
      if (this.tabName !== "name1") this.tabName = "name1";
    },
    rkbhClick(p) {
      if (p.ddbh !== "") this.getDevices(p.ddbh);
    },
    ckbhClick(p) {
      if (p.ddbh !== "") this.getDevices(p.ddbh);
    },
    getProductList(p) {
      let request = {
        typeid: 23004,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            wh_type: this.cpxhpz[this.cktype_current_index].id,
            wh_id:
              this.menudata &&
              this.menudata.length > 0 &&
              this.ck_current_index !== ""
                ? this.menudata[this.ck_current_index].wh_id
                : undefined,
            keyword: this.inputVal === "" ? undefined : this.inputVal,
            page_num: p,
            page_size: 10,
            allocation_type: this.tabName === "name1" ? 1 : 0,
            allocation_no:
              this.cusfilterItem.djbh === ""
                ? undefined
                : this.cusfilterItem.djbh,
            order_no:
              this.cusfilterItem.ddbh === ""
                ? undefined
                : this.cusfilterItem.ddbh,
            agent_name:
              this.cusfilterItem.khmc === ""
                ? undefined
                : this.cusfilterItem.khmc,
            // product_models:
            //   this.cusfilterItem.ggxh === ''
            //     ? undefined
            //     : this.cusfilterItem.ggxh,
            // contract_no:
            //   this.cusfilterItem.htbh === ''
            //     ? undefined
            //     : this.cusfilterItem.htbh,
            // status:
            //   this.cusfilterItem.zt === ''
            //     ? undefined
            //     : this.cusfilterItem.zt,
            // start_time:
            //   this.cusfilterItem.startTime === ''
            //     ? undefined
            //     : this.cusfilterItem.startTime,
            // end_time:
            //   this.cusfilterItem.endTime === ''
            //     ? undefined
            //     : this.cusfilterItem.endTime,
          }
        ]
      };
      if (this.tabName === "name1") {
        this.inLoading = true;
        this.rkdj_data = [];
      } else {
        this.outLoading = true;
        this.ckdj_data = [];
      }
      this.$http.PostXLASSETS(request).then(
        response => {
          let res = response.data.result.data;
          if (this.tabName === "name1") {
            this.inLoading = true;
            this.rkdj_data = [];
            this.zkSum = res[0].sum;
          } else {
            this.outLoading = true;
            this.ckdj_data = [];
            this.crkSum = res[0].sum;
          }

          res[0].warehouse_bill_list.forEach(data => {
            let item = {};
            item.djbh = data.allocation_no;
            item.ddbh = String(data.order_no);
            item.khmc = data.customer_name;
            item.sbsl = data.product_count;
            item.zt = this.stausMap[data.allocation_status];
            item.data = data;
            if (this.tabName === "name1") {
              item.rklb = "成品入库";
              item.rkrq = data.allocation_ts;
              this.rkdj_data.push(item);
              this.inLoading = false;
            } else {
              item.cklb = "出库发货";
              item.ckrq = data.allocation_ts;
              this.ckdj_data.push(item);
              this.outLoading = false;
            }
          });
        },
        error => {
          if (this.tabName === "name1") {
            this.inLoading = false;
            this.zkSum = 0;
          } else {
            this.outLoading = false;
            this.crkSum = 0;
          }
        }
      );
    },
    getDevices(order_id) {
      let param = {
        typeid: 23018,
        data: [
          {
            order_no: order_id,
            allocation_id: this.djxx.allocation_id
          }
        ]
      };
      if (this.tabName === "name1") {
        this.indevice_data = [];
      } else {
        this.outdevice_data = [];
      }
      this.$http.PostXLASSETS(param).then(res => {
        if (this.tabName === "name1") {
          this.indevice_data = [];
        } else {
          this.outdevice_data = [];
        }
        res.data.result.data.forEach(data => {
          let item = {};
          item.chbm = data.product_code;
          item.chmc = data.product_name;
          item.ggxh = data.product_models;
          item.jldw = data.product_unit;
          item.sl = data.quantity_shipped;
          if (this.tabName === "name1") {
            this.indevice_data.push(item);
          } else {
            this.outdevice_data.push(item);
          }
        });
      });
    },
    getDevicesList(p) {
      let request = {
        typeid: 23011,
        data: [
          {
            allocation_id: this.djxx.allocation_id,
            page_num: p,
            page_size: 10
          }
        ]
      };
      this.sblb_data = [];
      this.sblbSum = 0;
      this.$http.PostXLASSETS(request).then(response => {
        let { data } = response.data.result;
        this.sblb_data = [];
        this.sblbSum = data[0].sum||0;
        data[0].devicelist.forEach(d => {
          let crk_item = {};
          crk_item.tm = d.device_address;
          crk_item.chbm = d.product_code;
          crk_item.chmc = d.product_name;
          crk_item.ggxh = d.product_models;
          crk_item.jldw = d.product_unit;
          crk_item.xm = d.box_address;
          crk_item.zt = this.mapStatus[d.device_status];
          crk_item.newtime = d.device_ts;
          this.sblb_data.push(crk_item);
        });
      });
    },
    search(val) {
      let index =
        this.cpxhpz[this.cktype_current_index].id === undefined
          ? 0
          : this.cpxhpz[this.cktype_current_index].id + 1;
      this.getMenuList(index);
      if (this.$refs["menu"].currentActiveName !== -1)
        this.$refs["menu"].currentActiveName = -1;
      this.ck_current_index = "";
      this.getProductList(1);
    },
    changeTab(p) {
      if (p === "name2" && !this.hasloadout) {
        this.getProductList(1);
      }
      this.hasloadout = true;
    },
    handleSubmitgl(name) {
      let status = true;
      for (let key in this.cusfilterItem) {
        if (this.cusfilterItem[key] !== "" && this.cusfilterItem[key] !== 0) {
          status = false;
        }
      }
      if (status) {
        this.filterStatus = false;
        $(".cor").css({ color: "#000000" });
        this.glShow = false;
        if (this.tabName === "name1") {
          this.getProductList(1);
        } else {
          this.getProductList(1);
        }
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.filterStatus = true;
          this.glShow = false;
          if (this.tabName === "name1") {
            this.getProductList(1);
          } else {
            this.getProductList(1);
          }
          this.$Message.success("查询成功！");
        } else {
          this.$Message.error("查询失败，请重试!");
        }
      });
    },
    handleReset(name) {
      this.filterStatus = false;
      for (let key in this.cusfilterItem) {
        this.cusfilterItem[key] = "";
      }
    },
    glkhClick() {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow || this.filterStatus) {
        $(".cor").css({ color: "#4a9af5" });
        $(".cor1").css({ color: "#000000" });
      } else {
        $(".cor").css({ color: "#000000" });
      }
    },
    moreClick() {
      this.moreShow = !this.moreShow;
      this.glShow = false;
      if (this.moreShow) {
        $(".cor1").css({ color: "#4a9af5" });
        $(".cor").css({ color: "#000000" });
      }
    },
    closeglClick() {
      this.glShow = false;
      if (!this.filterStatus) $(".cor").css({ color: "#000000" });
    },
    goMenu(menu) {
      let whId =
        (this.menudata.find(m => m.wh_name === menu) || {}).wh_id || "";
      this.$refs["menu"].currentActiveName =
        this.menudata.findIndex(m => m.wh_id === whId) || 0;
      this.completeValue = "";
      this.$nextTick(() => {
        this.ck_current_index =
          this.menudata.findIndex(m => m.wh_id === whId) || 0;
        let scroll =
          this.$refs["menu"].$children[0].$children[this.ck_current_index + 2]
            .$el.offsetTop - 200;
        this.$refs["menu"].updateActiveName();
        this.$refs["menu"].updateActiveName();
        this.$refs["menuContainer"].scrollTo(0, scroll);
        this.getProductList(1);
      });
    },
    searchMenu() {
      if (this.completeData.length > 0)
        this.goMenu(this.completeData[0].wh_name);
    }
  },
  mounted() {
    this.selectClick(0);
    this.tableHeight = document.body.scrollHeight - 300;
  },
  computed: {
    scrollHeight() {
      let h = 0;
      // h = (window.screen.height-330)+'px'
      h = document.body.scrollHeight - 185 + "px";
      return h;
    },
    completeData() {
      let data = [];
      if (
        this.menudata &&
        this.menudata.length > 0 &&
        this.completeValue !== ""
      ) {
        data = JSON.parse(JSON.stringify(this.menudata)).filter(
          i => i.wh_name.indexOf(this.completeValue) !== -1
        );
      }
      return data;
    }
  },
  watch: {
    tabName(nv) {
      this.getProductList(1);
      if (nv === "name1") {
        this.inPageNum = 1;
      } else {
        this.outPageNum = 1;
      }
    }
  }
};
</script>

<style>
@import "../assetmanage.css";
.changetable .ivu-table-body {
  height: 600px;
  overflow: auto;
  /* overflow-x: hidden; */
}
.ivu-select-dropdown.ivu-select-dropdown-transfer.ivu-auto-complete {
  max-height: 400px;
}
.ivu-select-single .ivu-select-selection .ivu-select-placeholder{
 color:orange
}
.vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;
}
.vertical-center-modal .ivu-modal{
  top: 0;
}
</style>
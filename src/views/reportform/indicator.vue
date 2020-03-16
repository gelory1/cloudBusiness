<template>
  <div class="address">
    <div :style="{background: '#fff',minWidth:'400px', padding: '10px', borderRadius: '5px'}">
      <Row>
        <div style="float:right;">
          <span class="f-more">
            <span @click="morehtztClick" class="cor1">
              <Icon type="navicon-round"></Icon>
              <span>更多</span>
            </span>
            <div v-show="showExport" class="more">
              <p @click="exportAll">导出当前视图数据</p>
            </div>
          </span>
        </div>
      </Row>
      <Tabs>
        <Tab-pane label="平台指标">
          <Form ref="filterItem" :model="filterItem" :label-width="80">
            <Row>
              <Col :span="6">
                <FormItem label="指标" prop="zb">
                  <Select v-model="filterItem.zb" clearable filterable>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="6">
                <FormItem label="处于" prop="cy">
                  <Input-number v-model="filterItem.zbks"></Input-number>-
                  <Input-number v-model="filterItem.zbjs"></Input-number>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="偏差标志">
              <el-radio-group v-model="filterItem.pcbz" size="small">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="正常"></el-radio-button>
                <el-radio-button label="异常"></el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem label="时间">
              <Row>
                <Col span="4">
                  <DatePicker
                    style="width: 100%"
                    type="date"
                    :options="startOption"
                    placeholder="开始日期"
                    v-model="filterItem.kssj"
                  ></DatePicker>
                </Col>
                <Col span="1" style="text-align: center">-</Col>
                <Col span="4">
                  <DatePicker
                    style="width: 100%"
                    type="date"
                    :options="endOption"
                    placeholder="结束日期"
                    v-model="filterItem.jssj"
                  ></DatePicker>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="业务公司" prop="ywgs">
              <Row>
                <Col :span="8">
                  <Select v-model="filterItem.ywgs" clearable filterable>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="业务类型" prop="ywlx">
              <Row>
                <Col :span="8">
                  <Select v-model="filterItem.ywlx" clearable filterable multiple>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="销售模式">
              <el-radio-group v-model="filterItem.xsms" size="small">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="自营"></el-radio-button>
                <el-radio-button label="渠道"></el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem label="企业/编号">
              <Col :span="8">
                <Input v-model="qybh" placeholder="请输入企业编号、或名称查询" />
              </Col>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('filterItem')">生成报表</Button>
            </FormItem>
          </Form>
        </Tab-pane>
        <Tab-pane label="业务公司指标">
          <Form ref="filterItemYWGS" :model="filterItemYWGS" :label-width="80">
            <Row>
              <Col :span="6">
                <FormItem label="指标" prop="zb">
                  <Select v-model="filterItemYWGS.zb" clearable filterable>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="6">
                <FormItem label="处于" prop="cy">
                  <Input-number v-model="filterItemYWGS.zbks"></Input-number>-
                  <Input-number v-model="filterItemYWGS.zbjs"></Input-number>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="偏差标志">
              <el-radio-group v-model="filterItemYWGS.pcbz" size="small">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="正常"></el-radio-button>
                <el-radio-button label="异常"></el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem label="时间">
              <Row>
                <Col span="4">
                  <DatePicker
                    style="width: 100%"
                    type="date"
                    :options="startOption"
                    placeholder="开始日期"
                    v-model="filterItemYWGS.kssj"
                  ></DatePicker>
                </Col>
                <Col span="1" style="text-align: center">-</Col>
                <Col span="4">
                  <DatePicker
                    style="width: 100%"
                    type="date"
                    :options="endOption"
                    placeholder="结束日期"
                    v-model="filterItemYWGS.jssj"
                  ></DatePicker>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="业务公司" prop="ywgs">
              <Row>
                <Col :span="8">
                  <Select v-model="filterItemYWGS.ywgs" clearable filterable>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="服务商" prop="ywgs">
              <Row>
                <Col :span="8">
                  <Select v-model="filterItemYWGS.fws" clearable filterable>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="业务类型" prop="ywlx">
              <Row>
                <Col :span="8">
                  <Select v-model="filterItemYWGS.ywlx" clearable filterable multiple>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="销售模式">
              <el-radio-group v-model="filterItemYWGS.xsms" size="small">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="自营"></el-radio-button>
                <el-radio-button label="渠道"></el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem label="企业/编号">
              <Col :span="8">
                <Input v-model="qybh" placeholder="请输入企业编号、或名称查询" />
              </Col>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('filterItemYWGS')">生成报表</Button>
            </FormItem>
          </Form>
        </Tab-pane>
        <Tab-pane label="服务商指标">
          <Form ref="filterItemYWGS" :model="filterItemYWGS" :label-width="80">
            <Row>
              <Col :span="6">
                <FormItem label="指标" prop="zb">
                  <Select v-model="filterItemYWGS.zb" clearable filterable>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="6">
                <FormItem label="处于" prop="cy">
                  <Input-number v-model="filterItemYWGS.zbks"></Input-number>-
                  <Input-number v-model="filterItemYWGS.zbjs"></Input-number>
                </FormItem>
              </Col>
            </Row>
            <FormItem label="偏差标志">
              <el-radio-group v-model="filterItemYWGS.pcbz" size="small">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="正常"></el-radio-button>
                <el-radio-button label="异常"></el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem label="时间">
              <Row>
                <Col span="4">
                  <DatePicker
                    style="width: 100%"
                    type="date"
                    :options="startOption"
                    placeholder="开始日期"
                    v-model="filterItemYWGS.kssj"
                  ></DatePicker>
                </Col>
                <Col span="1" style="text-align: center">-</Col>
                <Col span="4">
                  <DatePicker
                    style="width: 100%"
                    type="date"
                    :options="endOption"
                    placeholder="结束日期"
                    v-model="filterItemYWGS.jssj"
                  ></DatePicker>
                </Col>
              </Row>
            </FormItem>

            <FormItem label="业务公司" prop="ywgs">
              <Row>
                <Col :span="8">
                  <Select v-model="filterItemYWGS.ywgs" clearable filterable>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="服务商" prop="ywgs">
              <Row>
                <Col :span="8">
                  <Select v-model="filterItemYWGS.fws" clearable filterable>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="业务类型" prop="ywlx">
              <Row>
                <Col :span="8">
                  <Select v-model="filterItemYWGS.ywlx" clearable filterable multiple>
                    <Option
                      :value="item.index"
                      v-for="(item,index) in status"
                      :key="index"
                    >{{item.val}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="销售模式">
              <el-radio-group v-model="filterItemYWGS.xsms" size="small">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="自营"></el-radio-button>
                <el-radio-button label="渠道"></el-radio-button>
              </el-radio-group>
            </FormItem>
            <FormItem label="区域" prop="qy">
              <Row>
                <Col :span="8">
                  <el-cascader
                    style="width: 100%"
                    clearable
                    v-model="filterItem.qy"
                    :options="regions"
                    filterable
                    show-all-levels
                    :props="{ value: 'name', label: 'name',checkStrictly: true, multiple: true}"
                    size="small"
                  ></el-cascader>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="企业/编号">
              <Col :span="8">
                <Input v-model="qybh" placeholder="请输入企业编号、或名称查询" />
              </Col>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('filterItemYWGS')">生成报表</Button>
            </FormItem>
          </Form>
        </Tab-pane>
      </Tabs>
    </div>
    <Content
      :style="{background: '#fff', minHeight: '760px',marginTop: '10px', borderRadius: '5px'}"
      style="padding:20px 20px 0"
    >
      <el-table ref="table" style="position:relative;" :loading="loading" :data="data" size="small">
        <el-table-column property="index" label="序号" width="50"></el-table-column>
        <el-table-column property="contractNature" label="指标名称"></el-table-column>
        <el-table-column property="contractNature1" label="业务类型"></el-table-column>
        <el-table-column property="contractNature2" label="业务公司"></el-table-column>
        <el-table-column property="contractNature3" label="销售方式"></el-table-column>
        <el-table-column property="contractNature4" label="服务商"></el-table-column>
        <el-table-column property="contractNature5" label="企业编号"></el-table-column>
        <el-table-column property="contractNature6" label="企业名称"></el-table-column>
        <el-table-column property="contractNature7" label="指标计划值"></el-table-column>
        <el-table-column property="contractNature8" label="指标达成值"></el-table-column>
        <el-table-column property="contractNature8" label="指标偏差值"></el-table-column>
      </el-table>
      <Page
        :total="sum"
        :current.sync="pageNum"
        :page-size="10"
        show-total
        size="small"
        show-elevator
        style="text-align:center;margin-top:20px;"
      ></Page>
    </Content>
  </div>
</template>

<script>
export default {
  name: "indicator",
  data() {
    return {
      radio: "1",
      activeName: "first",
      loading: false,
      sum: 0,
      pageNum: 1,
      columns: [
        {
          title: "序号",
          width: 20,
          key: "setting",
          align: "center",
          renderHeader: (h, { column, $index }) => {
            return h("i", {
              class: "el-icon-setting",
              style: {
                cursor: "pointer"
              },
              on: {
                click: () => {
                  this.getTransferColumns();
                }
              }
            });
          }
        },
        {
          title: "序号",
          width: 50,
          align: "center",
          key: "index"
        },
        {
          title: "业务公司",
          key: "contractNature",
          align: "center"
        },
        {
          title: "业务类型",
          key: "contractNature1",
          align: "center"
        },
        {
          title: "销售方式",
          key: "contractNature2",
          align: "center"
        },
        {
          title: "区域",
          key: "contractNature3",
          align: "center"
        },
        {
          title: "用户ID",
          key: "contractNature4",
          align: "center"
        },
        {
          title: "用户名称",
          key: "contractNature5",
          align: "center"
        },
        {
          title: "网关数",
          key: "contractNature6",
          align: "center"
        },
        {
          title: "监测点数",
          key: "contractNature7",
          align: "center"
        },
        {
          title: "CJJ-XL（400A）",
          key: "contractNature8",
          align: "center"
        },
        {
          title: "2.5代G01-1型",
          key: "contractNature9",
          align: "center"
        }
      ],
      data: [
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 1,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 2,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        },
        {
          index: 3,
          contractNature: "1",
          contractNature1: "1",
          contractNature2: "1",
          contractNature3: "1",
          contractNature4: "1",
          contractNature5: "1",
          contractNature6: "1",
          contractNature7: "1",
          contractNature8: "1",
          contractNature9: "1"
        }
      ],
      showMore: false,
      showExport: false,
      tooptipShow: false,
      filterItem: {
        zb: "",
        zbks: "",
        zbjs: "",
        pcbz: "",
        kssj: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        jssj: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ywgs: "",
        ywlx: [],
        xsms: "",
        qybh: ""
      },
      filterItemYWGS: {
        zb: "",
        zbks: "",
        zbjs: "",
        pcbz: "",
        kssj: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        jssj: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ywgs: "",
        fws: "",
        ywlx: [],
        xsms: "",
        qybh: ""
      },
      filterItemFWS: {
        zb: "",
        zbks: "",
        zbjs: "",
        pcbz: "",
        kssj: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        jssj: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        ywgs: "",
        fws: "",
        ywlx: [],
        qy: [],
        xsms: "",
        qybh: ""
      },
      startOption: {
        disabledDate: time => {
          if (this.filterItem.jssj) {
            return time.getTime() > new Date(this.filterItem.jssj).getTime();
          }
        }
      },
      endOption: {
        disabledDate: time => {
          if (this.filterItem.kssj) {
            return time.getTime() < new Date(this.filterItem.kssj).getTime();
          }
        }
      }
    };
  },
  mounted() {
    this.getList(1);
  },
  computed: {
    isFinance() {
      if (
        this.$store.state.app.authority &&
        this.$store.state.app.authority.length > 0 &&
        this.$store.state.app.authority[0].role
      ) {
        return this.$store.state.app.authority[0].role.find(r => r === "财务");
      }
    },
    isCooperative() {
      if (
        this.$store.state.app.authority &&
        this.$store.state.app.authority.length > 0 &&
        this.$store.state.app.authority[0].role
      ) {
        return this.$store.state.app.authority[0].role.find(
          r => r === "合作伙伴"
        );
      }
    },
    isSaleManage() {
      if (
        this.$store.state.app.authority &&
        this.$store.state.app.authority.length > 0 &&
        this.$store.state.app.authority[0].role
      ) {
        return this.$store.state.app.authority[0].role.find(
          r => r === "业务管控"
        );
      }
    },
    isSaleMan() {
      if (
        this.$store.state.app.authority &&
        this.$store.state.app.authority.length > 0 &&
        this.$store.state.app.authority[0].role
      ) {
        return this.$store.state.app.authority[0].role.find(
          r => r === "销售人员"
        );
      }
    },
    regions() {
      return JSON.parse(localStorage.getItem("regions")) || [];
    }
  },
  methods: {
    morehtztClick() {
      this.showExport = !this.showExport;
      //   this.glShow = false;
      if (this.showExport) {
        $(".cor1").css({ color: "#4a9af5" });
      } else {
        $(".cor1").css({ color: "#000000" });
      }
    },
    getTransferColumns() {
      const tColumns = [];
      const tValues = [];
      this.columns.map(item => {
        if (item.title !== "序号") {
          tColumns.push({
            key: item.key,
            label: item.title,
            checked: true
          });
          tValues.push(item.key);
        }
      });
      this.value = tValues;
      this.columnsData = tColumns;
    },
    delRow(row) {
      this.columnsData.map(
        item => item.key === row.key && (item.checked = false)
      );
    },
    addRow(row) {
      this.columnsData.map(
        item => item.key === row.key && (item.checked = true)
      );
    },
    handleSubmit(name) {
      console.log("reser", name);
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getList(1);
          if (this.jbxx_data == "") {
            this.sum = 0;
          }
          this.$Message.success("查询成功！");
        } else {
          this.$Message.error("查询失败，请重试!");
        }
      });
    },
    getList(p) {
      console.log("this get list", this.filterItem);
      let startTime = "",
        endTime = "";
      if (this.filterItem.kssj && this.filterItem.kssj !== "") {
        startTime =
          this.filterItem.kssj.getFullYear() +
          "-" +
          (this.filterItem.kssj.getMonth() + 1) +
          "-" +
          this.filterItem.kssj.getDate() +
          " 00:00:00";
      }
      if (this.filterItem.jssj && this.filterItem.jssj !== "") {
        endTime =
          this.filterItem.jssj.getFullYear() +
          "-" +
          (this.filterItem.jssj.getMonth() + 1) +
          "-" +
          this.filterItem.jssj.getDate() +
          " 23:59:59";
      }
      let request = {
        typeid: 25001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            page_num: p,
            page_size: 10,
            customer_name: "",
            create_starttime: startTime,
            create_endtime: endTime
            // customer_level:
            //   this.filterItem.nature === "" ? 0 : this.filterItem.nature,
            // customer_nature: this.selectedCustomType.no,
            // province: this.filterItem.city[0] || "",
            // city: this.filterItem.city[1] || "",
            // area: this.filterItem.city[2] || "",
            // manage_company:
            //   this.filterItem.manageCompany === ""
            //     ? 0
            //     : this.filterItem.manageCompany,
            // empowerProvince: this.filterItem.empower_city[0] || "",
            // empowerCity: this.filterItem.empower_city[1] || "",
            // empowerArea: this.filterItem.empower_city[2] || "",
            // saleName: this.filterItem.salesman,
            // keyword: this.inputVal
          }
        ]
      };
      //   this.loading = true;
      //   this.$http.XLCUSTOMER(request).then(
      //     response => {
      //       let res = response.data.result.data;
      //       this.data = [];
      //       this.sum = res.sum;
      //       res.customerList.forEach(data => {
      //         let item = {};
      //         item.name = data.customer_name;
      //         item.time = data.create_date;
      //         item.salesman = data.sale_no;
      //         item.company = data.manage_company_cn;
      //         item.data = data;
      //         this.customList_data.push(item);
      //       });
      //       this.loading = false;
      //     },
      //     error => {
      //       this.loading = false;
      //     }
      //   );
    },
    exportAll() {
      if (this.isFinance || this.isCooperative || this.isSaleMan) {
        this.$Message.error("权限不足！");
        return;
      }
      this.export();
    },
    export(list) {
      if (this.isFinance || this.isCooperative || this.isSaleMan) {
        return;
      }
      //   let request = {
      //     data: [
      //       {
      //         account_id: this.$store.state.user.accountId,
      //         contractList: list
      //       }
      //     ]
      //   };
      this.$Message.info("导出中...");
      this.$http.CONTRACTEXPORT(request).then(
        res => {},
        error => {
          if (error.data.code === 0) {
            this.exportUrl = error.data.exportUrl;
            this.$nextTick(() => {
              this.$refs.downloadLink.click();
              this.exportUrl = "";
            });
            this.morehtztClick();
          } else {
            this.$Message.error("导出失败，请稍后重试！");
          }
        }
      );
    }
  }
};
</script>

<style scoped>
@import "../assetmanagement/assetmanage.css";
</style>
<style>
.result {
  background: #e6f5ff;
  padding-right: 5px;
}
</style>
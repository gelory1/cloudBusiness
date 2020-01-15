<template>
  <div class="contract" @click="contractClick('outside')">
    <Layout>
      <Menu width="auto" size="small">
        <div class="tip" style="float:left;margin-top:10px;">
          <p class="tooltip" @click.stop="contractClick('inside')">
            {{selectedStatus.status}}
            <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
          </p>
          <div class="tooltipslot" v-show="tooptipShow">
            <p
              v-for="(item,index) in contractStatus"
              @click="changeStatus(index)"
              :key="index"
            >{{item.status}}</p>
          </div>
        </div>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;">
            <Input
              icon="ios-search"
              placeholder="请输入内容"
              style="width: 200px;margin-right:20px;"
              v-model="inputVal"
              @on-enter="goSearch"
              @on-click="goSearch"
            />
            <span class="f_gl">
              <span @click="glhtztClick" class="cor">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>
              <!-- 过滤 -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="filterItem" :model="filterItem" :label-width="100">
                  <FormItem label="客户名称" prop="customerName">
                    <Input type="text" placeholder="请输入" v-model="filterItem.customerName" />
                  </FormItem>
                  <FormItem label="合同性质" prop="contractNature">
                    <Select v-model="filterItem.contractNature" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in natures"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="合同类型" prop="contractType">
                    <Select v-model="filterItem.contractType" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in contractTypes"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="合同内容" prop="htnr">
                    <Select v-model="filterItem.contractContent" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in contents"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                   <FormItem label="省份/城市" prop="city">
                    <el-cascader clearable v-model="filterItem.city" :options="regions" filterable show-all-levels :props="{ value: 'name', label: 'name',checkStrictly: true}" size="small"></el-cascader>
                  </FormItem>
                  <FormItem label="运营公司" prop="manageCompany">
                    <Select v-model="filterItem.manageCompany" clearable filterable>
                      <Option
                        :value="item.id"
                        v-for="(item,index) in companys"
                        :key="index"
                      >{{item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售性质" prop="salesType">
                    <Select v-model="filterItem.salesType" clearable filterable>
                      <Option
                        :value="item.index"
                        v-for="(item,index) in salesTypes"
                        :key="index"
                      >{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售人员" prop="saleName">
                    <Input type="text" placeholder="请输入" v-model="filterItem.saleName" />
                  </FormItem>
                  <FormItem label="建档日期">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          placeholder="开始日期"
                          v-model="filterItem.signStarttime"
                          :options="startOption"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          placeholder="结束日期"
                          v-model="filterItem.signEndtime"
                          :options="endOption"
                        ></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="合同到期时间于">
                    <Row>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          :options="startOption1"
                          placement="bottom"
                          placeholder="开始日期"
                          v-model="filterItem.dueStarttime"
                        ></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker
                          type="date"
                          placement="bottom"
                          :options="endOption1"
                          placeholder="结束日期"
                          v-model="filterItem.dueEndtime"
                        ></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Button @click="handleResetht('filterItem')" style="margin-left: 8px">重置</Button>
                    <Button type="primary" @click="handleSubmitht('filterItem')">确定</Button>
                  </FormItem>
                </Form>
              </div>
            </span>
            <span style="padding:0 5px">|</span>
            <span class="f-more">
              <span @click="morehtztClick" class="cor1">
                <Icon type="navicon-round"></Icon>
                <span>更多</span>
              </span>
              <!-- 更多 -->
              <div v-show="moreShow" class="more">
                <p @click="exportSelect">导出所选结果</p>
                <p @click="exportAll">导出全部结果</p>
                <!-- <p>
                  <Upload ref="upload" action="/public/api/xlcontract/uploadFile" :show-upload-list="false" :data="postData" :before-upload="beforeUpload" :headers="{user:'x',key:'x'}">
                    上传合同附件
                  </Upload>
                </p>-->
              </div>
            </span>
          </div>
        </Header>
      </Menu>
      <Content :style="{background: '#fff', minHeight: '800px'}" style="padding-left:20px">
        <Table
          ref="table"
          @on-selection-change="selectChange"
          style="position:relative;"
          :columns="contract_columns"
          :loading="loading"
          :data="contract_data"
          size="small"
        ></Table>
        <Page
          :total="sum"
          :current.sync="pageNum"
          :page-size="10"
          show-total
          @on-change="getContracts"
          size="small"
          show-elevator
          style="text-align:center;margin-top:20px;"
        ></Page>
        <a ref="downloadLink" :href="exportUrl === ''?'#':exportUrl" download="合同列表"></a>
      </Content>
    </Layout>
  </div>
</template>
``
<script>
export default {
  name: "contract",
  data() {
    return {
      contractStatus: this.$option.contract.status,
      contractNatureMap: this.$option.contract.natureMap,
      salesTypeMap: this.$option.contract.salesTypeMap,
      contractTypes: this.$option.contract.types,
      contract_columns: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          title: "合同编号",
          key: "contractNo",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  class: "iconShow",
                  style: {},
                  on: {
                    click: () => {
                      this.openDetail(params.row);
                    }
                  }
                },
                params.row.contractNo
              )
            ]);
          }
        },
        {
          title: "合同性质",
          key: "contractNature",
          align: "center",
        },
        {
          title: "合同类型",
          key: "contractType",
          align: "center",
        },
        {
          title: "合同状态",
          key: "contractStatus",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "ghost",
                    size: "small"
                  },
                  style: {
                    backgroundColor: params.row.contractStatus
                      ? this.$option.contract.statusColorMap[
                          params.row.contractStatus
                        ].backgroundColor
                      : "white",
                    color: params.row.contractStatus
                      ? this.$option.contract.statusColorMap[
                          params.row.contractStatus
                        ].color
                      : "#7D7F82"
                  }
                },
                params.row.contractStatus
              )
            ]);
          }
        },
        {
          title: "归档时间",
          key: "archiveTime",
          align: "center"
        },
        {
          title: "合同到期时间",
          key: "dueTime",
          align: "center",
          width: 120
        },
        {
          title: "合同名称",
          key: "customerName",
          align: "center",
          render: (h, params) => {
              let texts = ''
              if (params.row.customerName !== null) {
                if ((params.row.customerName||'').length > 20) {
                  texts = params.row.customerName.substring(0, 20) + '...'
                } else {
                  texts = params.row.customerName
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
                }, params.row.customerName)
              ])
            }
        },
        {
          title: "省份城市",
          key: "city",
          align: "center"
        },
        {
          title: "销售方式",
          key: "saleType",
          align: "center"
        },
        // {
        //   title: "销售负责人",
        //   key: "saleName",
        //   align: "center"
        // },
        {
          title: "运营公司",
          key: "manageCompany",
          align: "center"
        }
      ],
      contract_data: [
        {
          saleName: "热尔"
        }
      ],
      filterItem: {
        customerName: "",
        contractNature: "",
        contractType: "",
        contractContent: "",
        province: "",
        city: "",
        manageCompany: "",
        salesType: "",
        saleName: "",
        signStarttime: "",
        signEndtime: "",
        dueStarttime: "",
        dueEndtime: ""
      },
      startOption: {
        disabledDate: time => {
          if (this.filterItem.signEndtime) {
            return (
              time.getTime() > new Date(this.filterItem.signEndtime).getTime()
            );
          }
        }
      },
      endOption: {
        disabledDate: time => {
          if (this.filterItem.signStarttime) {
            return (
              time.getTime() < new Date(this.filterItem.signStarttime).getTime()
            );
          }
        }
      },
      startOption1: {
        disabledDate: time => {
          if (this.filterItem.dueEndtime) {
            return (
              time.getTime() > new Date(this.filterItem.dueEndtime).getTime()
            );
          }
        }
      },
      endOption1: {
        disabledDate: time => {
          if (this.filterItem.dueStarttime) {
            return (
              time.getTime() < new Date(this.filterItem.dueStarttime).getTime()
            );
          }
        }
      },
      khmch: [
        {
          val: ""
        }
      ],
      htxzh: [
        {
          val: ""
        }
      ],
      htnrh: [],
      cityh: [],
      yygsh: [],
      salesTypeh: [],
      tooptipShow: false,
      glShow: false,
      moreShow: false,
      disabled: true,
      butZT: "XXX",
      selectedStatus: this.$option.contract.status[0],
      sum: 0,
      inputVal: "",
      loading: false,
      pageNum: 1,
      filterStatus: false,
      natures: this.$option.contract.natures,
      salesTypes: this.$option.contract.salesTypes,
      provinces: [],
      companys: [],
      contractContentMap: this.$option.contract.contentMap,
      contents: this.$option.contract.contents,
      selectedItems: [],
      postData: {
        accountId: "",
        contractNo: ""
      },
      exportUrl: ""
    };
  },
  methods: {
    contractClick(side) {
      if (side === "inside") {
        this.tooptipShow = !this.tooptipShow;
      } else if (side === "outside") {
        if (this.tooptipShow) this.tooptipShow = false;
      }
    },
    changeStatus(index) {
      this.tooptipShow = false;
      this.selectedStatus = this.contractStatus[index];
      this.pageNum = 1;
      this.getContracts(1);
    },
    openDetail(data) {
      if (!this.$store.state.app.authority.find(a => a.id === 801)) {
        this.$Message.error("权限不足！");
        return;
      }
      this.$store.commit("selectedContract", JSON.parse(JSON.stringify(data)));
      localStorage.setItem("contractInfo", JSON.stringify(data));
      this.$router.push({ path: "/contractmanage/detail" });
    },
    handleSubmitht(name) {
      let status = true;
      for (let key in this.filterItem) {
        if (this.filterItem[key] !== "" && this.filterItem[key] !== 0) {
          status = false;
        }
      }
      if (status) {
        this.filterStatus = false;
        $(".cor").css({ color: "#000000" });
        this.glShow = false;
        this.getContracts(1);
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.filterStatus = true;
          this.glShow = false;
          this.getContracts(1);
          // this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleResetht() {
      this.filterStatus = false;
      for (let key in this.filterItem) {
        this.filterItem[key] = "";
      }
    },
    glhtztClick() {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow || this.filterStatus) {
        $(".cor").css({ color: "#4a9af5" });
        $(".cor1").css({ color: "#000000" });
      } else {
        $(".cor").css({ color: "#000000" });
      }
    },
    morehtztClick() {
      this.moreShow = !this.moreShow;
      this.glShow = false;
      if (this.moreShow) {
        $(".cor1").css({ color: "#4a9af5" });
        // $(".cor").css({ color: "#000000" });
      } else {
        $(".cor1").css({ color: "#000000" });
      }
    },
    closeglClick() {
      this.glShow = false;
      if (!this.filterStatus) $(".cor").css({ color: "#000000" });
    },
    getContracts(p) {
      let request = {
        typeid: 26001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            customerName: this.filterItem.customerName,
            signStarttime:
              this.filterItem.signStarttime === ""
                ? ""
                : this.filterItem.signStarttime.getFullYear() +
                  "-" +
                  (this.filterItem.signStarttime.getMonth() + 1) +
                  "-" +
                  this.filterItem.signStarttime.getDate() +
                  " 00:00:00",
            signEndtime:
              this.filterItem.signEndtime === ""
                ? ""
                : this.filterItem.signEndtime.getFullYear() +
                  "-" +
                  (this.filterItem.signEndtime.getMonth() + 1) +
                  "-" +
                  this.filterItem.signEndtime.getDate() +
                  " 23:59:59",
            dueStarttime:
              this.filterItem.dueStarttime === ""
                ? ""
                : this.filterItem.dueStarttime.getFullYear() +
                  "-" +
                  (this.filterItem.dueStarttime.getMonth() + 1) +
                  "-" +
                  this.filterItem.dueStarttime.getDate() +
                  " 00:00:00",
            dueEndtime:
              this.filterItem.dueEndtime === ""
                ? ""
                : this.filterItem.dueEndtime.getFullYear() +
                  "-" +
                  (this.filterItem.dueEndtime.getMonth() + 1) +
                  "-" +
                  this.filterItem.dueEndtime.getDate() +
                  " 23:59:59",
            contractNature:
              this.filterItem.contractNature === ""
                ? 0
                : this.filterItem.contractNature,
            contractType:
              this.filterItem.contractType === ""
                ? -1
                : this.filterItem.contractType,
            contractContent:
              this.filterItem.contractContent === ""
                ? 0
                : this.filterItem.contractContent,
            customerProvince:
              this.filterItem.city[0]||'',
            customerCity:
              this.filterItem.city[1]||'',
            manageCompany:
              this.filterItem.manageCompany === ""
                ? 0
                : this.filterItem.manageCompany,
            saleType:
              this.filterItem.salesType === "" ? 0 : this.filterItem.salesType,
            saleName: this.filterItem.saleName,
            keyword: this.inputVal,
            contractStatus: this.selectedStatus.index,
            page_num: p,
            page_size: 10
          }
        ]
      };
      this.contract_data = [];
      this.loading = true;
      this.$http.XLCONTRACT(request).then(
        response => {
          let { data } = response.data.result;
          this.sum = data.sum;
          data.contractList.forEach(con => {
            let item = {};
            item.contractNo = con.contractNo;
            item.contractNature = this.contractNatureMap[con.contractNature];
            item.contractType = (
              this.contractTypes.find(c => c.index === con.contractType) || {}
            ).val;
            item.contractStatus = this.contractStatus.find(
              s => s.index === con.contractStatus
            ).status;
            item.archiveTime = con.archiveTime;
            item.dueTime = con.dueTime;
            item.customerName =
              (con.customerName || "") +
              "-" +
              this.contractContentMap[con.contractContent];
            let cityObj = this.regions.find(c => (con.customerProvince||"").indexOf(c.name)!==-1)||{};
            let areaObj = (cityObj.children || []).find(
              c => c.name === con.customerCity
            )||{};
            if (cityObj)
              item.city =
                (cityObj.name||"") +
                " " +
                (areaObj.name||"") +
                " " +
                ((
                  (areaObj.children || []).find(
                    c => c.name === con.customerArea
                  ) || {}
                ).name || "");
            item.saleType = this.salesTypeMap[con.saleType];
            item.saleName = con.saleManName;
            item.manageCompany = con.manageCompanyName;
            item.data = con;
            this.contract_data.push(item);
          });
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
    },
    goSearch() {
      this.pageNum = 1;
      this.getContracts(1);
    },
    getProvinces() {
      let request = {
        typeid: 27002
      };
      this.$http.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.provinces = res;
        this.$store.commit("getProvinces", res);
      });
    },
    getManagecompanys() {
      let request = {
        typeid: 27001
      };
      this.$http.XLSELECT(request).then(response => {
        this.companys = response.data.result.data;
      });
    },
    selectChange(item) {
      this.selectedItems = item;
      this.contract_data.forEach(c => {
        if (this.selectedItems.find(s => s.contractNo === c.contractNo)) {
          c._checked = true;
        } else {
          c._checked = false;
        }
      });
    },
    exportSelect() {
      if (this.isFinance || this.isCooperative || this.isSaleMan) {
        this.$Message.error("权限不足！");
        return;
      }
      if (
        this.contract_data.filter(data => data._checked === true).length === 0
      ) {
        this.$Message.error("请先选择需要导出的合同！");
        return;
      }
      let exportList = '';
      this.contract_data.forEach(c => {
        if(c._checked === true){
          exportList += c.contractNo + ','
        }
      })
      this.export(exportList);
    },
    beforeUpload(file) {
      let data = this.selectedItems;
      if (data.length === 0) {
        this.$Message.error("请先选择需要上传附件的合同！");
        return;
      }
      this.$nextTick(() => {
        if (data.length === 0) {
        } else {
          data.forEach(d => {
            this.postData.accountId = this.$store.state.user.accountId;
            this.postData.contractNo = d.data.contractNo;
            this.$refs.upload.post(file);
          });
          this.morehtztClick();
          this.$Message.success("上传成功！");
        }
      });
      return false;
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
      let request = {
        data: [
          {
            account_id: this.$store.state.user.accountId,
            contractList: list
          }
        ]
      };
      this.$Message.info('导出中...');
      this.$http.CONTRACTEXPORT(request).then(
        res => {},
        error => {
          if (error.data.code === 0) {
            this.exportUrl = error.data.exportUrl;
            this.$nextTick(() => {
              this.$refs.downloadLink.click();
              this.exportUrl = '';
            })
            this.morehtztClick();
          }else{
            this.$Message.error("导出失败，请稍后重试！");
          }
        }
      )
    }
  },
  mounted() {
    this.getContracts(1);
    this.getProvinces();
    this.getManagecompanys();
  },
  watch: {
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
  }
};
</script>

<style>
@import "../assetmanagement/assetmanage.css";
@import "../customermanage/customer.css";
@import "./contract.css";
.ivu-table-cell {
  text-overflow: unset;
}
.ivu-table td, .ivu-table th{
  text-overflow: unset;
}
</style>
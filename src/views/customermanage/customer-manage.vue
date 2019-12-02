<template>
  <div class="customer" @click="customerClick('outside')">
    <Layout>
      <Menu width="auto" size="small" style="padding-top:30px;">
        <div class="tip" style="float:left">
          <p class="tooltip" @click.stop="customerClick('inside')">
            {{selectedCustomType.type}}
            <Icon type="ios-arrow-down" style="margin-left:5px;"></Icon>
          </p>
          <div class="tooltipslot" v-show="tooptipShow">
            <p v-for="(item,index) in customerTypes" @click="selectCustomer(index)" :key="index">{{item.type}}</p>
          </div>
        </div>
        <Header :style="{background: '#fff',minWidth:'400px'}">
          <div style="float:right;">
            <Input icon="ios-search" placeholder="请输入内容" v-model="inputVal" @on-enter="search" @on-click="search" style="width: 200px;margin-right:20px;" />
            <span class="f_gl">
              <span @click="glkhClick" class="cor">
                <Icon type="ios-flask-outline"></Icon>
                <span>过滤</span>
              </span>

              <!-- 过滤 -->
              <div v-show="glShow" class="gl">
                <p class="gl_p">过滤条件</p>
                <span @click="closeglClick" class="gl_p1">X</span>
                <Form ref="filterItem" :model="filterItem" :label-width="80">
                  <FormItem label="客户等级" prop="khdj">
                    <Select v-model="filterItem.nature" clearable filterable>
                      <Option :value="index+1" v-for="(item,index) in natures" :key="index">{{item}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="授权资质" prop="sqzz">
                    <Row>
                      <Col span="12">
                        <Select v-model="filterItem.empower_province" clearable filterable>
                          <Option :value="item.id" v-for="(item,index) in provinces" :key="index">{{item.name}}</Option>
                        </Select>
                      </Col>
                      <Col span="12">
                        <Select v-model="filterItem.empower_city" clearable filterable>
                          <Option :value="item.id" v-for="(item,index) in empowerCitys" :key="index">{{item.name}}</Option>
                        </Select>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="省份/城市" prop="city">
                    <Row>
                      <Col span="12">
                        <Select v-model="filterItem.province" clearable filterable>
                          <Option :value="item.id" v-for="(item,index) in provinces" :key="index">{{item.name}}</Option>
                        </Select>
                      </Col>
                      <Col span="12">
                        <Select v-model="filterItem.city" clearable filterable>
                          <Option :value="item.id" v-for="(item,index) in citys" :key="index">{{item.name}}</Option>
                        </Select>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="运营公司" prop="yygs">
                    <Select v-model="filterItem.manageCompany" clearable filterable>
                      <Option :value="item.id" v-for="(item,index) in companys" :key="index">{{item.name}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="销售人员" prop="xsry">
                    <Input type="text" v-model="filterItem.salesman" />
                  </FormItem>
                  <FormItem label="建档日期">
                    <Row>
                      <Col span="11">
                        <DatePicker placement="bottom-end" type="date" v-model="filterItem.startTime"></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker placement="bottom-end" type="date" v-model="filterItem.endTime"></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem>
                    <Button @click="handleReset('filterItem')" style="margin-left: 8px">重置</Button>
                    <Button type="primary" @click="handleSubmitgl('filterItem')">确定</Button>
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
                <p @click="addkpClick">新增开票信息</p>
                <p>导出所选结果</p>
                <p>导出全部客户</p>
              </div>
            </span>
          </div>
          <Button type="ghost" icon="ios-plus-empty" class="addBut" @click="addClick">添加客户</Button>
        </Header>
      </Menu>
      <Content :style="{background: '#fff', minHeight: '800px'}" style="padding-left:20px">
        <Table
          @on-selection-change="selectChange"
          style="position:relative;"
          :columns="customList_columns"
          :data="customList_data"
          size="small"
          :loading="loading"
          class="table"
        ></Table>
        <Page
          :current.sync="pageNum"
          :total="customSum"
          size="small"
          show-elevator
          style="text-align:center;margin-top:20px;"
          @on-change="getCustomList"
        ></Page>
      </Content>
    </Layout>
  </div>
</template>

<script>
import dropDown from "../public-components/drop-down.vue";
import Dropdown from "iview";
const customerTypes= [
  {
    no:0,
    type: "所有客户"
  },
  {
    no:1,
    type: "直销客户"
  },
  {
    no:2,
    type: "合作伙伴"
  },
  {
    no:3,
    type: "伙伴客户"
  }
]
const natures = ['A级', 'B级','C级','D级','E级',]
const levelMap = {
  1: 'A级', 
  2: 'B级',
  3: 'C级',
  4: 'D级',
  5: 'E级',
}
const companyMap = {
  1: '电能云',
  2: '智慧能源',
  3: '维智泰',
  4: '康源'
}
export default {
  name: "customerManage",
  components: {
    dropDown
  },
  data() {
    return {
      customerTypes: customerTypes,
      customList_columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "客户名称",
          key: "name",
          align:"center",
           render: (h, params) => {
              return h('div', [
                  h('a', {
                      style:{
                        color:"black"
                      },
                      on: {
                          click: () => {
                                this.$store.commit('selectedCustom',params.row);
                                this.$router.push({ path: "/customermanage/see" });
                            }
                        }
                  },params.row.name)
              ]);
          }
        },
        {
          title: " ",
          width: 30,
          align:"center",
          render: (h, params) => {
            return h('Dropdown',{
                class:'iconShow',
                props:{
                    trigger:"click"
                },
                style:{
                  // display:"none"
                },
                on:{
                   'on-click':(value)=>{
                       if (value == "查看") {
                        this.$store.commit('selectedCustom',params.row);
                        this.$router.push({ path: "/customermanage/see" });
                      } else if (value == "编辑") {
                        this.$store.commit('selectedCustom',params.row);
                        this.$router.push({ path: "/customermanage/edit" });
                      } else if (value == "删除") {
                        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                        }).then(() => {
                          let request = {
                            "typeid": 25010,
                            "data": [
                              {
                                "customerNo": params.row.data.customer_no
                              }
                            ]
                          }
                          this.$http.DELETECUSTOMER(request).then(response =>{
                            this.getCustomList(this.pageNum);
                          })
                          this.$message({
                            type: 'success',
                            message: '删除成功!'
                          });
                        }).catch(() => {
                          this.$message({
                            type: 'info',
                            message: '已取消删除'
                          });          
                        });
                      }
                   }
                }
            }, [
                h('a',[
                    h('span',''),
                    h('Icon',{
                        props: {
                            type: 'android-more-vertical',
                            size:'18'
                        }
                    })
                ]),
                h('DropdownMenu',{
                     slot:"list"
                },
                this.dropdownItems.map(function(type){
                    return h('DropdownItem',{
                        props:{
                            name:type.val
                        }
                    },type.val)
                })
                )
            ]);
          }
        },
        {
          title: "客户性质",
          key: "nature",
          align:"center"
        },
        {
          title: "客户等级",
          key: "level",
          align:"center"
        },
        {
          title: "省份/城市",
          key: "city",
          align:"center"
        },
        {
          title: "建档时间",
          key: "time",
          align:"center"
        },
        {
          title: "销售人员",
          key: "salesman",
          align:"center"
        },
        {
          title: "运营公司",
          key: "company",
          align:"center"
        }
      ],
      customList_data: [],
      dropdownItems: [
        {
          val: "查看"
        },
        {
          val: "编辑"
        },
        {
          val: "删除"
        }
      ],
      filterItem: {
        manageCompany: 0,
        nature: 0,
        city: 0,
        salesman: "",
        empower_province: 0,
        empower_city: 0,
        province: 0,
        startTime:'',
        endTime:''
      },
      khdjg: [
        {
          val: "AAA"
        }
      ],
      sqzzg: [],
      cityg: [],
      yygsg: [],
      tooptipShow: false,
      isShow: false,
      glShow: false,
      moreShow: false,
      selectedCustomType:customerTypes[0],
      customSum:0,
      selectedItems:[],
      inputVal:'',
      loading:false,
      pageNum:1,
      companys:[],
      provinces:[],
      citys:[],
      natures,
      empowerCitys:[],
      filterStatus:false
    };
  },
  methods: {
    customerClick(side) {
      if(side === 'inside'){
        this.tooptipShow = !this.tooptipShow;
      }else if(side === 'outside'){
        if(this.tooptipShow) this.tooptipShow = false;
      }
    },
    selectCustomer(index) {
      this.tooptipShow = false;
      this.pageNum = 1;
      this.selectedCustomType = customerTypes[index];
      this.getCustomList(1);
    },
    getCustomList(p){
      let startTime = '',endTime = '';
      if(this.filterItem.startTime&&this.filterItem.startTime !== ''){
        startTime = this.filterItem.startTime.getFullYear() + '-' + (this.filterItem.startTime.getMonth()+1) + '-' + (this.filterItem.startTime.getDate())+ ' 00:00:00';
      }
      if(this.filterItem.endTime&&this.filterItem.endTime !== ''){
        endTime = this.filterItem.endTime.getFullYear() + '-' + (this.filterItem.endTime.getMonth()+1) + '-' + (this.filterItem.endTime.getDate()) +' 23:59:59';
      }
      let request = {
        typeid: 25001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
            page_num:p,
            page_size:10,
            customer_name:'',
            create_starttime:startTime,
            create_endtime:endTime,
            customer_level:this.filterItem.nature === ''?0:this.filterItem.nature,
            customer_nature:this.selectedCustomType.no,
            province:this.filterItem.province === ''?0:this.filterItem.province,
            city:this.filterItem.city === ''?0:this.filterItem.city,
            manage_company:this.filterItem.manageCompany === ''?0:this.filterItem.manageCompany,
            empowerProvince:this.filterItem.empower_province === ''?0:this.filterItem.empower_province,
            empowerCity:this.filterItem.empower_city === ''?0:this.filterItem.empower_city,
            saleName:this.filterItem.salesman,
            keyword:this.inputVal
          }
        ],
      };
      this.loading = true;
      this.$http.XLCUSTOMER(request).then(response => {
        let res = response.data.result.data;
         this.customList_data = [];
          this.customSum = res.sum;
          res.customerList.forEach(data => {
            let item = {};
            item.name = data.customer_name;
            item.nature = this.customerTypes.find(t => t.no === data.customer_nature).type ;
            item.level = levelMap[data.customer_level];
            item.city = (data.province_cn||'') + ' ' + (data.city_cn||'');
            item.time = data.create_date;
            item.salesman = data.sale_no;
            item.company = companyMap[data.manage_company];
            item.data = data;
            this.customList_data.push(item);
          });
          this.loading = false;
      },error => {
        this.loading = false;
      });
    },
    handleClick() {
      this.isShow = !this.isShow;
    },
    khglczClick(index) {
      // console.log(index);
    },
    glkhClick() {
      this.glShow = !this.glShow;
      this.moreShow = false;
      if (this.glShow||this.filterStatus) {
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
        // $(".cor").css({ color: "#000000" });
      } else {
        $(".cor1").css({ color: "#000000" });
      }
    },
    handleSubmitgl(name) {
      let status = true;
      for(let key in this.filterItem){
        if(this.filterItem[key] !== ''&&this.filterItem[key] !== 0){
          status = false;
        }
      }
      if(status){
        this.filterStatus = false;
        $(".cor").css({ color: "#000000" });
        this.glShow = false;
        this.getCustomList(1);
        return;
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.filterStatus = true;
          this.glShow = false;
          this.getCustomList(1);
          this.$Message.success("Success!");
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.filterStatus = false;
      for(let key in this.filterItem){
        this.filterItem[key] = '';
      }
      
    },
    closeglClick() {
      this.glShow = false;
      if(!this.filterStatus) $(".cor").css({ color: "#000000" });
    },
    addkpClick() {
      this.$router.push({ path: "/customermanage/add-informat" });
    },
    selectChange(item){
      this.selectedItems = item;
    },
    addClick(){
      this.$store.commit('selectedCustom',{});
      this.$router.push({ path: "/customermanage/new" });
    },
    getProvinces(){
      let request = {
        typeid: 27002
      };
      this.$http.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        this.provinces = res;
        this.$store.commit('getProvinces',res);
      });
    },
    getManagecompanys(){
      let request = {
        typeid:27001
      }
      this.$http.XLSELECT(request).then(response => {
        this.companys = response.data.result.data;
      })
    },
    getCitys(province,isEmpower){
      let request = {
        typeid: 27003,
        data: [
          {
            province:province
          }
        ]
      };
      this.citys = [];
      this.$http.XLSELECT(request).then(response => {
        let res = response.data.result.data;
        if(isEmpower){
          this.empowerCitys = res;
        }else{ 
          this.citys = res;
        }
      });
    },
    search(){
      this.pageNum = 1;
      this.getCustomList(1);
    }
  },
  mounted() {
    this.getCustomList(1);
    this.getProvinces();
    this.getManagecompanys();
  },
  watch:{
    'filterItem.empower_province':function(nv){
      if(nv !==0&&nv!=='') this.getCitys(nv,true);
    },
    'filterItem.province':function(nv){
      if(nv !==0&&nv!=='') this.getCitys(nv,false);
    },
  }
};
</script>

<style>
@import "../assetmanagement/assetmanage.css";
@import "./customer.css";
</style>
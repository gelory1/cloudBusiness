<template>
  <div class="customer" @click="customerClick('outside')">
    <Layout>
      <Menu width="auto" size="small">
        <div class="tip" style="float:left;margin-top:5px;">
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
                      <Option :value="item.index" v-for="(item,index) in natures" :key="item.index">{{item.val}}</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="授权资质" prop="sqzz">
                    <el-cascader clearable v-model="filterItem.empower_city" :options="regions" filterable show-all-levels :props="{ value: 'id', label: 'name'}" size="small"></el-cascader>
                  </FormItem>
                  <FormItem label="省份/城市" prop="city">
                    <el-cascader clearable v-model="filterItem.city" :options="regions" filterable show-all-levels :props="{ value: 'id', label: 'name'}" size="small"></el-cascader>
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
                        <DatePicker placement="bottom" type="date" :options="startOption"  v-model="filterItem.startTime" format="yyyy-MM-dd"></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker placement="bottom" type="date" :options="endOption" v-model="filterItem.endTime" format="yyyy-MM-dd"></DatePicker>
                      </Col>
                    </Row>
                  </FormItem>
                  <FormItem label="授权期限">
                    <Row>
                      <Col span="11">
                        <DatePicker placement="bottom" type="date" :options="startOption1"  v-model="filterItem.sqstartTime" format="yyyy-MM-dd"></DatePicker>
                      </Col>
                      <Col span="2" style="text-align: center">-</Col>
                      <Col span="11">
                        <DatePicker placement="bottom" type="date" :options="endOption1" v-model="filterItem.sqendTime" format="yyyy-MM-dd"></DatePicker>
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
                <p @click="exportSelect">导出所选结果</p>
                <p><a :href="exportUrl === ''||this.isFinance||this.isCooperative?'#':exportUrl" @click="exportAll" style="color:#495060">导出全部客户</a></p>
              </div>
            </span>
          </div>
        </Header>
        <Button type="primary" icon="ios-plus-empty" class="addBut1" @click="addClick" style="margin-bottom:5px;">添加客户</Button>
      </Menu>
      <Content :style="{background: '#fff', minHeight: '800px'}" style="padding-left:20px">
        <Table
          ref="table"
          @on-selection-change="selectChange"
          style="position:relative;"
          :columns="customList_columns"
          :data="customList_data"
          size="small"
          :loading="loading"
          class="ww"
        ></Table>
        <Page
          :current.sync="pageNum"
          :total="customSum"
          size="small"
          show-elevator
          show-total
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
export default {
  name: "customerManage",
  components: {
    dropDown
  },
  data() {
    return {
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
                      class:"iconShow",
                      style:{
                      },
                      on: {
                          click: () => {
                                this.$store.commit('selectedCustom',params.row);
                                localStorage.setItem('customInfo',JSON.stringify(params.row));
                                if(!this.$store.state.app.authority.find(a => a.id === 701)){
                                  this.$Message.error('权限不足！');
                                  return;
                                }
                                this.$router.push({ path: "/customermanage/see" });
                            }
                        }
                  },params.row.name)
              ]);
          }
        },
        {
          title: " ",
          width: "50",
          align:"center",
          render: (h, params) => {
            return h('Dropdown',{
                class:'iconShow',
                props:{
                    trigger:"click"
                },
                on:{
                   'on-click':(value)=>{
                       if (value == "查看") {
                        this.$store.commit('selectedCustom',params.row);
                        localStorage.setItem('customInfo',JSON.stringify(params.row));
                        if(!this.$store.state.app.authority.find(a => a.id === 701)){
                          this.$Message.error('权限不足！');
                          return;
                        }
                        this.$router.push({ path: "/customermanage/see" });
                      } else if (value == "编辑") {
                        this.$store.commit('selectedCustom',params.row);
                        localStorage.setItem('customInfo',JSON.stringify(params.row));
                        if(!this.$store.state.app.authority.find(a => a.id === 702)){
                          this.$Message.error('权限不足！');
                          return;
                        }
                        this.$router.push({ path: "/customermanage/edit" });
                      } else if (value == "删除") {
                        if(!this.$store.state.app.authority.find(a => a.id === 702)){
                          this.$Message.error('权限不足！');
                          return;
                        }
                        this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
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
                        class:"iconshow",
                        props: {
                            type: 'android-more-vertical',
                            size:'18'
                        },
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
        city: [],
        salesman: "",
        empower_city: [],
        startTime:'',
        endTime:'',
        sqstartTime:"",
        sqendTime:""
      },
      startOption:{
        disabledDate:time =>{
          if(this.filterItem.endTime){
            return time.getTime() > new Date(this.filterItem.endTime).getTime()
          }
        }
      },
      endOption:{
        disabledDate:time =>{
          if(this.filterItem.startTime){
            return time.getTime() < new Date(this.filterItem.startTime).getTime()
          }
        }
      },
       startOption1:{
        disabledDate:time =>{
          if(this.filterItem.sqendTime){
            return time.getTime() > new Date(this.filterItem.sqendTime).getTime()
          }
        }
      },
      endOption1:{
        disabledDate:time =>{
          if(this.filterItem.sqstartTime){
            return time.getTime() < new Date(this.filterItem.sqstartTime).getTime()
          }
        }
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
      selectedCustomType:{},
      customSum:0,
      selectedItems:[],
      inputVal:'',
      loading:false,
      pageNum:1,
      companys:[],
      provinces:[],
      citys:[],
      natures:this.$option.customer.levels,
      empowerCitys:[],
      filterStatus:false,
      disabled:true,
      exportUrl:''
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
      this.selectedCustomType = this.customerTypes[index];
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
            province:this.filterItem.city[0]||0,
            city:this.filterItem.city[1]||0,
            area:this.filterItem.city[2]||0,
            manage_company:this.filterItem.manageCompany === ''?0:this.filterItem.manageCompany,
            empowerProvince:this.filterItem.empower_city[0]||0,
            empowerCity:this.filterItem.empower_city[1]||0,
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
            item.nature = data.customer_nature === 0?'':this.customerTypes.find(t => t.no === data.customer_nature).type;
            item.level = this.$option.customer.levelMap[data.customer_level];
            item.city = (data.province_cn||'') + ' ' + (data.city_cn||'') + ' ' + (data.area_cn||'');
            item.time = data.create_date;
            item.salesman = data.sale_no;
            item.company = data.manage_company_cn;
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
        $(".cor").css({ color: "#000000" });
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
          // this.$Message.success("Success!");
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
      if(!this.$store.state.app.authority.find(a => a.id === 704)){
        this.$Message.error('权限不足！');
        return;
      }
      this.$router.push({ path: "/customermanage/add-informat" });
    },
    selectChange(item){
      this.selectedItems = item;
      this.customList_data.forEach(c=> {
        if(this.selectedItems.find(s => s.data.customer_no === c.data.customer_no)){
          c._checked = true;
        }else{
          c._checked = false;
        }
      })
    },
    addClick(){
      if(!this.$store.state.app.authority.find(a => a.id === 703)){
        this.$Message.error('权限不足！');
        return;
      }
      this.$store.commit('selectedCustom',{});
      localStorage.setItem('customInfo',JSON.stringify({}));
      this.$router.push({ path: "/customermanage/new" });
    },
    getManagecompanys(){
      let request = {
        typeid:27001
      }
      this.$http.XLSELECT(request).then(response => {
        this.companys = response.data.result.data;
        localStorage.setItem('companys',JSON.stringify(this.companys));
      })
    },
    search(){
      this.pageNum = 1;
      this.getCustomList(1);
    },
    exportSelect(){
      if(this.isFinance||this.isCooperative||this.isSaleMan){
        this.$Message.error('权限不足！');
        return;
      }
      if(this.customList_data.filter(data => data._checked === true).length === 0){
        this.$Message.error('请先选择需要导出的数据！');
        return;
      }
      this.$refs['table'].exportCsv({
        filename: '客户信息列表',
        columns: this.customList_columns.filter((col, index) => index !== 0&&index!==2),
        data: this.customList_data.filter(data => data._checked === true)
      })
      this.moreClick();
    },
    exportAll(){
      if(this.isFinance||this.isCooperative||this.isSaleMan){
        this.$Message.error('权限不足！');
        return;
      }
      if(this.exportUrl === ''){
        this.$Message.error('导出失败，请稍后重试！');
        return;
      }
      this.moreClick();
    },
    export(){
      if(this.isFinance||this.isCooperative||this.isSaleMan){
        return;
      }
      let request = {
        data:[
          {
            account_id: this.$store.state.user.accountId
          }
        ]
      };
      this.$http.EXPORT(request).then(res => {
        
      },error => {
        if(error.data&&error.data.code === 0){
          this.exportUrl = error.data.exportUrl;
        }
      })
    }
  },
  mounted() {
    this.getCustomList(1);
    this.getManagecompanys(); 
    this.export();  
  },
  computed:{
    isFinance(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '财务');
      }
    },
    isCooperative(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '合作伙伴');
      }
    },
    isSaleManage(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '业务管控');
      }
    },
    isSaleMan(){
      if(this.$store.state.app.authority&&this.$store.state.app.authority.length>0&&this.$store.state.app.authority[0].role){
        return this.$store.state.app.authority[0].role.find(r => r === '销售人员');
      }
    },
    regions() {
      return JSON.parse(localStorage.getItem("regions")) || [];
    },
    customerTypes(){
      let types = [];
      if(this.isCooperative){
        types = this.$option.customer.types.filter(t => t.no === 3);
      }else if(this.isSaleMan){
        types = this.$option.customer.types.filter(t => t.no === 1);
      }else{
        types = this.$option.customer.types;
      }
      if(!this.selectedCustomType.type){
        this.selectedCustomType = types[0];
      }
      return types;
    }
  },
  watch:{

  }
};
</script>

<style>
@import "../assetmanagement/assetmanage.css";
@import "./customer.css";
.iconshow{
  display: none;
}
.ivu-table-row:hover .iconshow{
  display: inline-block;
}
.aa .ivu-modal-footer {
  display: none;
}
</style>
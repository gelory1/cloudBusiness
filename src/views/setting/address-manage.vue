<template>
  <div class="address layout">
    <Layout style="background:#fff;min-height:900px">
      <p class="ad_p">收货地址列表</p>
      <div>
        <el-card v-for="(item,index) in shdzData" :key="index" shadow='hover' class="ad_div" style="overflow:inherit;">
          <p class="p_span">
            <b>{{item.company}}</b>
            <!--  -->
            <span class="icon">
              <Dropdown  style="float:right;text-align:center;position:relative" trigger="click" @on-click="dropDownClick">
                <div style="width:12px" @click="changeSelectItem(item)">
                  <Icon type="android-more-vertical"></Icon>
                </div>
                <DropdownMenu slot="list">
                  <DropdownItem name="edit">编辑</DropdownItem>
                  <DropdownItem name="default">设为默认</DropdownItem>
                  <DropdownItem name="delete">删除</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </span>
          </p>
          <p class="p_span1">
            <span>{{item.name}}</span>
            <span>&#x3000;{{item.tel}}</span>
            <span class="ad_span" v-if="item.isDefault">默认</span>
          </p>
          <p>{{item.address}}</p>
        </el-card>
      </div>
      <div class="add_adress">
        <p @click="createNewAddr" style="cursor:pointer">+&#x3000;添加新地址</p>
      </div>
    </Layout>
    <!-- 添加地址弹框 -->
    <Modal v-model="addadressmodal" width="800" class="aa">
      <p class="ad_p" v-if="status === 'new'">添加新地址</p>
      <p class="ad_p" v-else>编辑地址</p>
      <Form
        ref="addadressform"
        :model="addadressform"
        :rules="addadressrule"
        :label-width="150"
        class="formTop"
      >
        <Row>
          <Col span="15">
            <FormItem label="仓库名称" prop="company">
              <Select v-model="addadressform.company" clearable filterable>
                <Option :value="item.wh_id" v-for="(item,index) in whData" :key="index">{{item.wh_name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="联系人姓名" prop="name">
              <Input v-model="addadressform.name" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="15">
            <FormItem label="联系电话" prop="tel">
              <Input v-model="addadressform.tel" placeholder></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="20">
            <FormItem label="详细地址" prop="address">
              <Input
                v-model="addadressform.address"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                placeholder
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem style="margin:40px 0 30px 160px;">
          <Button type="primary" @click="saveSubmit('addadressform')">保存</Button>
          <Button type="primary" @click="addadressmodal = false" style="margin-left:20px">取消</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "addressmanage",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (this.addadressform.tel !== "") {
        var expression = /^1(3|4|5|7|8)\d{9}$/;
        if (expression.test(value) == false) {
          callback(new Error("请输入正确的电话号码"));
        }
      }else{
        callback(new Error("请输入电话号码"));
      }
      callback();
    };
    return {
      addadressmodal: false,
      addadressform: {
        company: "",
        name: "",
        tel: "",
        address: ""
      },
      shdzData: [],
      addadressrule: {
        company: [
          {
            required: true,
            message: "请输入仓库名称",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入联系人姓名",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            trigger: "blur",
            validator: validatePhone,
          }
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur"
          }
        ]
      },
      selectItem:{},
      status:'new',
      whData: []
    };
  },
  methods: {
    getAddresses(){
      let request = {
        typeid: 23013,
        data: [
          {
            account_id: this.$store.state.user.accountId,
          }
        ]
      };
      this.shdzData = [];
      this.$http.PostXLASSETS(request).then(response => {
        let { data } = response.data.result;
        data.forEach(d => {
          this.shdzData.push({
            company: d.wh_name,
            name: d.manager_name,
            tel: d.manager_phone,
            address: d.address_detail,
            isDefault:d.address_status === 1?true:false,
            wh_id:d.wh_id,
            address_id:d.address_id,
          })
        });
        
      })
    },
    getWhs(){
      let request = {
        typeid: 23001,
        data: [
          {
            account_id: this.$store.state.user.accountId,
          }
        ]
      };
      this.whData = [];
      this.$http.PostXLASSETS(request).then(response => {
        let { data } = response.data.result;
        this.whData = data;
      })
    },
    czClick() {},
    saveSubmit(name) {
      this.$refs[name].validate(valid => {
        let request = {
          "typeid": 23014,
          "data": [
              {
                "account_id": this.$store.state.user.accountId,
                "wh_id": this.addadressform.company,
                "address_title": (this.whData.find(w =>w.wh_id === this.addadressform.company)||{}).wh_name||'',
                "manager_name": this.addadressform.name,
                "manager_phone": this.addadressform.tel,
                "address_detail": this.addadressform.address
              }
          ]
        }
        if (valid) {
          if(this.status === 'edit'){
            request.typeid = 23023;
            request.data[0].address_id = this.selectItem.address_id;
            this.$http.UPDATEXLASSETS(request).then(response => {
              this.$Message.success("Success!");
              this.getAddresses();
              this.addadressmodal = false;
            },error => {
              if(error.data.code === 0){
                this.$Message.success("Success!");
                this.getAddresses();
                this.addadressmodal = false;
              }
            })
          }else if(this.status === 'new'){
            this.$http.SETXLASSETS(request).then(response => {
              this.$Message.success("Success!");
              this.getAddresses();
              this.addadressmodal = false;
            },error => {
              if(error.data.code === 0){
                this.$Message.success("Success!");
                this.getAddresses();
                this.addadressmodal = false;
              }
            })
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    dropDownClick(name){
      if(name === 'edit'){
        this.edit();
      }else if(name === 'default'){
        this.setDefault();
      }else if(name === 'delete'){
        this.delete();
      }
    },
    edit(){
      this.status = 'edit';
      this.addadressform = {...this.selectItem};
      this.addadressform.company = (this.whData.find(w => w.wh_id === this.selectItem.wh_id)||{}).wh_id;
      this.addadressmodal = true;
    },
    setDefault(){
      let request = {
        "typeid": 23024,
        "data": [
          {
            "account_id": this.$store.state.user.accountId,
            "address_id": this.selectItem.address_id,
            "wh_id": this.selectItem.wh_id
          }
        ]
      };
      this.$http.UPDATEXLASSETS(request).then(response =>{
        this.$Message.success("设置成功!");
        this.getAddresses();
      },error => {
        if(error.data.code === 0){
          this.$Message.success("设置成功!");
          this.getAddresses();
        }
      })
    },
    delete(){
      let request = {
        "typeid": 23022,
        "data": [
          {
            "account_id": this.$store.state.user.accountId,
            "address_id": this.selectItem.address_id
          }
        ]
      };
      this.$http.DELXLASSETS(request).then(response =>{
        this.$Message.success("删除成功!");
        this.getAddresses();
      },error => {
        if(error.data.code === 0){
          this.$Message.success("删除成功!");
          this.getAddresses();
        }
      })
    },
    changeSelectItem(item){
      this.selectItem = item;
    },
    createNewAddr(){
      this.status = 'new';
      this.addadressmodal = true;
    }
  },
  mounted() {
    this.getAddresses();
    this.getWhs();
  },
  watch:{
    addadressmodal(nv){
      if(!nv){
        this.addadressform = {
          company: "",
          name: "",
          tel: "",
          address: ""
        }
      }
    }
  }
};
</script>

<style>
@import "./setting.css";
.aa .ivu-modal-footer {
  display: none;
}
</style>